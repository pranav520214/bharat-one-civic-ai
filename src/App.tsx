import React from 'react';
import { useSaarthiStore } from './store';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { ServicesTab } from './components/ServicesTab';
import { AICopilotTab } from './components/AICopilotTab';
import { TrackTab } from './components/TrackTab';
import { ProfileTab } from './components/ProfileTab';
import { Sparkles, Bot, AlertTriangle } from 'lucide-react';

export default function App() {
  const { activeTab, stateTheme, activeState } = useSaarthiStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'services':
        return <ServicesTab />;
      case 'chat':
        return <AICopilotTab />;
      case 'track':
        return <TrackTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center py-0 sm:py-6 font-sans">
      {/* Maximum width container on desktop, fits completely like a real smartphone device layout */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[900px] sm:rounded-[40px] bg-gray-50 flex flex-col relative shadow-2xl overflow-hidden border-0 sm:border-4 sm:border-black sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Real App Header Top Notch */}
        <div className={`shrink-0 h-10 bg-[#202124] text-white px-5 flex items-center justify-between text-xs select-none font-black uppercase tracking-wider border-b-2 border-black`}>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-[#FBBC05] text-black px-2 py-0.5 rounded font-black tracking-wider uppercase border border-black">Bharat One</span>
            <span className="text-[9px] text-gray-300">Saarthi AI</span>
          </div>
          
          <div className="flex items-center gap-2 text-[9px]">
            <span>12:42 PM</span>
            <span className="text-[9px] bg-[#34A853] text-white border border-black px-1.5 py-0.5 rounded uppercase font-black tracking-wide">Live</span>
          </div>
        </div>

        {/* Dynamic State Banner Flag Decoration */}
        <div className="h-1.5 shrink-0 bg-gradient-to-r from-orange-500 via-white to-green-500" />

        {/* Active view component scroll section */}
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          {renderActiveView()}
        </div>

        {/* Global Bottom Tab Navigation */}
        <BottomNav />

      </div>
    </div>
  );
}
