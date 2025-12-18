
import React, { useState, useEffect, useCallback } from 'react';
import { CrystalCard } from './components/CrystalCard';
import { getAlmanacDataSync } from './services/geminiService';
import { AlmanacEvent } from './types';
import { soundEngine } from './services/soundEngine';
import { FrozenLightHub } from './components/FrozenLightHub';

const App: React.FC = () => {
  // 1. 初始化日期：优先从 URL 读取 (?month=0&day=1)，否则默认为 2026-01-01
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const params = new URLSearchParams(window.location.search);
    const m = parseInt(params.get('month') || '0', 10);
    const d = parseInt(params.get('day') || '1', 10);
    // basic validation
    if (!isNaN(m) && !isNaN(d) && m >= 0 && m <= 11 && d >= 1 && d <= 31) {
      return new Date(2026, m, d);
    }
    return new Date(2026, 0, 1);
  });

  // 使用同步方法直接初始化数据，避免首屏 null 状态
  const [eventData, setEventData] = useState<AlmanacEvent>(() => getAlmanacDataSync(currentDate));

  // 状态控制：导航锁与视觉过渡状态
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // 初始化音效引擎
  useEffect(() => {
    const initAudio = () => {
      soundEngine.init();
      soundEngine.resume(); // Ensure context is running on user interaction
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };

    window.addEventListener('click', initAudio);
    window.addEventListener('keydown', initAudio);

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('keydown', initAudio);
    };
  }, []);

  // 核心导航函数：处理数据更新和视觉过渡
  const performNavigation = useCallback((newDate: Date) => {
    // 1. 锁定导航，防止动画中途重复点击
    setIsNavigating(true);

    // 2. 触发进场动画 (The Vanishing)
    // 设置为 true 后，CrystalCard 会添加 .animating 类，触发 CSS 中的模糊和流光
    setIsTransitioning(true);

    // 3. 数据交换阶段 (The Swap) - 极速响应调优
    // 在 250ms 时（视觉模糊达到峰值），瞬间替换数据
    setTimeout(() => {
      setEventData(getAlmanacDataSync(newDate));
      setCurrentDate(newDate);

      // Update URL without reloading (optional, helps with bookmarking but mostly for consistency)
      const url = new URL(window.location.href);
      url.searchParams.set('month', newDate.getMonth().toString());
      url.searchParams.set('day', newDate.getDate().toString());
      window.history.replaceState({}, '', url);

    }, 250);

    // 4. 触发出场动画 (The Reveal)
    // 在 600ms 时（流光刚刚扫完），移除模糊，完成交互
    setTimeout(() => {
      setIsTransitioning(false); // 移除 .animating 类
      setIsNavigating(false);    // 解锁点击
    }, 600);
  }, []);

  // 边缘点击导航
  const navigateDay = useCallback((direction: number) => {
    if (isNavigating) return;

    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);

    // 保持年份在 2026
    if (newDate.getFullYear() !== 2026) {
      newDate.setFullYear(2026);
      if (direction > 0) newDate.setMonth(0, 1); // 循环到年初
      else newDate.setMonth(11, 31); // 循环到年尾
    }

    performNavigation(newDate);
  }, [currentDate, isNavigating, performNavigation]);

  // 全息跳转
  const handleJump = useCallback((monthIndex: number, day: number) => {
    const newDate = new Date(2026, monthIndex, day);
    // 跳转不需要 performNavigation 的流光过渡，因为 CrystalCard 内部有 FlashBang (白屏闪光) 遮罩
    setCurrentDate(newDate);
    setEventData(getAlmanacDataSync(newDate));

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('month', monthIndex.toString());
    url.searchParams.set('day', day.toString());
    window.history.replaceState({}, '', url);
  }, []);

  // 滚轮监听
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isNavigating) return; // 节流

      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) navigateDay(1);
        else navigateDay(-1);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [navigateDay, isNavigating]);

  // 键盘监听 (Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isNavigating) return;

      if (e.key === 'ArrowLeft') {
        navigateDay(-1);
      } else if (e.key === 'ArrowRight') {
        navigateDay(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateDay, isNavigating]);

  return (
    // CHANGED: overflow-hidden -> overflow-y-auto to allow scrolling on small vertical screens
    <div className="w-full h-screen flex flex-col items-center justify-center relative overflow-y-auto overflow-x-hidden">

      {/* Background Ambient Light */}
      <div className="fixed top-1/2 left-full w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(240, 185, 11, 0.08) 0%, transparent 60%)' }}>
      </div>

      {/* Main Card Render */}
      <div className="w-full flex justify-center transform transition-transform duration-500 z-10 shrink-0">
        <CrystalCard
          data={eventData}
          isTransitioning={isTransitioning}
          onNavigate={navigateDay}
          onJump={handleJump}
          isExport={new URLSearchParams(window.location.search).get('mode') === 'export'}
        />
      </div>

      {/* Context info - Added 'hide-on-capture' class */}
      <div className="mt-8 mb-4 text-white/20 font-code text-[10px] tracking-[0.2em] uppercase z-0 pointer-events-none shrink-0 hide-on-capture">
        SCROLL, KEYS or CLICK EDGES to NAVIGATE
      </div>

      {/* Project: Frozen Light Hub */}
      {/* The invisible trigger & dual engine controller */}
      <FrozenLightHub currentMood={eventData.mood} />
    </div>
  );
};

export default App;
