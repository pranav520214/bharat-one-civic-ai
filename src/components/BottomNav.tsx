import React from 'react';
import { useSaarthiStore } from '../store';
import { Home, Layers, Bot, ClipboardCheck, User } from 'lucide-react';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, stateTheme } = useSaarthiStore();

  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'services' as const, label: 'Services', icon: Layers },
    { id: 'chat' as const, label: 'Saarthi AI', icon: Bot, isCenter: true },
    { id: 'track' as const, label: 'Track', icon: ClipboardCheck },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-black pb-safe-bottom">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-4 flex flex-col items-center justify-center select-none"
                id={`nav-btn-${tab.id}`}
              >
                {/* Neon Neo-Brutalist Outer Floating Circle */}
                <motion.div
                  className={`w-13 h-13 rounded-full bg-[#4285F4] flex items-center justify-center text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-[9px] font-black uppercase tracking-tight text-black mt-1">
                  {tab.label}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-dot-center"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-black"
                  />
                )}
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full text-black hover:text-black transition-colors"
              id={`nav-btn-${tab.id}`}
            >
              <div className="relative py-1.5 px-3 flex items-center justify-center select-none">
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-[#FEEFC3] border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? 'text-black scale-110' : 'text-gray-500'}`} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-black' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
