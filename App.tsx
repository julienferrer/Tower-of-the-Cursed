
import React, { useState, useEffect } from 'react';
import { Hero, GameState, Enemy, Boss, CharacterClass, Equipment, SlotType, Rarity } from './types';
import { CLASS_DATA, ENEMY_DATA, BOSS_DATA, SLOT_NAMES } from './constants';
import { calculateTotalForce, getWinProbability, generateLoot, handleLevelUp, generateHighTierLoot } from './gameLogic';

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

  // Full reset for a completely new start (Restart Journey)
  const resetEntireGame = () => {
    setGameState({
      hero: null,
      unlockedKeys: [],
      maxBossDefeated: 0,
      isDead: false,
      gameWon: false,
      logs: ["A new legacy begins. The tower has reset its cycle."],
      collection: {
        Weapon: [],
        Armor: [],
        Accessory: [],
        Relic: []
      }
    });
    setCurrentView('summon');
  };

  // Restart after death while keeping keys (Progression)
  const restartJourney = () => {
    setGameState(prev => ({
      ...prev,
      hero: null,
      isDead: false,
      logs: ["The vessel is lost, but the keys remain in your spirit. Summon a new host."]
    }));
    setCurrentView('summon');
  };

  const summonHero = (type: 'standard' | 'legendary' = 'standard') => {
    const cost = type === 'legendary' ? 100 : (gameState.hero ? 10 : 0);
    
    if (gameState.hero && gameState.hero.gold < cost && !gameState.isDead) {
      addLog(`Not enough gold to perform a ${type} summon.`);
      return;
    }

    let selectedClass: CharacterClass;
    
    if (type === 'legendary') {
      const legendaries = CLASS_DATA.slice(-5);
      selectedClass = legendaries[Math.floor(Math.random() * legendaries.length)];
    } else {
      let r = Math.random();
      let acc = 0;
      selectedClass = CLASS_DATA[0];
      for (const c of CLASS_DATA) {
        acc += c.probability;
        if (r <= acc) {
          selectedClass = c;
          break;
        }
      }
    }

    // Start at level 1
    const startLevel = 1;
    const baseForceAtLevelOne = selectedClass.minForce;
    // Every level after level 1 grants +15 base force
    const levelBonus = (startLevel - 1) * 15;

    const newHero: Hero = {
      name: `Dungeon Seeker`,
      class: selectedClass,
      baseForce: baseForceAtLevelOne + levelBonus,
      exp: 0,
      level: startLevel,
      gold: gameState.hero ? Math.max(0, gameState.hero.gold - cost) : 0,
      lives: 2,
      equipment: { Weapon: null, Armor: null, Accessory: null, Relic: null }
    };

    setGameState(prev => ({ ...prev, hero: newHero, isDead: false }));
    setCurrentView('dungeon');
    addLog(`${type === 'legendary' ? 'LEGENDARY ' : ''}Summoned: ${selectedClass.name}. Level: ${newHero.level}. Base Force: ${newHero.baseForce}`);
  };

  const summonArsenal = () => {
    if (!gameState.hero || gameState.hero.gold < 50) {
      addLog("Not enough gold for the Divine Arsenal.");
      return;
    }

    const loot = generateHighTierLoot();
    updateCollection(loot.slot, loot.rarity);
    
    setGameState(prev => {
      if (!prev.hero) return prev;
      const newHero = { ...prev.hero, gold: prev.hero.gold - 50 };
      const currentItem = newHero.equipment[loot.slot];
      if (!currentItem || loot.forceBonus > currentItem.forceBonus) {
        newHero.equipment[loot.slot] = loot;
        addLog(`Divine Arsenal: Equipped ${loot.name} (+${loot.forceBonus} Force)!`);
      } else {
        addLog(`Divine Arsenal: Found ${loot.name}, but current gear is stronger.`);
      }
      return { ...prev, hero: newHero };
    });
  };

  const startCombat = (enemy: Enemy | Boss) => {
    setActiveEnemy(enemy);
    setCombatResult(null);
    setCurrentView('combat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          if (isFinal) {
             setTimeout(() => setCurrentView('win'), 1000);
          }
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
        <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.5)] rotate-12">
           <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 20 20">
             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
           </svg>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter uppercase">Tower Conquered</h1>
        <p className="text-zinc-400 text-lg mb-12 max-w-md">The Void Entity lies shattered. The curse is broken. You are finally free.</p>
        <button onClick={resetEntireGame} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/20">
          RESTART JOURNEY
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col pb-24 lg:pb-0">
      <Header 
        hero={gameState.hero} 
        unlockedKeys={gameState.unlockedKeys} 
        onOpenCodex={() => setCurrentView('codex')} 
      />
      
      {/* Mobile Sticky HUD - Only in Dungeon view */}
      {gameState.hero && currentView === 'dungeon' && (
        <div className="lg:hidden sticky top-[64px] z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
           <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase">Force</span>
              <span className="text-emerald-400 font-bold">{calculateTotalForce(gameState.hero)}</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase">Gold</span>
              <span className="text-yellow-500 font-bold">{gameState.hero.gold}🪙</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="text-zinc-500 uppercase">Floor</span>
              <span className="text-white font-bold">{gameState.unlockedKeys.length + 1}</span>
           </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hero Info Column - Hidden on Mobile during Combat */}
        <div className={`lg:col-span-4 flex-col gap-4 md:gap-6 order-1 lg:order-none ${currentView === 'combat' ? 'hidden lg:flex' : 'flex'}`}>
          <HeroCard 
            hero={gameState.hero} 
            onSummon={summonHero} 
            onSummonArsenal={summonArsenal}
            isDead={gameState.isDead} 
          />
          <div className="hidden lg:block">
            <LogPanel logs={gameState.logs} />
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6 order-2 lg:order-none">
          {currentView === 'summon' && !gameState.hero && (
            <div className="h-full min-h-[400px] bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase tracking-tighter">Choose Your Vessel</h2>
              <div className="flex flex-col gap-4 w-full max-w-md">
                <button onClick={() => summonHero('standard')} className="w-full bg-emerald-600 hover:bg-emerald-500 px-8 py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95">
                  Begin The Ascent
                </button>
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Your first life is a gift from the tower</p>
              </div>
              <button onClick={() => setCurrentView('codex')} className="mt-8 text-zinc-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">Consult the Codex</button>
            </div>
          )}

          {currentView === 'dungeon' && gameState.hero && (
            <div className="flex flex-col gap-4 md:gap-6 h-full">
              <div className="bg-zinc-900/80 rounded-3xl p-5 md:p-6 border border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-[10px] md:text-sm font-bold text-zinc-400 uppercase tracking-widest">Adventure</h3>
                  <p className="text-lg md:text-2xl font-black">Ascend the Spire</p>
                </div>
                <button onClick={findEnemy} className="bg-zinc-100 text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all active:scale-95 shadow-lg">Find Enemy</button>
              </div>
              <TowerMap unlockedKeys={gameState.unlockedKeys} maxBossDefeated={gameState.maxBossDefeated} onChallenge={startCombat} />
              <div className="lg:hidden mb-12">
                <LogPanel logs={gameState.logs} />
              </div>
            </div>
          )}

          {currentView === 'combat' && activeEnemy && (
            <CombatPanel hero={gameState.hero!} enemy={activeEnemy} result={combatResult} onFight={resolveCombat} onClose={() => { setCurrentView('dungeon'); window.scrollTo({top: 0, behavior: 'smooth'}); }} />
          )}

          {currentView === 'sanctuary' && (
            <SanctuaryPanel hero={gameState.hero!} onReward={handleSanctuaryReward} onLeave={() => setCurrentView('dungeon')} />
          )}

          {currentView === 'codex' && (
            <CodexView collection={gameState.collection} onClose={() => setCurrentView(gameState.hero ? 'dungeon' : 'summon')} />
          )}

          {currentView === 'dead' && (
            <div className="bg-red-950/10 border border-red-900/30 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center animate-in zoom-in duration-300">
              {gameState.hero && gameState.hero.gold < 10 ? (
                <>
                  <h2 className="text-5xl font-black text-red-600 mb-4 tracking-tighter uppercase leading-none">Vessel Shattered</h2>
                  <p className="text-zinc-400 mb-8 max-w-sm font-mono uppercase tracking-widest text-[10px]">
                    Your resources are depleted. The tower claims another soul.
                  </p>
                  <button onClick={resetEntireGame} className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95">
                    RESTART JOURNEY
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-red-500 mb-4 uppercase tracking-tighter">Hero Fallen</h2>
                  <p className="text-zinc-400 mb-8 max-w-sm">Items lost. Level reset. Only the keys and gold persist.</p>
                  <div className="flex flex-col w-full max-w-xs gap-3">
                    <button onClick={() => summonHero('standard')} className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-900/20 hover:bg-red-500 transition-all active:scale-95">
                      Summon New Hero (10🪙)
                    </button>
                    {gameState.hero && gameState.hero.gold >= 100 && (
                      <button onClick={() => summonHero('legendary')} className="w-full bg-zinc-900 border border-yellow-600/50 text-yellow-500 py-4 rounded-xl font-bold shadow-xl transition-all hover:bg-yellow-600/10 active:scale-95">
                        Legendary Vessel (100🪙)
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar - Only in Dungeon View */}
      {gameState.hero && currentView === 'dungeon' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none">
           <button onClick={findEnemy} className="pointer-events-auto w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-[0_0_40px_rgba(16,185,129,0.5)] active:scale-95 transition-all">
             FIND ENEMY
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
