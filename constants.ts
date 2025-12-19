
import { Enemy, Boss, CharacterClass, Rarity, SlotType } from './types';

export const ENEMY_DATA: Enemy[] = [
  { id: 1, name: "Wild Rat", force: 5, spawnRate: 0.1, exp: 5, goldRange: [1, 2], lootChance: 0.05, statBonus: 1 },
  { id: 2, name: "Bat", force: 7, spawnRate: 0.09, exp: 6, goldRange: [1, 3], lootChance: 0.06, statBonus: 1 },
  { id: 3, name: "Goblin Scout", force: 10, spawnRate: 0.08, exp: 8, goldRange: [2, 4], lootChance: 0.08, statBonus: 2 },
  { id: 4, name: "Green Slime", force: 12, spawnRate: 0.07, exp: 10, goldRange: [3, 5], lootChance: 0.1, statBonus: 2 },
  { id: 5, name: "Novice Bandit", force: 14, spawnRate: 0.06, exp: 12, goldRange: [4, 6], lootChance: 0.12, statBonus: 2 },
  { id: 6, name: "Hungry Wolf", force: 16, spawnRate: 0.06, exp: 14, goldRange: [5, 7], lootChance: 0.14, statBonus: 2 },
  { id: 7, name: "Fragile Skeleton", force: 18, spawnRate: 0.06, exp: 16, goldRange: [6, 8], lootChance: 0.15, statBonus: 3 },
  { id: 8, name: "Giant Spider", force: 20, spawnRate: 0.05, exp: 18, goldRange: [7, 10], lootChance: 0.18, statBonus: 3 },
  { id: 9, name: "Cultist", force: 22, spawnRate: 0.05, exp: 20, goldRange: [8, 11], lootChance: 0.20, statBonus: 3 },
  { id: 10, name: "Wandering Zombie", force: 25, spawnRate: 0.05, exp: 23, goldRange: [9, 13], lootChance: 0.22, statBonus: 4 },
  { id: 11, name: "Cracked Golem", force: 28, spawnRate: 0.04, exp: 26, goldRange: [11, 15], lootChance: 0.25, statBonus: 4 },
  { id: 12, name: "Fallen Knight", force: 30, spawnRate: 0.04, exp: 30, goldRange: [13, 18], lootChance: 0.28, statBonus: 5 },
  { id: 13, name: "Crawling Shadow", force: 33, spawnRate: 0.04, exp: 34, goldRange: [15, 20], lootChance: 0.30, statBonus: 5 },
  { id: 14, name: "Minor Elemental", force: 36, spawnRate: 0.03, exp: 38, goldRange: [18, 24], lootChance: 0.35, statBonus: 6 },
  { id: 15, name: "Masked Assassin", force: 40, spawnRate: 0.03, exp: 42, goldRange: [20, 27], lootChance: 0.38, statBonus: 6 },
  { id: 16, name: "Lesser Demon", force: 45, spawnRate: 0.02, exp: 48, goldRange: [25, 35], lootChance: 0.42, statBonus: 7 },
  { id: 17, name: "Specter", force: 50, spawnRate: 0.02, exp: 55, goldRange: [30, 40], lootChance: 0.45, statBonus: 7 },
  { id: 18, name: "Ancient Guardian", force: 55, spawnRate: 0.015, exp: 65, goldRange: [35, 50], lootChance: 0.50, statBonus: 8 },
  { id: 19, name: "Corrupted Monster", force: 60, spawnRate: 0.015, exp: 75, goldRange: [40, 60], lootChance: 0.55, statBonus: 8 },
  { id: 20, name: "Cursed Champion", force: 70, spawnRate: 0.01, exp: 90, goldRange: [50, 80], lootChance: 0.60, statBonus: 10 }
];

export const BOSS_DATA: Boss[] = [
  { id: 1, name: "Ruins Guardian", force: 40, keyName: "Stone Key", unlocksBossId: 2 },
  { id: 2, name: "Goblin Lord", force: 55, keyName: "Rusty Key", unlocksBossId: 3 },
  { id: 3, name: "Beast of the Depths", force: 70, keyName: "Bone Key", unlocksBossId: 4 },
  { id: 4, name: "Black Knight", force: 90, keyName: "Dark Key", unlocksBossId: 5 },
  { id: 5, name: "Corrupted Priestess", force: 115, keyName: "Sacred Key", unlocksBossId: 6 },
  { id: 6, name: "Iron Titan", force: 145, keyName: "Iron Key", unlocksBossId: 7 },
  { id: 7, name: "Ancient Dragon", force: 180, keyName: "Draconic Key", unlocksBossId: 8 },
  { id: 8, name: "Supreme Lich", force: 220, keyName: "Necromantic Key", unlocksBossId: 9 },
  { id: 9, name: "Primordial Demon", force: 270, keyName: "Infernal Key", unlocksBossId: 10 },
  { id: 10, name: "Void Entity", force: 330, keyName: "Void Key", unlocksBossId: null }
];

export const CLASS_DATA: CharacterClass[] = [
  { id: 1, name: "Adventurer", minForce: 140, maxForce: 330, probability: 0.18 },
  { id: 2, name: "Swordsman", minForce: 145, maxForce: 335, probability: 0.14 },
  { id: 3, name: "Archer", minForce: 148, maxForce: 338, probability: 0.12 },
  { id: 4, name: "Heavy Warrior", minForce: 150, maxForce: 340, probability: 0.10 },
  { id: 5, name: "Thief", minForce: 152, maxForce: 342, probability: 0.09 },
  { id: 6, name: "Paladin", minForce: 155, maxForce: 345, probability: 0.08 },
  { id: 7, name: "Berserker", minForce: 158, maxForce: 348, probability: 0.07 },
  { id: 8, name: "Battle Mage", minForce: 160, maxForce: 350, probability: 0.06 },
  { id: 9, name: "Holy Knight", minForce: 165, maxForce: 355, probability: 0.05 },
  { id: 10, name: "Shadow Assassin", minForce: 170, maxForce: 360, probability: 0.04 },
  { id: 11, name: "Blade Master", minForce: 175, maxForce: 365, probability: 0.03 },
  { id: 12, name: "Ancient Champion", minForce: 180, maxForce: 370, probability: 0.02 },
  { id: 13, name: "Cursed Herald", minForce: 185, maxForce: 375, probability: 0.015 },
  { id: 14, name: "Warlord", minForce: 190, maxForce: 380, probability: 0.008 },
  { id: 15, name: "Dungeon Chosen", minForce: 200, maxForce: 390, probability: 0.007 }
];

export const RARITY_BONUS = {
  [Rarity.COMMON]: 1,
  [Rarity.UNCOMMON]: 2,
  [Rarity.RARE]: 3,
  [Rarity.EPIC]: 5,
  [Rarity.LEGENDARY]: 8
};

export const SLOT_NAMES: SlotType[] = ['Weapon', 'Armor', 'Accessory', 'Relic'];
