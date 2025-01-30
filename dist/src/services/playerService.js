"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBCFA = exports.calculateCFP = exports.calculateMagicResistance = exports.calculateDefense = exports.calculateAttack = exports.calculateHitPoints = void 0;
const Player = require("../models/playerSchema");
const calculateBaseAttributes = (data) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const equipmentModifiers = [
        (_a = data.equipment.helmet) === null || _a === void 0 ? void 0 : _a.modifiers,
        (_b = data.equipment.weapon) === null || _b === void 0 ? void 0 : _b.modifiers,
        (_c = data.equipment.armor) === null || _c === void 0 ? void 0 : _c.modifiers,
        (_d = data.equipment.shield) === null || _d === void 0 ? void 0 : _d.modifiers,
        (_e = data.equipment.artifact) === null || _e === void 0 ? void 0 : _e.modifiers,
        (_f = data.equipment.boot) === null || _f === void 0 ? void 0 : _f.modifiers,
        (_g = data.equipment.ring) === null || _g === void 0 ? void 0 : _g.modifiers,
    ].filter((modifier) => modifier !== undefined);
    const calculateAttribute = (attribute) => {
        const baseValue = data.attributes[attribute] || 0;
        const equipmentValue = equipmentModifiers.reduce((sum, modifier) => sum + (modifier[attribute] || 0), 0);
        return baseValue + equipmentValue;
    };
    return {
        charisma: calculateAttribute('charisma'),
        constitution: calculateAttribute('constitution'),
        dexterity: calculateAttribute('dexterity'),
        insanity: calculateAttribute('insanity'),
        intelligence: calculateAttribute('intelligence'),
        strength: calculateAttribute('strength'),
        resistance: 100,
        attack: 0,
        hit_points: 0,
        defense: 0,
        magic_resistance: 0,
        CFP: 0,
        BCFA: 0,
    };
};
const calculateHitPoints = (attributes) => {
    return Math.floor(attributes.constitution + attributes.dexterity - attributes.insanity / 2);
};
exports.calculateHitPoints = calculateHitPoints;
const calculateAttack = (attributes) => {
    return Math.floor(attributes.strength - attributes.insanity / 2);
};
exports.calculateAttack = calculateAttack;
const calculateDefense = (attributes) => {
    return Math.floor(attributes.dexterity + attributes.constitution + attributes.intelligence / 2);
};
exports.calculateDefense = calculateDefense;
const calculateMagicResistance = (attributes) => {
    return Math.floor(attributes.intelligence + attributes.charisma);
};
exports.calculateMagicResistance = calculateMagicResistance;
const calculateCFP = (attributes) => {
    return attributes.insanity;
};
exports.calculateCFP = calculateCFP;
const calculateBCFA = (attributes) => {
    return Math.floor(attributes.strength + attributes.insanity);
};
exports.calculateBCFA = calculateBCFA;
const filterPlayerData = (data) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const baseAttributes = calculateBaseAttributes(data);
    const calculatedAttributes = Object.assign(Object.assign({}, baseAttributes), { hit_points: (0, exports.calculateHitPoints)(baseAttributes), attack: (0, exports.calculateAttack)(baseAttributes), defense: (0, exports.calculateDefense)(baseAttributes), magic_resistance: (0, exports.calculateMagicResistance)(baseAttributes), CFP: (0, exports.calculateCFP)(baseAttributes), BCFA: (0, exports.calculateBCFA)(baseAttributes) });
    const player = {
        _id: data._id,
        name: data.name || '',
        nickname: data.nickname || '',
        avatar: data.avatar || '',
        email: data.email || '',
        level: data.level || 0,
        role: assignRole(data.email) || '',
        socketId: '',
        isBetrayer: data.isBetrayer,
        profile: data.profile
            ? {
                name: data.profile.name || '',
            }
            : null,
        attributes: calculatedAttributes,
        base_attributes: calculatedAttributes || {
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: 0,
            constitution: 0,
            strength: 0,
            resistance: 100,
            attack: 0,
            hit_points: 0,
            defense: 0,
            magic_resistance: 0,
            CFP: 0,
            BCFA: 0,
        },
        equipment: {
            healing_potion: ((_a = data.equipment) === null || _a === void 0 ? void 0 : _a.healing_potion) || {},
            antidote_potion: ((_b = data.equipment) === null || _b === void 0 ? void 0 : _b.antidote_potion) || {},
            enhancer_potion: ((_c = data.equipment) === null || _c === void 0 ? void 0 : _c.enhancer_potion) || {},
            weapon: ((_d = data.equipment) === null || _d === void 0 ? void 0 : _d.weapon) || {}
        },
        inventory: {
            healing_potions: ((_e = data.inventory) === null || _e === void 0 ? void 0 : _e.healing_potions) || [],
            antidote_potions: ((_f = data.inventory) === null || _f === void 0 ? void 0 : _f.antidote_potions) || [],
            enhancer_potions: ((_g = data.inventory) === null || _g === void 0 ? void 0 : _g.enhancer_potions) || [],
        },
        status: {
            ethaziumCurse: false,
            common_diseases: [],
            tired: false
        },
    };
    return player;
};
const assignRole = (email) => {
    switch (email) {
        case process.env.ISTVAN_EMAIL:
            return 'istvan';
        case process.env.VILLAIN_EMAIL:
            return 'villain';
        case process.env.MORTIMER_EMAIL:
            return 'mortimer';
        default:
            return 'acolyte';
    }
};
const initFetchPlayer = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryResponse = yield fetch(`https://kaotika-server.fly.dev/players/email/${email}/`);
        const userData = yield queryResponse.json();
        const role = assignRole(userData.data.email);
        let user = filterPlayerData(userData.data);
        user.role = role;
        console.log('Email: ', email);
        console.log('Role: ', role);
        const existingPlayer = yield Player.findOne({ email: user.email });
        let player;
        if (!existingPlayer) {
            // ADD TO COLLECTION
            player = new Player(user);
            yield player.save();
            console.log('Added new player: ', player);
        }
        else {
            // MERGE TO COLLECTION
            Object.assign(existingPlayer, user);
            yield existingPlayer.save();
            player = existingPlayer;
        }
        return player;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
module.exports = { initFetchPlayer };
