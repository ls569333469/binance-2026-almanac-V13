import React, { useState, useEffect } from 'react';
import { Camera, Settings, Scan, Minimize2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Mood } from '../types';

interface FrozenLightHubProps {
  currentMood: Mood;
}

interface CropPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * =============================================================================
 *  PROJECT: FROZEN LIGHT (影像冻结协议)
 *  -----------------------------------------------------------------------------
 *  Double-Engine Export System for Binance 2026 Almanac.
 *  
 *  Engine A: Instant Snapshot (Web) - Uses html-to-image (No Popups)
 *  Engine B: Batch Book Generator (Node) - Uses Puppeteer (External)
 * =============================================================================
 */

export const FrozenLightHub: React.FC<FrozenLightHubProps> = ({ currentMood }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('就绪 (READY)');
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [padding, setPadding] = useState<CropPadding>({ top: 40, right: 40, bottom: 40, left: 40 });

  // Load calibration from local storage
  useEffect(() => {
    const saved = localStorage.getItem('FROZEN_CROP_CONFIG');
    if (saved) {
      try {
        setPadding(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load crop config', e);
      }
    }
  }, []);

  const savePadding = (newPadding: CropPadding) => {
    setPadding(newPadding);
    localStorage.setItem('FROZEN_CROP_CONFIG', JSON.stringify(newPadding));
  };

  /**
   * ===========================================================================
   * CORE ENGINE A: INSTANT SNAPSHOT (html-to-image)
   * ===========================================================================
   */
  const performOpticalCapture = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatus('生成影像中...'); // GENERATING...

    try {
      const card = document.querySelector('.crystal-card') as HTMLElement;
      if (!card) throw new Error('Crystal Card not found');

      // 1. Capture
      // 3x Pixel Ratio for "Retina" Quality (approx 4K equivalent for mobile size)
      const dataUrl = await toPng(card, {
        cacheBust: true,
        pixelRatio: 3,
        style: {
          // Ensure it looks clean during capture
          transform: 'scale(1)',
          margin: '0'
        }
      });

      // 2. Download
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      link.download = `Binance_Almanac_${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      setStatus('捕获成功'); // SUCCESS

    } catch (error) {
      console.error('Snapshot failed', error);
      setStatus('失败'); // FAILED
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatus('就绪 (READY)'), 2000);
    }
  };

  /**
   * ===========================================================================
   * UI: MOOD ENGINE & INTERACTION
   * ===========================================================================
   */
  const getMoodColor = () => {
    switch (currentMood) {
      case 'CRISIS': return '#ef4444'; // Red-500
      case 'FUTURE': return '#22d3ee'; // Cyan-400
      case 'GLORY':
      default: return '#F0B90B'; // Binance Yellow
    }
  };

  const moodColor = getMoodColor();

  return (
    <div className="fixed bottom-10 right-10 z-[9999] font-code flex flex-col items-end gap-4 hide-on-capture">

      {/* 1. STATUS INDICATOR */}
      <div
        className={`text-[10px] tracking-[2px] bg-black/90 px-3 py-1.5 rounded border backdrop-blur-md transition-all duration-300 ${status === '就绪 (READY)' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
        style={{ borderColor: `${moodColor}40`, color: moodColor }}
      >
        :: {status} ::
      </div>

      {/* 2. CALIBRATION PANEL (Admin Mode) */}
      {calibrationMode && (
        <div className="bg-[#111]/95 border border-white/10 rounded-xl p-4 backdrop-blur-xl shadow-2xl w-[200px] animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
            <span className="text-[10px] text-white/50 tracking-widest uppercase">校准模式 (Calibration)</span>
            <button onClick={() => setCalibrationMode(false)} className="text-white/30 hover:text-white"><Minimize2 size={12} /></button>
          </div>

          <div className="text-[10px] text-white/50 mb-2 italic">
            注：快速截图模式(Engine A)不需要校准，它会自动捕获卡片本身。以下设置仅供参考。
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-white/70 opacity-50 pointer-events-none">
            {Object.entries(padding).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="uppercase opacity-50 text-[9px]">{key}</label>
                <div className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
                  <input
                    type="number"
                    value={val}
                    readOnly
                    className="bg-transparent w-full outline-none text-right font-bold"
                  />
                  <span className="text-white/20">px</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <h4 className="text-[9px] text-white/50 tracking-widest uppercase mb-2">Engine B (批量引擎)</h4>

            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await fetch('/api/batch/start', { method: 'POST' });
                }}
                className="flex-1 bg-binance-yellow/10 hover:bg-binance-yellow/20 text-binance-yellow border border-binance-yellow/30 rounded px-2 py-1.5 text-[10px] uppercase font-bold transition-colors"
              >
                启动
              </button>

              <button
                onClick={async () => {
                  await fetch('/api/batch/stop', { method: 'POST' });
                }}
                className="flex-1 bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-500/30 rounded px-2 py-1.5 text-[10px] uppercase font-bold transition-colors"
              >
                停止
              </button>
            </div>
            {/* Simple Status Polling Debug */}
            <StatusPoller />
          </div>
        </div>
      )}

      {/* 3. THE INVISIBLE TRIGGER (Invisible Style) */}
      <div className="relative group">

        {/* Glow Halo (Only on Hover) */}
        <div
          className="absolute inset-0 rounded-full blur-xl transition-all duration-500 opacity-0 group-hover:opacity-40"
          style={{ background: moodColor, transform: 'scale(1.5)' }}
        />

        {/* Setup Gear (Admin Entry) */}
        <button
          onClick={() => setCalibrationMode(!calibrationMode)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/20 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          title="打开设置"
        >
          <Settings size={14} />
        </button>

        {/* Main Button */}
        <button
          onClick={performOpticalCapture}
          disabled={isProcessing}
          className="relative flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-[2px] transition-all duration-300 group-hover:scale-110 group-hover:bg-black/50 group-hover:border-white/30 active:scale-90"
          style={{
            boxShadow: `0 0 0 0px ${moodColor}00`,
          }}
        >
          {isProcessing ? (
            <Scan size={20} className="text-white animate-spin-slow" />
          ) : (
            <Camera size={20} className="text-white/60 group-hover:text-white transition-colors" />
          )}

          {/* Hover Ring Animation */}
          <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/20 group-hover:animate-ping-slow pointer-events-none"></div>
        </button>
      </div>

    </div>
  );
};

// Helper Component for Polling Status
const StatusPoller: React.FC = () => {
  const [status, setStatus] = useState('检查中...');

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/batch/status');
        const data = await res.json();
        // Translate status
        let cnStatus = '离线';
        if (data.status === 'RUNNING') cnStatus = '运行中';
        else if (data.status === 'IDLE') cnStatus = '待机';
        else if (data.status === 'STARTED') cnStatus = '已启动';
        else if (data.status === 'STOPPED') cnStatus = '已停止';
        setStatus(cnStatus);
      } catch (e) {
        setStatus('离线');
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-2 text-[9px] text-center font-code flex items-center justify-center gap-1.5">
      <div className={`w-1.5 h-1.5 rounded-full ${status === '运行中' ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`}></div>
      <span className={status === '运行中' ? 'text-green-500' : 'text-white/30'}>{status}</span>
    </div>
  );
};