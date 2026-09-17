/* eslint-disable @typescript-eslint/no-explicit-any */
import Client from 'socket.io-client';

import { BATTLES, CONNECTED_USERS, GAME_USERS, NPCS, increaseTurn, resetInitialGameValues, setCurrentPlayer, setSelectedBattleId, setTarget } from '../../game.ts';
import { startServer, io } from '../../../index.ts';
import * as SOCKETS from '../../constants/sockets.ts';
import { battles } from '../../__mocks__/battles.ts';
import { GAME_USERS_MOCK } from '../../__mocks__/players.ts';
import { getPlayerDataByEmail, fetchBattles } from '../../helpers/api.ts';
import { handleGameEnd } from '../../helpers/game.ts';
import { Player } from '../../interfaces/Player.ts';

jest.mock('../../helpers/api.ts', () => ({
  fetchBattles: jest.fn(),
  getPlayerDataByEmail: jest.fn(),
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

const connect = (port: number): Promise<ClientSocket> =>
  new Promise((resolve, reject) => {
    const socket = Client(`http://localhost:${port}`, { transports: ['websocket'] });
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
    (getPlayerDataByEmail as jest.Mock).mockImplementation(async (email: string) => playersByEmail[email] ?? null);

    port = await startServer(0);

    web = await connect(port);
    mobiles = [await connect(port), await connect(port), await connect(port)];
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
    web.emit(SOCKETS.WEB_SEND_SOCKET_ID);

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
    mobiles[0].emit(SOCKETS.MOBILE_CREATE_GAME, battles[0]._id);

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
    mobiles[0].emit(SOCKETS.MOBILE_GAME_START);

    await gameStart;
    const assignedId = await assignTurn;
    expect(typeof assignedId).toBe('string');
  });

  it('runs a full combat round end-to-end (select target -> attack -> turn advances)', async () => {
    web.emit(SOCKETS.WEB_SEND_SOCKET_ID);

    // Deterministic setup: attacker (betrayer) and defender (kaotika), no death.
    const attacker = clone(GAME_USERS_MOCK[0]);
    attacker.socketId = mobiles[0].id;
    const defender = clone(GAME_USERS_MOCK[2]);
    defender.attributes.hit_points = 100000;

    GAME_USERS.push(attacker, defender);
    increaseTurn(); // turn -> 0 (attacker)
    setCurrentPlayer(attacker);
    setTarget(defender);

    mobiles[0].emit(SOCKETS.MOBILE_SET_SELECTED_PLAYER, defender._id);

    const attackInfo = waitFor<any>(web, SOCKETS.ATTACK_INFORMATION);
    mobiles[0].emit(SOCKETS.MOBILE_ATTACK, defender._id);
    const info = await attackInfo;
    expect(info.attack).toBeDefined();

    const nextTurn = waitFor<string>(web, SOCKETS.ASSIGN_TURN);
    web.emit(SOCKETS.WEB_ATTACK_ANIMATION_END, defender._id);
    const nextPlayerId = await nextTurn;
    expect(nextPlayerId).toBe(defender._id);
  });

  it('ends the game and emits battle rewards to the web', async () => {
    web.emit(SOCKETS.WEB_SEND_SOCKET_ID);

    // Only kaotika players remain -> kaotika wins.
    GAME_USERS.push(clone(GAME_USERS_MOCK[2]));
    setSelectedBattleId(battles[0]._id);

    const rewardsData = {
      status: 'OK',
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

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => rewardsData,
    }) as any;

    const gameEnd = waitFor<string>(web, SOCKETS.GAME_END);
    const battleRewards = waitFor<any>(web, SOCKETS.WEB_BATTLE_REWARDS);

    await handleGameEnd();

    expect(await gameEnd).toBe('Kaotika');

    const outcome = await battleRewards;
    expect(outcome.winner).toBe('Kaotika');
    expect(outcome.rewards.gold).toBe(300);
    expect(outcome.rewards.experience).toBe(1500);
    expect(outcome.rewards.playerRewards).toHaveLength(1);
    expect(outcome.rewards.playerRewards[0].item.name).toBe('Sword');
  });
});
