
export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export type SlotType = 'Weapon' | 'Armor' | 'Accessory' | 'Relic';

export interface Equipment {
  id: string;
  name: string;
  slot: SlotType;
  rarity: Rarity;
  forceBonus: number;
}

export interface CharacterClass {
  id: number;
  name: string;
  minForce: number;
  maxForce: number;
  probability: number;
}

export interface Hero {
  name: string;
  class: CharacterClass;
  baseForce: number;
  exp: number;
  level: number;
  gold: number;
  lives: number;
  isMiserable?: boolean; // Pour le pacte du désespoir
  equipment: {
    [K in SlotType]: Equipment | null;
  };
}

export interface Enemy {
  id: number;
  name: string;
  force: number;
  spawnRate: number;
  exp: number;
  goldRange: [number, number];
  lootChance: number;
  statBonus: number;
}

export interface Boss {
  id: number;
  name: string;
  force: number;
  keyName: string;
  unlocksBossId: number | null;
}

export interface GameState {
  hero: Hero | null;
  unlockedKeys: string[];
  maxBossDefeated: number;
  isDead: boolean;
  gameWon: boolean;
  logs: string[];
  collection: {
    [K in SlotType]: Rarity[];
  };
}
