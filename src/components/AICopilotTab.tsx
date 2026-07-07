import React, { useState, useRef, useEffect } from 'react';
import { useSaarthiStore } from '../store';
import { ChatMessage } from '../types';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Sparkles, 
  AlertTriangle,
  Volume2,
  VolumeX,
  HelpCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Web Speech Types for TS compliance
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const AICopilotTab: React.FC = () => {
  const { chatHistory, sendMessageToAI, clearChat, stateTheme, activeState, user } = useSaarthiStore();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [sttError, setSttError] = useState<string | null>(null);

  // Whisper STT states
  const [whisperMode, setWhisperMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Speech Recognition (STT Browser Fallback) Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-IN'; // Indian English dialect works beautifully for multi-lingual accents

      rec.onstart = () => {
        setIsListening(true);
        setSttError(null);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        if (transcript.trim()) {
          handleSendText(transcript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Browser Speech Recognition Error:", err);
        setIsListening(false);
        setSttError("Browser Speech recognition failed or permission was denied. Please try Whisper AI Mode.");
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      console.warn("Browser SpeechRecognition is not supported");
    }

    // Cleanup speaking and timers on unmount
    return () => {
      window.speechSynthesis?.cancel();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Text-To-Speech (TTS) Trigger: Speak assistant's latest response if speech is enabled
  useEffect(() => {
    if (chatHistory.length > 0 && speechEnabled) {
      const latestMessage = chatHistory[chatHistory.length - 1];
      if (latestMessage.sender === 'assistant' && latestMessage.content !== '🤖 Thinking...') {
        speakText(latestMessage.content);
      }
    }
  }, [chatHistory, speechEnabled]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Clean markdown characters from text before reading
    const cleanText = text
      .replace(/[#*`|_\-\[\]()]/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN'; // Indian English accents match Saarthi's cultural context
    
    // Attempt to locate a pleasant Indian voice
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
    if (indianVoice) {
      utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    } else {
      // Re-read latest message
      const latest = chatHistory.filter(m => m.sender === 'assistant');
      if (latest.length > 0) {
        speakText(latest[latest.length - 1].content);
      }
    }
  };

  // Direct Audio Recording & Whisper API Handlers
  const startRecording = async () => {
    setSttError(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options = { mimeType: 'audio/ogg' };
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        if (audioBlob.size > 0) {
          await processAudioWithWhisper(audioBlob);
        }
      };

      mediaRecorder.start(200); // Collect data chunks every 200ms
      setIsRecording(true);
      window.speechSynthesis?.cancel(); // Stop talking when user begins speaking
      setIsSpeaking(false);

      // Start duration countdown (12 seconds maximum)
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 12) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error("Failed to start MediaRecorder:", err);
      setSttError("Microphone permission denied or busy. Check your browser settings and try again.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const processAudioWithWhisper = async (audioBlob: Blob) => {
    setTranscribing(true);
    setSttError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const base64Clean = base64Data.split(',')[1];

        const response = await fetch('/api/whisper', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            audio: base64Clean,
            mimeType: audioBlob.type
          })
        });

        if (!response.ok) {
          throw new Error("Voice transcription API returned non-200 response");
        }

        const result = await response.json();
        const text = result.text || "";

        if (text && text.trim()) {
          setInputText(text);
          await handleSendText(text);
        } else {
          setSttError("Could not capture any speech. Try speaking closer to the microphone.");
        }
        setTranscribing(false);
      };
    } catch (err: any) {
      console.error("Whisper processing error:", err);
      setSttError("Whisper API transcription failed. Try using Browser Voice or manual entry.");
      setTranscribing(false);
    }
  };

  const handleToggleListening = () => {
    if (whisperMode) {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    } else {
      if (!recognitionRef.current) {
        setSttError("Web Speech Recognition is not supported in this browser. Please use Chrome/Edge or type manually.");
        return;
      }

      if (isListening) {
        recognitionRef.current.stop();
      } else {
        window.speechSynthesis?.cancel(); // stop speaking when listening starts
        setIsSpeaking(false);
        recognitionRef.current.start();
      }
    }
  };

  const handleSendText = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setInputText('');
    await sendMessageToAI(text);
  };

  // Preset quick prompt starters
  const quickPrompts = [
    { title: "Subsidies Match", text: `What schemes in ${activeState} am I eligible for with low income?` },
    { title: "Report Pothole", text: "How do I lodge a road complaint on Saarthi?" },
    { title: "e-Locker Files", text: "What documents are required to register in Saarthi e-Locker?" },
    { title: "SSY Scheme", text: "Explain Sukanya Samriddhi Yojana (SSY) interest rate and requirements." }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-md mx-auto bg-[#F8F9FA] border-x border-gray-100">
      
      {/* 1. COPILOT HEADER BAR */}
      <div className={`p-4 bg-[#202124] text-white flex justify-between items-center border-b-2 border-black shrink-0 shadow-md`}>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div className="text-left">
            <h3 className="font-black text-sm tracking-tight uppercase">Saarthi AI</h3>
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-wider">{activeState} Civic Intelligence</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Whisper vs Browser Speech Toggle */}
          <button 
            onClick={() => {
              setWhisperMode(!whisperMode);
              setSttError(null);
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all select-none shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_rgba(0,0,0,1)] ${whisperMode ? 'bg-[#EA4335] text-white border-black' : 'bg-gray-800 text-gray-300 border-gray-600'}`}
            title={whisperMode ? "Using High-Precision Whisper AI" : "Using Browser Web Speech API"}
          >
            {whisperMode ? "🎤 Whisper" : "🌐 WebSpeech"}
          </button>

          {/* Speak / Speech setting toggle */}
          <button 
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-2 rounded-xl border border-transparent transition-all ${speechEnabled ? 'text-[#FBBC05] bg-black/40 border-black' : 'text-white/60'}`}
            title={speechEnabled ? "Auto Text-To-Speech is On" : "Auto Text-To-Speech is Off"}
          >
            {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Direct reset button */}
          <button 
            onClick={clearChat}
            className="p-2 rounded-xl hover:bg-black/30 text-white/80 hover:text-white transition-colors"
            title="Reset conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CHAT BUBBLES WINDOW CONTAINER */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        
        {/* Welcome status widget */}
        <div className="bg-[#FEEFC3] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-left text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-black text-black uppercase tracking-tight">
            <Sparkles className="w-4 h-4" />
            <span>Saarthi Interactive Guides</span>
          </div>
          <p className="text-gray-900 font-bold leading-relaxed">
            Welcome to the AI terminal. You can query scheme checklists, document locker states, or draft citizen petitions. Tap a quick-prompt starter below to query instantly.
          </p>
        </div>

        {/* Message logs */}
        <AnimatePresence initial={false}>
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-2.5 max-w-[85%] text-left ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'}`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-xl bg-white border-2 border-black flex items-center justify-center text-black shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] mt-0.5`}>
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className={`p-3.5 rounded-2xl text-xs font-bold leading-relaxed border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${isUser ? 'bg-[#4285F4] text-white rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                    
                    {/* Render message contents with simple markdown styling replacements */}
                    <div className="whitespace-pre-wrap select-text">
                      {msg.content === '🤖 Thinking...' ? (
                        <div className="flex items-center gap-1 text-gray-600 font-bold">
                          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      ) : (
                        msg.content
                          .split('\n')
                          .map((line, idx) => {
                            // Sub-header styling
                            if (line.startsWith('###') || line.startsWith('####')) {
                              return <h4 key={idx} className="font-black text-xs uppercase tracking-tight text-black mt-2 block">{line.replace(/#/g, '')}</h4>;
                            }
                            // List items styling
                            if (line.startsWith('*') || line.startsWith('-')) {
                              return (
                                <span key={idx} className="flex items-start gap-1 pl-1 text-gray-800 font-bold">
                                  <span>•</span>
                                  <span>{line.replace(/^[*-\s]+/, '')}</span>
                                </span>
                              );
                            }
                            return <p key={idx} className="mb-1 leading-relaxed">{line}</p>;
                          })
                      )}
                    </div>

                    {/* Metadata dynamic scheme box if attached */}
                    {msg.docDetails && (
                      <div className="mt-3 pt-3 border-t-2 border-black bg-[#CEEAD6] rounded-xl p-3 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[11px] text-black space-y-2 font-bold">
                        <div className="flex items-center gap-1 text-black font-black">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="uppercase tracking-tight text-[10px]">MAPPED DOCUMENT CHECKLIST</span>
                        </div>
                        {msg.docDetails.missingDocs && msg.docDetails.missingDocs.length > 0 ? (
                          <div>
                            <span className="text-red-700 uppercase font-black text-[9px] block">Missing Files:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {msg.docDetails.missingDocs.map((md, mi) => (
                                <span key={mi} className="bg-white text-black border border-black px-1.5 py-0.5 rounded text-[10px] font-bold">
                                  {md}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-emerald-800 text-[10px] font-black uppercase">✔ ALL REQUIRED DOCUMENTS DETECTED IN E-LOCKER</div>
                        )}
                        {msg.docDetails.nextSteps && (
                          <div className="text-[10px] text-gray-700 font-bold border-t border-black/10 pt-1.5">
                            Next Steps: {msg.docDetails.nextSteps.join(' → ')}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                  
                  {/* Speaker reader helper */}
                  {!isUser && msg.content !== '🤖 Thinking...' && (
                    <button 
                      onClick={handleToggleSpeak}
                      className="text-[10px] text-gray-500 font-black uppercase hover:text-black flex items-center gap-1 cursor-pointer select-none"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-indigo-600 animate-pulse' : ''}`} />
                      <span>{isSpeaking ? "Speaking..." : "Read Out"}</span>
                    </button>
                  )}
                  
                  <span className="text-[9px] text-gray-400 block px-1 font-semibold">{msg.timestamp}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* 3. CONVERSATIONAL STARTERS */}
      {chatHistory.length <= 1 && (
        <div className="px-4 py-2 bg-gray-50 overflow-x-auto whitespace-nowrap flex gap-3 shrink-0 border-t-2 border-black select-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(prompt.text)}
              className="inline-block bg-[#FEEFC3] hover:bg-[#fde7a6] border-2 border-black px-3.5 py-2.5 rounded-xl text-[11px] font-black text-black transition-all shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              id={`quick-prompt-${idx}`}
            >
              <div className="text-[8px] text-gray-700 uppercase font-black leading-none">{prompt.title}</div>
              <div className="truncate max-w-[150px] mt-0.5 font-bold">{prompt.text}</div>
            </button>
          ))}
        </div>
      )}

      {/* STT microphone errors */}
      {sttError && (
        <div className="bg-[#FAD2CF] text-black text-[10px] font-black px-4 py-2.5 border-t-2 border-black flex items-center gap-1.5 shrink-0 select-text">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
          <span>{sttError}</span>
          <button onClick={() => setSttError(null)} className="ml-auto underline font-black uppercase">Dismiss</button>
        </div>
      )}

      {/* 4. CHAT INPUT PANEL */}
      <div className="p-3 bg-white border-t-2 border-black flex flex-col gap-2 shrink-0 pb-safe-bottom">
        {/* Whisper Mode Status Indicator Pill */}
        {(isRecording || transcribing) && (
          <div className="flex items-center gap-1.5 px-1 py-0.5 self-start">
            <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-[#EA4335] animate-ping' : 'bg-[#FBBC05] animate-bounce'}`} />
            <span className="text-[10px] font-black uppercase text-black/70">
              {isRecording ? `Whisper Recording Voice (${recordingSeconds}s / 12s Max)` : "Whisper AI transcribing..."}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Dynamic Voice Recognition Activator */}
          <motion.button
            onClick={handleToggleListening}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 border-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
              isRecording 
                ? 'bg-[#EA4335] text-white animate-pulse' 
                : isListening 
                ? 'bg-[#FBBC05] text-black animate-pulse' 
                : transcribing 
                ? 'bg-gray-200 text-gray-500 cursor-wait' 
                : 'bg-[#FAD2CF] text-black hover:bg-[#fcc0ba]'
            }`}
            whileHover={!transcribing ? { scale: 1.05 } : {}}
            whileTap={!transcribing ? { scale: 0.95 } : {}}
            disabled={transcribing}
            title={
              transcribing 
                ? "Whisper is transcribing..." 
                : isRecording || isListening 
                ? "Click to stop recording" 
                : `Record voice query via ${whisperMode ? "Whisper AI" : "Browser WebSpeech"}`
            }
            id="speech-toggle-btn"
          >
            {transcribing ? (
              <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : isRecording || isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          {/* Textbox */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={
                isRecording 
                  ? "Speak now... Click red button to stop" 
                  : isListening 
                  ? "Listening (Browser)... Speak clearly" 
                  : transcribing 
                  ? "Whisper is translating speech to text..." 
                  : `Ask about Ayushman, Potholes, SSY (${whisperMode ? "Whisper AI" : "Browser STT"})`
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !transcribing && handleSendText()}
              className="w-full bg-white border-2 border-black rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-black text-black placeholder-gray-500 focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-75 disabled:cursor-wait"
              disabled={isListening || isRecording || transcribing}
              id="chat-text-input"
            />
          </div>

          {/* Send Action */}
          <button
            onClick={() => handleSendText()}
            className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 border-black transition-all ${inputText.trim() && !transcribing ? 'bg-[#34A853] text-white shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 text-gray-400 border-black/10 cursor-not-allowed'}`}
            disabled={!inputText.trim() || transcribing}
            id="chat-submit-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
