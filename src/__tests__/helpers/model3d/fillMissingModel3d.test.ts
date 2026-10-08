import {
  MID_POOL,
  NPC_MODELS,
  POWERFUL_POOL,
  WEAK_POOL,
  acolyteAssignments,
  assertKnown,
  fillMissingModel3d,
  fillNpcModel3d,
  Model3dMember,
} from '../../../helpers/model3d.ts';

const MASTER_EMAIL = 'istvan@kaotika.test';

describe('model3d assignment', () => {
  const originalIstvan = process.env.ISTVAN_EMAIL;
  const originalMortimer = process.env.MORTIMER_EMAIL;
  const originalVillain = process.env.VILLAIN_EMAIL;

  beforeEach(() => {
    process.env.ISTVAN_EMAIL = MASTER_EMAIL;
    process.env.MORTIMER_EMAIL = 'mortimer@kaotika.test';
    process.env.VILLAIN_EMAIL = 'villain@kaotika.test';
  });

  afterEach(() => {
    process.env.ISTVAN_EMAIL = originalIstvan;
    process.env.MORTIMER_EMAIL = originalMortimer;
    process.env.VILLAIN_EMAIL = originalVillain;
  });

  it('gives an NPC the model of the table, even when its row is stale', () => {
    const roster: Model3dMember[] = [
      { _id: 'npc-1', name: 'Dicerius', role: 'npc', model3d: '' },
      { _id: 'npc-2', nickname: 'Nausea', role: 'npc', model3d: 'paladin' },
    ];

    fillMissingModel3d(roster);

    expect(roster.map((member) => member.model3d)).toEqual(['enemy-ganfaul', 'enemy-vampire']);
  });

  it('gives the master the model of the table', () => {
    const roster: Model3dMember[] = [
      { _id: 'p1', email: MASTER_EMAIL, level: 5, model3d: 'archer' },
    ];

    fillMissingModel3d(roster);

    expect(roster[0].model3d).toBe('brute');
  });

  it('keeps the stored model of an acolyte', () => {
    const roster: Model3dMember[] = [
      { _id: 'p1', email: 'acolyte@kaotika.test', level: 5, model3d: 'maria' },
    ];

    fillMissingModel3d(roster);

    expect(roster[0].model3d).toBe('maria');
  });

  it('fills an acolyte without a model from the pool of its level tier', () => {
    const roster: Model3dMember[] = [
      { _id: 'weak', email: 'weak@kaotika.test', level: 5 },
      { _id: 'mid', email: 'mid@kaotika.test', level: 30 },
      { _id: 'powerful', email: 'powerful@kaotika.test', level: 65 },
    ];

    fillMissingModel3d(roster);

    expect(roster[0].model3d).toBe(WEAK_POOL[0]);
    expect(roster[1].model3d).toBe(MID_POOL[0]);
    expect(roster[2].model3d).toBe(POWERFUL_POOL[0]);
  });

  it('spreads a tier over its pool instead of repeating one model', () => {
    const roster: Model3dMember[] = ['a', 'b', 'c', 'd'].map((suffix) => ({
      _id: `acolyte-${suffix}`,
      email: `acolyte-${suffix}@kaotika.test`,
      level: 30,
      model3d: '',
    }));
    const expected = acolyteAssignments(roster);

    fillMissingModel3d(roster);

    const models = roster.map((member) => member.model3d);
    expect(models.every((model) => MID_POOL.includes(model as string))).toBe(true);
    expect(new Set(models).size).toBeGreaterThan(1);
    expect(models).toEqual(roster.map((member) => expected.get(String(member._id))));
  });

  it('is deterministic: the same roster always gets the same models', () => {
    const build = (): Model3dMember[] => ['1', '2', '3'].map((suffix) => ({
      _id: `player-${suffix}`,
      email: `player-${suffix}@kaotika.test`,
      level: 62,
    }));

    const first = build();
    const second = build();
    fillMissingModel3d(first);
    fillMissingModel3d(second);

    expect(first.map((member) => member.model3d)).toEqual(second.map((member) => member.model3d));
    expect(first.every((member) => (POWERFUL_POOL as readonly string[]).includes(member.model3d ?? ''))).toBe(true);
  });

  it('resolves mission enemies by name', () => {
    const enemies: Model3dMember[] = [
      { _id: 'e1', name: 'Lazarus', model3d: '' },
      { _id: 'e2', name: 'Nobody', model3d: 'brute' },
    ];

    fillNpcModel3d(enemies);

    expect(enemies.map((enemy) => enemy.model3d)).toEqual(['brute', 'brute']);
  });

  it('only publishes models the web client ships', () => {
    const models = [
      ...Object.values(NPC_MODELS),
      ...WEAK_POOL,
      ...MID_POOL,
      ...POWERFUL_POOL,
      'brute', 'enemy-ganfaul', 'ch40',
    ];

    for (const model of models) assertKnown(model, 'table');
  });
});
