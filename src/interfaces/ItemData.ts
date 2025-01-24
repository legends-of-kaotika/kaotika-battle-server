export interface ItemData {
    _id: string;
    name: string;
    description: string;
    image: string;
    type: string;
    value?: number;
    modifiers?: any;
    min_lvl?: number;
    effects?: Array<string>;
    profiles?: Array<string>;
    base_percentage?: number;
    defense?: number;
    isUnique?: boolean;
    isActive?: boolean;
    die_faces?: number;
    die_modifier?: number;
    die_num?: number;
    qty?: number;
  }