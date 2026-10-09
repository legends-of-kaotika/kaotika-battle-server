/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from 'socket.io-client';

import { BATTLES, CONNECTED_USERS, GAME_USERS, NPCS, increaseTurn, isGameCreated, resetInitialGameValues, setCurrentPlayer, setGameStarted, setSelectedBattleId, setTarget } from '../../game.ts';
import { startServer, io } from '../../../index.ts';
import * as SOCKETS from '../../constants/sockets.ts';
import { battles } from '../../__mocks__/battles.ts';
import { GAME_USERS_MOCK } from '../../__mocks__/players.ts';
import { getPlayerDataByEmail, fetchBattles } from '../../helpers/api.ts';
import { handleGameEnd } from '../../helpers/game.ts';
import { Player } from '../../interfaces/Player.ts';
import { verifyFirebaseIdToken } from '../../services/firebaseAuthService.ts';

jest.mock('../../helpers/api.ts', () => ({
  fetchBattles: jest.fn(),
  getPlayerDataByEmail: jest.fn(),
}));

jest.mock('../../services/battleRewardsService.ts', () => ({
  recordBattleOutcome: jest.fn(),
}));

jest.mock('../../services/firebaseAuthService.ts', () => ({
  verifyFirebaseIdToken: jest.fn(),
}));

jest.mock('../../timer/timer.ts', () => ({
  turnTime: 30,
  startTimer: jest.fn(),
  clearTimer: jest.fn(),
  resetTimer: jest.fn(),
  handleTurnTimerExpiration: jest.fn(),
}));

jest.mock('../../helpers/utils.ts', () => ({
  ...jest.requireActual('../../helpers/utils.ts'),
  sleep: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../helpers/npc.ts', () => {
  const actual = jest.requireActual('../../helpers/npc.ts');
  return { ...actual, npcAttack: jest.fn() };
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

type ClientSocket = any;

const EMAILS = {
  admin: 'mortimer@aeg.eus',
  loyal: 'acolyte@aeg.eus',
  betrayer: 'betrayer@aeg.eus',
};

const playersByEmail: Record<string, Player> = {
  [EMAILS.admin]: clone(GAME_USERS_MOCK[0]),
  [EMAILS.loyal]: clone(GAME_USERS_MOCK[2]),
  [EMAILS.betrayer]: clone(GAME_USERS_MOCK[1]),
};
playersByEmail[EMAILS.admin].role = 'mortimer';

const waitFor = <T>(socket: ClientSocket, event: string, timeoutMs = 5000): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for event '${event}'`)), timeoutMs);
    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });

const emitAck = <T>(socket: ClientSocket, event: string, ...args: unknown[]): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ack '${event}'`)), 5000);
    socket.emit(event, ...args, (response: T) => {
      clearTimeout(timer);
      resolve(response);
    });
  });

const connect = (port: number, auth: Record<string, string> = {}): Promise<ClientSocket> =>
  new Promise((resolve, reject) => {
    const socket = Client(`http://localhost:${port}`, { transports: ['websocket'], auth, forceNew: true });
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', reject);
  });

