
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SUPPORTED_GAMES } from './constants';
import { CoDGame, Loadout, Message, RuleMode } from './types';
import { generateClassWithAI, chatWithGemini } from './geminiService';
import { translations, Language } from './translations';
import { toPng } from 'html-to-image';

// --- Icons ---
const IconPrimary = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4l-4 4L4 8l1 3 2 1 2 4 4 4 1 2 3-1-1-3 4-4 4-4-4-4z" />
    <path d="M11.5 7L17 12.5" />
    <path d="M7 10l5 5" />
  </svg>
);
const IconSecondary = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7" />
    <path d="M21 7l-9 6-9-6" />
  </svg>
);
const IconLethal = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);
const IconTactical = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);
const IconPerk = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconUpgrade = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconStar = ({ filled }: { filled?: boolean }) => (
  <svg className={`w-5 h-5 transition-colors ${filled ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconCopy = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconDownload = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const IconLegacy = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8 11h8" />
    <path d="M12 7v8" />
  </svg>
);
const IconModern = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
  </svg>
);

// --- Components ---
const GameCard: React.FC<{ game: CoDGame; onSelect: (g: CoDGame) => void; isSelected: boolean }> = ({ game, onSelect, isSelected }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() => onSelect(game)}
      className={`relative overflow-hidden rounded-xl transition-all duration-300 group h-28 ${
        isSelected ? 'ring-4 ring-amber-500 scale-105 shadow-lg shadow-amber-500/20' : 'hover:scale-102 opacity-70 hover:opacity-100'
      }`}
    >
      {!imgError ? (
        <img 
          src={game.image} 
          alt={game.name} 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center border border-white/10">
           <span className="text-[10px] text-slate-500 font-bold px-4 text-center">{game.name}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-3 text-left">
        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">{game.year}</span>
        <h3 className="text-xs font-black leading-tight uppercase tracking-tighter drop-shadow-md">{game.name}</h3>
      </div>
    </button>
  );
};

const LoadoutItem: React.FC<{ icon: React.ReactNode; label: string; value: string; category?: string; subItems?: string[]; color?: string }> = ({ icon, label, value, category, subItems, color = "amber" }) => (
  <div className={`bg-slate-900/40 border-l-2 border-${color}-500/50 p-3 rounded-r-lg group hover:bg-slate-900/60 transition-colors`}>
    <div className="flex items-center gap-2 mb-1">
      <span className={`text-${color}-500 opacity-60 group-hover:opacity-100 transition-opacity`}>{icon}</span>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</h4>
    </div>
    <div className="pl-7">
      <p className="text-lg font-black text-white italic leading-tight uppercase tracking-tight">{value}</p>
      {category && <p className={`text-[10px] font-bold text-${color}-500/80 uppercase tracking-widest mt-0.5`}>{category}</p>}
      {subItems && subItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {subItems.map((item, idx) => (
            <span key={idx} className={`text-[9px] font-bold bg-${color}-500/10 text-${color}-400 px-2 py-0.5 rounded border border-${color}-500/20`}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const LoadoutView: React.FC<{ loadout: Loadout; game: CoDGame; onToggleFavorite: () => void; t: any }> = ({ loadout, game, onToggleFavorite, t }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const isClassicMode = loadout.ruleMode === 'classic';
  const isModernEra = ['mw3_2023', 'bo6', 'bo7'].includes(game.id);

  const handleCopy = () => {
    const text = `Loadout for ${game.name} [${isClassicMode ? t.classicRules : t.modernRules}]: ${loadout.primary?.name} / ${loadout.secondary?.name}. Perks: ${Object.values(loadout.perks).flat().join(', ')}`;
    navigator.clipboard.writeText(text);
    alert(t.copied);
  };

  const handleExportImage = async () => {
    if (exportRef.current === null) return;
    try {
      const dataUrl = await toPng(exportRef.current, { 
        cacheBust: true, 
        backgroundColor: '#0f172a',
        filter: (node) => {
          const exclusionClasses = ['no-export-btn'];
          if (node instanceof HTMLElement) {
            return !exclusionClasses.some(cls => node.classList.contains(cls));
          }
          return true;
        }
      });
      const link = document.createElement('a');
      link.download = `cod-loadout-${game.id}-${loadout.primary?.name?.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    }
  };

  return (
    <div className="relative group">
      <div ref={exportRef} className="card-glass p-1 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-2xl overflow-hidden relative">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start border-b border-white/5 pb-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-8 h-1 ${isClassicMode ? 'bg-amber-600' : 'bg-amber-400'} rounded-full`}></span>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">{t.classConfirmed}</span>
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg">
                {loadout.primary?.name || "REDACTED"}
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                {game.name} <span className="text-slate-600">•</span> {game.year}
              </p>
            </div>
            
            <div className="flex gap-2 no-export-btn">
              <button onClick={handleExportImage} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-amber-500" title={t.exportImage}>
                <IconDownload />
              </button>
              <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500 hover:text-blue-500" title={t.copy}>
                <IconCopy />
              </button>
              <button onClick={onToggleFavorite} className="p-2 hover:bg-white/5 rounded-lg transition-colors" title={t.favorite}>
                <IconStar filled={loadout.isFavorite} />
              </button>
            </div>
          </div>

          {/* Rule Mode Banner */}
          <div className={`text-[9px] font-black uppercase tracking-[0.2em] p-1.5 rounded-md flex items-center gap-2 ${isClassicMode ? 'bg-amber-900/20 text-amber-600 border border-amber-900/30' : 'bg-blue-900/20 text-blue-400 border border-blue-900/30'}`}>
            {isClassicMode ? <IconLegacy /> : <IconModern />}
            {isClassicMode ? t.classicNotice : t.modernNotice}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* Conditional Modern Slot: Vest */}
              {!isClassicMode && loadout.vest && <LoadoutItem icon={<IconUpgrade />} label={t.vest} value={loadout.vest} color="blue" />}
              
              {loadout.primary && <LoadoutItem icon={<IconPrimary />} label={t.primary} value={loadout.primary.name} category={loadout.primary.category} subItems={loadout.primary.attachments} />}
              {loadout.secondary && <LoadoutItem icon={<IconSecondary />} label={t.secondary} value={loadout.secondary.name} category={loadout.secondary.category} subItems={loadout.secondary.attachments} color="slate" />}
              
              {/* Specialty is mostly a modern concept in this UI */}
              {!isClassicMode && loadout.specialty && <LoadoutItem icon={<IconPerk />} label={t.specialty} value={loadout.specialty} color="purple" />}
              
              {(loadout.wildcards && loadout.wildcards.length > 0) && <LoadoutItem icon={<IconUpgrade />} label={t.wildcard} value={loadout.wildcards[0]} color="orange" />}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {loadout.lethal && <LoadoutItem icon={<IconLethal />} label={t.lethal} value={Array.isArray(loadout.lethal) ? loadout.lethal[0] : (loadout.lethal as any)} color="red" />}
                {loadout.tactical && <LoadoutItem icon={<IconTactical />} label={t.tactical} value={Array.isArray(loadout.tactical) ? loadout.tactical[0] : (loadout.tactical as any)} color="cyan" />}
              </div>
              
              {/* Conditional Modern Slot: Field Upgrade */}
              {!isClassicMode && loadout.fieldUpgrade && <LoadoutItem icon={<IconUpgrade />} label={t.fieldUpgrade} value={loadout.fieldUpgrade} color="blue" />}
              
              {/* Conditional Modern Suit Config */}
              {!isClassicMode && (loadout.gloves || loadout.boots || (loadout.gear && loadout.gear.length > 0)) && (
                <div className="bg-slate-900/20 rounded-lg p-3 border border-white/5 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <IconUpgrade /> {t.suitConfig}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {loadout.gloves && <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-2 py-1.5 bg-slate-900/60 rounded"><span>{t.gloves}</span> <span>{loadout.gloves}</span></div>}
                    {loadout.boots && <div className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-2 py-1.5 bg-slate-900/60 rounded"><span>{t.boots}</span> <span>{loadout.boots}</span></div>}
                    {loadout.gear?.map((g, i) => <div key={i} className="flex justify-between items-center text-[11px] font-bold text-slate-300 px-2 py-1.5 bg-slate-900/60 rounded"><span>{t.gear} {i+1}</span> <span>{g}</span></div>)}
                  </div>
                </div>
              )}

              <div className="bg-slate-900/20 rounded-lg p-3 border border-white/5">
                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <IconPerk /> {t.perks}
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3].map(slot => {
                    const perks = (loadout.perks as any)[`slot${slot}`] || [];
                    if (perks.length === 0) return null;
                    return (
                      <div key={slot} className="flex items-center gap-3 bg-slate-950/40 p-2 rounded border border-white/5">
                        <span className={`w-8 h-6 flex items-center justify-center ${isClassicMode ? 'bg-amber-600/10 text-amber-600' : 'bg-amber-400/10 text-amber-400'} text-[10px] font-black rounded border border-amber-500/20`}>
                          {(!isClassicMode && isModernEra) ? `V${slot}` : slot}
                        </span>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-tight italic">{perks.join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {loadout.observations && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 relative overflow-hidden">
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">{t.fieldReport}</h4>
                 <p className="text-xs text-slate-400 italic leading-relaxed font-medium">{loadout.observations}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [ruleMode, setRuleMode] = useState<RuleMode>(() => (localStorage.getItem('ruleMode') as RuleMode) || 'modern');
  const [selectedGame, setSelectedGame] = useState<CoDGame | null>(SUPPORTED_GAMES.find(g => g.id === 'bo6') || null);
  const [loadout, setLoadout] = useState<Loadout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, Loadout>>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : {};
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('ruleMode', ruleMode);
  }, [ruleMode]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Auto-set RuleMode when selecting a game, if it's vastly different
  useEffect(() => {
    if (selectedGame) {
      const gameYear = selectedGame.year;
      // Define era threshold
      if (gameYear <= 2011) {
        setRuleMode('classic');
      } else if (gameYear >= 2019) {
        setRuleMode('modern');
      }
    }
  }, [selectedGame]);

  const filteredGames = useMemo(() => {
    return SUPPORTED_GAMES.filter(g => 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.year.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const handleGenerate = async () => {
    if (!selectedGame) return;
    setLoading(true);
    setLoadout(null); 
    setError(null);
    try {
      const result = await generateClassWithAI(selectedGame, lang, ruleMode);
      setLoadout(result);
    } catch (e: any) {
      console.error(e);
      setError(t.transmissionFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedGame || chatLoading) return;
    const userMsg: Message = { role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    setChatLoading(true);
    try {
      const response = await chatWithGemini([{ role: 'user', content: currentInput }], selectedGame.name, lang);
      const modelMsg: Message = { role: 'model', text: response || '...', timestamp: new Date() };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!loadout || !selectedGame) return;
    const key = `${selectedGame.id}-${loadout.primary?.name}`;
    const isNowFavorite = !loadout.isFavorite;
    const newLoadout = { ...loadout, isFavorite: isNowFavorite };
    setLoadout(newLoadout);
    
    setFavorites(prev => {
      const next = { ...prev };
      if (isNowFavorite) {
        next[key] = newLoadout;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen cod-gradient pb-20 selection:bg-amber-500 selection:text-black">
      <header className="border-b border-white/10 py-5 px-6 mb-8 bg-black/60 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-2.5 rounded shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">{t.appTitle}</h1>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">{t.appVersion}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Rules Toggle */}
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5" title={t.rulesToggleDesc}>
               <button 
                  onClick={() => setRuleMode('classic')}
                  className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${ruleMode === 'classic' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 <IconLegacy /> {t.classicRules}
               </button>
               <button 
                  onClick={() => setRuleMode('modern')}
                  className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-black rounded-lg transition-all ${ruleMode === 'modern' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 <IconModern /> {t.modernRules}
               </button>
            </div>

            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
              <button onClick={() => setLang('en')} className={`px-3 py-1 text-[10px] font-black rounded ${lang === 'en' ? 'bg-amber-500 text-black' : 'text-slate-500'}`}>EN</button>
              <button onClick={() => setLang('pt')} className={`px-3 py-1 text-[10px] font-black rounded ${lang === 'pt' ? 'bg-amber-500 text-black' : 'text-slate-500'}`}>PT-BR</button>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading || !selectedGame}
              className={`group relative ${ruleMode === 'classic' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} disabled:bg-slate-800 disabled:text-slate-500 text-white px-8 py-3 rounded font-black transition-all flex items-center gap-3 active:scale-95 uppercase italic tracking-tighter`}
            >
              {loading ? <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <IconPrimary />}
              {loading ? t.generating : t.requestLoadout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-3 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className={`w-6 h-1 ${ruleMode === 'classic' ? 'bg-amber-600' : 'bg-blue-600'}`}></span>
                {t.militaryArchive}
              </h2>
              <span className="text-[9px] font-black text-slate-700 uppercase">{t.totalGames}: {SUPPORTED_GAMES.length}</span>
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-amber-500/30 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onSelect={(g) => { setSelectedGame(g); setLoadout(null); setError(null); }} 
                  isSelected={selectedGame?.id === game.id} 
                />
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-6 space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl text-center"><p className="text-sm font-black text-red-500 uppercase">{error}</p></div>}
          
          {loadout ? (
            <LoadoutView loadout={loadout} game={selectedGame!} onToggleFavorite={toggleFavorite} t={t} />
          ) : !loading && (
            <div className="card-glass p-16 rounded-3xl text-center space-y-10 group relative overflow-hidden border-dashed border-2 border-white/5 opacity-40">
              <div className="relative inline-block">
                {selectedGame && (
                  <img src={selectedGame.image} className="w-48 h-48 rounded-3xl object-cover relative z-10 border-4 border-white/5 grayscale group-hover:grayscale-0 transition-all duration-700" />
                )}
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{selectedGame ? selectedGame.name : t.waitingSelection}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] max-w-xs mx-auto">{t.selectGamePrompt}</p>
              </div>
            </div>
          )}

          {loading && (
             <div className="card-glass p-24 rounded-3xl text-center space-y-8 animate-pulse">
               <div className="flex justify-center gap-2 items-end h-16">
                 {[0.1, 0.2, 0.3, 0.4].map(d => <div key={d} className={`w-2 ${ruleMode === 'classic' ? 'bg-amber-600' : 'bg-blue-600'} h-10 rounded-full`} style={{ animation: `bounce 1s infinite ${d}s` }}></div>)}
               </div>
               <div className="space-y-2">
                <p className={`text-sm font-black uppercase tracking-[0.5em] ${ruleMode === 'classic' ? 'text-amber-600' : 'text-blue-500'}`}>{t.syncing}</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest italic">{t.decrypting}</p>
               </div>
             </div>
          )}
        </section>

        <section className="lg:col-span-3">
          <div className="card-glass flex flex-col h-[650px] rounded-3xl overflow-hidden shadow-2xl border-white/5 sticky top-28 bg-black/40">
            <div className="bg-slate-900/80 p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${ruleMode === 'classic' ? 'bg-amber-600 shadow-[0_0_12px_#d97706]' : 'bg-blue-500 shadow-[0_0_12px_#3b82f6]'} animate-pulse`}></div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">{t.tacticalIntelligence}</h3>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-slate-950/20">
              {chatMessages.length === 0 ? (
                <div className="text-center py-20 opacity-20 px-8 flex flex-col items-center gap-4">
                  <IconPerk />
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] leading-relaxed">{t.chatOpen}</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[90%] p-3.5 rounded-2xl text-[11px] font-bold italic leading-relaxed ${msg.role === 'user' ? (ruleMode === 'classic' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white') : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-slate-600 font-bold uppercase mt-1 px-1">{msg.role === 'user' ? t.soldier : t.strategist}</span>
                  </div>
                ))
              )}
              {chatLoading && <div className={`text-[9px] ${ruleMode === 'classic' ? 'text-amber-600' : 'text-blue-500'} font-black uppercase tracking-widest p-2 animate-pulse`}>{t.receivingData}</div>}
            </div>

            <form onSubmit={handleSendMessage} className="p-5 bg-black/60 border-t border-white/5">
              <div className="relative group">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!selectedGame || chatLoading}
                  placeholder={t.askStrategist}
                  className="w-full bg-slate-900/60 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-[11px] font-bold outline-none placeholder:text-slate-700 focus:border-amber-500/50 transition-all focus:bg-slate-900"
                />
                <button type="submit" disabled={!chatInput.trim() || chatLoading} className={`absolute right-3 top-1/2 -translate-y-1/2 ${ruleMode === 'classic' ? 'text-amber-600' : 'text-blue-500'} disabled:opacity-20 hover:scale-125 transition-all`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
