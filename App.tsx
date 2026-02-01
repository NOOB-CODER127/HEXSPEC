
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalOutput } from './components/TerminalOutput';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { FileSignature, AnalysisResult, TerminalLog } from './types';
import { FILE_SIGNATURES } from './constants';
import { analyzeFileSecurity } from './services/geminiService';

const App: React.FC = () => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'web' | 'cli'>('web');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((message: string, type: TerminalLog['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      message
    }]);
  }, []);

  useEffect(() => {
    addLog("HexSpec v2.4.0 (Forensic Edition) Initializing...", "system");
    setTimeout(() => {
      addLog("Local signature database loaded: " + FILE_SIGNATURES.length + " markers.", "info");
      addLog("Gemini Intelligence Engine: Standby.", "info");
      addLog("Ready for payload ingestion. Drop a file or click below.", "warning");
    }, 800);
  }, [addLog]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResult(null);
    setIsAnalyzing(true);
    addLog(`Ingesting: ${file.name} (${file.size} bytes)`, "info");

    try {
      const buffer = await file.arrayBuffer();
      const header = new Uint8Array(buffer.slice(0, 32));
      const hexPreview = Array.from(header).map(b => b.toString(16).toUpperCase().padStart(2, '0'));
      
      addLog("Calculating hex signature...", "info");
      
      let match: FileSignature | null = null;
      for (const sig of FILE_SIGNATURES) {
        const fileSigPart = hexPreview.slice(sig.offset, sig.offset + sig.hex.length);
        if (fileSigPart.join('') === sig.hex.join('')) {
          match = sig;
          break;
        }
      }

      const detectedExt = match?.extension || 'bin';
      const actualExt = file.name.split('.').pop()?.toLowerCase();
      
      if (match) {
        addLog(`Match found: ${match.description} (.${match.extension})`, "success");
      } else {
        addLog("No signature match. Generic binary blob detected.", "warning");
      }

      if (actualExt && actualExt !== detectedExt && match) {
        addLog(`ALERT: Extension mismatch detected! (Declared: .${actualExt}, Reality: .${detectedExt})`, "error");
      }

      addLog("Querying Gemini Intelligence Engine for security heuristics...", "info");
      
      const intel = await analyzeFileSecurity(
        file.name,
        match?.description || "Unknown Binary",
        hexPreview.slice(0, 16),
        file.size
      );

      let threatLevel: AnalysisResult['threatLevel'] = 'Low';
      if (actualExt && actualExt !== detectedExt && match) threatLevel = 'High';
      if (match?.category === 'executable') threatLevel = 'Medium';
      if (intel.toLowerCase().includes('exploit') || intel.toLowerCase().includes('malicious') || intel.toLowerCase().includes('attack')) threatLevel = 'Critical';

      setResult({
        fileName: file.name,
        fileSize: file.size,
        detectedType: match?.description || "Generic Binary Data",
        detectedExtension: detectedExt,
        hexPreview: hexPreview.slice(0, 16),
        signatureMatch: match,
        securityIntel: intel,
        threatLevel
      });

      addLog("Analysis sequence complete.", "success");
    } catch (err) {
      addLog("Fatal error during processing: " + (err as Error).message, "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearTerminal = () => {
    setLogs([]);
    setResult(null);
    addLog("Terminal state flushed.", "system");
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-green-900/50 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center text-black shadow-[0_0_15px_rgba(74,222,128,0.5)]">
            <i className="fas fa-ghost text-xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">HexSpec</h1>
            <p className="text-[10px] text-green-500 uppercase font-bold tracking-widest">Forensic Identification Matrix</p>
          </div>
        </div>
        
        <div className="flex bg-black border border-green-900/50 rounded p-1">
          <button 
            onClick={() => setActiveTab('web')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'web' ? 'bg-green-600 text-black shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'text-green-500 hover:bg-green-900/20'}`}
          >
            WEB CONSOLE
          </button>
          <button 
            onClick={() => setActiveTab('cli')}
            className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'cli' ? 'bg-green-600 text-black shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'text-green-500 hover:bg-green-900/20'}`}
          >
            PYTHON CLI (LINUX)
          </button>
        </div>
      </div>

      {activeTab === 'web' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 h-[70vh]">
          {/* Main Console Area */}
          <div className={`
            ${result ? 'lg:col-span-4' : 'lg:col-span-12'} 
            bg-black/90 border border-green-900/30 rounded flex flex-col relative transition-all duration-500
          `}>
            <div className="absolute top-2 right-4 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            
            <TerminalOutput logs={logs} />
            <div ref={terminalEndRef} />

            <div className="p-4 border-t border-green-900/30 flex items-center gap-4 bg-gray-950">
              <span className="text-green-500 font-bold">$</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className={`
                  flex-1 text-left px-2 py-1 text-sm outline-none bg-transparent 
                  ${isAnalyzing ? 'text-gray-600 cursor-not-allowed' : 'text-green-400 hover:bg-green-900/10 cursor-pointer'}
                `}
              >
                {isAnalyzing ? "SCANNING_IN_PROGRESS..." : "upload_payload --target"}
              </button>
              <button onClick={clearTerminal} className="text-gray-600 hover:text-red-500 text-xs uppercase font-bold transition-colors">Flush</button>
            </div>
          </div>

          {result && (
            <div className="lg:col-span-8 animate-in slide-in-from-right duration-500">
              <AnalysisDisplay result={result} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 bg-black border border-green-900/30 rounded p-6 overflow-y-auto terminal-scrollbar flex flex-col items-center">
          <div className="max-w-3xl w-full space-y-6">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-3 uppercase tracking-widest glitch-text">
              <i className="fab fa-python"></i> Linux Terminal Tool (CLI)
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              For native forensic analysis, use our standalone Python script. 
              Restricted strictly to <span className="text-green-500 font-bold">Linux</span> environments to leverage 
              standard Unix execution and ELF detection mechanisms.
            </p>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-green-900/20 font-mono text-sm">
              <div className="flex justify-between items-center mb-4 text-xs text-green-700 uppercase font-bold border-b border-green-900/20 pb-2">
                <span>Setup Guide</span>
                <span className="bg-green-900/20 px-2 py-0.5 rounded">bash</span>
              </div>
              <pre className="text-green-500 overflow-x-auto whitespace-pre">
{`# 1. Download/Copy the hexspec.py source
# 2. Grant execution permissions:
chmod +x hexspec.py

# 3. Usage:
./hexspec.py <path_to_malicious_file>`}
              </pre>
            </div>

            <div className="bg-gray-950 p-6 rounded border border-green-900/40 relative group">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="text-[10px] text-green-700 uppercase font-bold">Linux Only</span>
                    <i className="fab fa-linux text-green-500"></i>
                </div>
                <h3 className="text-green-400 text-sm font-bold uppercase mb-4">CLI Architecture</h3>
                <ul className="text-gray-400 text-xs space-y-3 font-mono">
                    <li className="flex gap-2">
                        <span className="text-green-500">>></span> 
                        <span>Strict Platform Enforcement (sys.platform)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500">>></span> 
                        <span>Direct Binary Buffer Access (rb mode)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500">>></span> 
                        <span>Extension Spoofing Detection Logic</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-500">>></span> 
                        <span>Integrated MITRE & OWASP Resource Links</span>
                    </li>
                </ul>
                <div className="mt-8 p-4 bg-green-900/10 border border-green-900/30 rounded text-center">
                    <p className="text-green-500 text-xs font-bold uppercase">Source code available in project root: hexspec.py</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer / Resources */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'OWASP WebGoat', url: 'https://owasp.org/www-project-webgoat/', icon: 'fa-shield-halved' },
          { label: 'HackTheBox', url: 'https://www.hackthebox.com/', icon: 'fa-cube' },
          { label: 'TryHackMe', url: 'https://tryhackme.com/', icon: 'fa-bullseye' },
          { label: 'MITRE ATT&CK', url: 'https://attack.mitre.org/', icon: 'fa-spider' }
        ].map((res) => (
          <a 
            key={res.label}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-900/40 border border-gray-800 hover:border-green-600/50 hover:bg-gray-800 transition-all rounded group"
          >
            <i className={`fas ${res.icon} text-green-500 text-xs group-hover:scale-125 transition-transform`}></i>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">{res.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default App;
