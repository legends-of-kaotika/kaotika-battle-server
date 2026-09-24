export interface ProfilesEntry {
  name: string;
  major_attributes: string[];
  minor_attributes: string[];
  normal_attributes: string[];
}

export const ProfilesAttributes: ProfilesEntry[] = [
  {
    name: 'Scholar',
    major_attributes: ['Intelligence'],
    minor_attributes: ['Constitution', 'Strength'],
    normal_attributes: ['Dexterity', 'Charisma'],
  },
  {
    name: 'Pariah',
    major_attributes: ['Strength'],
    minor_attributes: ['Charisma', 'Intelligence'],
    normal_attributes: ['Dexterity', 'Constitution'],
  },
  {
    name: 'Juggler',
    major_attributes: ['Dexterity'],
    minor_attributes: ['Intelligence', 'Strength'],
    normal_attributes: ['Charisma', 'Constitution'],
  },
  {
    name: 'Blasphemer',
    major_attributes: ['Charisma'],
    minor_attributes: ['Intelligence', 'Constitution'],
    normal_attributes: ['Strength', 'Dexterity'],
  },
  {
    name: 'Embalmer',
    major_attributes: ['Dexterity'],
    minor_attributes: ['Charisma', 'Constitution'],
    normal_attributes: ['Intelligence', 'Strength'],
  },
  {
    name: 'Gossiper',
    major_attributes: ['Intelligence'],
    minor_attributes: ['Strength', 'Constitution'],
    normal_attributes: ['Dexterity', 'Charisma'],
  },
  {
    name: 'Bumbler',
    major_attributes: ['Constitution'],
    minor_attributes: ['Intelligence', 'Dexterity', 'Charisma'],
    normal_attributes: ['Strength'],
  },
  {
    name: 'Poet',
    major_attributes: ['Charisma'],
    minor_attributes: ['Constitution', 'Strength'],
    normal_attributes: ['Dexterity', 'Intelligence'],
  },
];
