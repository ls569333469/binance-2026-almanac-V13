import React, { useState, useEffect } from 'react';
import { Camera, Aperture, Eye, EyeOff, Lock, MonitorUp } from 'lucide-react';

/**
 * =============================================================================
 *  ADMIN SNAPSHOT HUB (The Optical Studio)
 *  -----------------------------------------------------------------------------
 *  A pro-grade tool that uses the browser's Screen Capture API to generate
 *  100% fidelity assets. It captures exactly what the GPU renders.
 *  
 *  Access methods:
 *  1. URL parameter: ?mode=admin_capture
 *  2. Keyboard Shortcut: Ctrl + Shift + X
 * =============================================================================
 */

export const AdminSnapshotHub: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCleanMode, setIsCleanMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string>('READY');

  // 1. Authorization Check
  useEffect(() => {
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin_capture') activateAdminMode();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        toggleAuthorization();
      }
    };

    checkUrlParams();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('admin-clean-mode');
    };
  }, []);

  const activateAdminMode = () => {
    setIsAuthorized(true);
    injectCleanModeStyles();
  };

  const toggleAuthorization = () => {
    setIsAuthorized(prev => {
      const newState = !prev;
      if (newState) injectCleanModeStyles();
      else {
        document.body.classList.remove('admin-clean-mode');
        setIsCleanMode(false);
      }
      return newState;
    });
  };

  const injectCleanModeStyles = () => {
    if (document.getElementById('admin-clean-mode-styles')) return;
    const style = document.createElement('style');
    style.id = 'admin-clean-mode-styles';
    // Style for the "Clean Mode" toggle button (just hides navigational elements visually)
    style.innerHTML = `
      body.admin-clean-mode div[class*="rounded-l-[32px]"],
      body.admin-clean-mode div[class*="rounded-r-[32px]"],
      body.admin-clean-mode .hide-on-capture {
        opacity: 0 !important;
        pointer-events: none !important;
        transition: opacity 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  };

  const toggleCleanMode = () => {
    setIsCleanMode(!isCleanMode);
    document.body.classList.toggle('admin-clean-mode');
  };

  /**
   * ===========================================================================
   * CORE ENGINE: OPTICAL SCREEN CAPTURE
   * Uses navigator.mediaDevices.getDisplayMedia to grab the GPU buffer.
   * ===========================================================================
   */
  const performOpticalCapture = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setStatus('INIT OPTICAL...');

    try {
      // 1. Enter Studio Mode (Hide UI, Cursor, Scrollbars)
      document.body.classList.add('capture-mode');
      
      // Wait for UI transitions to finish
      await new Promise(resolve => setTimeout(resolve, 300));

      // 2. Request Screen Share (User selects "This Tab")
      setStatus('SELECT TAB...');
      let stream: MediaStream;
      try {
        // @ts-ignore - TS doesn't fully know getDisplayMedia constraints yet
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "browser", // Prefer browser tab
            width: { ideal: 3840 }, // Request 4K if available
            height: { ideal: 2160 },
            frameRate: { ideal: 1 } // We only need 1 frame
          },
          audio: false,
          selfBrowserSurface: "include", // Allow capturing current tab
          preferCurrentTab: true // Experimental hint
        } as any);
      } catch (err) {
        // User cancelled or not supported
        document.body.classList.remove('capture-mode');
        setStatus('CANCELLED');
        setIsProcessing(false);
        setTimeout(() => setStatus('READY'), 2000);
        return;
      }

      setStatus('CAPTURING...');
      
      // 3. Extract Frame from Stream
      const track = stream.getVideoTracks()[0];
      // Create a video element to play the stream so we can draw it
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });
      // Small buffer to ensure first frame is fully rendered (sometimes it fades in)
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // 4. Draw to Canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context failed');

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 5. Cleanup
      track.stop();
      video.remove();
      document.body.classList.remove('capture-mode');

      // 6. Download
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const link = document.createElement('a');
      link.download = `Binance_Almanac_Optical_${timestamp}.png`;
      link.href = dataUrl;
      link.click();

      setStatus('SUCCESS');
      setTimeout(() => setStatus('READY'), 2000);

    } catch (error) {
      console.error('Optical capture failed:', error);
      document.body.classList.remove('capture-mode');
      setStatus('ERROR');
      setTimeout(() => setStatus('READY'), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 font-code hide-on-capture">
      
      {/* Status Monitor */}
      <div className="text-[10px] text-binance-yellow tracking-[2px] bg-black/80 px-2 py-1 rounded border border-binance-yellow/30 backdrop-blur-md">
        :: OPTICAL_ENGINE :: {status}
      </div>

      {/* Dock */}
      <div className="flex items-center gap-2 p-2 bg-[#151921]/90 border border-white/10 rounded-xl backdrop-blur-xl shadow-2xl">
        
        {/* Toggle Clean Mode (Preview) */}
        <button 
          onClick={toggleCleanMode}
          className={`p-3 rounded-lg transition-all duration-300 ${isCleanMode ? 'bg-binance-yellow text-black' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          title="Preview Clean Mode"
        >
          {isCleanMode ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        <div className="w-[1px] h-[24px] bg-white/10 mx-1"></div>

        {/* Optical Capture Action */}
        <button 
          onClick={performOpticalCapture}
          disabled={isProcessing}
          className="group flex items-center gap-2 p-3 bg-white/5 text-white hover:bg-binance-yellow hover:text-black rounded-lg transition-all duration-300 disabled:opacity-50"
          title="Optical Screen Capture (100% Fidelity)"
        >
          <Aperture size={20} className={isProcessing ? "animate-spin" : ""} />
          <span className="text-[12px] font-bold tracking-widest hidden group-hover:block transition-all">CAPTURE_GPU</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-widest mt-1">
        <MonitorUp size={10} />
        <span>WYSIWYG Mode Active</span>
      </div>
    </div>
  );
};