import React, { useState } from 'react';
import { useSaarthiStore, STATE_THEMES } from '../store';
import { CivicState } from '../types';
import { CulturalIllustration } from './CulturalIllustration';
import { 
  CloudSun, 
  Wind, 
  MapPin, 
  AlertTriangle, 
  ChevronRight, 
  ThumbsUp, 
  Compass, 
  Phone, 
  TrendingUp, 
  Search, 
  Sparkles,
  Award,
  PlusCircle,
  Building,
  Activity,
  CheckCircle,
  ShieldAlert,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HomeTab: React.FC = () => {
  const { 
    activeState, 
    setActiveState, 
    stateTheme, 
    complaints, 
    schemes, 
    upvoteComplaint, 
    applyForScheme, 
    setActiveTab,
    user,
    quickLogin
  } = useSaarthiStore();

  const [sosActive, setSosActive] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<any>('Roads & Potholes');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Filter complaints & schemes specific to state for personalized feel
  const stateComplaints = complaints.filter(c => c.state === activeState).slice(0, 3);
  const stateSchemes = schemes.slice(0, 3); // showing core high level schemes

  const handleSOSClick = () => {
    setSosActive(true);
    // Auto-disable SOS after 8 seconds
    setTimeout(() => setSosActive(false), 8000);
  };

  const handleStateChange = (state: CivicState) => {
    setActiveState(state);
    setShowStateDropdown(false);
  };

  const getAqiColor = (status: string) => {
    switch (status) {
      case 'Good': return 'bg-emerald-500 text-white';
      case 'Moderate': return 'bg-amber-500 text-white';
      default: return 'bg-red-500 text-white';
    }
  };

  // Nearby government offices static mock coordinates, distance computed from current selected state center
  const nearbyOffices = [
    { name: 'District Collectorate & DM Office', type: 'Administrative', dist: '1.2 km', phone: '011-24567890', desc: 'Central grievance cell and licensing center' },
    { name: 'Saarthi e-Seva Kendra (Single Window)', type: 'Public Services', dist: '0.8 km', phone: '1800-456-1122', desc: 'Aadhaar registrations, scheme approvals, utility logs' },
    { name: 'Government Multi-Specialty Hospital', type: 'Medical', dist: '2.3 km', phone: '102', desc: '24/7 Casualty & Ayushman Bharat support helpdesk' },
    { name: 'Central Post Office & Aadhaar Cell', type: 'Postal & Finance', dist: '1.5 km', phone: '011-23305566', desc: 'Postal savings, stamp duty verification' }
  ];

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6">
      
      {/* 1. STATE SELECTOR & USER STATUS BAR */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative">
          <button 
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-black bg-[#FEEFC3] hover:bg-[#fde7a6] transition-all text-left shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            id="state-dropdown-btn"
          >
            <MapPin className="w-4 h-4 text-red-600" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-black font-extrabold">Active Civic State</div>
              <div className="flex items-center gap-1">
                <span className="font-black text-black text-xs">{activeState}</span>
                <span className="text-[10px] text-gray-700 font-bold">({stateTheme.hindiName})</span>
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showStateDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-52 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 p-1.5 space-y-1"
              >
                {(Object.keys(STATE_THEMES) as CivicState[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStateChange(st)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-black flex items-center justify-between transition-colors ${activeState === st ? 'bg-black text-white' : 'text-black hover:bg-[#E8F0FE]'}`}
                  >
                    <span>{st}</span>
                    <span className="text-[9px] font-bold opacity-80">({STATE_THEMES[st].hindiName})</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          {user ? (
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border-2 border-black hover:bg-gray-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="w-8 h-8 rounded-full bg-black border border-black flex items-center justify-center text-white text-xs font-black">
                {user.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[8px] font-extrabold text-gray-500 uppercase leading-none">Citizen</div>
                <div className="text-xs font-black text-black leading-tight">{user.fullName.split(' ')[0]}</div>
              </div>
            </div>
          ) : (
            <button 
              onClick={quickLogin}
              className="px-3.5 py-2 bg-[#4285F4] text-white rounded-xl border-2 border-black text-xs font-black uppercase tracking-tight hover:bg-[#3273e2] transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
              id="home-quick-login-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Login</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC CULTURAL HERO CARD */}
      <div className={`relative rounded-3xl overflow-hidden border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-gradient-to-br ${stateTheme.gradientFrom} ${stateTheme.gradientTo} text-white p-5`}>
        {/* Cultural vector illustration overlay */}
        <div className="absolute inset-0 opacity-20">
          <CulturalIllustration state={activeState} />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <span className="text-[10px] uppercase font-black tracking-widest text-white bg-black/40 px-2 py-0.5 rounded border border-white/20">Bharat One Portal</span>
              <h1 className="text-3xl font-black uppercase tracking-tighter mt-1.5 leading-none">Saarthi AI</h1>
              <p className="text-xs text-white/90 font-bold mt-1">One AI. Every Government Service.</p>
            </div>
            
            {/* Dynamic Weather & State Capital Badge */}
            <div className="text-right bg-white text-black border-2 border-black p-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[9px] font-black uppercase tracking-wider text-gray-500 leading-none">{stateTheme.localCapital}</div>
              <div className="flex items-center justify-end gap-1 font-black text-sm mt-1">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span>{stateTheme.weatherTemp}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Realtime AQI widget */}
            <div className="bg-[#E8F0FE] text-black border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 text-left">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${getAqiColor(stateTheme.aqiStatus)}`}>
                {stateTheme.aqi}
              </div>
              <div>
                <div className="text-[8px] font-black text-gray-500 uppercase leading-none">Local AQI</div>
                <div className="text-xs font-black flex items-center gap-0.5 mt-0.5">
                  <Wind className="w-3.5 h-3.5 text-[#34A853]" />
                  <span>{stateTheme.aqiStatus}</span>
                </div>
              </div>
            </div>

            {/* Trending Local Scheme */}
            <div 
              onClick={() => setActiveTab('services')}
              className="bg-[#FEEFC3] text-black border-2 border-black p-3 rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#fde7a6] transition-all cursor-pointer flex flex-col justify-center text-left"
            >
              <div className="text-[8px] font-black text-gray-500 uppercase flex items-center gap-1 leading-none">
                <TrendingUp className="w-3 h-3 text-[#34A853]" />
                <span>Trending Scheme</span>
              </div>
              <div className="text-xs font-black tracking-tight truncate mt-1 text-black underline">
                {stateTheme.trendingScheme}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC SOS EMERGENCY BUTTON */}
      <div className="bg-[#FAD2CF] border-2 border-black rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 text-red-950 font-black text-sm uppercase tracking-tight">
          <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse" />
          <span>CIVIC EMERGENCY SOS HUB</span>
        </div>
        <p className="text-xs text-red-900 font-extrabold leading-tight">Pressing SOS broadcasts your verified location to the {activeState} Emergency Response Patrol.</p>
        
        <div className="relative">
          <motion.button
            onClick={handleSOSClick}
            className={`w-28 h-28 rounded-full border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center font-black tracking-widest text-sm text-white select-none cursor-pointer transition-all ${sosActive ? 'bg-red-800 scale-95 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-[#EA4335] hover:bg-red-600'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="emergency-sos-btn"
          >
            {sosActive ? (
              <span className="text-xs animate-ping font-black">SIREN ON</span>
            ) : (
              <>
                <AlertTriangle className="w-7 h-7 mb-1" />
                <span>SOS</span>
              </>
            )}
          </motion.button>
          
          {sosActive && (
            <div className="absolute -inset-4 bg-red-500/20 rounded-full animate-ping pointer-events-none -z-10" />
          )}
        </div>

        <AnimatePresence>
          {sosActive && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full bg-white rounded-xl border-2 border-black p-3 text-left text-xs text-red-950 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="font-black flex items-center justify-between text-[11px] uppercase tracking-wide">
                <span>🚨 DISPATCHED PATROL</span>
                <span className="text-[9px] bg-[#FAD2CF] border border-black px-2 py-0.5 rounded font-black uppercase">Broadcasting Live</span>
              </div>
              <p className="font-bold text-[10px] text-gray-700">Broadcasting emergency coordinates: **lat: {stateTheme.localCapital === 'New Delhi' ? '28.6139' : '31.6340'}, lng: 77.2090**.</p>
              <div className="flex items-center justify-between border-t border-black/10 pt-2 font-black text-gray-900">
                <span className="flex items-center gap-1 text-xs">
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>State Control: {stateTheme.emergencyContact}</span>
                </span>
                <a href={`tel:${stateTheme.emergencyContact}`} className="text-red-600 underline font-black">Call Now</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. QUICK SERVICE WORKFLOW CARDS */}
      <div className="space-y-3">
        <h3 className="font-black text-black text-sm uppercase tracking-tight flex items-center gap-1.5 px-1">
          <Compass className="w-4 h-4 text-black" />
          <span>Quick Civic Actions</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => setActiveTab('chat')}
            className="bg-[#D2E3FC] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-left space-y-2.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-black uppercase tracking-tight">Ask Saarthi AI</h4>
              <p className="text-[10px] text-gray-800 font-bold mt-0.5 leading-tight">Verify eligibility, check templates</p>
            </div>
          </div>

          <div 
            onClick={() => { setActiveTab('services') }}
            className="bg-[#FEEFC3] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-left space-y-2.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-black uppercase tracking-tight">Govt Schemes</h4>
              <p className="text-[10px] text-gray-800 font-bold mt-0.5 leading-tight">Browse welfare programs & apply</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('track')}
            className="bg-[#FAD2CF] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-left space-y-2.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-black uppercase tracking-tight">Report Issue</h4>
              <p className="text-[10px] text-gray-800 font-bold mt-0.5 leading-tight">Log potholes & municipal complaints</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('profile')}
            className="bg-[#CEEAD6] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer text-left space-y-2.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="w-9 h-9 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs text-black uppercase tracking-tight">e-Locker Wallet</h4>
              <p className="text-[10px] text-gray-800 font-bold mt-0.5 leading-tight">Encrypt Aadhaar, PAN & licenses</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRENDING CIVIC ISSUES FEED */}
      <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
        <div className="flex justify-between items-center px-0.5">
          <h3 className="font-black text-black text-sm uppercase tracking-tight flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#EA4335]" />
            <span>Active Grievances ({activeState})</span>
          </h3>
          <button 
            onClick={() => setActiveTab('track')}
            className="text-xs font-black text-[#4285F4] hover:underline flex items-center uppercase"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {stateComplaints.length > 0 ? (
            stateComplaints.map(comp => (
              <div key={comp.id} className="bg-gray-50 border-2 border-black/10 rounded-xl p-3.5 space-y-2 transition-all hover:bg-gray-100/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-xs text-black truncate max-w-[210px]">{comp.title}</h4>
                    <span className="text-[8px] bg-[#E8F0FE] text-black border border-black px-2 py-0.5 rounded font-black uppercase mt-1.5 inline-block">
                      {comp.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[9px] font-black border border-black px-2 py-0.5 rounded ${comp.status === 'Resolved' ? 'bg-[#CEEAD6]' : comp.status === 'In Progress' ? 'bg-[#FEEFC3]' : 'bg-[#D2E3FC]'}`}>
                      {comp.status}
                    </span>
                    <div className="text-[9px] text-gray-500 mt-1 font-bold">{comp.timeline[0]?.date}</div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 font-medium leading-relaxed line-clamp-2">{comp.description}</p>

                <div className="flex justify-between items-center pt-2.5 border-t border-black/5">
                  <span className="text-[9px] text-gray-500 font-extrabold flex items-center gap-0.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>{comp.locationName}</span>
                  </span>
                  
                  <button
                    onClick={() => upvoteComplaint(comp.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[9px] font-black border-2 border-black transition-all ${comp.hasUpvoted ? 'bg-black text-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comp.upvotes} Upvotes</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 text-xs font-black">
              No recent complaints logged in {activeState}. Be the first to report!
            </div>
          )}
        </div>
      </div>

      {/* 6. LOCAL CIVIC HUBS LOCATOR */}
      <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3 text-left">
        <h3 className="font-black text-black text-sm uppercase tracking-tight flex items-center gap-1.5">
          <Building className="w-4 h-4 text-[#34A853]" />
          <span>Local Civic Centers</span>
        </h3>
        <p className="text-[11px] text-gray-500 font-bold leading-tight">Verified contact counters in {activeState} Capital HQ for direct support.</p>
        
        <div className="space-y-2.5">
          {nearbyOffices.map((office, idx) => (
            <div key={idx} className="border-2 border-black/10 hover:border-black/30 bg-gray-50/50 p-3 rounded-xl flex items-start gap-3 transition-all">
              <div className="w-7 h-7 rounded-lg bg-white border border-black flex items-center justify-center text-black shrink-0 mt-0.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <Building className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xs text-black">{office.name}</h4>
                  <span className="text-[9px] text-gray-500 font-black">{office.dist}</span>
                </div>
                <p className="text-[10px] text-gray-600 font-medium leading-normal">{office.desc}</p>
                <div className="flex items-center gap-1 text-[9px] text-[#34A853] font-black pt-1">
                  <Phone className="w-3 h-3" />
                  <a href={`tel:${office.phone}`} className="hover:underline">{office.phone}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. MUNICIPAL BUDGET & SATISFACTION SUMMARY */}
      <div className="bg-[#202124] text-white p-5 rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-left space-y-3">
        <h3 className="font-black text-xs uppercase tracking-wider text-[#FBBC05] flex items-center gap-1.5">
          <Activity className="w-4 h-4" />
          <span>{activeState} Municipal Report Card</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Area Covered</div>
            <div className="text-sm font-black text-white mt-0.5">1,484 sq. km</div>
          </div>
          <div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Population</div>
            <div className="text-sm font-black text-white mt-0.5">~1.9 Crore</div>
          </div>
          <div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Annual Budget</div>
            <div className="text-sm font-black text-[#FBBC05] mt-0.5">₹12,450 Cr</div>
          </div>
          <div>
            <div className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Satisfaction Rate</div>
            <div className="text-sm font-black text-[#34A853] mt-0.5">82.4% (★★★★)</div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3 flex justify-between items-center text-[10px] font-bold text-gray-400">
          <span className="flex items-center gap-1 text-[#34A853] font-black">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>94% complaints resolved in 7 days</span>
          </span>
          <span className="underline cursor-pointer font-black text-[#4285F4]" onClick={() => setActiveTab('track')}>Report Issue</span>
        </div>
      </div>

    </div>
  );
};
