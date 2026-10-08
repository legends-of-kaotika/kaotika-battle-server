import { parseWebBattleData } from '../../../helpers/battle.ts';
import { Battle } from '../../../interfaces/Battles.ts';
import { PlayerPopulated } from '../../../interfaces/PlayerPopulated.ts';

const buildEnemy = (overrides: Partial<PlayerPopulated> = {}): PlayerPopulated => ({
  _id: 'enemy-1',
  name: 'Lazarus',
  nickname: 'Lazarus',
  avatar: 'images/enemies/lazarus.webp',
  model3d: 'enemy-knight.glb',
  email: 'lazarus@kaotika.test',
  experience: 0,
  level: 42,
  gold: 100,
  is_active: true,
  created_date: '2026-01-01T00:00:00.000Z',
  profile: null,
  attributes: {} as PlayerPopulated['attributes'],
  classroom_id: null,
  isBetrayer: false,
  equipment: {} as PlayerPopulated['equipment'],
  inventory: {} as PlayerPopulated['inventory'],
  tasks: [],
  ...overrides,
});

const buildBattle = (enemies: PlayerPopulated[]): Battle => ({
  _id: 'battle-1',
  name: 'The Ashen Covenant',
  description: 'Desc',
  enemies,
  suggested_level: 10,
  drop_item_level: 5,
  gold: 50,
  exp: 100,
  battle_background: 'images/battle/bg.webp',
  battle_music: 'battle.ogg',
  battle_video_background: 'videos/battle/intro.mp4',
  battle_animations: ['videos/battle/attack.mp4'],
  end_of_battle_background: ['images/battle/victory.webp'],
});

describe('parseWebBattleData', () => {
  it('keeps the stored 3D model of an enemy that is not in the assignment table', () => {
    const battle = buildBattle([
      buildEnemy({ _id: 'e1', name: 'Unknown Foe', model3d: 'brute.glb' }),
      buildEnemy({ _id: 'e2', name: 'Another Foe', model3d: 'demon.glb' }),
    ]);

    const parsed = parseWebBattleData(battle);

    expect(parsed.enemies.map((enemy) => enemy.model3d)).toEqual(['brute.glb', 'demon.glb']);
  });

  it('overrides a stored model with the one the assignment table gives the enemy', () => {
    const battle = buildBattle([
      buildEnemy({ _id: 'e1', model3d: 'brute.glb' }),
      buildEnemy({ _id: 'e2', name: 'Nausea', model3d: 'demon.glb' }),
    ]);

    const parsed = parseWebBattleData(battle);

    expect(parsed.enemies.map((enemy) => enemy.model3d)).toEqual(['brute', 'enemy-vampire']);
  });

  it('falls back to the assignment table when the enemy has no stored model', () => {
    const battle = buildBattle([
      buildEnemy({ model3d: undefined as unknown as string }),
      buildEnemy({ _id: 'e2', name: 'Nobody', model3d: '' }),
    ]);

    const parsed = parseWebBattleData(battle);

    expect(parsed.enemies.map((enemy) => enemy.model3d)).toEqual(['brute', '']);
  });

  it('trims the enemy payload to the fields the web renderer needs', () => {
    const parsed = parseWebBattleData(buildBattle([buildEnemy()]));

    expect(parsed.enemies[0]).toEqual({
      _id: 'enemy-1',
      name: 'Lazarus',
      avatar: 'images/enemies/lazarus.webp',
      model3d: 'brute',
    });
  });

  it('leaves the battle untouched when it has no enemies', () => {
    const parsed = parseWebBattleData(buildBattle([]));

    expect(parsed.enemies).toEqual([]);
  });
});
