import { adjustAtributes } from '../../helpers/attack.ts';
import { Player } from '../../interfaces/Player.ts';

describe('adjustAtributes', () => {
  it('should round all attributes to integers', () => {
    const player: Player = {
      attributes: {
        intelligence: 10.7,
        dexterity: 5.2,
        constitution: 8.9,
        insanity: 99.9,
        charisma: 7.3,
        strength: 6.5,
        hit_points: 50.4,
        attack: 0.4,
        defense: 12.6,
        magic_resistance: 3.3,
        CFP: 12.6,
        BCFA: 7.9,
        resistance: 4.5
      }
    } as Player;
    
    const adjustedPlayer = adjustAtributes(player);
    expect(adjustedPlayer.attributes.intelligence).toBe(11);
    expect(adjustedPlayer.attributes.dexterity).toBe(5);
    expect(adjustedPlayer.attributes.constitution).toBe(9);
    expect(adjustedPlayer.attributes.insanity).toBe(100);
    expect(adjustedPlayer.attributes.charisma).toBe(7);
    expect(adjustedPlayer.attributes.strength).toBe(7);
    expect(adjustedPlayer.attributes.hit_points).toBe(50);
    expect(adjustedPlayer.attributes.attack).toBe(0);
    expect(adjustedPlayer.attributes.defense).toBe(13);
    expect(adjustedPlayer.attributes.magic_resistance).toBe(3);
    expect(adjustedPlayer.attributes.CFP).toBe(13);
    expect(adjustedPlayer.attributes.BCFA).toBe(8);
    expect(adjustedPlayer.attributes.resistance).toBe(5);
  });

  it('should enforce minimum value rules', () => {
    const player: Player = {
      attributes: {
        intelligence: -5,
        dexterity: 0.2,
        constitution: -1,
        insanity: 150,
        charisma: -3,
        strength: -4,
        hit_points: -10,
        attack: -3,
        defense: -2,
        magic_resistance: -5,
        CFP: 10,
        BCFA: -7,
        resistance: -6
      }
    }as Player;
    
    const adjustedPlayer = adjustAtributes(player);
    expect(adjustedPlayer.attributes.intelligence).toBe(1);
    expect(adjustedPlayer.attributes.dexterity).toBe(1);
    expect(adjustedPlayer.attributes.constitution).toBe(1);
    expect(adjustedPlayer.attributes.insanity).toBe(100);
    expect(adjustedPlayer.attributes.charisma).toBe(1);
    expect(adjustedPlayer.attributes.strength).toBe(1);
    expect(adjustedPlayer.attributes.hit_points).toBe(1);
    expect(adjustedPlayer.attributes.defense).toBe(1);
    expect(adjustedPlayer.attributes.magic_resistance).toBe(1);
    expect(adjustedPlayer.attributes.CFP).toBe(10);
    expect(adjustedPlayer.attributes.BCFA).toBe(1);
    expect(adjustedPlayer.attributes.resistance).toBe(1);
  });

  it('should enforce minimum and maximum values for insanity', () => {
    const player: Player = {
      attributes: {
        insanity: -10
      }
    }as Player;
    
    const adjustedPlayer = adjustAtributes(player);
    expect(adjustedPlayer.attributes.insanity).toBe(1);

    player.attributes.insanity = 150;
    const adjustedPlayerMax = adjustAtributes(player);
    expect(adjustedPlayerMax.attributes.insanity).toBe(100);
  });
});




