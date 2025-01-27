import { Player } from "../interfaces/Player";

export const playersMock: Player[] = [{
    _id: "66dec0786301a115d494bdb6",
    socketId: "hhwfgeihgiweiu",
    attributes: {
      intelligence: 17,
      dexterity: 37,
      insanity: 30,
      charisma: 17,
      constitution: 22,
      strength: 67
    },
    equipment: {
      helmet: {
        modifiers: {
          intelligence: 2,
          dexterity: 5,
          constitution: 6,
          insanity: 0,
          charisma: 2,
          strength: 6
        },
        _id: "66f3b3ddc8cdd090db911d95",
        name: "Crown of Thunder",
        description: "Harnesses the power of the storm.",
        type: "helmet",
        image: "/images/equipment/helmets/helmet_24.png",
        value: 170,
        defense: 23,
        min_lvl: 10,
        isUnique: false,
        isActive: true
      },
      weapon: {
        modifiers: {
          intelligence: 0,
          dexterity: -5,
          constitution: 0,
          insanity: -8,
          charisma: -1,
          strength: 0
        },
        _id: "672c9f86b705d71590ea1b97",
        name: "Heretic Banana",
        description: "La rica banana.",
        type: "weapon",
        image: "/images/equipment/weapons/banana.png",
        base_percentage: 15,
        min_lvl: 1,
        die_faces: 6,
        die_modifier: 1,
        die_num: 2,
      },
      armor: {
        modifiers: {
          intelligence: 23,
          charisma: 18,
          dexterity: 15,
          strength: -8,
          constitution: 0,
          insanity: 0
        },
        _id: "66f3d2fab32d7add9a08764d",
        name: "Guardian's Plate",
        description: "Worn by protectors of ancient temples.",
        type: "armor",
        image: "/images/equipment/armors/armor_49.png",
        value: 780,
        defense: 90,
        min_lvl: 13,
        isUnique: false,
        isActive: true
      },
      shield: {
        modifiers: {
          intelligence: 15,
          dexterity: 5,
          constitution: 10,
          insanity: 0,
          charisma: 10,
          strength: 5
        },
        _id: "66f27ec7c114335cadf45da5",
        name: "Shield of the Arcane Ward",
        description: "A shield infused with arcane magic.",
        type: "shield",
        image: "/images/equipment/shields/shield_53.png",
        value: 250,
        defense: 40,
        min_lvl: 17,
        isUnique: true,
        isActive: false
      },
      artifact: {
        modifiers: {
          intelligence: 6,
          dexterity: 5,
          constitution: 6,
          insanity: 3,
          charisma: 4,
          strength: 5
        },
        _id: "66f66ae44a8f1157dab87b66",
        name: "Amulet of Twilight Harmony",
        description: "Balances light and dark energies.",
        type: "artifact",
        image: "/images/equipment/artifacts/artifact_17.png",
        value: 180,
        min_lvl: 13,
        isActive: true,
        isUnique: false
      },
      boot: {
        modifiers: {
          intelligence: 7,
          dexterity: 6,
          constitution: 4,
          insanity: 2,
          charisma: 4,
          strength: 2
        },
        _id: "66f694d84a8f1157dab87bd2",
        name: "Voidwalker Boots",
        description: "Walk the line between worlds.",
        type: "boot",
        image: "/images/equipment/boots/boot_26.png",
        value: 500,
        defense: 45,
        min_lvl: 19,
        isActive: true,
        isUnique: false
      },
      ring: {
        modifiers: {
          intelligence: 2,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 2
        },
        _id: "66a6d6c8dfbffe7e6503970f",
        name: "Ring of Eternal Flame",
        description: "A ring that burns with eternal fire.",
        type: "ring",
        image: "/images/equipment/rings/ring_1.png",
        value: 10,
        min_lvl: 1,
      },
      antidote_potion: {
        modifiers: {
          hit_points: 0,
          intelligence: 0,
          dexterity: 0,
          constitution: 12,
          insanity: 0,
          charisma: 8,
          strength: 0
        },
        _id: "668bca125319ea9afdff075e",
        name: "Antidote of Frostbane Fever",
        description: "A potent concoction brewed from the rare Lumina flowers that only bloom under the full moon. The elixir emits a radiant glow and, when consumed, floods the body with purifying light, banishing the shadows and restoring the natural hue of the skin.",
        type: "antidote",
        image: "/images/equipment/potions/antidote/antidote_1.png",
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: -8,
            constitution: -12,
            strength: 0
          },
          _id: "6693fd5846527d0df5f0efe8",
          name: "Frostbane Fever",
          description: "A chilling illness that lowers the body temperature drastically, causing frost to form on the skin and organs to freeze.",
          type: "illness",
          antidote_effects: [
            "restore_constitution",
            "lesser_restore_charisma"
          ],
          poison_effects: [
            "damage_constitution",
            "lesser_damage_charisma"
          ]
        },
        min_lvl: 1
      },
      healing_potion: {
        modifiers: {
          hit_points: 20,
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0
        },
        _id: "668bca125319ea9afdff0750",
        name: "Essence of Vitality",
        description: "A rejuvenating potion that restores vigor and vitality to the drinker.",
        type: "essence",
        image: "/images/equipment/potions/healing/healing_1.png",
        value: 10,
        min_lvl: 1
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 20
        },
        _id: "668bca125319ea9afdff0767",
        name: "Elixir of Increase Strength",
        description: "This robust elixir temporarily amplifies the drinker's physical power, significantly boosting muscle strength and stamina.\n\n\n",
        type: "elixir",
        image: "/images/equipment/potions/enhancer/enhancer_1.png",
        value: 10,
        duration: 2,
        min_lvl: 1
      }
    },
    inventory: {
      antidote_potions: [],
      healing_potions: [],
      enhancer_potions: []
    },
    status: {
      ethaziumCurse: false,
      common_diseases: [],
      tired: false
    },
    name: "VICTOR JAVIER DURÁN DE FRANÇA",
    nickname: "Vittorio “Il Ratto” Di Napoli",
    email: "victor.duran@ikasle.aeg.eus",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjX8hFPf0kk1iWOz-s7lrsyaBSeOGz8vsFiT8c07uyz9oZteEEwPbxYsq7vsG-vOoOynzwNyoZrZujmFEGa6nBoxZErZlxZzbM4y-j-61owzNTxtc325CITaG09yt9yP86aUyCXQBfwhQLbBhD6KrEZ7C4UA35n2WQ1Wt3Ae4IZN7PoTxoe296Gntu3ih3L96qsMOu3YLH_bcWVK3qiORg4PZBMbn7815BwdiiEXfvNKCf0A1ihbynjSpSoz0ds_zn1YshF5e95UBYAMklwtMqHnBoHpfwqWDGpkwHIm-qUS1DLiTFDQIHl5qOCbiEYEIrfdAQGtrCMqxV8b05WGauBfVHuq-JVD9OHlN0Xhu0tblXZL2YwvSxa74-pBYfuHd7BfxxI9Lju5YMO58M9yFXQe0l0HI54Td7LApBrb0lNtrB2HpIEIHBmZQPns8OmATjlX6v83KCDSSmWJPvlxCHv19uyQswkve8pw-mmtdKkD7pf7L9vMJZsSvsK2Cu91J-777Sm4wOsn6m8EVIP0sAkSbFJKFXZ2vUNNRoof8dvuUcgnBIXqPkWlEm3N2CHR4zhnXuH_zWcYvsFtnAtnq7F6FemEyyEgT44tfGk8D2WnSNxmiwJD9cMEG8Zw2SYzucCAdyWQssQI9OtCoo3Ga88wXw9vkaZZ7MPASbGRQ0FcbkubzzQhQrCRoJXAX-pJ5MqfWLT_oSrartdlOdGP0GXobxWh9GcXGz5SE5xo-Z79qXpAowsGDDyLrtqypAcNpPqmiCtG3QLN8ryv2vcNUO1BBXqsbobziv-mMepytQe1YjJBXz67lvwRf8KGWJgyuIlwKkDS7HY3HLqVv1yfnVqda6AS0HAyQ2JvRBeW97rg4S0Ur3P5eMFsq_Zy1beWUxNPBvO8-qJkpw8miLcEUgyaU7I-rsyMtQh0xP--paKfHdtp8gtoVaG7AQseMRA1iuFdq59Is8oV2kJkBctfzCw_IiPe=s100-c",
    level: 19,
    profile: {
      name: "Pariah"
    },
    role: "acolyte",
    resistance: 100,
  },
  {
    _id: "66dec0006301a115d494bd0d",
    socketId: "wefjkgew",
    attributes: {
      intelligence: 16,
      dexterity: 66,
      insanity: 45,
      charisma: 30,
      constitution: 28,
      strength: 15
    },
    equipment: {
      helmet: {
        modifiers: {
          intelligence: 3,
          dexterity: 6,
          constitution: 5,
          insanity: 1,
          charisma: 2,
          strength: 4
        },
        _id: "66f3b3ddc8cdd090db911d96",
        name: "Helm of Eternal Flames",
        description: "Burns with the fire of the eternal.",
        type: "helmet",
        image: "/images/equipment/helmets/helmet_25.png",
        value: 190,
        defense: 27,
        min_lvl: 11,
        isUnique: false,
        isActive: true
      },
      weapon: {
        modifiers: {
          intelligence: 9,
          dexterity: 10,
          constitution: 0,
          insanity: 11,
          charisma: 8,
          strength: 0
        },
        _id: "66f9cfb1d39859521ad20ff4",
        name: "Arcane Sabre",
        description: "A sword infused with pure arcane energy.",
        type: "weapon",
        image: "/images/equipment/weapons/sword_31.png",
        base_percentage: 15,
        min_lvl: 20,
        die_faces: 20,
        die_modifier: 5,
        die_num: 10,
      },
      armor: {
        modifiers: {
          strength: -8,
          constitution: 0,
          dexterity: 20,
          intelligence: 25,
          insanity: 0,
          charisma: 20
        },
        _id: "66f3e0f7b32d7add9a087691",
        name: "Guardian's Armament",
        description: "A special armor that protects its bearer with ancient magic.",
        type: "armor",
        image: "/images/equipment/armors/heavy_armor_28.png",
        value: 870,
        defense: 75,
        isUnique: false,
        isActive: true,
        min_lvl: 15
      },
      shield: {
        modifiers: {
          intelligence: 12,
          dexterity: 3,
          constitution: 10,
          insanity: 0,
          charisma: 10,
          strength: 5
        },
        _id: "66f27e07c114335cadf45da0",
        name: "Arcane Shield",
        description: "An impenetrable shield crafted from rare materials.",
        type: "shield",
        image: "/images/equipment/shields/shield_54.png",
        value: 240,
        defense: 40,
        min_lvl: 12,
        isUnique: false,
        isActive: true
      },
      artifact: {
        modifiers: {
          intelligence: 6,
          dexterity: 7,
          constitution: 7,
          insanity: 4,
          charisma: 4,
          strength: 4
        },
        _id: "66f66ae64a8f1157dab87b68",
        name: "Talisman of Eternal Radiance",
        description: "Imbued with radiant energy to heal and defend.",
        type: "artifact",
        image: "/images/equipment/artifacts/artifact_16.png",
        value: 180,
        min_lvl: 14,
        isActive: true,
        isUnique: false
      },
      boot: {
        modifiers: {
          intelligence: 8,
          dexterity: 7,
          constitution: 4,
          insanity: 3,
          charisma: 4,
          strength: 1
        },
        _id: "66f694d84a8f1157dab87bdb",
        name: "Boots of the Arcane Stride",
        description: "Grants the user unparalleled swiftness and agility.",
        type: "boot",
        image: "/images/equipment/boots/boot_30.png",
        value: 500,
        defense: 40,
        min_lvl: 18,
        isActive: true,
        isUnique: false
      },
      ring: {
        modifiers: {
          intelligence: 1,
          dexterity: 0,
          constitution: 0,
          insanity: 2,
          charisma: 0,
          strength: 3
        },
        _id: "66a6d6c8dfbffe7e65039710",
        name: "Ring of Eternal Inferno",
        description: "Wreathed in the flames of the underworld.",
        type: "ring",
        image: "/images/equipment/rings/ring_2.png",
        value: 20,
        min_lvl: 1,
      },
      antidote_potion: {
        modifiers: {
          hit_points: 0,
          intelligence: 0,
          dexterity: 0,
          constitution: 10,
          insanity: 0,
          charisma: 0,
          strength: 0
        },
        _id: "668bca125319ea9afdff075f",
        name: "Antidote of Molten Fever",
        description: "A fiery antidote brewed from molten lava and rare herbs.",
        type: "antidote",
        image: "/images/equipment/potions/antidote/antidote_2.png",
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: -8,
            constitution: -12,
            strength: 0
          },
          _id: "6693fd5846527d0df5f0ef11",
          name: "Molten Fever",
          description: "A scorching disease that weakens the body and mind.",
          type: "illness",
          antidote_effects: [
            "restore_constitution",
            "lesser_restore_charisma"
          ],
          poison_effects: [
            "damage_constitution",
            "lesser_damage_charisma"
          ]
        },
        min_lvl: 1
      },
      healing_potion: {
        modifiers: {
          hit_points: 20,
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0
        },
        _id: "668bca125319ea9afdff0756",
        name: "Essence of Eternal Flame",
        description: "A potion that burns away weakness and restores vitality.",
        type: "essence",
        image: "/images/equipment/potions/healing/healing_2.png",
        value: 10,
        min_lvl: 1
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 15
        },
        _id: "668bca125319ea9afdff0769",
        name: "Elixir of Pure Agility",
        description: "An elixir that enhances dexterity and speed.",
        type: "elixir",
        image: "/images/equipment/potions/enhancer/enhancer_2.png",
        value: 10,
        duration: 2,
        min_lvl: 1
      }
    },
    inventory: {
      antidote_potions: [],
      healing_potions: [],
      enhancer_potions: []
    },
    status: {
      ethaziumCurse: false,
      common_diseases: [],
      tired: false
    },
    name: "JAIME ALBERTO PONCE",
    nickname: "Karmakarma",
    email: "jaime.alberto@ikasle.aeg.eus",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjX8hFPf0kk1iWOz-s7lrsyaBSeOGz8vsFiT8c07uyz9oZteEEwPbxYsq7vsG-vOoOynzwNyoZrZujmFEGa6nBoxZErZlxZzbM4y-j-61owzNTxtc325CITaG09yt9yP86aUyCXQBfwhQLbBhD6KrEZ7C4UA35n2WQ1Wt3Ae4IZN7PoTxoe296Gntu3ih3L96qsMOu3YLH_bcWVK3qiORg4PZBMbn7815BwdiiEXfvNKCf0A1ihbynjSpSoz0ds_zn1YshF5e95UBYAMklwtMqHnBoHpfwqWDGpkwHIm-qUS1DLiTFDQIHl5qOCbiEYEIrfdAQGtrCMqxV8b05WGauBfVHuq-JVD9OHlN0Xhu0tblXZL2YwvSxa74-pBYfuHd7BfxxI9Lju5YMO58M9yFXQe0l0HI54Td7LApBrb0lNtrB2HpIEIHBmZQPns8OmATjlX6v83KCDSSmWJPvlxCHv19uyQswkve8pw-mmtdKkD7pf7L9vMJZsSvsK2Cu91J-777Sm4wOsn6m8EVIP0sAkSbFJKFXZ2vUNNRoof8dvuUcgnBIXqPkWlEm3N2CHR4zhnXuH_zWcYvsFtnAtnq7F6FemEyyEgT44tfGk8D2WnSNxmiwJD9cMEG8Zw2SYzucCAdyWQssQI9OtCoo3Ga88wXw9vkaZZ7MPASbGRQ0FcbkubzzQhQrCRoJXAX-pJ5MqfWLT_oSrartdlOdGP0GXobxWh9GcXGz5SE5xo-Z79qXpAowsGDDyLrtqypAcNpPqmiCtG3QLN8ryv2vcNUO1BBXqsbobziv-mMepytQe1YjJBXz67lvwRf8KGWJgyuIlwKkDS7HY3HLqVv1yfnVqda6AS0HAyQ2JvRBeW97rg4S0Ur3P5eMFsq_Zy1beWUxNPBvO8-qJkpw8miLcEUgyaU7I-rsyMtQh0xP--paKfHdtp8gtoVaG7AQseMRA1iuFdq59Is8oV2kJkBctfzCw_IiPe=s100-c",
    level: 20,
    profile: {
      name: "Champion"
    },
    role: "knight",
    resistance: 80,
  }];
