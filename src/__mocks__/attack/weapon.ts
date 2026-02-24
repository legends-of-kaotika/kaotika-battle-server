import { Weapon } from "../../interfaces/Weapon.ts";

export const weapon: Weapon = {
    _id: "5632etadg67382",
    name: "Starfall Fang", 
    description: "A silver-black blade that drinks starlight, striking harder with each night it's drawn under the open sky",
    type: "magic",
    image: "/images/weapon/sword.png",
    die_num: 3,
    die_faces: 8,
    die_modifier: 4,
    base_percentage: 40,
    modifiers: {
    intelligence: 20,
    dexterity: 10,
    constitution: 5,
    insanity: 30,
    charisma: 50,
    strength: 60,
    },
    min_lvl: 50,
    value: 200,
    isUnique: false,
    isActive: true,
}
