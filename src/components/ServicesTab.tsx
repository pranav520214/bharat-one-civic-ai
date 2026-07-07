import React, { useState } from 'react';
import { useSaarthiStore } from '../store';
import { GovScheme, CivicJob } from '../types';
import { 
  Search, 
  HelpCircle, 
  Calculator, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ServicesTab: React.FC = () => {
  const { schemes, jobs, applyForScheme, applyForJob, activeState, user } = useSaarthiStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedScheme, setExpandedScheme] = useState<string | null>(null);
  
  // Eligibility Calculator Input States
  const [calcAge, setCalcAge] = useState('28');
  const [calcGender, setCalcGender] = useState<'All' | 'Female' | 'Male'>('All');
  const [calcIncome, setCalcIncome] = useState('180000');
  const [calcProfession, setCalcProfession] = useState('Farmer');
  const [eligibleResults, setEligibleResults] = useState<{ schemeId: string; eligible: boolean; reasons: string[] }[] | null>(null);
  
  const professionsList = ['Farmer', 'Laborer', 'Artisan', 'Business Owner', 'Merchant', 'Unemployed', 'Nurse', 'Student', 'Professional'];

  // Saarthi Live Scheme Search states
  const [liveQuery, setLiveQuery] = useState('');
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [liveResults, setLiveResults] = useState<GovScheme[]>([]);
  const [liveSource, setLiveSource] = useState<string | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [expandedLiveScheme, setExpandedLiveScheme] = useState<string | null>(null);

  const handleLiveSchemeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveQuery.trim()) return;
    setIsSearchingLive(true);
    setLiveError(null);
    setLiveSource(null);

    try {
      const response = await fetch('/api/search-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: liveQuery, state: activeState }),
      });
      if (!response.ok) throw new Error('Live search request failed');
      const data = await response.json();
      setLiveResults(data.schemes || []);
      setLiveSource(data.source || 'Grounded AI');
    } catch (err: any) {
      setLiveError(err.message || 'An error occurred fetching schemes');
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleApplyLiveScheme = (scheme: GovScheme) => {
    const exists = schemes.some(s => s.id === scheme.id);
    if (!exists) {
      useSaarthiStore.setState({
        schemes: [...schemes, { ...scheme, status: 'Available' }]
      });
    }
    applyForScheme(scheme.id);
  };

  // Schemes Filter
  const filteredSchemes = schemes.filter(sch => 
    sch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sch.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sch.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute Eligibility Logic
  const handleCalculateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    const age = parseInt(calcAge) || 25;
    const income = parseInt(calcIncome) || 200000;
    
    const results = schemes.map(sch => {
      const reasons: string[] = [];
      let eligible = true;

      // Gender Match
      if (sch.eligibility.gender && sch.eligibility.gender !== 'All' && calcGender !== 'All' && sch.eligibility.gender !== calcGender) {
        eligible = false;
        reasons.push(`Scheme targeted exclusively for ${sch.eligibility.gender} beneficiaries`);
      }

      // Income limit match
      if (sch.eligibility.incomeLimit && income > sch.eligibility.incomeLimit) {
        eligible = false;
        reasons.push(`Annual income exceeds limit of ₹${sch.eligibility.incomeLimit.toLocaleString()}`);
      }

      // Age Limits match
      if (sch.eligibility.minAge && age < sch.eligibility.minAge) {
        eligible = false;
        reasons.push(`Minimum age required is ${sch.eligibility.minAge} years`);
      }
      if (sch.eligibility.maxAge && age > sch.eligibility.maxAge) {
        eligible = false;
        reasons.push(`Maximum eligible age is ${sch.eligibility.maxAge} years`);
      }

      // Profession match
      if (sch.eligibility.professions && !sch.eligibility.professions.includes(calcProfession)) {
        eligible = false;
        reasons.push(`Profession '${calcProfession}' is not listed in target categories (${sch.eligibility.professions.join(', ')})`);
      }

      if (eligible) {
        reasons.push('Matches all basic central government parameters!');
      }

      return {
        schemeId: sch.id,
        eligible,
        reasons
      };
    });

    setEligibleResults(results);
  };

  const getMatchDetails = (schemeId: string) => {
    if (!eligibleResults) return null;
    return eligibleResults.find(r => r.schemeId === schemeId);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6 text-left">
      
      {/* Tab Title */}
      <div>
        <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
          <Layers className="w-5.5 h-5.5 text-black" />
          <span>Civic Schemes & Portals</span>
        </h2>
        <p className="text-xs text-gray-500 font-bold">Verify your eligibility and submit welfare applications directly to state agencies.</p>
      </div>

      {/* 1. DYNAMIC ELIGIBILITY ENGINE */}
      <div className="bg-white text-black p-5 rounded-3xl space-y-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#D2E3FC] border border-black text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-xs text-black">Smart Eligibility Advisor</h3>
            <p className="text-[10px] text-gray-500 font-bold">Calculate matched subsidies in 10 seconds.</p>
          </div>
        </div>

        <form onSubmit={handleCalculateEligibility} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Citizen Age</label>
              <input 
                type="number" 
                value={calcAge} 
                onChange={(e) => setCalcAge(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            
            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Gender Group</label>
              <select 
                value={calcGender} 
                onChange={(e: any) => setCalcGender(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="All">All Genders</option>
                <option value="Female">Female Only</option>
                <option value="Male">Male Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Household Income</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-black text-black">₹</span>
                <input 
                  type="number" 
                  value={calcIncome} 
                  onChange={(e) => setCalcIncome(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl pl-5 pr-2 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
            
            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Occupation</label>
              <select 
                value={calcProfession} 
                onChange={(e) => setCalcProfession(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
              >
                {professionsList.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 bg-[#4285F4] text-white rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5"
            id="calculate-eligibility-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Check My Active Matches</span>
          </button>
        </form>

        {/* Results Toast */}
        {eligibleResults && (
          <div className="bg-[#CEEAD6] rounded-2xl p-4 border-2 border-black space-y-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-black text-black flex items-center justify-between uppercase">
              <span>CALCULATED OUTCOME:</span>
              <button onClick={() => setEligibleResults(null)} className="text-[10px] underline hover:text-black font-black uppercase">Clear</button>
            </div>
            <div className="text-[11px] font-bold text-gray-900 leading-relaxed">
              Based on your Profile, we identified **{eligibleResults.filter(r => r.eligible).length} out of {schemes.length} welfare schemes** matching your credentials perfectly! 
              Check individual listings below.
            </div>
          </div>
        )}
      </div>

      {/* 1.5 SAARTHI LIVE AI SCHEME SEARCH (GROUNDED WITH GOOGLE SEARCH) */}
      <div className="bg-[#E8F0FE] text-black p-5 rounded-3xl space-y-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-[#4285F4] border border-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tight text-xs text-black flex items-center gap-1.5">
              <span>Saarthi Live AI Scheme Finder</span>
              <span className="bg-red-500 text-white text-[7px] px-1.5 py-0.2 rounded uppercase font-black tracking-wide">Live Grounded</span>
            </h3>
            <p className="text-[10px] text-gray-500 font-bold">Query real-time central & state databases via Google Search Grounding.</p>
          </div>
        </div>

        <form onSubmit={handleLiveSchemeSearch} className="space-y-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g., agriculture subsidy for women in Bihar..."
              value={liveQuery}
              onChange={(e) => setLiveQuery(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl pl-3 pr-10 py-2 text-xs font-black text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearchingLive || !liveQuery.trim()}
              className="absolute right-2.5 top-2 text-black hover:text-blue-600 font-black disabled:opacity-40"
              id="live-search-submit-btn"
            >
              {isSearchingLive ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[9px] text-gray-400 font-extrabold text-center">Powered by Gemini 3.5 & Google Search Grounding for up-to-date 2026 eligibility.</p>
        </form>

        {liveError && (
          <div className="bg-[#FAD2CF] rounded-xl p-3 border-2 border-black text-xs font-bold text-red-950">
            {liveError}
          </div>
        )}

        {liveResults.length > 0 && (
          <div className="space-y-3 pt-1 text-left">
            <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-500">
              <span>Search Source: <span className="text-blue-600 font-black">{liveSource}</span></span>
              <span>{liveResults.length} Found</span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {liveResults.map((sch) => {
                const isExpanded = expandedLiveScheme === sch.id;
                const storeScheme = schemes.find(s => s.id === sch.id);
                const isApplied = storeScheme?.status === 'Applied';

                return (
                  <div key={sch.id} className="bg-white border-2 border-black rounded-xl p-3.5 space-y-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div 
                      onClick={() => setExpandedLiveScheme(isExpanded ? null : sch.id)}
                      className="cursor-pointer flex justify-between items-start gap-2 select-none"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-black uppercase bg-[#D2E3FC] border border-black px-2 py-0.5 rounded inline-block">
                          {sch.department}
                        </span>
                        <h4 className="font-black text-xs text-black leading-tight">{sch.name}</h4>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-3 text-[10px] border-t border-black/5 pt-2.5 font-bold text-gray-800">
                        <p className="text-gray-600 leading-relaxed text-[11px]">{sch.description}</p>
                        
                        <div className="space-y-1.5">
                          <div className="font-black text-[9px] uppercase text-gray-500">Key Subsidies & Benefits:</div>
                          <ul className="space-y-1 pl-1">
                            {sch.benefits?.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-1 font-bold text-gray-700 text-[10.5px]">
                                <span className="text-blue-600 font-black">•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#FFF2E0] p-3 rounded-lg border border-orange-200 text-[10px] space-y-1">
                          <div className="font-black uppercase text-orange-800 text-[8.5px]">Basic Criteria:</div>
                          <div>• Max Income: <span className="font-black">{sch.eligibility?.incomeLimit ? `₹${sch.eligibility.incomeLimit.toLocaleString()}` : 'No Limit'}</span></div>
                          <div>• Professions: <span className="font-black">{sch.eligibility?.professions?.join(', ') || 'All citizens'}</span></div>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
                          <span className="text-[9px] text-gray-500 font-extrabold uppercase">Requires Aadhaar & Income</span>
                          {isApplied ? (
                            <span className="text-[10px] bg-[#CEEAD6] text-black border border-black font-black px-2.5 py-1 rounded-lg">Applied ✔</span>
                          ) : (
                            <button
                              onClick={() => handleApplyLiveScheme(sch)}
                              className="px-3.5 py-1.5 bg-[#FBBC05] text-black rounded-lg border-2 border-black text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                            >
                              Apply via Saarthi e-Seva
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. SCHEMES CATALOG */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-black" />
            <span>Welfare & Subsidies Catalog</span>
          </h3>
          <span className="text-[10px] bg-black text-white border border-black font-black px-2.5 py-0.5 rounded">
            {filteredSchemes.length} Schemes
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-black" />
          <input 
            type="text" 
            placeholder="Search schemes by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-xl pl-9.5 pr-4 py-2.5 text-xs font-black text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
          />
        </div>

        {/* Schemes list */}
        <div className="space-y-4">
          {filteredSchemes.map((sch) => {
            const isExpanded = expandedScheme === sch.id;
            const match = getMatchDetails(sch.id);
            const isApplied = sch.status === 'Applied';

            return (
              <div 
                key={sch.id} 
                className={`bg-white border-2 border-black rounded-2xl transition-all overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              >
                {/* Header card clickable */}
                <div 
                  onClick={() => setExpandedScheme(isExpanded ? null : sch.id)}
                  className="p-4 cursor-pointer flex justify-between items-start gap-3 select-none"
                >
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-black tracking-wider text-black uppercase bg-[#D2E3FC] border border-black px-2 py-0.5 rounded inline-block">
                      {sch.department}
                    </span>
                    <h4 className="font-black text-xs sm:text-sm text-black leading-tight">{sch.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold line-clamp-1">{sch.description}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {isApplied ? (
                      <span className="text-[9px] bg-[#CEEAD6] text-black border border-black font-black px-2 py-0.5 rounded flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Applied</span>
                      </span>
                    ) : match ? (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded border flex items-center gap-0.5 ${match.eligible ? 'bg-[#CEEAD6] text-black border-black' : 'bg-[#FAD2CF] text-black border-black'}`}>
                        {match.eligible ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{match.eligible ? 'Eligible' : 'Not Match'}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] bg-gray-100 text-gray-600 border border-black/10 font-black px-2 py-0.5 rounded">
                        Evaluate
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-black" /> : <ChevronDown className="w-4 h-4 text-black" />}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-black bg-gray-50/50 p-4 space-y-4 text-xs text-black font-bold"
                    >
                      <div className="space-y-1">
                        <div className="font-black text-[9px] uppercase text-gray-500">Scheme Core Description:</div>
                        <p className="text-gray-800 font-bold leading-relaxed text-[11px]">{sch.description}</p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-black text-[9px] uppercase text-gray-500">Key Subsidies & Benefits:</div>
                        <ul className="space-y-1 pl-1">
                          {sch.benefits.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-1.5 font-bold text-gray-800 text-[11px]">
                              <span className="text-indigo-600 font-black">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Eligibility parameters list */}
                      <div className="bg-[#FEEFC3] p-3.5 rounded-xl border-2 border-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="font-black text-[9px] uppercase text-black">Standard Criteria Checklist:</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-900">
                          <div>• Max Income: <span className="text-black font-black">{sch.eligibility.incomeLimit ? `₹${sch.eligibility.incomeLimit.toLocaleString()}` : 'No Limit'}</span></div>
                          <div>• Gender Target: <span className="text-black font-black">{sch.eligibility.gender || 'All Genders'}</span></div>
                          {sch.eligibility.professions && (
                            <div className="col-span-2">• Occupations: <span className="text-black font-black">{sch.eligibility.professions.join(', ')}</span></div>
                          )}
                        </div>
                        
                        {/* Advisor reason */}
                        {match && (
                          <div className={`mt-2.5 p-2 rounded-lg text-[10px] font-bold border border-black/20 flex items-start gap-1.5 ${match.eligible ? 'bg-[#CEEAD6]' : 'bg-[#FAD2CF]'}`}>
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{match.reasons.join('. ')}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="font-black text-[9px] uppercase text-gray-500">Mandatory Verification Files:</div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {sch.documentsRequired.map((docName, dIdx) => {
                            // Check if user has uploaded this doc in locker
                            const hasDoc = user?.savedDocuments.some(ud => ud.type === docName || (docName === 'Aadhaar Card' && ud.type === 'Aadhaar') || (docName === 'PAN Card' && ud.type === 'PAN'));
                            return (
                              <span 
                                key={dIdx} 
                                className={`text-[10px] font-black border border-black px-2 py-1 rounded-lg flex items-center gap-1 ${hasDoc ? 'bg-[#CEEAD6]' : 'bg-[#FAD2CF]'}`}
                              >
                                {hasDoc ? <CheckCircle2 className="w-3 h-3 text-black" /> : <HelpCircle className="w-3 h-3 text-black" />}
                                <span>{docName}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2">
                        {isApplied ? (
                          <div className="bg-[#CEEAD6] text-black border-2 border-black p-3 rounded-xl flex justify-between items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div>
                              <div className="text-[9px] font-black uppercase text-gray-700">Application Reference Logged</div>
                              <div className="text-xs font-black">{sch.applicationId}</div>
                            </div>
                            <span className="text-[9px] font-black bg-white px-2 py-0.5 border border-black rounded">On {sch.appliedDate}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => applyForScheme(sch.id)}
                            className="w-full py-2 bg-[#FBBC05] text-black rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1"
                            id={`apply-scheme-btn-${sch.id}`}
                          >
                            <span>Initiate Form Fill & Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CIVIC JOBS DESK */}
      <div className="bg-white p-5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4.5 h-4.5 text-black" />
            <span>Civic Recruitment ({activeState})</span>
          </h3>
          <span className="text-[10px] font-black text-black bg-[#CEEAD6] border border-black px-2 py-0.5 rounded">
            Active Vacancies
          </span>
        </div>
        <p className="text-[11px] text-gray-500 font-bold leading-tight">Direct municipal and smart-city contractual employment opportunities for verified local citizens.</p>

        <div className="space-y-3 pt-1">
          {jobs.map((job) => (
            <div key={job.id} className="border-2 border-black/10 hover:border-black/30 bg-gray-50/50 p-3.5 rounded-xl space-y-2.5 transition-all text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-xs text-black">{job.title}</h4>
                  <span className="text-[9px] text-gray-500 font-bold block">{job.department}</span>
                </div>
                <span className="text-xs font-black text-emerald-700">{job.salary}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-700">
                <div>• Experience: <span className="text-black font-black">{job.experience}</span></div>
                <div>• Terms: <span className="text-black font-black">{job.type}</span></div>
                <div className="col-span-2">• Site Location: <span className="text-black font-black">{job.location}</span></div>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
                <span className="text-[9px] text-red-600 font-black">Apply before: {job.deadline}</span>
                {job.applied ? (
                  <span className="text-[10px] bg-[#CEEAD6] text-black border-2 border-black font-black px-3 py-1 rounded-xl">Applied ✔</span>
                ) : (
                  <button
                    onClick={() => applyForJob(job.id)}
                    className="px-4 py-1.5 bg-[#4285F4] text-white border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors"
                    id={`apply-job-btn-${job.id}`}
                  >
                    Direct Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
