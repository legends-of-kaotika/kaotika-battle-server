/**
 * Single source of truth for the 3D model every character uses.
 *
 * `scripts/seedModel3d.ts` persists this table to Mongo, and the helpers below
 * apply the very same table while a payload is being built, so the web client
 * still gets the right model when a document (or an in-memory copy of it) was
 * stored before the table existed.
 *
 * Every value must be a stem present in `public/assets/` of the web client.
 * The arena derives the animation set from MODEL_CLASS and the size from
 * MODEL_SCALE, so the value is a file name without extension.
 */
export const KNOWN_MODELS = [
  'archer', 'arissa', 'ascetum', 'bishop', 'brute', 'ch40', 'demon', 'demetrius', 'dicerius',
  'enemy-ganfaul', 'enemy-heraklios', 'enemy-knight', 'enemy-vampire',
  'eve', 'kachujin', 'lazarus', 'maria', 'mutant', 'nausea', 'paladin', 'poluctus',
] as const;

/** Big silhouettes for the L60+ crowd: mostly mages plus a couple of bruisers.
 *  The head of the list is what the smallest tier draws from, so it stays balanced. */
export const POWERFUL_POOL = [
  'demon', 'enemy-vampire', 'brute',
  'enemy-heraklios', 'enemy-vampire',
  'enemy-knight', 'demon',
];

/** Human-sized models for the mid game. */
export const MID_POOL = ['arissa', 'ch40', 'kachujin', 'arissa', 'ch40'];

/** Small human models for the weakest characters. */
export const WEAK_POOL = ['archer', 'paladin', 'maria', 'eve', 'arissa', 'kachujin'];

export const NPC_MODELS: Record<string, string> = {
  Dicerius: 'dicerius',
  Demetrius: 'demetrius',
  Elias: 'enemy-knight',
  Lazarus: 'lazarus',
  Nausea: 'nausea',
  Zachariah: 'mutant',
  Ascetum: 'ascetum',
  Banger: 'demon',
  Leoric: 'brute',
  Szar: 'enemy-knight',
  'Angelo di Mortis': 'ch40',
  Poluctus: 'poluctus',
  Bishop: 'bishop',
  Strombo: 'kachujin',
  'PAZUS-DESPISTADUS': 'paladin',
  'Dr Github': 'archer',
  'The Calvorot Pringao': 'maria',
  'The Chinese': 'kachujin',
  Rous: 'eve',
  Angelo: 'arissa',
  'El Biuti': 'maria',
};

export const PROFILE_MODELS: Record<string, string> = {
  Bumbler: 'brute',
};

/** Anything that travels to the client with a name and a model slot. */
export interface Model3dMember {
  _id?: unknown;
  email?: string;
  name?: string;
  nickname?: string;
  level?: number;
  role?: string;
  model3d?: string;
  profile?: { name?: string } | null;
}

export const hash = (value: string): number => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

export const masterModelByEmail = (): Record<string, string> => {
  const masters: Record<string, string> = {};
  if (process.env.ISTVAN_EMAIL) masters[process.env.ISTVAN_EMAIL] = 'brute';
  if (process.env.MORTIMER_EMAIL) masters[process.env.MORTIMER_EMAIL] = 'paladin';
  if (process.env.VILLAIN_EMAIL) masters[process.env.VILLAIN_EMAIL] = 'ch40';
  return masters;
};

export const tierForLevel = (level: number): readonly string[] => (
  level >= 60 ? POWERFUL_POOL : level >= 20 ? MID_POOL : WEAK_POOL
);

export const assertKnown = (model: string, where: string): void => {
  if (!(KNOWN_MODELS as readonly string[]).includes(model)) {
    throw new Error(`${where} points at unknown model "${model}"`);
  }
};

export const labelFor = (member: Model3dMember): string => (
  member.nickname || member.name || String(member._id ?? '')
);

const isNpcMember = (member: Model3dMember): boolean => member.role === 'npc';

/**
 * Spreads every level tier over its pool: the hash orders the queue and the
 * index inside the tier picks the model, which is the rule the seed applies.
 */
export const acolyteAssignments = (roster: Model3dMember[]): Map<string, string> => {
  const masters = masterModelByEmail();
  const acolytes = roster.filter((member) => (!member.email || !masters[member.email]) && !PROFILE_MODELS[member.profile?.name ?? '']);
  const tiers = new Map<readonly string[], Model3dMember[]>();
  for (const member of acolytes) {
    const tier = tierForLevel(member.level ?? 0);
    tiers.set(tier, [...(tiers.get(tier) ?? []), member]);
  }

  const assignments = new Map<string, string>();
  for (const [tier, members] of tiers) {
    members
      .slice()
      .sort((left, right) => hash(String(left._id)) - hash(String(right._id)))
      .forEach((member, index) => assignments.set(String(member._id), tier[index % tier.length]));
  }
  return assignments;
};

const resolveMember = (member: Model3dMember, masters: Record<string, string>, assignments: Map<string, string>): string => {
  if (isNpcMember(member)) return NPC_MODELS[labelFor(member)] ?? member.model3d ?? '';
  if (member.email && masters[member.email]) return masters[member.email];
  const profileModel = PROFILE_MODELS[member.profile?.name ?? ''];
  if (profileModel) return profileModel;
  if (member.model3d) return member.model3d;
  return assignments.get(String(member._id ?? '')) ?? '';
};

/** Writes the model of every roster member that would reach the client without one. */
export const fillMissingModel3d = (roster: Model3dMember[]): void => {
  const masters = masterModelByEmail();
  const assignments = acolyteAssignments(roster);
  for (const member of roster) {
    const model = resolveMember(member, masters, assignments);
    if (model && model !== (member.model3d ?? '')) member.model3d = model;
  }
};

/** Same rule for mission enemies, which arrive as plain name/model pairs. */
export const fillNpcModel3d = (members: Model3dMember[]): void => {
  for (const member of members) {
    const model = NPC_MODELS[labelFor(member)] ?? member.model3d ?? '';
    if (model && model !== (member.model3d ?? '')) member.model3d = model;
  }
};
