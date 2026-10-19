import { FFA_WINNER_EXP, FFA_WINNER_GOLD, applyFfaRewards } from '../../services/battleRewardsService.ts';
import { Player, Weapon } from '../../db/models/index.ts';
import { checkIfLevelUpAndUpdatePlayer } from '../../levelup/CheckLevelUp.ts';
import { getAllEquipment, deactivateEquipment } from '../../levelup/EquipmentRepository.ts';

jest.mock('../../db/models/index.ts', () => ({
  Mission: { find: jest.fn(), findOne: jest.fn() },
  Player: { findOne: jest.fn(), findById: jest.fn(), updateOne: jest.fn() },
  Weapon: { find: jest.fn(), findById: jest.fn() },
  Armor: { find: jest.fn(), findById: jest.fn() },
  Helmet: { find: jest.fn(), findById: jest.fn() },
  Shield: { find: jest.fn(), findById: jest.fn() },
  Artifact: { find: jest.fn(), findById: jest.fn() },
  Boot: { find: jest.fn(), findById: jest.fn() },
  Ring: { find: jest.fn(), findById: jest.fn() },
  Npc: { find: jest.fn(), findById: jest.fn() },
}));

jest.mock('../../levelup/CheckLevelUp.ts', () => ({
  checkIfLevelUpAndUpdatePlayer: jest.fn(),
}));

jest.mock('../../levelup/EquipmentRepository.ts', () => ({
  getAllEquipment: jest.fn(),
  deactivateEquipment: jest.fn(),
  getRandomEquipment: jest.fn(),
}));

const winnerDoc = {
  _id: 'winner-id',
  email: 'winner@test.com',
  name: 'WinnerName',
  nickname: 'WinnerNick',
  avatar: 'avatars/winner.png',
  level: 10,
  experience: 100,
  gold: 500,
  isBetrayer: false,
  attributes: { strength: 5 },
  inventory: { weapons: [], armors: [], helmets: [], shields: [], artifacts: [], boots: [], rings: [] },
};

const loserDoc = {
  _id: 'loser-id',
  email: 'loser@test.com',
  name: 'LoserName',
  nickname: 'LoserNick',
  avatar: 'avatars/loser.png',
  level: 8,
  experience: 50,
  gold: 300,
  isBetrayer: false,
  attributes: { strength: 3 },
  inventory: { weapons: ['item-123'], armors: [], helmets: [], shields: [], artifacts: [], boots: [], rings: [] },
};

const dropPiece = {
  _id: 'drop-id',
  type: 'weapon',
  name: 'FFA Drop',
  description: 'A unique drop',
  image: 'images/drop.png',
  value: 100,
  min_lvl: 12,
  isUnique: true,
  isActive: true,
};

const weaponDoc = {
  _id: 'item-123',
  name: 'Stolen Sword',
  description: 'Sharp blade',
  image: 'images/sword.png',
  type: 'weapon',
  value: 50,
  min_lvl: 8,
  isUnique: false,
  isActive: true,
};

