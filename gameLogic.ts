
import { Hero, Enemy, Boss, Rarity, Equipment, SlotType } from './types';
import { RARITY_BONUS, SLOT_NAMES } from './constants';

export const calculateTotalForce = (hero: Hero): number => {
  let totalBonus = 0;
  SLOT_NAMES.forEach(slot => {
    const item = hero.equipment[slot];
    if (item) totalBonus += item.forceBonus;
  });
  return hero.baseForce + totalBonus;
};

export const getWinProbability = (heroForce: number, enemyForce: number): number => {
  return Math.min(0.99, Math.max(0.01, heroForce / (heroForce + enemyForce)));
};

export const generateLoot = (enemyForce: number): Equipment | null => {
  // Chance of rarity improves with enemy force
  const baseSeed = Math.random();
  let rarity: Rarity = Rarity.COMMON;

  if (baseSeed < 0.01) rarity = Rarity.LEGENDARY;
  else if (baseSeed < 0.05) rarity = Rarity.EPIC;
  else if (baseSeed < 0.15) rarity = Rarity.RARE;
  else if (baseSeed < 0.40) rarity = Rarity.UNCOMMON;
  else rarity = Rarity.COMMON;

  const slot = SLOT_NAMES[Math.floor(Math.random() * SLOT_NAMES.length)];
  const bonus = RARITY_BONUS[rarity];

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${rarity} ${slot}`,
    slot: slot,
    rarity: rarity,
    forceBonus: bonus
  };
};

export const handleLevelUp = (hero: Hero): Hero => {
  const expNeeded = hero.level * 100;
  if (hero.exp >= expNeeded) {
    return {
      ...hero,
      level: hero.level + 1,
      exp: hero.exp - expNeeded,
      baseForce: hero.baseForce + 2
    };
  }
  return hero;
};
