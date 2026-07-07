import React from 'react';
import { CivicState } from '../types';

interface IllustrationProps {
  state: CivicState;
  className?: string;
}

export const CulturalIllustration: React.FC<IllustrationProps> = ({ state, className = "" }) => {
  switch (state) {
    case 'Delhi':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle Grid Pattern Background */}
          <defs>
            <pattern id="delhi-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#delhi-grid)" />
          
          {/* Modern Metro Skyline */}
          <path d="M0,170 Q100,165 200,170 T400,170 L400,200 L0,200 Z" fill="rgba(255, 255, 255, 0.1)" />
          <rect x="20" y="100" width="30" height="70" rx="2" fill="rgba(255, 255, 255, 0.05)" />
          <rect x="60" y="80" width="45" height="90" rx="3" fill="rgba(255, 255, 255, 0.08)" />
          <rect x="310" y="110" width="40" height="60" rx="2" fill="rgba(255, 255, 255, 0.06)" />
          <rect x="360" y="70" width="30" height="100" rx="2" fill="rgba(255, 255, 255, 0.04)" />
          
          {/* Delhi Metro Track & Train */}
          <line x1="0" y1="160" x2="400" y2="160" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="4" />
          <line x1="0" y1="163" x2="400" y2="163" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
          {/* Metro Train */}
          <g>
            <rect x="220" y="148" width="80" height="11" rx="3" fill="#E2E8F0" />
            <rect x="222" y="150" width="18" height="5" rx="1" fill="#1E293B" />
            <rect x="243" y="150" width="18" height="5" rx="1" fill="#1E293B" />
            <rect x="264" y="150" width="18" height="5" rx="1" fill="#1E293B" />
            <rect x="285" y="150" width="12" height="5" rx="1" fill="#1E293B" />
            {/* Blue line stripe on metro */}
            <rect x="220" y="156" width="80" height="2" fill="#2563EB" />
          </g>
          
          {/* India Gate Silhouette */}
          <g transform="translate(135, 45)" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {/* Outer Pillars */}
            <path d="M20,115 L20,30 L28,30 L28,115 Z" fill="rgba(255, 255, 255, 0.15)" />
            <path d="M100,115 L100,30 L92,30 L92,115 Z" fill="rgba(255, 255, 255, 0.15)" />
            
            {/* Central Arch base */}
            <path d="M40,115 L40,65 Q60,50 80,65 L80,115" />
            <path d="M34,115 L34,50 Q60,35 86,50 L86,115" />
            
            {/* Multi-tiered Top */}
            <path d="M12,30 L108,30" />
            <path d="M15,22 L105,22" />
            <rect x="25" y="10" width="70" height="12" fill="rgba(255, 255, 255, 0.2)" />
            <path d="M35,10 Q60,0 85,10 Z" fill="rgba(255, 255, 255, 0.3)" />
            
            {/* Ashok Chakra Emblem symbol */}
            <circle cx="60" cy="20" r="5" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          </g>
        </svg>
      );
      
    case 'Punjab':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Phulkari/Wheat Background */}
          <defs>
            <pattern id="punjab-phulkari" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15,0 L30,15 L15,30 L0,15 Z" stroke="rgba(251, 191, 36, 0.1)" strokeWidth="1" fill="none" />
              <circle cx="15" cy="15" r="2" fill="rgba(251, 191, 36, 0.15)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#punjab-phulkari)" />
          
          {/* Warm Mustard Yellow Curves / Hills */}
          <path d="M0,150 Q100,120 200,150 T400,140 L400,200 L0,200 Z" fill="rgba(245, 158, 11, 0.15)" />
          <path d="M0,170 Q130,155 260,180 T400,165 L400,200 L0,200 Z" fill="rgba(245, 158, 11, 0.25)" />
          
          {/* Wheat Grass stalks */}
          <g stroke="#FBBF24" strokeWidth="1.5">
            <path d="M30,180 Q32,140 25,120" />
            <path d="M25,120 Q20,115 15,120" /> <path d="M25,125 Q32,120 35,127" />
            
            <path d="M340,175 Q345,130 350,110" />
            <path d="M350,110 Q355,100 360,105" /> <path d="M350,118 Q342,112 338,122" />
          </g>
          
          {/* Golden Temple Dome Silhouette */}
          <g transform="translate(110, 40)" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Lake Sarovar base */}
            <path d="M-30,125 L210,125" stroke="rgba(251, 191, 36, 0.4)" strokeWidth="4" />
            <path d="M-10,132 L190,132" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="2" />
            
            {/* Bridge walkway */}
            <path d="M-15,125 L25,125 L25,115 L35,115 L35,125" />
            
            {/* Main Temple Structure */}
            <rect x="40" y="70" width="100" height="50" fill="rgba(245, 158, 11, 0.1)" />
            {/* Arches */}
            <path d="M50,120 L50,95 Q60,85 70,95 L70,120" />
            <path d="M80,120 L80,95 Q90,85 100,95 L100,120" />
            <path d="M110,120 L110,95 Q120,85 130,95 L130,120" />
            
            {/* Second Tier */}
            <rect x="50" y="50" width="80" height="20" fill="rgba(245, 158, 11, 0.15)" />
            <circle cx="90" cy="60" r="4" />
            
            {/* Central Golden Dome */}
            <path d="M70,50 Q90,20 110,50 Z" fill="rgba(245, 158, 11, 0.4)" />
            {/* Kalasa pin on top of dome */}
            <line x1="90" y1="32" x2="90" y2="15" strokeWidth="2" />
            <path d="M88,18 L90,15 L92,18" />
            
            {/* Side Chatris */}
            <path d="M45,70 Q50,60 55,70 Z" fill="rgba(245, 158, 11, 0.3)" />
            <path d="M125,70 Q130,60 135,70 Z" fill="rgba(245, 158, 11, 0.3)" />
          </g>
        </svg>
      );
      
    case 'Kerala':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Backwaters Wave Grid */}
          <defs>
            <pattern id="kerala-waves" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 Q10,5 20,10 T40,10" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kerala-waves)" />
          
          {/* Water Bodies Gradients */}
          <path d="M0,140 Q100,155 200,140 T400,150 L400,200 L0,200 Z" fill="rgba(16, 185, 129, 0.1)" />
          <path d="M0,165 Q120,150 240,175 T400,160 L400,200 L0,200 Z" fill="rgba(20, 184, 166, 0.15)" />
          
          {/* Palm/Coconut Trees Silhouette */}
          <g transform="translate(30, 40)" stroke="#10B981" strokeWidth="2.5" fill="none">
            {/* Bent Trunk */}
            <path d="M15,130 Q5,80 12,20" strokeWidth="3" />
            {/* Leaves */}
            <path d="M12,20 Q-15,10 -30,30" />
            <path d="M12,20 Q-20,-5 -15,-25" />
            <path d="M12,20 Q12,-15 25,-30" />
            <path d="M12,20 Q35,-5 45,15" />
            <path d="M12,20 Q30,25 20,45" />
          </g>
          <g transform="translate(330, 50)" stroke="#0D9488" strokeWidth="2.5" fill="none">
            <path d="M10,120 Q18,70 10,15" strokeWidth="3" />
            <path d="M10,15 Q-15,5 -20,25" />
            <path d="M10,15 Q-15,-15 5,-25" />
            <path d="M10,15 Q30,-10 35,10" />
            <path d="M10,15 Q25,25 15,40" />
          </g>
          
          {/* Traditional Houseboat (Kettuvallam) */}
          <g transform="translate(100, 105)" stroke="#14B8A6" strokeWidth="2" fill="none" strokeLinecap="round">
            {/* Boat Hull */}
            <path d="M10,35 Q90,45 170,35 Q185,25 190,15 Q150,42 10,35 Z" fill="rgba(20, 184, 166, 0.1)" />
            {/* Wooden Bamboo Canopy roof */}
            <path d="M30,35 C35,10 145,10 150,35 Z" fill="rgba(20, 184, 166, 0.2)" />
            <path d="M50,11 L50,35" />
            <path d="M75,9 L75,35" />
            <path d="M100,8 L100,35" />
            <path d="M125,11 L125,35" />
            
            {/* Ripples beneath boat */}
            <path d="M0,45 Q90,48 180,45" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="1" />
            <path d="M20,50 Q100,53 160,50" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="1" />
          </g>
        </svg>
      );
      
    case 'Tamil Nadu':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Kolam geometric backdrop */}
          <defs>
            <pattern id="tn-kolam" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="rgba(234, 88, 12, 0.15)" />
              <path d="M20,10 Q25,20 20,30 Q15,20 20,10 Z" stroke="rgba(234, 88, 12, 0.08)" fill="none" />
              <path d="M10,20 Q20,25 30,20 Q20,15 10,20 Z" stroke="rgba(234, 88, 12, 0.08)" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tn-kolam)" />
          
          {/* Warm gradients */}
          <path d="M0,160 Q100,150 200,160 T400,155 L400,200 L0,200 Z" fill="rgba(234, 88, 12, 0.1)" />
          
          {/* Great Gopuram Silhouette (Meenakshi/Tanjore Temple) */}
          <g transform="translate(135, 30)" stroke="#EA580C" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Broad Base Gate */}
            <path d="M25,140 L105,140 L105,120 L25,120 Z" fill="rgba(234, 88, 12, 0.1)" />
            {/* Doorway Arch */}
            <path d="M53,140 L53,125 Q65,118 77,125 L77,140" />
            
            {/* Level 1 Tier */}
            <path d="M30,120 L40,95 L90,95 L100,120" fill="rgba(234, 88, 12, 0.15)" />
            {/* Level 2 Tier */}
            <path d="M40,95 L46,72 L84,72 L90,95" fill="rgba(234, 88, 12, 0.2)" />
            {/* Level 3 Tier */}
            <path d="M46,72 L51,52 L79,52 L84,72" fill="rgba(234, 88, 12, 0.25)" />
            {/* Level 4 Tier */}
            <path d="M51,52 L55,35 L75,35 L79,52" fill="rgba(234, 88, 12, 0.3)" />
            
            {/* Top Ornamental Cap (Kalasam) */}
            <path d="M54,35 Q65,22 76,35 Z" fill="rgba(234, 88, 12, 0.4)" />
            <circle cx="59" cy="22" r="2" />
            <circle cx="65" cy="20" r="2" />
            <circle cx="71" cy="22" r="2" />
            
            {/* Horizonal relief details on gopuram levels */}
            <line x1="33" y1="108" x2="97" y2="108" strokeWidth="1" stroke="rgba(234, 88, 12, 0.4)" />
            <line x1="42" y1="84" x2="88" y2="84" strokeWidth="1" stroke="rgba(234, 88, 12, 0.4)" />
            <line x1="48" y1="62" x2="82" y2="62" strokeWidth="1" stroke="rgba(234, 88, 12, 0.4)" />
            <line x1="53" y1="43" x2="77" y2="43" strokeWidth="1" stroke="rgba(234, 88, 12, 0.4)" />
          </g>
        </svg>
      );
      
    case 'Bihar':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Madhubani Art borders */}
          <defs>
            <pattern id="bihar-madhubani" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M0,15 L15,0 L30,15 L15,30 Z" stroke="rgba(180, 83, 9, 0.12)" strokeWidth="1" fill="none" />
              <path d="M15,15 Q20,5 15,0 Q10,5 15,15 Z" fill="rgba(180, 83, 9, 0.05)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bihar-madhubani)" />
          
          {/* Terracotta hills and sun */}
          <path d="M0,165 Q110,145 220,170 T400,160 L400,200 L0,200 Z" fill="rgba(180, 83, 9, 0.15)" />
          
          {/* Stupa / Nalanda Ruins silhouettes */}
          <g transform="translate(120, 60)" stroke="#B45309" strokeWidth="2.5" fill="none" strokeLinecap="round">
            {/* Brick Stupa Base */}
            <rect x="30" y="80" width="100" height="30" rx="3" fill="rgba(180, 83, 9, 0.05)" />
            <line x1="30" y1="90" x2="130" y2="90" strokeWidth="1" stroke="rgba(180, 83, 9, 0.3)" />
            <line x1="30" y1="100" x2="130" y2="100" strokeWidth="1" stroke="rgba(180, 83, 9, 0.3)" />
            
            {/* Semispherical Dome (Stupa of Nalanda) */}
            <path d="M40,80 C40,40 120,40 120,80 Z" fill="rgba(180, 83, 9, 0.15)" />
            
            {/* Top spire/Harmika */}
            <rect x="72" y="32" width="16" height="8" />
            <line x1="80" y1="32" x2="80" y2="10" strokeWidth="2" />
            {/* Chattras rings */}
            <line x1="75" y1="18" x2="85" y2="18" />
            <line x1="73" y1="23" x2="87" y2="23" />
            
            {/* Traditional Madhubani Lotus Silhouette */}
            <g transform="translate(-50, -10)" stroke="#B45309" strokeWidth="1.5">
              <path d="M20,50 Q20,20 10,10 Q25,25 20,50 Z" fill="rgba(180, 83, 9, 0.1)" />
              <path d="M20,50 Q20,20 30,10 Q15,25 20,50 Z" fill="rgba(180, 83, 9, 0.1)" />
              <path d="M20,50 Q40,30 50,30 Q35,45 20,50 Z" />
              <path d="M20,50 Q0,30 -10,30 Q5,45 20,50 Z" />
            </g>
          </g>
        </svg>
      );
      
    case 'West Bengal':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Traditional Durga/Alpona background */}
          <defs>
            <pattern id="wb-alpona" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="3" stroke="rgba(220, 38, 38, 0.1)" strokeWidth="1" fill="none" />
              <path d="M25,10 C20,15 20,20 25,25 C30,20 30,15 25,10 Z" fill="rgba(220, 38, 38, 0.05)" />
              <path d="M25,25 C20,30 20,35 25,40 C30,35 30,30 25,25 Z" fill="rgba(220, 38, 38, 0.05)" />
              <path d="M10,25 C15,20 20,20 25,25 C20,30 15,30 10,25 Z" fill="rgba(220, 38, 38, 0.05)" />
              <path d="M25,25 C30,20 35,20 40,25 C35,30 30,30 25,25 Z" fill="rgba(220, 38, 38, 0.05)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wb-alpona)" />
          
          {/* Hooghly River flow */}
          <path d="M0,155 Q120,135 240,170 T400,160 L400,200 L0,200 Z" fill="rgba(220, 38, 38, 0.08)" />
          
          {/* Howrah Bridge Silhouette */}
          <g transform="translate(60, 50)" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Water Line */}
            <line x1="-30" y1="115" x2="310" y2="115" stroke="rgba(220, 38, 38, 0.3)" />
            
            {/* Left Tower */}
            <path d="M10,115 L35,25 L45,25 L70,115" fill="rgba(220, 38, 38, 0.1)" />
            <line x1="30" y1="115" x2="35" y2="25" />
            <line x1="50" y1="115" x2="45" y2="25" />
            
            {/* Right Tower */}
            <path d="M210,115 L235,25 L245,25 L270,115" fill="rgba(220, 38, 38, 0.1)" />
            <line x1="230" y1="115" x2="235" y2="25" />
            <line x1="250" y1="115" x2="245" y2="25" />
            
            {/* Main Roadway Deck */}
            <line x1="-20" y1="100" x2="300" y2="100" strokeWidth="3.5" />
            
            {/* Cantilever Truss curves */}
            <path d="M-20,40 Q35,25 140,100" strokeWidth="2" />
            <path d="M300,40 Q245,25 140,100" strokeWidth="2" />
            <path d="M40,25 Q140,105 240,25" strokeWidth="2" />
            
            {/* Vertical Suspender Cables */}
            <line x1="80" y1="52" x2="80" y2="100" strokeWidth="1" stroke="rgba(220, 38, 38, 0.4)" />
            <line x1="110" y1="70" x2="110" y2="100" strokeWidth="1" stroke="rgba(220, 38, 38, 0.4)" />
            <line x1="140" y1="80" x2="140" y2="100" strokeWidth="1" stroke="rgba(220, 38, 38, 0.4)" />
            <line x1="170" y1="70" x2="170" y2="100" strokeWidth="1" stroke="rgba(220, 38, 38, 0.4)" />
            <line x1="200" y1="52" x2="200" y2="100" strokeWidth="1" stroke="rgba(220, 38, 38, 0.4)" />
            
            {/* Diagonal cross trusses on Towers */}
            <line x1="30" y1="40" x2="50" y2="65" strokeWidth="1" />
            <line x1="50" y1="40" x2="30" y2="65" strokeWidth="1" />
            <line x1="230" y1="40" x2="250" y2="65" strokeWidth="1" />
            <line x1="250" y1="40" x2="230" y2="65" strokeWidth="1" />
          </g>
        </svg>
      );
      
    case 'North East':
      return (
        <svg viewBox="0 0 400 200" className={`w-full h-full ${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cloud Pattern and Bamboo backdrop */}
          <defs>
            <pattern id="ne-bamboo" width="40" height="40" patternUnits="userSpaceOnUse">
              <line x1="10" y1="0" x2="10" y2="40" stroke="rgba(13, 148, 136, 0.08)" strokeWidth="1.5" />
              <line x1="30" y1="0" x2="30" y2="40" stroke="rgba(13, 148, 136, 0.05)" strokeWidth="1" />
              {/* Bamboo joints */}
              <circle cx="10" cy="15" r="1.5" fill="rgba(13, 148, 136, 0.15)" />
              <circle cx="10" cy="35" r="1.5" fill="rgba(13, 148, 136, 0.15)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ne-bamboo)" />
          
          {/* Cloud vectors floating */}
          <g fill="rgba(255, 255, 255, 0.1)">
            <path d="M50,40 Q65,30 80,40 T110,40 L110,50 L50,50 Z" />
            <path d="M280,30 Q295,20 310,30 T340,30 L340,40 L280,40 Z" />
          </g>
          
          {/* Mountain Peaks Silhouette */}
          <g stroke="#0D9488" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Rear Range */}
            <path d="M-20,180 L80,90 L160,180" fill="rgba(13, 148, 136, 0.08)" />
            <path d="M120,180 L230,70 L340,180" fill="rgba(13, 148, 136, 0.12)" />
            <path d="M260,180 L340,100 L420,180" fill="rgba(13, 148, 136, 0.08)" />
            
            {/* Front lush green tea gardens curves */}
            <path d="M0,150 Q120,135 240,160 T400,145 L400,200 L0,200 Z" fill="rgba(13, 148, 136, 0.15)" />
            <path d="M0,170 Q100,155 200,180 T400,165 L400,200 L0,200 Z" fill="rgba(13, 148, 136, 0.25)" />
            
            {/* Snow line caps on peak */}
            <path d="M210,90 L230,70 L250,90 L240,95 L230,85 L220,95 Z" fill="rgba(255, 255, 255, 0.4)" stroke="none" />
            <path d="M60,108 L80,90 L100,108 L90,113 L80,103 L70,113 Z" fill="rgba(255, 255, 255, 0.3)" stroke="none" />
          </g>
        </svg>
      );
      
    default:
      return null;
  }
};
