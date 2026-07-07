import React, { useState, useRef, useEffect } from 'react';
import { useSaarthiStore } from '../store';
import { CivicComplaint } from '../types';
import { 
  ClipboardList, 
  MapPin, 
  AlertTriangle, 
  Plus, 
  Send, 
  ThumbsUp, 
  CheckCircle, 
  Compass, 
  Navigation,
  Clock,
  Layers,
  HelpCircle,
  X,
  Sparkles,
  UploadCloud,
  Image,
  ShieldAlert,
  Eye,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TrackTab: React.FC = () => {
  const { 
    complaints, 
    schemes, 
    lodgeComplaint, 
    upvoteComplaint, 
    activeState, 
    stateTheme,
    customMapCenter
  } = useSaarthiStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<CivicComplaint | null>(null);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'map' | 'ai'>('map');
  
  // New Complaint Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<CivicComplaint['category']>('Roads & Potholes');
  const [formLocation, setFormLocation] = useState('Central Civic Lane');
  const [formLat, setFormLat] = useState(customMapCenter.lat);
  const [formLng, setFormLng] = useState(customMapCenter.lng);
  const [isFiling, setIsFiling] = useState(false);

  // Directions/Navigation Simulation
  const [showDirections, setShowDirections] = useState(false);
  const [navigationSteps, setNavigationSteps] = useState<string[]>([]);

  // AI-Powered Issue Detection States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiImageBase64, setAiImageBase64] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Intelligent Reporting Auto-filled States
  const [aiCategory, setAiCategory] = useState<CivicComplaint['category']>('Roads & Potholes');
  const [aiSeverity, setAiSeverity] = useState('Medium');
  const [aiDescription, setAiDescription] = useState('');
  const [aiDepartment, setAiDepartment] = useState('Public Works Department');
  const [aiLocationName, setAiLocationName] = useState('Civic Center Sector');
  const [aiLat, setAiLat] = useState(customMapCenter.lat);
  const [aiLng, setAiLng] = useState(customMapCenter.lng);
  const [aiFiling, setAiFiling] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Verification & Similarity Response States
  const [imageIntegrity, setImageIntegrity] = useState<{ isReal: boolean; confidenceScore: number; issuesDetected: string[] } | null>(null);
  const [geoMapping, setGeoMapping] = useState<{ district: string; ward: string; constituency: string } | null>(null);
  const [duplicateCheck, setDuplicateCheck] = useState<{ isDuplicate: boolean; duplicateDetails: any; nearbyComplaintsRadius1Km: any[] } | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  // Update form coordinates when state map changes
  useEffect(() => {
    setFormLat(customMapCenter.lat);
    setFormLng(customMapCenter.lng);
    // Auto-select first complaint in state on load
    const stateList = complaints.filter(c => c.state === activeState);
    if (stateList.length > 0) {
      setSelectedComplaint(stateList[0]);
    } else {
      setSelectedComplaint(null);
    }
  }, [activeState, customMapCenter]);

  const handleMapClick = (latOffset: number, lngOffset: number, computedName: string) => {
    const clickLat = customMapCenter.lat + latOffset;
    const clickLng = customMapCenter.lng + lngOffset;
    setFormLat(parseFloat(clickLat.toFixed(4)));
    setFormLng(parseFloat(clickLng.toFixed(4)));
    setFormLocation(computedName);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim() || !formLocation.trim()) return;

    setIsFiling(true);
    
    // Simulate API dispatch latency
    setTimeout(async () => {
      await lodgeComplaint({
        title: formTitle,
        category: formCategory,
        description: formDesc,
        locationName: formLocation,
        coordinates: { lat: formLat, lng: formLng },
        state: activeState
      });
      
      // Reset form states
      setFormTitle('');
      setFormDesc('');
      setIsFiling(false);
      setShowAddForm(false);
      
      // Select the newly created complaint
      const stateList = complaints.filter(c => c.state === activeState);
      if (stateList.length > 0) {
        setSelectedComplaint(stateList[0]);
      }
    }, 1500);
  };

  // Simulate routing path steps based on directions API
  const handleSimulateDirections = (comp: CivicComplaint) => {
    setSelectedComplaint(comp);
    setShowDirections(true);
    setNavigationSteps([
      `Start from current location in ${activeState} Municipal Hub`,
      `Turn right onto main state corridor (0.4 km)`,
      `Proceed straight past public park and e-Seva Seva Kendra (1.2 km)`,
      `Identify reported issue [${comp.title}] directly ahead near ${comp.locationName}`
    ]);
  };

  // AI-Powered Issue Detection & GIS operations
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAiError('Please upload a valid civic photo (JPEG/PNG)');
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setAiImageBase64(reader.result as string);
      runAiVisionAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAiVisionAnalysis = async (base64Data: string) => {
    setAiAnalyzing(true);
    setAiError(null);
    setImageIntegrity(null);
    setGeoMapping(null);
    setDuplicateCheck(null);
    try {
      const response = await fetch('/api/analyze-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Data,
          lat: aiLat,
          lng: aiLng,
          activeComplaints: complaints
        })
      });
      if (!response.ok) throw new Error('AI vision analysis failed');
      const data = await response.json();
      
      setAiCategory(data.category);
      setAiSeverity(data.severity);
      setAiDescription(data.description);
      setAiDepartment(data.department);
      
      setImageIntegrity(data.imageIntegrity);
      setGeoMapping(data.geoMapping);
      setDuplicateCheck(data.duplicateCheck);
      setAiSource(data.source);
    } catch (err: any) {
      setAiError(err.message || 'Error executing vision analysis');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleDetectGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(4));
          const lng = parseFloat(position.coords.longitude.toFixed(4));
          setAiLat(lat);
          setAiLng(lng);
        },
        () => {
          const latOffset = (Math.random() - 0.5) * 0.05;
          const lngOffset = (Math.random() - 0.5) * 0.05;
          setAiLat(parseFloat((customMapCenter.lat + latOffset).toFixed(4)));
          setAiLng(parseFloat((customMapCenter.lng + lngOffset).toFixed(4)));
        }
      );
    } else {
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      setAiLat(parseFloat((customMapCenter.lat + latOffset).toFixed(4)));
      setAiLng(parseFloat((customMapCenter.lng + lngOffset).toFixed(4)));
    }
  };

  const handleAiFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiDescription.trim() || !aiLocationName.trim()) return;

    setAiFiling(true);
    try {
      await lodgeComplaint({
        title: `AI Detected: ${aiCategory} - ${aiLocationName}`,
        category: aiCategory,
        description: aiDescription,
        locationName: aiLocationName,
        coordinates: { lat: aiLat, lng: aiLng },
        state: activeState
      });

      setAiSuccessMessage(`Successfully lodged complaint! Assigned to ${aiDepartment} under ${geoMapping?.ward || 'Local Ward'}.`);
      setTimeout(() => {
        setAiSuccessMessage(null);
        setAiImageBase64(null);
        setAiDescription('');
        setImageIntegrity(null);
        setGeoMapping(null);
        setDuplicateCheck(null);
        setActiveWorkspaceTab('map');
      }, 4000);
    } catch (err: any) {
      setAiError(err.message || 'Error logging complaint');
    } finally {
      setAiFiling(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageUpload(file);
  };

  // State filtered data lists
  const stateComplaints = complaints.filter(c => c.state === activeState);
  const stateAppliedSchemes = schemes.filter(s => s.status === 'Applied');

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6 text-left">
      
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
            <ClipboardList className="w-5.5 h-5.5 text-black" />
            <span>Civic Tracking Hub</span>
          </h2>
          <p className="text-xs text-gray-500 font-bold">Log civic defaults or trace applied scheme pipelines.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 bg-[#EA4335] text-white rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black flex items-center gap-1.5 text-xs font-black uppercase"
          id="toggle-complaint-form-btn"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? 'Close' : 'Log Issue'}</span>
        </button>
      </div>

      {/* Workspace Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => setActiveWorkspaceTab('map')}
          className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${activeWorkspaceTab === 'map' ? 'bg-white border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent text-gray-500 hover:text-black'}`}
        >
          <Compass className="w-4 h-4" />
          <span>Interactive GIS Map</span>
        </button>
        <button
          onClick={() => setActiveWorkspaceTab('ai')}
          className={`py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all flex items-center justify-center gap-1.5 ${activeWorkspaceTab === 'ai' ? 'bg-[#4285F4] border-black text-white shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent text-gray-500 hover:text-black'}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Issue Detection</span>
        </button>
      </div>

      {activeWorkspaceTab === 'map' ? (
        /* 1. DYNAMIC HIGH-FIDELITY VECTOR MAP WORKSPACE */
        <div className="bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-4 space-y-3.5">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1">
              <Compass className="w-4 h-4 text-black" />
              <span>Interactive Municipal Map ({activeState})</span>
            </span>
            <span className="text-[9px] font-black text-black bg-[#CEEAD6] border border-black px-2.5 py-0.5 rounded flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping mr-1" />
              <span>Directions API Sim</span>
            </span>
          </div>

          {/* Custom Visual Interactive Vector Map Stage */}
          <div className="relative w-full h-48 rounded-2xl bg-[#202124] overflow-hidden border-2 border-black select-none cursor-crosshair shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {/* Subtle grid layout lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-white" />
              ))}
            </div>

            {/* Abstract City Vector roads */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,80 L400,100" stroke="white" strokeWidth="12" strokeLinecap="round" />
              <path d="M120,0 L140,200" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <path d="M280,0 L260,200" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <path d="M0,150 L400,120" stroke="white" strokeWidth="10" strokeLinecap="round" />
            </svg>

            {/* Interactive clickable zones to place a pothole or light error coordinate */}
            <div className="absolute inset-0">
              <button 
                onClick={() => handleMapClick(0.0122, -0.0184, "Green Corridor Crossing")}
                className="absolute top-10 left-12 group p-1"
                title="Click to set pothole coordinates"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#4285F4]/30 animate-ping absolute inset-0" />
                <MapPin className="w-5 h-5 text-[#4285F4] relative z-10 hover:scale-125 transition-transform" />
              </button>
              <button 
                onClick={() => handleMapClick(-0.0185, 0.0245, "Sector 8 Metro Pillar 42")}
                className="absolute bottom-16 right-20 group p-1"
                title="Click to set water leak coordinates"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-[#FBBC05]/30 animate-ping absolute inset-0" />
                <MapPin className="w-5 h-5 text-[#FBBC05] relative z-10 hover:scale-125 transition-transform" />
              </button>
            </div>

            {/* Plotting active complaints pin points dynamically */}
            {stateComplaints.map(comp => {
              const isSelected = selectedComplaint?.id === comp.id;
              // Generate some deterministic map coordinates offsets for display on the abstract grid
              const latMod = (comp.coordinates.lat * 1000) % 150;
              const lngMod = (comp.coordinates.lng * 1000) % 300;
              return (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComplaint(comp)}
                  className="absolute"
                  style={{ top: `${20 + (latMod % 110)}px`, left: `${40 + (lngMod % 280)}px` }}
                >
                  <motion.div 
                    className="relative flex flex-col items-center"
                    animate={{ scale: isSelected ? 1.25 : 1 }}
                  >
                    <MapPin className={`w-6 h-6 drop-shadow-md ${isSelected ? 'text-red-500 animate-bounce' : 'text-[#4285F4]'}`} />
                    <span className="text-[7px] bg-slate-950/80 text-white px-1.5 py-0.5 rounded-md font-bold mt-0.5 truncate max-w-[60px]">
                      {comp.title}
                    </span>
                  </motion.div>
                </button>
              );
            })}

            {/* User Marker indicator Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500/30 rounded-full animate-ping absolute" />
              <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10" />
              <span className="text-[7px] bg-blue-600 text-white font-extrabold px-1 rounded mt-0.5 shadow-sm">You</span>
            </div>

            {/* Directions Draw Line */}
            {showDirections && selectedComplaint && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <line 
                  x1="200" y1="100" 
                  x2="180" y2="120" 
                  stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeDasharray="6,4" className="animate-[dash_2s_linear_infinite]"
                />
              </svg>
            )}
          </div>

          <p className="text-[10px] text-gray-500 font-bold text-center">• Click on map markers to view timeline. Tap empty spaces to map coordinates.</p>

          {/* Selected Map Marker Box */}
          {selectedComplaint && (
            <div className="bg-white rounded-2xl p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[8px] bg-[#D2E3FC] border border-black text-black font-black px-2 py-0.5 rounded uppercase tracking-wider">{selectedComplaint.category}</span>
                  <h4 className="font-black text-xs sm:text-sm text-black mt-1.5 leading-tight">{selectedComplaint.title}</h4>
                </div>
                <span className={`text-[9px] font-black px-2 py-0.5 border border-black rounded ${selectedComplaint.status === 'Resolved' ? 'bg-[#CEEAD6] text-black' : 'bg-[#FEEFC3] text-black'}`}>
                  {selectedComplaint.status}
                </span>
              </div>

              <p className="text-[10px] text-gray-700 font-bold leading-relaxed">{selectedComplaint.description}</p>

              <div className="flex justify-between items-center text-[10px] font-black text-black pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#EA4335]" />
                  <span className="text-black font-black uppercase text-[9px]">{selectedComplaint.locationName}</span>
                </span>
                <span className="text-[9px] text-gray-500 font-bold">Coords: {selectedComplaint.coordinates.lat}, {selectedComplaint.coordinates.lng}</span>
              </div>

              {/* Simulated route trigger */}
              <div className="flex gap-2 pt-2 border-t border-black/10">
                <button
                  onClick={() => handleSimulateDirections(selectedComplaint)}
                  className="flex-1 py-1.5 bg-[#4285F4] text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)]"
                  id="simulate-routing-btn"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Simulate GPS Directions</span>
                </button>
                
                <button
                  onClick={() => upvoteComplaint(selectedComplaint.id)}
                  className={`px-3.5 py-1.5 border-2 border-black rounded-xl text-[10px] font-black transition-all flex items-center gap-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] ${selectedComplaint.hasUpvoted ? 'bg-[#34A853] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{selectedComplaint.upvotes}</span>
                </button>
              </div>
            </div>
          )}

          {/* Directions Steps Drawer */}
          <AnimatePresence>
            {showDirections && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#CEEAD6] rounded-2xl p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-2 text-left"
              >
                <div className="flex justify-between items-center text-black font-black text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-black" />
                    <span>GPS Directions Navigation Simulation</span>
                  </span>
                  <button onClick={() => setShowDirections(false)} className="text-black hover:scale-110"><X className="w-3.5 h-3.5" /></button>
                </div>

                <div className="space-y-1.5 pl-1.5 border-t border-black/10 pt-2">
                  {navigationSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-2 items-start text-[10px] font-bold text-gray-800">
                      <span className="w-4 h-4 rounded bg-white text-black border border-black flex items-center justify-center font-black shrink-0 text-[8px] mt-0.5">{sIdx + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* AI-POWERED ISSUE DETECTION WORKSPACE */
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#4285F4] text-white rounded-xl border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-black text-xs uppercase text-black flex items-center gap-1.5">
                  <span>Gemini Vision Inspector</span>
                  <span className="bg-green-600 text-white text-[7.5px] px-1.5 py-0.2 rounded uppercase font-black tracking-wide animate-pulse">Real-time</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-bold">Auto-category detection, GPS mapping & integrity verification.</p>
              </div>
            </div>

            {/* Success Message Banner */}
            {aiSuccessMessage && (
              <div className="bg-[#CEEAD6] rounded-xl p-3 border-2 border-black text-[11px] font-black text-black">
                {aiSuccessMessage}
              </div>
            )}

            {/* Drag & Drop File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${isDragOver ? 'bg-[#E8F0FE] border-[#4285F4]' : 'bg-gray-50 border-gray-300 hover:border-black'}`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              {aiImageBase64 ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <img src={aiImageBase64} alt="Civic preview" className="w-full h-full object-cover animate-fade-in" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-black uppercase">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1 text-center">
                  <UploadCloud className="w-9 h-9 text-gray-400" />
                  <span className="text-xs font-black text-black uppercase">Drag & Drop civic photo here</span>
                  <span className="text-[10px] text-gray-500 font-bold">or click to browse local files</span>
                </div>
              )}
            </div>

            {/* AI analyzing progress spinner */}
            {aiAnalyzing && (
              <div className="bg-[#E8F0FE] rounded-xl p-4 border-2 border-black flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                <div className="text-[11px] font-black uppercase tracking-tight text-black">
                  Analyzing photo integrity & GIS database matches...
                </div>
              </div>
            )}

            {aiError && (
              <div className="bg-[#FAD2CF] rounded-xl p-3 border-2 border-black text-xs font-bold text-red-950">
                {aiError}
              </div>
            )}

            {/* Vision Grounding, Integrity & Map Metrics */}
            {aiImageBase64 && !aiAnalyzing && (
              <div className="space-y-4 text-left">
                
                {/* 1. Image Integrity Badge */}
                {imageIntegrity && (
                  <div className={`p-3 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] space-y-1.5 ${imageIntegrity.isReal ? 'bg-[#CEEAD6] text-black' : 'bg-[#FAD2CF] text-black'}`}>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                      <span className="flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Visual Integrity Audit</span>
                      </span>
                      <span>Confidence: {imageIntegrity.confidenceScore}%</span>
                    </div>
                    <div className="text-[11px] font-bold text-left">
                      {imageIntegrity.isReal ? (
                        <span className="text-green-950 font-black">✔ Authenticity Confirmed. Photo verified as original, unmodified ground capture.</span>
                      ) : (
                        <div className="text-red-950 space-y-1 text-left">
                          <span className="font-black">⚠ INTEGRITY ALERT: Screenshot, Internet-sourced, or edited photo detected!</span>
                          <ul className="list-disc pl-3 text-[10px] space-y-0.5">
                            {imageIntegrity.issuesDetected.map((issue, index) => (
                              <li key={index}>{issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Intelligent Reporting Auto-fill Preview */}
                <form onSubmit={handleAiFormSubmit} className="space-y-3.5 border-t border-black/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Auto-filled Complaint Details</span>
                    <span className="text-[9px] bg-[#E8F0FE] text-[#4285F4] border border-black px-2 py-0.5 rounded font-black uppercase">{aiSource || 'Gemini AI'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-black block mb-1">AI Detected Category</label>
                      <select 
                        value={aiCategory} 
                        onChange={(e: any) => setAiCategory(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE]"
                      >
                        <option value="Roads & Potholes">Roads & Potholes</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity & Lights">Electricity & Lights</option>
                        <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                        <option value="Stray Animals">Stray Animals</option>
                        <option value="Security & Policing">Security & Policing</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase text-black block mb-1">Severity Rating</label>
                      <span className={`w-full border-2 border-black rounded-xl px-2.5 py-1.5 text-xs font-black flex items-center justify-center text-center ${aiSeverity === 'Critical' ? 'bg-[#FAD2CF] text-red-950' : aiSeverity === 'High' ? 'bg-orange-100 text-orange-950' : 'bg-green-100 text-green-950'}`}>
                        {aiSeverity}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-black block mb-1">Automatic Assigned Department</label>
                    <input 
                      type="text" 
                      value={aiDepartment} 
                      onChange={(e) => setAiDepartment(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-black text-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-black block mb-1">Verify Street Location Name</label>
                    <input 
                      type="text" 
                      value={aiLocationName} 
                      onChange={(e) => setAiLocationName(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-black text-black focus:outline-none"
                      required
                    />
                  </div>

                  {/* Smart Geo-Location Ward Map Coordinates */}
                  <div className="bg-[#FFF2E0] p-3 rounded-xl border-2 border-black space-y-2.5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-orange-800">
                      <span>Smart GIS Coordinate Mapping</span>
                      <button type="button" onClick={handleDetectGPS} className="underline hover:text-black">Update GPS</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-800 font-bold">
                      <div>• Latitude: <span className="font-black">{aiLat}</span></div>
                      <div>• Longitude: <span className="font-black">{aiLng}</span></div>
                    </div>

                    {geoMapping && (
                      <div className="border-t border-orange-200 pt-2 grid grid-cols-3 gap-1.5 text-[9.5px] font-black uppercase text-orange-950">
                        <div>
                          <span className="text-[7.5px] text-orange-700 block">District</span>
                          <span>{geoMapping.district}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-orange-700 block">Civic Ward</span>
                          <span>{geoMapping.ward}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-orange-700 block">Constituency</span>
                          <span>{geoMapping.constituency}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Duplicate Prevention alert */}
                  {duplicateCheck && (
                    <div className={`p-3 rounded-xl border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] space-y-2 text-left ${duplicateCheck.isDuplicate ? 'bg-[#FFF2E0]' : 'bg-[#E8F0FE]'}`}>
                      <div className="text-[10px] font-black uppercase flex items-center gap-1">
                        <Activity className="w-4 h-4 text-black" />
                        <span>AI Duplicate & Cluster Audit</span>
                      </div>
                      
                      {duplicateCheck.isDuplicate ? (
                        <div className="text-[11px] font-bold text-orange-950 space-y-1">
                          <p>⚠ DUPLICATE ALREADY REGISTERED (Similarity score: {duplicateCheck.duplicateDetails.similarityScore}%).</p>
                          <p className="text-[10px] font-medium text-orange-900 leading-relaxed">
                            A highly similar issue "{duplicateCheck.duplicateDetails.title}" exists within {duplicateCheck.duplicateDetails.distanceMeters} meters. We suggest merging this into the existing active thread to avoid departmental strain.
                          </p>
                        </div>
                      ) : (
                        <div className="text-[11px] font-bold text-blue-950 space-y-1">
                          <p className="text-green-950 font-black">✔ No duplicate complaint cluster conflict found. Verified safe to submit.</p>
                          {duplicateCheck.nearbyComplaintsRadius1Km && duplicateCheck.nearbyComplaintsRadius1Km.length > 0 && (
                            <div className="text-[10px] text-gray-700 font-bold space-y-1 border-t border-blue-200 pt-1.5">
                              <div className="font-black text-gray-500 text-[8px] uppercase">Nearby issues in 1Km (KNN Cluster Density):</div>
                              {duplicateCheck.nearbyComplaintsRadius1Km.map((c: any, index: number) => (
                                <div key={index} className="flex justify-between items-center text-[9px]">
                                  <span>• {c.title}</span>
                                  <span>({c.distanceMeters}m away)</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Citizen Review & Submit */}
                  <button
                    type="submit"
                    disabled={aiFiling}
                    className="w-full py-3 bg-[#4285F4] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 border-2 border-black active:translate-y-0.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{aiFiling ? 'Lodging Grievance...' : 'Review & Submit Petition'}</span>
                  </button>

                </form>

              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. ADD COMPLAINT PANEL */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <h3 className="font-black text-xs uppercase tracking-tight text-black flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-[#EA4335]" />
                <span>Log New Civic Default</span>
              </h3>
              <button onClick={() => setShowAddForm(false)} className="p-1 hover:bg-gray-100 rounded-lg text-black"><X className="w-4.5 h-4.5" /></button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="text-[9px] font-black uppercase text-black block mb-1">Issue Headline</label>
                <input 
                  type="text" 
                  placeholder="e.g. Broken streetlight on main crossing"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                  required
                  id="complaint-title-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-black block mb-1">Category Group</label>
                  <select 
                    value={formCategory} 
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl px-2 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="Roads & Potholes">Roads & Potholes</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Electricity & Lights">Electricity & Lights</option>
                    <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                    <option value="Stray Animals">Stray Animals</option>
                    <option value="Security & Policing">Security & Policing</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase text-black block mb-1">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lane 12, Sector B"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]"
                    required
                    id="complaint-address-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#FEEFC3] p-3 rounded-xl border-2 border-black text-[10px] font-bold text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                <div>• Latitude Coords: <span className="font-black">{formLat}</span></div>
                <div>• Longitude Coords: <span className="font-black">{formLng}</span></div>
                <div className="col-span-2 text-[9px] text-[#EA4335] font-black uppercase tracking-tight">* Tap the vector map above to change GPS coordinates automatically.</div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-black block mb-1">Explain the Grievance</label>
                <textarea 
                  rows={3}
                  placeholder="Provide complete details about leakage volume, broken pavement or safety concerns to accelerate ground inspection..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] resize-none"
                  required
                  id="complaint-desc-input"
                />
              </div>

              <button
                type="submit"
                disabled={isFiling}
                className="w-full py-2.5 bg-[#EA4335] text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 border-2 border-black active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                id="complaint-submit-btn"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isFiling ? 'Filing Petition...' : 'Dispatch Petition to State PWD'}</span>
              </button>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. LIST OF HISTORIC COMPLAINTS & SCHEMES TIMELINES */}
      <div className="space-y-5">
        
        {/* Complaints Section */}
        <div className="space-y-3">
          <h3 className="font-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5 px-1">
            <ClipboardList className="w-4.5 h-4.5 text-black" />
            <span>My Registered Grievance Logs ({activeState})</span>
          </h3>

          <div className="space-y-4">
            {stateComplaints.length > 0 ? (
              stateComplaints.map(comp => (
                <div 
                  key={comp.id} 
                  onClick={() => setSelectedComplaint(comp)}
                  className={`bg-white border-2 border-black rounded-2xl p-4 space-y-3 cursor-pointer transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-black leading-tight">{comp.title}</h4>
                      <span className="text-[9px] font-black text-black uppercase bg-[#D2E3FC] border border-black px-2 py-0.5 rounded inline-block mt-1.5">
                        {comp.category}
                      </span>
                    </div>
                    <span className={`text-[9px] font-black px-2.5 py-0.5 border border-black rounded ${comp.status === 'Resolved' ? 'bg-[#CEEAD6] text-black' : comp.status === 'In Progress' ? 'bg-[#FEEFC3] text-black' : 'bg-[#D2E3FC] text-black'}`}>
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-700 font-bold leading-relaxed line-clamp-2">{comp.description}</p>

                  {/* Grievance progress timeline steps */}
                  <div className="bg-[#FEEFC3] rounded-xl p-3 border-2 border-black text-[10px] text-black space-y-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="font-black text-[9px] uppercase tracking-wider text-black flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-black" />
                      <span>Live Audit Trail Track:</span>
                    </div>
                    <div className="space-y-2 pl-1 border-t border-black/10 pt-2 text-black">
                      {comp.timeline.map((step, sIdx) => (
                        <div key={sIdx} className="flex gap-2 items-start font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-black">{step.status}</span> 
                            <span className="text-gray-600"> ({step.date}): </span>
                            <span className="font-medium text-[10px] text-gray-800">{step.comment}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-white rounded-2xl text-gray-500 text-xs font-black border-2 border-dashed border-black/30">
                No registered complaints in {activeState}. Lodge an issue above.
              </div>
            )}
          </div>
        </div>

        {/* Applied Schemes tracking */}
        <div className="space-y-3">
          <h3 className="font-black text-black text-xs uppercase tracking-wider flex items-center gap-1.5 px-1">
            <CheckCircle className="w-4.5 h-4.5 text-black" />
            <span>Applied Scheme Petitions</span>
          </h3>

          <div className="space-y-4">
            {stateAppliedSchemes.length > 0 ? (
              stateAppliedSchemes.map(sch => (
                <div key={sch.id} className="bg-white border-2 border-black rounded-2xl p-4 space-y-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-black leading-tight">{sch.name}</h4>
                      <span className="text-[9px] text-gray-500 font-bold block">{sch.department}</span>
                    </div>
                    <span className="text-[9px] font-black text-black bg-[#FEEFC3] border border-black px-2 py-0.5 rounded uppercase">
                      Under Review
                    </span>
                  </div>

                  <div className="bg-[#E8F0FE] p-2.5 rounded-xl border-2 border-black flex justify-between items-center text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <span className="text-gray-500 text-[8px] block uppercase">Petition Reference ID</span>
                      <span className="text-black font-black">{sch.applicationId}</span>
                    </div>
                    <span className="text-gray-500">Date: {sch.appliedDate}</span>
                  </div>

                  <div className="flex gap-2 items-start text-[10px] font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cross-referenced with Secure e-Locker Aadhaar credentials. Forwarded to State Welfare Nodal Officer for license issuance.</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-white rounded-2xl text-gray-500 text-xs font-black border-2 border-dashed border-black/30">
                No active scheme petitions filed yet. Go to 'Services' to apply for subsidies!
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
