
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

/**
 * Calculates experience required for the next level.
 * Significantly reduced for faster progression.
 */
export const getRequiredExp = (level: number): number => {
  return 10 + (level * 10);
};

export const generateLoot = (enemyForce: number): Equipment | null => {
  const baseSeed = Math.random();
  const forceBonus = Math.min(0.15, enemyForce / 500);
  const roll = baseSeed - forceBonus;

  let rarity: Rarity = Rarity.COMMON;

  if (roll < 0.015) rarity = Rarity.LEGENDARY;
  else if (roll < 0.06) rarity = Rarity.EPIC;
  else if (roll < 0.18) rarity = Rarity.RARE;
  else if (roll < 0.45) rarity = Rarity.UNCOMMON;
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

/**
 * Generates high-tier equipment (Rare+) for the Divine Arsenal summon.
 */
export const generateHighTierLoot = (): Equipment => {
  const roll = Math.random();
  let rarity: Rarity = Rarity.RARE;

  if (roll < 0.10) rarity = Rarity.LEGENDARY;
  else if (roll < 0.40) rarity = Rarity.EPIC;
  else rarity = Rarity.RARE;

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
  let currentHero = { ...hero };
  let needed = getRequiredExp(currentHero.level);
  let leveledUp = false;
  
  while (currentHero.exp >= needed) {
    currentHero.exp -= needed;
    currentHero.level += 1;
    currentHero.baseForce += 15;
    leveledUp = true;
    needed = getRequiredExp(currentHero.level);
  }

  if (leveledUp) {
    currentHero.lives = 2;
  }
  
  return currentHero;
};

export const getRarityFromProb = (prob: number) => {
  const p = prob * 100;
  if (p < 1.5) return { label: 'Legendary', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' };
  if (p < 3) return { label: 'Epic', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' };
  if (p < 6) return { label: 'Rare', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
  if (p < 10) return { label: 'Uncommon', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' };
  return { label: 'Common', color: 'text-zinc-400', bg: 'bg-zinc-400/10', border: 'border-zinc-400/20' };
};
