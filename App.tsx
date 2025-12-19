
import React, { useState, useEffect } from 'react';
import { Hero, GameState, Enemy, Boss, CharacterClass, Equipment, SlotType, Rarity } from './types';
import { CLASS_DATA, ENEMY_DATA, BOSS_DATA, SLOT_NAMES } from './constants';
import { calculateTotalForce, getWinProbability, generateLoot, handleLevelUp } from './gameLogic';

// UI Components
import Header from './components/Header';
import HeroCard from './components/HeroCard';
import TowerMap from './components/TowerMap';
import CombatPanel from './components/CombatPanel';
import LogPanel from './components/LogPanel';
import CodexView from './components/CodexView';
import SanctuaryPanel from './components/SanctuaryPanel';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      hero: null,
      unlockedKeys: [],
      maxBossDefeated: 0,
      isDead: false,
      gameWon: false,
      logs: ["Welcome to the Tower of the Cursed. Ascend or perish."],
      collection: {
        Weapon: [],
        Armor: [],
        Accessory: [],
        Relic: []
      }
    };
  });

  const [currentView, setCurrentView] = useState<'summon' | 'dungeon' | 'combat' | 'dead' | 'win' | 'codex' | 'sanctuary'>('summon');
  const [activeEnemy, setActiveEnemy] = useState<Enemy | Boss | null>(null);
  const [combatResult, setCombatResult] = useState<{ success: boolean; loot?: Equipment | null; gold?: number; exp?: number; message: string } | null>(null);

  const addLog = (msg: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [msg, ...prev.logs.slice(0, 49)]
    }));
  };

  const updateCollection = (slot: SlotType, rarity: Rarity) => {
    setGameState(prev => {
      if (prev.collection[slot].includes(rarity)) return prev;
      return {
        ...prev,
        collection: {
          ...prev.collection,
          [slot]: [...prev.collection[slot], rarity]
        }
      };
    });
  };

  const restartJourney = () => {
    setGameState(prev => ({
      ...prev,
      hero: null,
      isDead: false,
      logs: ["A new journey begins. The tower remains, but your pockets are empty."]
    }));
    setCurrentView('summon');
  };

  const summonHero = () => {
    const cost = (gameState.hero ? 10 : 0);
    
    if (gameState.hero && gameState.hero.gold < cost && !gameState.isDead) {
      addLog("Not enough gold to summon a new hero.");
      return;
    }

    let r = Math.random();
    let selectedClass = CLASS_DATA[0];
    let acc = 0;
    for (const c of CLASS_DATA) {
      acc += c.probability;
      if (r <= acc) {
        selectedClass = c;
        break;
      }
    }

    const newHero: Hero = {
      name: `Dungeon Seeker`,
      class: selectedClass,
      baseForce: selectedClass.minForce,
      exp: 0,
      level: 1,
      gold: gameState.hero ? Math.max(0, gameState.hero.gold - cost) : 0,
      lives: 2,
      equipment: { Weapon: null, Armor: null, Accessory: null, Relic: null }
    };

    setGameState(prev => ({ ...prev, hero: newHero, isDead: false }));
    setCurrentView('dungeon');
    addLog(`Summoned: ${selectedClass.name}. Base Force: ${newHero.baseForce}`);
  };

  const startCombat = (enemy: Enemy | Boss) => {
    setActiveEnemy(enemy);
    setCombatResult(null);
    setCurrentView('combat');
  };

  const resolveCombat = async () => {
    if (!gameState.hero || !activeEnemy) return;

    const heroForce = calculateTotalForce(gameState.hero);
    const winProb = getWinProbability(heroForce, activeEnemy.force);
    const success = Math.random() < winProb;

    let loot: Equipment | null = null;
    let gold = 0;
    let exp = 0;
    let message = "";

    const isBoss = 'keyName' in activeEnemy;

    if (success) {
      if (isBoss) {
        const boss = activeEnemy as Boss;
        gold = 50 + boss.id * 20;
        message = `You defeated ${boss.name}! Obtained: ${boss.keyName}.`;
        
        setGameState(prev => {
          const keys = prev.unlockedKeys.includes(boss.keyName) ? prev.unlockedKeys : [...prev.unlockedKeys, boss.keyName];
          const newMax = Math.max(prev.maxBossDefeated, boss.id);
          const isFinal = boss.id === 10;
          if (isFinal) setTimeout(() => setCurrentView('win'), 1000);
          return {
            ...prev,
            unlockedKeys: keys,
            maxBossDefeated: newMax,
            hero: prev.hero ? { ...prev.hero, gold: prev.hero.gold + gold } : null,
            gameWon: isFinal
          };
        });
      } else {
        const enemy = activeEnemy as Enemy;
        exp = enemy.exp;
        gold = Math.floor(Math.random() * (enemy.goldRange[1] - enemy.goldRange[0] + 1)) + enemy.goldRange[0];
        message = `Victory against ${enemy.name}!`;

        if (Math.random() < enemy.lootChance) {
          loot = generateLoot(enemy.force);
          if (loot) updateCollection(loot.slot, loot.rarity);
        }

        setGameState(prev => {
          if (!prev.hero) return prev;
          let oldLevel = prev.hero.level;
          let newHero = { ...prev.hero };
          newHero.exp += exp;
          newHero.gold += gold;
          newHero.baseForce += enemy.statBonus;
          if (loot) {
            const currentItem = newHero.equipment[loot.slot];
            if (!currentItem || loot.forceBonus > currentItem.forceBonus) {
              newHero.equipment[loot.slot] = loot;
            }
          }
          newHero = handleLevelUp(newHero);
          
          if (newHero.level > oldLevel) {
            setTimeout(() => addLog(`Level Up! Level ${newHero.level} reached. Vitals restored!`), 500);
          }
          
          return { ...prev, hero: newHero };
        });

        if (Math.random() < 0.20) {
          setTimeout(() => setCurrentView('sanctuary'), 1500);
        }
      }
    } else {
      if (isBoss) {
        message = `The ${activeEnemy.name} crushed you. Instant death.`;
        setGameState(prev => ({ ...prev, isDead: true }));
        setTimeout(() => setCurrentView('dead'), 1500);
      } else {
        message = `Defeat against ${activeEnemy.name}. Lost 1 life.`;
        setGameState(prev => {
          if (!prev.hero) return prev;
          const lives = prev.hero.lives - 1;
          if (lives <= 0) {
            setTimeout(() => setCurrentView('dead'), 1500);
            return { ...prev, isDead: true, hero: { ...prev.hero, lives: 0 } };
          }
          return { ...prev, hero: { ...prev.hero, lives: lives } };
        });
      }
    }

    setCombatResult({ success, loot, gold, exp, message });
    addLog(message);
  };

  const findEnemy = () => {
    let r = Math.random();
    let acc = 0;
    let found = ENEMY_DATA[0];
    for (const e of ENEMY_DATA) {
      acc += e.spawnRate;
      if (r <= acc) {
        found = e;
        break;
      }
    }
    startCombat(found);
  };

  const handleSanctuaryReward = (type: 'force' | 'life') => {
    setGameState(prev => {
      if (!prev.hero) return prev;
      if (type === 'force') {
        addLog("The sanctuary granted you ancient power (+5 Force).");
        return { ...prev, hero: { ...prev.hero, baseForce: prev.hero.baseForce + 5 } };
      } else {
        addLog("The sanctuary restored your spirit (+1 Life).");
        return { ...prev, hero: { ...prev.hero, lives: Math.min(2, prev.hero.lives + 1), gold: prev.hero.gold - 20 } };
      }
    });
    setCurrentView('dungeon');
  };

  if (currentView === 'win') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
        <h1 className="text-6xl font-black text-emerald-500 mb-4 tracking-tighter">VICTORY</h1>
        <p className="text-xl mb-8 max-w-md">The Void Entity is no more. You are free.</p>
        <button onClick={() => window.location.reload()} className="bg-emerald-600 px-10 py-4 rounded-full font-bold">RESTART</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Header 
        hero={gameState.hero} 
        unlockedKeys={gameState.unlockedKeys} 
        onOpenCodex={() => setCurrentView('codex')} 
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 lg:pb-8">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <HeroCard hero={gameState.hero} onSummon={() => summonHero()} isDead={gameState.isDead} />
          <LogPanel logs={gameState.logs} />
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {currentView === 'summon' && !gameState.hero && (
            <div className="h-full bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-3xl font-bold mb-8">Choose your fate</h2>
              <button onClick={() => summonHero()} className="bg-emerald-600 px-8 py-3 rounded-xl font-bold shadow-xl mb-4">Summon (Free)</button>
              <button onClick={() => setCurrentView('codex')} className="text-zinc-500 hover:text-white transition-colors">Consult the Codex</button>
            </div>
          )}

          {currentView === 'dungeon' && gameState.hero && (
            <div className="flex flex-col gap-6 h-full">
              <div className="bg-zinc-900/80 rounded-3xl p-6 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-400">Current Objective</h3>
                  <p className="text-2xl font-black">Explore or Challenge</p>
                </div>
                <button onClick={findEnemy} className="bg-zinc-100 text-black px-6 py-3 rounded-xl font-bold">Find Enemy</button>
              </div>
              <TowerMap unlockedKeys={gameState.unlockedKeys} maxBossDefeated={gameState.maxBossDefeated} onChallenge={startCombat} />
            </div>
          )}

          {currentView === 'combat' && activeEnemy && (
            <CombatPanel hero={gameState.hero!} enemy={activeEnemy} result={combatResult} onFight={resolveCombat} onClose={() => setCurrentView('dungeon')} />
          )}

          {currentView === 'sanctuary' && (
            <SanctuaryPanel hero={gameState.hero!} onReward={handleSanctuaryReward} onLeave={() => setCurrentView('dungeon')} />
          )}

          {currentView === 'codex' && (
            <CodexView collection={gameState.collection} onClose={() => setCurrentView(gameState.hero ? 'dungeon' : 'summon')} />
          )}

          {currentView === 'dead' && (
            <div className="bg-red-950/20 border border-red-900/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center animate-in zoom-in duration-300">
              {gameState.hero && gameState.hero.gold < 10 ? (
                <>
                  <h2 className="text-5xl font-black text-red-600 mb-4">TOTAL DEFEAT</h2>
                  <p className="text-zinc-400 mb-8 max-w-sm font-mono uppercase tracking-widest text-xs">
                    You have run out of gold to summon a new protector. The tower has consumed your legacy.
                  </p>
                  <button onClick={restartJourney} className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                    RESTART JOURNEY
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-red-500 mb-4 uppercase">Character Lost</h2>
                  <p className="text-zinc-400 mb-8 max-w-sm">Your items have vanished, but your keys are eternal.</p>
                  <button onClick={summonHero} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-500 transition-colors">
                    New Summon (10🪙)
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
