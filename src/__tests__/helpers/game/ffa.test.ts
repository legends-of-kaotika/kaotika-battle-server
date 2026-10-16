import { GAME_USERS, setMissionType, resetInitialGameValues } from '../../../game.ts';
import { isValidAttackTarget, isGameEnded, getWinnerSide, returnLoyalsAndBetrayers, checkStartGameRequirement } from '../../../helpers/game.ts';
import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

describe('Free-for-All mode', () => {
  beforeEach(() => {
    resetInitialGameValues();
    GAME_USERS.length = 0;
    setMissionType('team');
  });

  afterAll(() => {
    setMissionType('team');
  });

  describe('returnLoyalsAndBetrayers', () => {
    it('splits players by isBetrayer in team mode', () => {
      setMissionType('team');
      const loyal = clone(GAME_USERS_MOCK[0]);
      loyal.isBetrayer = false;
      const betrayer = clone(GAME_USERS_MOCK[1]);
      betrayer.isBetrayer = true;

      const result = returnLoyalsAndBetrayers([loyal, betrayer]);
      expect(result.kaotika).toHaveLength(1);
      expect(result.dravokar).toHaveLength(1);
    });

    it('puts all players in kaotika in FFA mode', () => {
      setMissionType('free-for-all');
      const loyal = clone(GAME_USERS_MOCK[0]);
      loyal.isBetrayer = false;
      const betrayer = clone(GAME_USERS_MOCK[1]);
      betrayer.isBetrayer = true;

      const result = returnLoyalsAndBetrayers([loyal, betrayer]);
      expect(result.kaotika).toHaveLength(2);
      expect(result.dravokar).toHaveLength(0);
    });
  });

  describe('isValidAttackTarget', () => {
    it('requires opposite teams in team mode', () => {
      setMissionType('team');
      const attacker = clone(GAME_USERS_MOCK[0]);
      attacker.isBetrayer = false;
      const sameTeam = clone(GAME_USERS_MOCK[2]);
      sameTeam.isBetrayer = false;
      const enemy = clone(GAME_USERS_MOCK[1]);
      enemy.isBetrayer = true;

      GAME_USERS.push(attacker, sameTeam, enemy);

      expect(isValidAttackTarget(attacker, sameTeam)).toBe(false);
      expect(isValidAttackTarget(attacker, enemy)).toBe(true);
    });

    it('allows attacking anyone in FFA mode', () => {
      setMissionType('free-for-all');
      const attacker = clone(GAME_USERS_MOCK[0]);
      attacker.isBetrayer = false;
      const sameTeam = clone(GAME_USERS_MOCK[2]);
      sameTeam.isBetrayer = false;
      const enemy = clone(GAME_USERS_MOCK[1]);
      enemy.isBetrayer = true;

      GAME_USERS.push(attacker, sameTeam, enemy);

      expect(isValidAttackTarget(attacker, sameTeam)).toBe(true);
      expect(isValidAttackTarget(attacker, enemy)).toBe(true);
    });

    it('never allows self-attack', () => {
      setMissionType('free-for-all');
      const attacker = clone(GAME_USERS_MOCK[0]);
      GAME_USERS.push(attacker);

      expect(isValidAttackTarget(attacker, attacker)).toBe(false);
    });

    it('never allows attacking dead players', () => {
      setMissionType('free-for-all');
      const attacker = clone(GAME_USERS_MOCK[0]);
      const dead = clone(GAME_USERS_MOCK[1]);
      dead.attributes.hit_points = 0;

      GAME_USERS.push(attacker, dead);

      expect(isValidAttackTarget(attacker, dead)).toBe(false);
    });
  });

  describe('isGameEnded', () => {
    it('ends when one team is eliminated in team mode', () => {
      setMissionType('team');
      const alive = clone(GAME_USERS_MOCK[0]);
      alive.isBetrayer = false;
      alive.attributes.hit_points = 100;

      GAME_USERS.push(alive);
      expect(isGameEnded()).toBe(true);
    });

    it('ends when 1 or fewer players remain alive in FFA mode', () => {
      setMissionType('free-for-all');
      const alive1 = clone(GAME_USERS_MOCK[0]);
      alive1.attributes.hit_points = 100;
      const alive2 = clone(GAME_USERS_MOCK[1]);
      alive2.attributes.hit_points = 100;

      GAME_USERS.push(alive1, alive2);
      expect(isGameEnded()).toBe(false);

      alive2.attributes.hit_points = 0;
      expect(isGameEnded()).toBe(true);
    });
  });

  describe('getWinnerSide', () => {
    it('returns team name in team mode', () => {
      setMissionType('team');
      const survivor = clone(GAME_USERS_MOCK[0]);
      survivor.isBetrayer = false;
      survivor.attributes.hit_points = 100;

      GAME_USERS.push(survivor);
      expect(getWinnerSide()).toBe('kaotika');
    });

    it('returns player name in FFA mode', () => {
      setMissionType('free-for-all');
      const winner = clone(GAME_USERS_MOCK[0]);
      winner.nickname = 'FFA Winner';
      winner.attributes.hit_points = 100;
      const loser = clone(GAME_USERS_MOCK[1]);
      loser.attributes.hit_points = 0;

      GAME_USERS.push(winner, loser);
      expect(getWinnerSide()).toBe('FFA Winner');
    });

    it('returns draw when multiple players alive in FFA mode', () => {
      setMissionType('free-for-all');
      const alive1 = clone(GAME_USERS_MOCK[0]);
      alive1.attributes.hit_points = 100;
      const alive2 = clone(GAME_USERS_MOCK[1]);
      alive2.attributes.hit_points = 100;

      GAME_USERS.push(alive1, alive2);
      // Game hasn't ended yet, so winner is null
      expect(getWinnerSide()).toBe(null);
    });
  });

  describe('checkStartGameRequirement', () => {
    it('requires non-betrayer acolyte in team mode', () => {
      setMissionType('team');
      const betrayer = clone(GAME_USERS_MOCK[0]);
      betrayer.isBetrayer = true;
      betrayer.role = 'acolyte';

      GAME_USERS.push(betrayer);
      expect(checkStartGameRequirement()).toBe(false);
    });

    it('allows any acolyte in FFA mode', () => {
      setMissionType('free-for-all');
      const betrayer = clone(GAME_USERS_MOCK[0]);
      betrayer.isBetrayer = true;
      betrayer.role = 'acolyte';

      GAME_USERS.push(betrayer);
      expect(checkStartGameRequirement()).toBe(true);
    });

    it('allows master in both modes', () => {
      const master = clone(GAME_USERS_MOCK[0]);
      master.role = 'mortimer';
      GAME_USERS.push(master);

      setMissionType('team');
      expect(checkStartGameRequirement()).toBe(true);

      setMissionType('free-for-all');
      expect(checkStartGameRequirement()).toBe(true);
    });
  });
});