describe('Battle flow integration (mobile + web against the real server)', () => {
  jest.setTimeout(20000);

  let port: number;
  let web: ClientSocket;
  let mobiles: ClientSocket[];

  beforeAll(async () => {
    (fetchBattles as jest.Mock).mockResolvedValue(battles);
    (getPlayerDataByEmail as jest.Mock).mockImplementation(async (email: string) => playersByEmail[email] ? clone(playersByEmail[email]) : null);
    (verifyFirebaseIdToken as jest.Mock).mockImplementation(async (token: string) => {
      if (token === 'invalid-token') throw new Error('invalid');
      const unverified = token.startsWith('unverified:');
      const email = token.replace(/^(token|unverified):/, '');
      return { uid: `uid:${email}`, email, emailVerified: !unverified };
    });

    port = await startServer(0);

    web = await connect(port);
    mobiles = await Promise.all(Object.values(EMAILS).map((email) => connect(port, { idToken: `token:${email}` })));
  });

  afterAll(() => {
    // Reset state first so closing sockets does not trigger an async game end.
    resetInitialGameValues();
    mobiles.forEach((s) => s.close());
    web.close();
    io.close();
  });

  beforeEach(() => {
    resetInitialGameValues();
    CONNECTED_USERS.length = 0;
    BATTLES.length = 0;
  });

  it('runs the full setup flow from sign-in to game start', async () => {
    // 1. Web client registers itself
    const webRegistration = await emitAck<{ status: string; state: { generation: number; attackPending: boolean } }>(web, SOCKETS.WEB_SEND_SOCKET_ID);
    expect(webRegistration.status).toBe('OK');
    expect(webRegistration.state.attackPending).toBe(false);

    // 2. Three players sign in
    const signIn = await Promise.all(mobiles.map((socket, i) => {
      const email = Object.values(EMAILS)[i];
      return emitAck<{ status: string; player: Player }>(socket, SOCKETS.MOBILE_SIGN_IN, email);
    }));
    signIn.forEach((res) => expect(res.status).toBe('OK'));
    expect(CONNECTED_USERS).toHaveLength(3);

    // 3. Admin fetches available battles
    const battlesAck = await emitAck<{ status: string; battles: unknown[] }>(mobiles[0], SOCKETS.MOBILE_GET_BATTLES);
    expect(battlesAck.status).toBe('OK');
    expect(battlesAck.battles).toHaveLength(2);

    // 4. Admin creates the game for the first battle
    const webCreatedBattle = waitFor<{ name: string }>(web, SOCKETS.WEB_CREATE_BATTLE);
    const isGameCreated = waitFor<boolean>(mobiles[0], SOCKETS.IS_GAME_CREATED);
    const createAck = await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_CREATE_GAME, battles[0]._id);

    expect(createAck.status).toBe('OK');
    expect((await webCreatedBattle).name).toBe(battles[0].name);
    expect(await isGameCreated).toBe(true);
    expect(NPCS).toHaveLength(battles[0].enemies.length);

    // 5. The other two players join the battle
    const joinAcks = await Promise.all([1, 2].map((i) => emitAck<{ status: string; joinBattle: boolean }>(mobiles[i], SOCKETS.MOBILE_JOIN_BATTLE, signIn[i].player._id)));
    joinAcks.forEach((res) => expect(res.joinBattle).toBe(true));
    expect(GAME_USERS).toHaveLength(battles[0].enemies.length + 2);

    // 6. Admin starts the game
    const gameStart = waitFor<void>(web, SOCKETS.GAME_START);
    const assignTurn = waitFor<string>(web, SOCKETS.ASSIGN_TURN);
    const startAck = await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_GAME_START);

    expect(startAck.status).toBe('OK');
    await gameStart;
    const assignedId = await assignTurn;
    expect(typeof assignedId).toBe('string');

    const sync = await emitAck<{ status: string; state: { gameCreated: boolean; gameStarted: boolean; currentPlayerId: string | null; players: unknown } }>(web, SOCKETS.WEB_SYNC_STATE);
    expect(sync.state.gameCreated).toBe(true);
    expect(sync.state.gameStarted).toBe(true);
    expect(sync.state.currentPlayerId).toBe(assignedId);
    expect(sync.state.players).toBeDefined();
  });

  it('runs a full combat round end-to-end (select target -> attack -> turn advances)', async () => {
    await emitAck(web, SOCKETS.WEB_SEND_SOCKET_ID);

    const signedIn = await emitAck<{ status: string; player: Player }>(mobiles[0], SOCKETS.MOBILE_SIGN_IN, EMAILS.admin);
    expect(signedIn.status).toBe('OK');

    // Deterministic setup: attacker (betrayer) and defender (kaotika), no death.
    const attacker = clone(signedIn.player);
    attacker.socketId = mobiles[0].id;
    const defender = clone(GAME_USERS_MOCK[2]);
    defender.attributes.hit_points = 100000;

    GAME_USERS.push(attacker, defender);
    increaseTurn(); // turn -> 0 (attacker)
    setCurrentPlayer(attacker);
    setTarget(defender);

    const unauthorizedAttack = await emitAck<{ status: string }>(mobiles[1], SOCKETS.MOBILE_ATTACK, defender._id);
    expect(unauthorizedAttack.status).toBe('FAILED');

    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_SET_SELECTED_PLAYER, attacker._id)).status).toBe('FAILED');
    defender.isAlive = false;
    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_SET_SELECTED_PLAYER, defender._id)).status).toBe('FAILED');
    defender.isAlive = true;
    defender.isBetrayer = attacker.isBetrayer;
    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_SET_SELECTED_PLAYER, defender._id)).status).toBe('FAILED');
    defender.isBetrayer = !attacker.isBetrayer;

    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_SET_SELECTED_PLAYER, defender._id)).status).toBe('OK');

    const attackInfo = waitFor<any>(web, SOCKETS.ATTACK_INFORMATION);
    const pausedTimer = waitFor<number>(web, SOCKETS.SEND_TIMER);
    defender.isAlive = false;
    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_ATTACK, defender._id)).status).toBe('FAILED');
    defender.isAlive = true;
    const attackAck = await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_ATTACK, defender._id);
    const duplicateAttackAck = await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_ATTACK, defender._id);
    expect(attackAck.status).toBe('OK');
    expect(duplicateAttackAck.status).toBe('FAILED');
    const info = await attackInfo;
    expect(info.attack).toBeDefined();
    expect(await pausedTimer).toBe(-1);
    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_SET_SELECTED_PLAYER, defender._id)).status).toBe('FAILED');

    const nextTurn = waitFor<string>(web, SOCKETS.ASSIGN_TURN);
    const animationAck = await emitAck<{ status: string }>(web, SOCKETS.WEB_ATTACK_ANIMATION_END, defender._id);
    const duplicateAnimationAck = await emitAck<{ status: string }>(web, SOCKETS.WEB_ATTACK_ANIMATION_END, defender._id);
    expect(animationAck.status).toBe('OK');
    expect(duplicateAnimationAck.status).toBe('FAILED');
    const nextPlayerId = await nextTurn;
    expect(nextPlayerId).toBe(defender._id);
  });

  it('ends the game and emits battle rewards to the web', async () => {
    await emitAck(web, SOCKETS.WEB_SEND_SOCKET_ID);

    // Only kaotika players remain -> kaotika wins.
    GAME_USERS.push(clone(GAME_USERS_MOCK[2]));
    setSelectedBattleId(battles[0]._id);

    const rewardsData = {
      status: 'OK' as const,
      data: {
        gold: 300,
        experience: 1500,
        playerRewards: [
          {
            playerId: GAME_USERS_MOCK[2]._id,
            playerName: GAME_USERS_MOCK[2].nickname,
            playerAvatar: GAME_USERS_MOCK[2].avatar,
            item: { _id: 'item-1', name: 'Sword', image: '/sword.png', type: 'weapon' },
          },
        ],
      },
    };

    const { recordBattleOutcome } = jest.requireMock('../../services/battleRewardsService.ts');
    (recordBattleOutcome as jest.Mock).mockClear();
    (recordBattleOutcome as jest.Mock).mockResolvedValue(rewardsData);

    const gameEnd = waitFor<string>(web, SOCKETS.GAME_END);
    const battleRewards = waitFor<any>(web, SOCKETS.WEB_BATTLE_REWARDS);

    await Promise.all([handleGameEnd(), handleGameEnd()]);

    expect(await gameEnd).toBe('Kaotika');

    const outcome = await battleRewards;
    expect(outcome.winner).toBe('Kaotika');
    expect(outcome.rewards.gold).toBe(300);
    expect(outcome.rewards.experience).toBe(1500);
    expect(outcome.rewards.playerRewards).toHaveLength(1);
    expect(outcome.rewards.playerRewards[0].item.name).toBe('Sword');
    expect(recordBattleOutcome).toHaveBeenCalledTimes(1);
  });

  it('emits a reward-clearing outcome when Dravokar wins', async () => {
    await emitAck(web, SOCKETS.WEB_SEND_SOCKET_ID);
    GAME_USERS.push(clone(GAME_USERS_MOCK[1]));
    const { recordBattleOutcome } = jest.requireMock('../../services/battleRewardsService.ts');
    (recordBattleOutcome as jest.Mock).mockResolvedValue({ status: 'OK', data: { penalties: [] } });
    const outcomePromise = waitFor<{ winner: string; rewards: null }>(web, SOCKETS.WEB_BATTLE_REWARDS);

    await handleGameEnd();

    await expect(outcomePromise).resolves.toEqual({ winner: 'Dravokar', rewards: null });
  });

  it('does not emit a stale reward result after reset', async () => {
    await emitAck(web, SOCKETS.WEB_SEND_SOCKET_ID);
    GAME_USERS.push(clone(GAME_USERS_MOCK[2]));
    setSelectedBattleId(battles[0]._id);
    const { recordBattleOutcome } = jest.requireMock('../../services/battleRewardsService.ts');
    let resolveResult: ((_value: unknown) => void) | undefined;
    (recordBattleOutcome as jest.Mock).mockImplementation(() => new Promise((resolve) => {
      resolveResult = resolve;
    }));
    const rewardListener = jest.fn();
    web.on(SOCKETS.WEB_BATTLE_REWARDS, rewardListener);

    const ending = handleGameEnd();
    await new Promise((resolve) => setImmediate(resolve));
    resetInitialGameValues();
    resolveResult?.({ status: 'OK', data: { gold: 1, experience: 1, playerRewards: [] } });
    await ending;

    expect(rewardListener).not.toHaveBeenCalled();
    web.off(SOCKETS.WEB_BATTLE_REWARDS, rewardListener);
  });

  it('rejects non-admin battle creation and duplicate joins', async () => {
    await emitAck(web, SOCKETS.WEB_SEND_SOCKET_ID);
    const admin = await emitAck<{ player: Player }>(mobiles[0], SOCKETS.MOBILE_SIGN_IN, EMAILS.admin);
    const loyal = await emitAck<{ player: Player }>(mobiles[1], SOCKETS.MOBILE_SIGN_IN, EMAILS.loyal);
    await emitAck(mobiles[0], SOCKETS.MOBILE_GET_BATTLES);

    const denied = await emitAck<{ status: string }>(mobiles[1], SOCKETS.MOBILE_CREATE_GAME, battles[0]._id);
    expect(denied.status).toBe('FAILED');
    expect(isGameCreated).toBe(false);

    expect((await emitAck<{ status: string }>(mobiles[0], SOCKETS.MOBILE_CREATE_GAME, battles[0]._id)).status).toBe('OK');
    expect((await emitAck<{ joinBattle: boolean }>(mobiles[1], SOCKETS.MOBILE_JOIN_BATTLE, loyal.player._id)).joinBattle).toBe(true);
    expect((await emitAck<{ joinBattle: boolean }>(mobiles[1], SOCKETS.MOBILE_JOIN_BATTLE, loyal.player._id)).joinBattle).toBe(true);
    expect(GAME_USERS.filter((player) => player._id === loyal.player._id)).toHaveLength(1);
    expect(admin.player.role).toBe('mortimer');
  });

  it('replaces a reconnected player socket in connected and game state', async () => {
    const first = await emitAck<{ player: Player }>(mobiles[0], SOCKETS.MOBILE_SIGN_IN, EMAILS.admin);
    GAME_USERS.push(clone(first.player));
    GAME_USERS[0].attributes.hit_points = 7;
    setGameStarted(true);
    mobiles[0].disconnect();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(GAME_USERS[0].socketId).toBe(first.player.socketId);

    const replacement = await connect(port, { idToken: `token:${EMAILS.admin}` });
    mobiles.push(replacement);

    const reconnected = await emitAck<{ player: Player }>(replacement, SOCKETS.MOBILE_SIGN_IN, EMAILS.admin);
    expect(CONNECTED_USERS.filter((player) => player._id === first.player._id)).toHaveLength(1);
    expect(GAME_USERS[0].socketId).toBe(replacement.id);
    expect(reconnected.player.attributes.hit_points).toBe(7);
  });

  it('does not let a duplicate login invalidate an active player socket', async () => {
    const firstSignIn = await emitAck<{ status: string }>(mobiles[1], SOCKETS.MOBILE_SIGN_IN, EMAILS.loyal);
    expect(firstSignIn.status).toBe('OK');

    const duplicate = await connect(port, { idToken: `token:${EMAILS.loyal}` });
    mobiles.push(duplicate);
    const duplicateSignIn = await emitAck<{ status: string; error: string }>(duplicate, SOCKETS.MOBILE_SIGN_IN, EMAILS.loyal);

    expect(duplicateSignIn.status).toBe('FAILED');
    expect(duplicateSignIn.error).toBe('Player already logged in.');
    expect((await emitAck<{ status: string }>(mobiles[1], SOCKETS.MOBILE_IS_GAME_CREATED)).status).toBe('OK');
  });

  it('rejects web-only events until registration and allows monitor takeover', async () => {
    const unregistered = await connect(port);
    mobiles.push(unregistered);
    const response = await emitAck<{ status: string }>(unregistered, SOCKETS.WEB_SEND_USERS);
    expect(response.status).toBe('FAILED');
    const registration = await emitAck<{ status: string }>(unregistered, SOCKETS.WEB_SEND_SOCKET_ID);
    expect(registration.status).toBe('OK');
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(web.connected).toBe(false);
  });

  it('requires a valid verified Firebase identity matching the requested email', async () => {
    const cases: { auth: Record<string, string>; email: string; error: string }[] = [
      { auth: {}, email: EMAILS.loyal, error: 'required' },
      { auth: { idToken: 'invalid-token' }, email: EMAILS.loyal, error: 'Invalid' },
      { auth: { idToken: `token:${EMAILS.admin}` }, email: EMAILS.loyal, error: 'does not match' },
      { auth: { idToken: `unverified:${EMAILS.loyal}` }, email: EMAILS.loyal, error: 'not verified' },
    ];
    for (const testCase of cases) {
      const client = await connect(port, testCase.auth);
      mobiles.push(client);
      const response = await emitAck<{ status: string; error: string }>(client, SOCKETS.MOBILE_SIGN_IN, testCase.email);
      expect(response.status).toBe('FAILED');
      expect(response.error).toContain(testCase.error);
    }

    const valid = await connect(port, { idToken: `token:${EMAILS.loyal}` });
    mobiles.push(valid);
    const response = await emitAck<{ status: string; player: Player }>(valid, SOCKETS.MOBILE_SIGN_IN, EMAILS.loyal.toUpperCase());
    expect(response.status).toBe('OK');
    expect(response.player._id).toBe(playersByEmail[EMAILS.loyal]._id);
    expect(getPlayerDataByEmail).toHaveBeenLastCalledWith(EMAILS.loyal);
  });

  it('releases web registration when the active web socket disconnects', async () => {
    web.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const replacementWeb = await connect(port);
    const response = await emitAck<{ status: string }>(replacementWeb, SOCKETS.WEB_SEND_SOCKET_ID);
    expect(response.status).toBe('OK');
    web = replacementWeb;
  });
});
