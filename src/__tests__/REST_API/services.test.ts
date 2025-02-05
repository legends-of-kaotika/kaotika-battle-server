import { calculateHitPoints, calculateAttack, calculateDefense, calculateMagicResistance, calculateCFP, calculateBCFA, /*filterPlayerData,*/assignRole, /*initFetchPlayer*/ } from '../../services/playerService';
import { Modifier } from '../../interfaces/Modifier';
// import { playerPopulated } from '../../__mocks__/playerPopulated';

describe('Attribute Calculation Functions', () => {
  const mockAttributes: Modifier = {
    charisma: 5,
    constitution: 10,
    dexterity: 8,
    insanity: 4,
    intelligence: 6,
    strength: 12,
    resistance: 100,
    attack: 0,
    hit_points: 0,
    defense: 0,
    magic_resistance: 0,
    CFP: 0,
    BCFA: 0,
  };

  it('calculateHitPoints', () => {
    expect(calculateHitPoints(mockAttributes)).toBe(Math.floor(10 + 8 - 4 / 2));
  });

  it('calculateAttack', () => {
    expect(calculateAttack(mockAttributes)).toBe(Math.floor(12 - 4 / 2));
  });

  it('calculateDefense', () => {
    expect(calculateDefense(mockAttributes)).toBe(Math.floor(8 + 10 + 6 / 2));
  });

  it('calculateMagicResistance', () => {
    expect(calculateMagicResistance(mockAttributes)).toBe(Math.floor(6 + 5));
  });

  it('calculateCFP', () => {
    expect(calculateCFP(mockAttributes)).toBe(4);
  });

  it('calculateBCFA', () => {
    expect(calculateBCFA(mockAttributes)).toBe(Math.floor(12 + 4));
  });
});

// describe('filterPlayerData', () => {
//   test('should return a properly structured Player object', () => {
//     const player = filterPlayerData(playerPopulated);
//     expect(player).toHaveProperty('_id', '123');
//     expect(player).toHaveProperty('name', 'TestPlayer');
//     expect(player).toHaveProperty('attributes');
//     expect(player.attributes).toHaveProperty('hit_points');
//     expect(player.attributes).toHaveProperty('attack');
//   });
// });

describe('assignRole', () => {
  it('assigns special roles based on email', () => {
    process.env.ISTVAN_EMAIL = 'istvan@example.com';
    process.env.VILLAIN_EMAIL = 'villain@example.com';
    process.env.MORTIMER_EMAIL = 'mortimer@example.com';

    expect(assignRole('istvan@example.com')).toBe('istvan');
    expect(assignRole('villain@example.com')).toBe('villain');
    expect(assignRole('mortimer@example.com')).toBe('mortimer');
    expect(assignRole('random@example.com')).toBe('acolyte');
  });
});

// describe('initFetchPlayer', () => {
//   beforeEach(() => {
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ data: { email: 'test@example.com', name: 'Test Player' } })
//       }));
//   });

//   test('fetches player data and assigns role', async () => {
//     const player = await initFetchPlayer('test@example.com');
//     expect(player).toHaveProperty('name');
//     expect(player).toHaveProperty('role');
//   });
// });