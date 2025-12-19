import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { BINANCE_LOGO_PATHS } from '../../types';

interface DirectorControlProps {
    stageRef: React.RefObject<HTMLDivElement | null>;
    ambientRef: React.RefObject<HTMLDivElement | null>;
    onNavigate: (direction: number) => void;
    onJump: (month: number, day: number) => void;
    onCinematicModeChange: (isCinematic: boolean) => void;
}

export interface DirectorHandle {
    play: () => void;
}

export const DirectorControl = forwardRef<DirectorHandle, DirectorControlProps>(({ stageRef, ambientRef, onJump, onCinematicModeChange }, ref) => {

    // Internal state for the loop
    const frameId = useRef<number>(0);
    const startTime = useRef<number>(0);

    // Visual State (Only Outro remains)
    const [showOutro, setShowOutro] = useState(false);
    const [outroOpacity, setOutroOpacity] = useState(0);

    const getCard = () => document.querySelector('.crystal-card') as HTMLElement;

    // Exposed Handle
    useImperativeHandle(ref, () => ({
        play: () => playLivingUI()
    }));

    const stop = (restoreUI = true) => {
        // Reset Visuals
        setShowOutro(false);
        setOutroOpacity(0);

        cancelAnimationFrame(frameId.current);

        if (stageRef.current) {
            stageRef.current.style.transform = 'translate3d(0,0,0) scale(1) rotateX(0) rotateY(0)';
            stageRef.current.style.opacity = '1';
        }
        const card = getCard();
        if (card) {
            card.style.setProperty('--mouse-x', '0%');
            card.style.setProperty('--mouse-y', '0%');
            card.style.transform = 'none';
            card.style.opacity = '1';
            card.style.filter = 'none';
            const left = card.querySelector('.absolute.left-0 > div') as HTMLElement;
            const right = card.querySelector('.absolute.right-0 > div') as HTMLElement;
            if (left) left.style.opacity = '0';
            if (right) right.style.opacity = '0';
        }
        if (ambientRef.current) ambientRef.current.style.opacity = '0';

        // Restore UI via State
        if (restoreUI) {
            onCinematicModeChange(false);
        }
    };

    const playLivingUI = () => {
        // Stop but DON'T restore UI yet (false)
        stop(false);

        // Toggle Cinematic Mode (Hides Text instantly via React)
        onCinematicModeChange(true);

        setTimeout(() => {
            startTime.current = performance.now();
            setShowOutro(true);
            setOutroOpacity(0);

            onJump(0, 1);
            let lastEventId = 0;
            let hasTriggeredSideFlash = false;
            if (ambientRef.current) ambientRef.current.style.opacity = '0';

            const loop = (time: number) => {
                const t = (time - startTime.current) / 1000;
                const card = getCard();
                if (!stageRef.current || !card || !ambientRef.current) return;

                // --- ANIMATION LOGIC (UNCHANGED) ---
                if (t <= 7) {
                    const p = t / 7;
                    const ease = easeInOutSine(p);
                    const scale = 1.6 - (0.25 * ease);
                    stageRef.current.style.opacity = `${Math.min(1, p * 1.5)}`;
                    stageRef.current.style.transform = `perspective(1000px) scale(${scale}) rotateX(${45 - 45 * ease}deg)`;
                    card.style.setProperty('--mouse-x', '-100%');
                }
                else if (t > 7 && t <= 12) {
                    const p = (t - 7) / 5;
                    const ease = easeInOutQuad(p);
                    stageRef.current.style.transform = `perspective(1000px) scale(1.35) rotateY(${-5 + 10 * ease}deg)`;
                    if (t > 9.5 && !hasTriggeredSideFlash) { TriggerSideFlashLogic(); hasTriggeredSideFlash = true; }
                    const lightX = -60 + (120 * ease);
                    card.style.setProperty('--mouse-x', `${lightX}%`); card.style.setProperty('--mouse-y', '20%');
                }
                else if (t > 12 && t <= 42) {
                    let targetEventId = lastEventId;
                    if (t >= 12 && t < 17) targetEventId = 2; else if (t >= 17 && t < 22) targetEventId = 3; else if (t >= 22 && t < 27) targetEventId = 4; else if (t >= 27 && t < 32) targetEventId = 5; else if (t >= 32) targetEventId = 6;
                    if (targetEventId !== lastEventId) { TriggerJumpLogic(targetEventId); lastEventId = targetEventId; }
                    if (targetEventId === 6) {
                        const ascP = (t - 32) / 10; const lift = -20 * ascP;
                        stageRef.current.style.transform = `perspective(1000px) scale(1.35) translateY(${lift}px)`;
                        if (t > 40) stageRef.current.style.opacity = `${1 - (t - 40) * 0.5}`;
                    } else {
                        const driftP = ((t - 12) % 5) / 5; const drift = targetEventId % 2 === 0 ? -8 + 16 * driftP : 8 - 16 * driftP;
                        stageRef.current.style.transform = `perspective(1200px) scale(1.35) rotateY(${drift}deg)`;
                    }
                }
                else if (t > 42 && t <= 50) { stageRef.current.style.opacity = '0'; const logoP = Math.min(1, (t - 42) / 2); setOutroOpacity(logoP); }
                else if (t > 50) { stop(); } // End

                frameId.current = requestAnimationFrame(loop);
            };
            frameId.current = requestAnimationFrame(loop);
        }, 100);
    };

    const TriggerSideFlashLogic = () => {
        const card = getCard(); if (!card) return; const right = card.querySelector('.absolute.right-0 > div') as HTMLElement;
        if (right) { right.style.transition = 'opacity 0.1s ease-out'; right.style.opacity = '1'; setTimeout(() => { right.style.opacity = '0'; }, 200); }
        soundEngine.playTrigger(); onJump(0, 4);
    };
    const TriggerJumpLogic = (id: number) => {
        if (id === 2) onJump(2, 12); if (id === 3) onJump(4, 20); if (id === 4) onJump(6, 14); if (id === 5) onJump(11, 15);
        if (id === 6) { onJump(11, 25); soundEngine.playShimmer(); TriggerFlashInternal(300); } else { TriggerFlashInternal(150); soundEngine.playLock(); }
    };
    const TriggerFlashInternal = (dur: number) => {
        const card = getCard(); if (card) { card.style.transition = 'filter 0.05s ease-out'; card.style.filter = 'brightness(2.5) contrast(0.5)'; setTimeout(() => { card.style.transition = 'filter 0.5s ease-out'; card.style.filter = 'none'; }, dur); }
    };
    const easeInOutSine = (x: number): number => -(Math.cos(Math.PI * x) - 1) / 2; const easeInOutQuad = (x: number): number => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

    return (
        <>
            {showOutro && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none" style={{ opacity: outroOpacity }}>
                    <div className="flex flex-col items-center transform scale-125 md:scale-100">
                        <svg className="w-[100px] h-[100px] mb-8 drop-shadow-[0_0_30px_rgba(240,185,11,0.6)]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <g className="fill-binance-yellow">{BINANCE_LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}</g>
                        </svg>
                        <div className="font-hei font-bold text-binance-yellow text-[32px] tracking-[0.4em] ml-2 drop-shadow-[0_0_20px_rgba(240,185,11,0.4)]">BINANCE</div>
                        <div className="w-[60px] h-[1.5px] bg-white/20 my-6"></div>
                        <div className="font-code font-light text-white/60 text-[14px] tracking-[0.6em] ml-2">2026 LUMINOUS</div>
                    </div>
                </div>
            )}
        </>
    );
});
