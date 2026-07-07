import React, { useState } from 'react';
import { useSaarthiStore } from '../store';
import { 
  User, 
  FileLock, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  LogOut, 
  QrCode, 
  Phone, 
  MapPin, 
  Lock, 
  KeyRound, 
  Sparkles,
  Info,
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileTab: React.FC = () => {
  const { 
    user, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle,
    quickLogin, 
    logoutUser, 
    uploadDocument, 
    deleteDocument, 
    stateTheme,
    activeState,
    loading,
    authError
  } = useSaarthiStore();

  const [isRegister, setIsRegister] = useState(false);
  
  // Auth Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  // e-Locker Upload Form inputs
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'Aadhaar' | 'PAN' | 'Ration Card' | 'Driving License'>('Aadhaar');
  const [docNum, setDocNum] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isRegister) {
      await registerWithEmail(email, password, fullName || "Citizen", phone || "+91 99999 99999", activeState, city || "District HQ");
    } else {
      await loginWithEmail(email, password);
    }
  };

  const handleDocUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !docNum.trim()) return;

    await uploadDocument(docName, docType, docNum);
    setDocName('');
    setDocNum('');
    setShowUploadForm(false);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-md mx-auto space-y-6 text-left">
      
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-black text-black uppercase tracking-tight flex items-center gap-2">
          <User className="w-5.5 h-5.5 text-black" />
          <span>My Civic Profile</span>
        </h2>
        <p className="text-xs text-gray-500 font-bold">Manage your secure digital identities and encrypted file vaults.</p>
      </div>

      {/* Profile Auth state routing */}
      {!user ? (
        <div className="bg-white border-2 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-[#D2E3FC] border-2 border-black rounded-2xl flex items-center justify-center text-black mx-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-black text-sm text-black uppercase tracking-tight pt-1">Secure Bharat Auth</h3>
            <p className="text-[11px] text-gray-500 font-bold">Verify your credentials to store documents or submit licensing petitions.</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div>
                  <label className="text-[9px] font-black uppercase text-black block mb-1">Full Legal Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Suresh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-black block mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      placeholder="+91 98765 01234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-black block mb-1">Local District / City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Karol Bagh"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Email ID</label>
              <input 
                type="email" 
                placeholder="suresh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-black uppercase text-black block mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                required
              />
            </div>

            {authError && (
              <div className="text-[10px] text-red-700 font-black bg-[#FAD2CF] p-2.5 rounded-lg border border-black">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-black text-white rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              id="submit-auth-btn"
            >
              {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Secure Login'}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-dashed border-black/30"></div>
              <span className="flex-shrink mx-3 text-[9px] font-black uppercase text-black/50">or</span>
              <div className="flex-grow border-t border-dashed border-black/30"></div>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full py-2.5 bg-white hover:bg-gray-50 text-black rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
              id="google-signin-btn"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.83 0 3.2 0.79 3.91 1.45l2.9-2.9C17 1.93 14.7 1 12 1 7.37 1 3.4 3.63 1.48 7.47l3.47 2.7C5.8 6.94 8.65 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.82-.07-1.61-.21-2.37H12v4.51h6.46c-.28 1.47-1.11 2.72-2.37 3.56l3.67 2.84c2.14-1.97 3.73-4.87 3.73-8.54z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.95 10.17c-.24-.73-.38-1.5-.38-2.3s.14-1.57.38-2.3L1.48 2.87C.54 4.75 0 6.84 0 9s.54 4.25 1.48 6.13l3.47-2.96z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.67-2.84c-1.02.68-2.33 1.09-4.29 1.09-3.35 0-6.2-1.9-7.21-5.13L1.32 16.17C3.24 20.37 7.21 23 12 23z"
                />
              </svg>
              <span>{loading ? 'Processing...' : 'Continue with Google'}</span>
            </button>
          </form>

          {/* Quick Sandbox Login buttons */}
          <div className="space-y-2.5 pt-3.5 border-t-2 border-black">
            <div className="text-[9px] font-black text-center text-gray-500 uppercase">Or test instantly using sandbox credentials</div>
            <button 
              onClick={quickLogin}
              className="w-full py-2 bg-[#FBBC05] text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1"
              id="sandbox-quick-login-btn"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Citizen Portal Entry</span>
            </button>

            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="w-full text-center text-[11px] font-black text-gray-500 hover:underline block uppercase tracking-tight"
            >
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 1. DIGITAL SAARTHI CIVIC CARD */}
          <div className="bg-white text-black rounded-3xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden select-none">
            {/* Hologram security grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 space-y-5">
              <div className="flex justify-between items-center border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#D2E3FC] border-2 border-black flex items-center justify-center text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    <ShieldCheck className="w-5 h-5 text-black" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black tracking-widest text-black uppercase leading-none">Government of India</div>
                    <div className="text-xs font-black tracking-tight mt-0.5 text-black uppercase">Saarthi Citizen ID</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[#CEEAD6] border border-black px-2 py-0.5 rounded text-black text-[8px] font-black uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse mr-0.5" />
                  <span>Verified</span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* Photo Placeholder */}
                <div className="w-16 h-20 bg-[#FEEFC3] rounded-xl border-2 border-black flex flex-col items-center justify-center relative shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] shrink-0 overflow-hidden">
                  <User className="w-8 h-8 text-black/50" />
                  <div className="absolute bottom-0 inset-x-0 bg-[#FBBC05] text-[7px] text-black py-0.5 font-black uppercase tracking-wider text-center border-t border-black">Saarthi</div>
                </div>

                {/* Details list */}
                <div className="flex-1 text-xs space-y-2 text-left">
                  <div>
                    <span className="text-[8px] uppercase font-black text-gray-500 block leading-none">Legal Citizen Name</span>
                    <span className="font-black text-sm text-black tracking-tight leading-normal uppercase">{user.fullName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[8px] uppercase font-black text-gray-500 block leading-none">State</span>
                      <span className="font-black text-black text-[11px] leading-normal">{user.state}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-black text-gray-500 block leading-none">Phone</span>
                      <span className="font-black text-black text-[11px] leading-normal">{user.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <div>
                      <span className="text-[8px] uppercase font-black text-gray-500 block leading-none">Aadhaar Pin</span>
                      <span className="font-mono text-black font-bold text-[11px] leading-normal">XXXX-XXXX-{user.aadhaarLastFour}</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-black text-gray-500 block leading-none">Digital Card ID</span>
                      <span className="font-mono text-[#4285F4] font-black text-[9px] leading-normal">{user.digitalCardId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code and digital seal footer */}
              <div className="border-t-2 border-black pt-3 flex justify-between items-center">
                <div className="text-[8px] text-gray-500 font-bold leading-relaxed max-w-[200px]">
                  Encrypted using SHA-256 state ledger algorithms. Integrated with DigiLocker & National Health Authority systems.
                </div>
                
                {/* Visual QR Code mock block */}
                <div className="w-10 h-10 bg-[#E8F0FE] rounded-lg p-1 border-2 border-black shrink-0 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  <QrCode className="w-8 h-8 text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. SECURE E-LOCKER DOCUMENTS SECTION */}
          <div className="bg-white p-5 rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#D2E3FC] border-2 border-black flex items-center justify-center text-black">
                  <FileLock className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-xs uppercase tracking-wider text-black">My Secured e-Locker</h3>
                  <p className="text-[10px] text-gray-500 font-bold">DigiLocker-compliant cloud identity safe.</p>
                </div>
              </div>

              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="p-2 bg-[#4285F4] text-white rounded-xl border-2 border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1"
                id="toggle-upload-form-btn"
              >
                {showUploadForm ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{showUploadForm ? 'Cancel' : 'Load File'}</span>
              </button>
            </div>

            {/* Document upload form drawer */}
            <AnimatePresence>
              {showUploadForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#FEEFC3] p-4 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-3"
                >
                  <div className="font-black text-[10px] uppercase text-black">Vault Upload Form:</div>
                  
                  <form onSubmit={handleDocUploadSubmit} className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-black block mb-0.5">Custom Document Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Suresh Kumar Driving License"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                        required
                        id="document-name-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[9px] font-black uppercase text-black block mb-0.5">Identity Class</label>
                        <select 
                          value={docType} 
                          onChange={(e: any) => setDocType(e.target.value)}
                          className="w-full bg-white border-2 border-black rounded-xl px-2 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <option value="Aadhaar">Aadhaar Card</option>
                          <option value="PAN">PAN Card</option>
                          <option value="Ration Card">Ration Card</option>
                          <option value="Driving License">Driving License</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-black uppercase text-black block mb-0.5">Card Number / ID No.</label>
                        <input 
                          type="text" 
                          placeholder="e.g. DL-12202300054"
                          value={docNum}
                          onChange={(e) => setDocNum(e.target.value)}
                          className="w-full bg-white border-2 border-black rounded-xl px-2.5 py-1.5 text-xs font-black text-black focus:outline-none focus:bg-[#E8F0FE] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                          required
                          id="document-number-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-black text-white rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 hover:bg-gray-900 transition-colors"
                      id="document-upload-btn"
                    >
                      Verify & Securely Encrypt File
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* List of uploaded documents */}
            <div className="space-y-3">
              {user.savedDocuments && user.savedDocuments.length > 0 ? (
                user.savedDocuments.map((doc) => (
                  <div key={doc.id} className="border-2 border-black/10 hover:border-black/30 bg-gray-50/50 p-3.5 rounded-xl flex items-center justify-between transition-all text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-xl bg-white border border-black/20 flex items-center justify-center text-black shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <FolderOpen className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-black leading-snug">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] bg-[#D2E3FC] text-black border border-black px-1.5 rounded font-black uppercase tracking-wider">{doc.type}</span>
                          <span className="text-[10px] font-mono text-gray-500 font-bold">{doc.docNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[8px] bg-[#CEEAD6] text-black border border-black font-black px-2 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Verified</span>
                      </span>

                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50/50 rounded-2xl text-gray-500 text-xs font-bold border-2 border-dashed border-black/20 space-y-1.5 p-4">
                  <p>Your e-Locker vault is currently empty.</p>
                  <p className="text-[10px] text-gray-400">Loading your Aadhaar Card or PAN card allows Saarthi AI to automatically pre-fill your applications and scheme matching forms instantly!</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile controls and info footer */}
          <div className="bg-[#FAD2CF] p-4 rounded-3xl border-2 border-black flex justify-between items-center select-none text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-black uppercase">
              <ShieldCheck className="w-5 h-5 text-black" />
              <span>Security: Active</span>
            </div>
            
            <button
              onClick={logoutUser}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#EA4335] text-white rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
              id="logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

    </div>
  );
};