describe('applyFfaRewards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Player.findOne as jest.Mock).mockImplementation(({ email }: { email: string }) => ({
      exec: jest.fn().mockResolvedValue(email === 'winner@test.com' ? winnerDoc : loserDoc),
    }));
    (Player.updateOne as jest.Mock).mockResolvedValue({ acknowledged: true });
    (checkIfLevelUpAndUpdatePlayer as jest.Mock).mockResolvedValue(undefined);
    (getAllEquipment as jest.Mock).mockResolvedValue([dropPiece]);
    (deactivateEquipment as jest.Mock).mockResolvedValue(undefined);
    (Weapon.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(weaponDoc) });
  });

  it('rewards winner with gold, exp and unique drop', async () => {
    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: false }],);

    expect(outcome.winner.gold).toBe(FFA_WINNER_GOLD);
    expect(outcome.winner.experience).toBe(FFA_WINNER_EXP);
    expect(outcome.winner.playerName).toBe('WinnerName');
    expect(outcome.winner.playerAvatar).toBe('avatars/winner.png');
    expect(outcome.winner.item).toBeDefined();
    expect(outcome.winner.item?.name).toBe('FFA Drop');
    expect(outcome.winner.item?.min_lvl).toBe(12);
    // Deactivated so it cannot be assigned again
    expect(deactivateEquipment).toHaveBeenCalledWith(dropPiece);
    // Gold incremented
    expect(Player.updateOne).toHaveBeenCalledWith({ _id: 'winner-id' },
      { $inc: { gold: FFA_WINNER_GOLD } },);
    // Drop added to winner inventory
    expect(Player.updateOne).toHaveBeenCalledWith({ _id: 'winner-id' },
      { $addToSet: { 'inventory.weapons': 'drop-id' } },);
  });

  it('steals one random item from each loser and gives them to the winner', async () => {
    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: false }],);

    // Loser inventory pulled
    expect(Player.updateOne).toHaveBeenCalledWith({ _id: 'loser-id' },
      { $pull: { 'inventory.weapons': 'item-123' } },);
    // Stolen item added to winner
    expect(Player.updateOne).toHaveBeenCalledWith({ _id: 'winner-id' },
      { $addToSet: { 'inventory.weapons': 'item-123' } },);
    expect(outcome.winner.stolenItems).toHaveLength(1);
    expect(outcome.winner.stolenItems[0].name).toBe('Stolen Sword');
    expect(outcome.losers[0].lostItem?.name).toBe('Stolen Sword');
    expect(outcome.losers[0].playerName).toBe('LoserName');
    expect(outcome.losers[0].playerAvatar).toBe('avatars/loser.png');
  });

  it('handles loser with empty inventory (no stolen item)', async () => {
    const emptyLoser = { ...loserDoc, inventory: { weapons: [], armors: [], helmets: [], shields: [], artifacts: [], boots: [], rings: [] } };
    (Player.findOne as jest.Mock).mockImplementation(({ email }: { email: string }) => ({
      exec: jest.fn().mockResolvedValue(email === 'winner@test.com' ? winnerDoc : emptyLoser),
    }));

    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: false }],);

    expect(outcome.winner.stolenItems).toHaveLength(0);
    expect(outcome.losers[0].lostItem).toBeUndefined();
    expect(outcome.losers[0].playerName).toBe('LoserName');
  });

  it('excludes the winner from the losers list', async () => {
    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'winner@test.com', isAlive: true }],);

    expect(outcome.losers).toHaveLength(0);
    expect(outcome.winner.stolenItems).toHaveLength(0);
  });

  it('only picks unique equipment for the drop', async () => {
    const nonUniqueNearLevel = { ...dropPiece, _id: 'non-unique-id', name: 'Common Blade', isUnique: false };
    (getAllEquipment as jest.Mock).mockResolvedValue([nonUniqueNearLevel, dropPiece]);

    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: true }],);

    expect(outcome.winner.item?.name).toBe('FFA Drop');
    expect(deactivateEquipment).toHaveBeenCalledWith(dropPiece);
    expect(deactivateEquipment).not.toHaveBeenCalledWith(nonUniqueNearLevel);
  });

  it('never re-drops a unique already deactivated in the database', async () => {
    const deactivatedUnique = { ...dropPiece, isActive: false };
    (getAllEquipment as jest.Mock).mockResolvedValue([deactivatedUnique]);

    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: true }],);

    expect(outcome.winner.item).toBeUndefined();
    expect(deactivateEquipment).not.toHaveBeenCalled();
  });

  it('skips the drop entirely when no unique equipment is available', async () => {
    const nonUnique = { ...dropPiece, _id: 'non-unique-id', isUnique: false };
    (getAllEquipment as jest.Mock).mockResolvedValue([nonUnique]);

    const outcome = await applyFfaRewards('battle-1',
      { email: 'winner@test.com', isAlive: true },
      [{ email: 'loser@test.com', isAlive: true }],);

    expect(outcome.winner.item).toBeUndefined();
    expect(deactivateEquipment).not.toHaveBeenCalled();
    // Drop is not added to the winner inventory
    const dropAdded = (Player.updateOne as jest.Mock).mock.calls
      .some(([, update]) => (update as { $addToSet?: Record<string, unknown> }).$addToSet?.['inventory.weapons'] === 'drop-id');
    expect(dropAdded).toBe(false);
  });
});
