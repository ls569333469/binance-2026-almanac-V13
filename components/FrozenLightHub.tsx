import React, { useState, useEffect } from 'react';
import { Camera, Settings, Scan, Minimize2, Play } from 'lucide-react';
import { Mood } from '../types';

interface FrozenLightHubProps {
  currentMood: Mood;
  month: number;
  day: number;
  onPlayCinematic?: () => void;
}

export const FrozenLightHub: React.FC<FrozenLightHubProps> = ({ currentMood, month, day, onPlayCinematic }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('就绪 (READY)');
  const [calibrationMode, setCalibrationMode] = useState(false);

  /**
   * ===========================================================================
   * ENGINE UPDATE (V29): SERVER-SIDE CONVERGENCE
   * Now triggers 'Engine B' (Puppeteer) via API for 100% Quality Match.
   * ===========================================================================
   */
  const performOpticalCapture = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatus('云端渲染中 (RENDERING)...'); // RENDERING

    try {
      // Trigger Server API & Download Stream
      const res = await fetch('/api/batch/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, day })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.download = `Binance_Almanac_Server_${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setStatus('下载完成 (DOWNLOADED)');
      } else {
        throw new Error('Server returned failure');
      }

    } catch (error) {
      console.error('Server Capture failed', error);
      setStatus('失败 (FAILED)');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatus('就绪 (READY)'), 3000);
    }
  };

  const getMoodColor = () => {
    switch (currentMood) {
      case 'CRISIS': return '#ef4444';
      case 'FUTURE': return '#22d3ee';
      case 'GLORY': default: return '#F0B90B';
    }
  };

  const moodColor = getMoodColor();

  // Auto-Hide Logic: Visible if Hovered, Processing, or Admin Mode
  const isVisible = isProcessing || calibrationMode;

  return (
    <div className={`fixed bottom-10 right-10 z-[9999] font-code flex flex-col items-end gap-3 hide-on-capture transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>

      {/* STATUS INDICATOR (Mini) */}
      <div
        className={`text-[9px] tracking-[2px] bg-black/90 px-3 py-1 rounded border backdrop-blur-md transition-all duration-300 ${status === '就绪 (READY)' ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}
        style={{ borderColor: `${moodColor}40`, color: moodColor }}
      >
        :: {status} ::
      </div>

      {/* === RESTORED: BATCH CONTROL PANEL (Admin Mode) === */}
      {calibrationMode && (
        <div className="bg-[#111]/95 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-2xl w-[200px] animate-in fade-in slide-in-from-bottom-4 mb-2">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <span className="text-[10px] text-white/50 tracking-widest uppercase">Batch Control</span>
            <button onClick={() => setCalibrationMode(false)} className="text-white/30 hover:text-white"><Minimize2 size={12} /></button>
          </div>

          <div className="flex gap-2 mb-3">
            <button
              onClick={async () => { await fetch('/api/batch/start', { method: 'POST' }); }}
              className="flex-1 bg-binance-yellow/10 hover:bg-binance-yellow/20 text-binance-yellow border border-binance-yellow/30 rounded px-2 py-1.5 text-[10px] uppercase font-bold transition-colors"
            >
              启动 (START)
            </button>
            <button
              onClick={async () => { await fetch('/api/batch/stop', { method: 'POST' }); }}
              className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-500/30 rounded px-2 py-1.5 text-[10px] uppercase font-bold transition-colors"
            >
              停止 (STOP)
            </button>
          </div>

          <StatusPoller />
        </div>
      )}

      {/* === CONTROL CAPSULE (DESIGNER LAYOUT V4: MINI DOCK) === */}
      <div className="flex flex-col items-center gap-2 p-1.5 rounded-full bg-[#0a0a0a]/80 backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-300 hover:border-white/20 hover:bg-[#0a0a0a]/90">

        {/* === BUTTON 1: DIRECTOR (CINEMATIC) === */}
        {onPlayCinematic && (
          <button
            onClick={onPlayCinematic}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-binance-yellow/20 hover:text-binance-yellow text-white/40 transition-all duration-300"
            title="Play Cinematic"
          >
            <Play size={14} className="fill-current" />

            {/* Tooltip (Left) */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-binance-yellow text-[9px] px-2 py-0.5 rounded border border-binance-yellow/20 whitespace-nowrap pointer-events-none tracking-widest uppercase scale-90 origin-right">
              Play
            </div>
          </button>
        )}

        {/* Separator - Subtle */}
        {onPlayCinematic && <div className="w-3 h-[1px] bg-white/5"></div>}

        {/* === BUTTON 2: SNAPSHOT (ENGINE B - Single) === */}
        <div className="relative group">
          {/* Glow Halo - Minimal */}
          <div className="absolute inset-0 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `${moodColor}40` }}></div>

          <button
            onClick={performOpticalCapture}
            disabled={isProcessing}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all duration-300 active:scale-95 shadow-sm"
            style={{ boxShadow: isProcessing ? `0 0 10px ${moodColor}40` : 'none' }}
          >
            {isProcessing ? (
              <Scan size={14} className="animate-spin-slow" />
            ) : (
              <Camera size={14} />
            )}
          </button>
        </div>

        {/* === BUTTON 3: SETTINGS (BATCH) - Micro === */}
        <button
          onClick={() => setCalibrationMode(!calibrationMode)}
          className="group relative flex items-center justify-center w-6 h-6 rounded-full text-white/10 hover:text-white/60 transition-all duration-300"
          title="Batch Controls"
        >
          <Settings size={10} />
        </button>

      </div>

    </div>
  );
};

// Helper Component for Polling Status
const StatusPoller: React.FC = () => {
  const [status, setStatus] = useState('Checking...');

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/batch/status');
        const data = await res.json();
        let cnStatus = 'OFFLINE';
        if (data.status === 'RUNNING') cnStatus = 'RUNNING';
        else if (data.status === 'IDLE') cnStatus = 'IDLE';
        else if (data.status === 'STARTED') cnStatus = 'STARTING';
        else if (data.status === 'STOPPED') cnStatus = 'STOPPED';
        setStatus(cnStatus);
      } catch (e) {
        setStatus('OFFLINE');
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-[9px] text-center font-code flex items-center justify-center gap-1.5 p-1 bg-black/40 rounded border border-white/5">
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'RUNNING' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
      <span className={status === 'RUNNING' ? 'text-green-500' : 'text-white/30'}>{status}</span>
    </div>
  );
};
