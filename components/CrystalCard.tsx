
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AlmanacEvent, BINANCE_LOGO_PATHS, Mood } from '../types';
import { soundEngine } from '../services/soundEngine';

interface CrystalCardProps {
  data: AlmanacEvent;
  isTransitioning: boolean; // 控制 .animating 类的关键 Props
  onNavigate: (direction: number) => void;
  onJump: (monthIndex: number, day: number) => void;
}

export const CrystalCard: React.FC<CrystalCardProps> = ({ data, isTransitioning, onNavigate, onJump }) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(0); // 0-11
  const [selectedDay, setSelectedDay] = useState(1);     // 1-31

  // Refs
  const cardRef = useRef<HTMLDivElement>(null);
  const monthListRef = useRef<HTMLDivElement>(null);
  const dayListRef = useRef<HTMLDivElement>(null);

  // Constants for Picker
  const ITEM_HEIGHT = 50;

  // Helper: Get Days in Month for 2026 (Non-Leap Year)
  const getDaysInMonth = (monthIndex: number) => {
    // Jan(31), Feb(28), Mar(31), Apr(30), May(31), Jun(30), Jul(31), Aug(31), Sep(30), Oct(31), Nov(30), Dec(31)
    const days2026 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days2026[monthIndex] || 30;
  };

  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const daysInCurrentMonth = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  // 1. 初始化音效 & 视差交互
  useEffect(() => {
    // 鼠标移动监听 (Parallax)
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || pickerOpen) return;
      
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1

      // 阻尼感：反向移动，角度很小
      const rotateY = x * -5; // Max 5deg rotation
      const rotateX = y * 5; 

      cardRef.current.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
        translateY(0px)
      `;

      // 动态反光位置 (Gloss movement)
      cardRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
      cardRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
    };

    // 鼠标离开时复位
    const handleMouseLeave = () => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [pickerOpen]);

  // 2. 音效触发逻辑
  useEffect(() => {
    if (isTransitioning) {
      // 动画开始：Trigger + Shimmer
      soundEngine.playTrigger();
      setTimeout(() => soundEngine.playShimmer(), 200);
    } 
  }, [isTransitioning]);

  // 3. 打开选择器时：初始化数据 + 自动滚动到位
  useEffect(() => {
    if (pickerOpen) {
      const monthIdx = new Date(Date.parse(data.month + " 1, 2026")).getMonth();
      const currentMonth = isNaN(monthIdx) ? 0 : monthIdx;
      const currentDay = parseInt(data.date) || 1;

      setSelectedMonth(currentMonth);
      setSelectedDay(currentDay);

      // Delay scroll slightly to ensure DOM is ready/visible
      setTimeout(() => {
        if (monthListRef.current) {
          monthListRef.current.scrollTop = currentMonth * ITEM_HEIGHT;
        }
        if (dayListRef.current) {
          dayListRef.current.scrollTop = (currentDay - 1) * ITEM_HEIGHT;
        }
      }, 50);
    }
  }, [pickerOpen, data]);

  // 4. Logic Correction: Ensure selectedDay is valid when switching months
  useEffect(() => {
    const maxDays = getDaysInMonth(selectedMonth);
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
      // Auto adjust scroll if day was cut off
      if (dayListRef.current) {
         // Check if current scroll position is out of bounds (rough check)
         if (dayListRef.current.scrollTop > (maxDays - 1) * ITEM_HEIGHT) {
             dayListRef.current.scrollTo({ top: (maxDays - 1) * ITEM_HEIGHT, behavior: 'smooth' });
         }
      }
    }
  }, [selectedMonth]);

  // --- Picker UX Enhancements ---

  // Handle scroll to update selection (iOS style)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'month' | 'day') => {
    const scrollTop = e.currentTarget.scrollTop;
    // Index based on center point mechanism (scrollTop / itemHeight)
    const index = Math.round(scrollTop / ITEM_HEIGHT);

    if (type === 'month') {
        const clampedIdx = Math.max(0, Math.min(11, index));
        if (clampedIdx !== selectedMonth) setSelectedMonth(clampedIdx);
    } else {
        const maxDays = getDaysInMonth(selectedMonth);
        const clampedIdx = Math.max(0, Math.min(maxDays - 1, index));
        if ((clampedIdx + 1) !== selectedDay) setSelectedDay(clampedIdx + 1);
    }
  };

  // Handle click to select & scroll
  const handleItemClick = (index: number, type: 'month' | 'day') => {
    if (type === 'month') {
        setSelectedMonth(index);
        monthListRef.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    } else {
        setSelectedDay(index + 1);
        dayListRef.current?.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    }
  };

  const handleInitiateJump = () => {
    soundEngine.playTrigger(); // Sound on jump initiate
    setPickerOpen(false);
    setFlashActive(true);
    
    // 在闪光最强时切换数据
    setTimeout(() => {
      onJump(selectedMonth, selectedDay);
      soundEngine.playLock(); // Sound on land
    }, 300);

    setTimeout(() => {
      setFlashActive(false);
    }, 600);
  };

  // 渲染描述文本 (Support for [[text]] highlighting)
  const renderDescription = (text: string) => {
    // Split by [[...]] pattern
    const parts = text.split(/(\[\[.*?\]\])/g);
    
    return (
      <p className="font-hei text-[14px] leading-[1.8] text-white/85 font-light text-justify">
        {parts.map((part, index) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
            return (
              <span 
                key={index} 
                className="text-binance-yellow font-bold drop-shadow-[0_0_8px_rgba(240,185,11,0.4)]"
              >
                {part.slice(2, -2)}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </p>
    );
  };

  // 4. 情绪化日期样式引擎 (Mood Engine)
  const getDateStyles = (mood: Mood) => {
    // UPDATED: Font size is now responsive (text-[clamp...]) to fit better in shorter cards
    const baseClasses = "font-ui font-extrabold text-transparent bg-clip-text leading-none tracking-[-5px] -ml-[5px] cursor-pointer transition-all duration-500 hover:scale-105 hover:translate-x-2 text-[100px] md:text-[110px]";
    switch (mood) {
      case 'CRISIS': // 熔岩红 (Lava Red)
        return `${baseClasses} bg-gradient-to-b from-white via-red-500 to-red-900 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]`;
      case 'FUTURE': // 切伦科夫蓝 (Cherenkov Blue)
        return `${baseClasses} bg-gradient-to-b from-white via-cyan-400 to-blue-600 drop-shadow-[0_0_25px_rgba(8,145,178,0.6)]`;
      case 'GLORY': // 荣耀金 (Default)
      default:
        return `${baseClasses} bg-gradient-to-b from-white via-white to-white drop-shadow-[0_0_40px_rgba(240,185,11,0.55)]`;
    }
  };

  // 根据 isTransitioning 状态，决定是否添加 'animating' 类名
  const containerClass = `crystal-card relative flex flex-col overflow-hidden transition-all duration-500 w-[calc(100%-2rem)] max-w-[360px] md:max-w-[400px] h-[82vh] min-h-[600px] max-h-[740px] my-4 md:my-6 ${isTransitioning ? 'animating' : ''}`;

  return (
    <div 
      ref={cardRef}
      className={containerClass}
      style={{
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(30px) brightness(1.15)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 50px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(240, 185, 11, 0.06)',
        transform: 'translate3d(0, 0, 0)',
        WebkitMaskImage: '-webkit-radial-gradient(white, black)', 
        '--mouse-x': '0%',
        '--mouse-y': '0%',
      } as React.CSSProperties}
    >
      
      {/* LEFT Navigation Zone - Added hide-on-capture */}
      <div 
        className="absolute top-0 bottom-0 left-0 w-[80px] z-40 cursor-pointer group rounded-l-[32px] overflow-hidden hide-on-capture"
        onClick={() => onNavigate(-1)}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[rgba(240,185,11,0.15)] to-[rgba(240,185,11,0)] pointer-events-none" 
          style={{ 
            maskImage: 'linear-gradient(to right, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent)' 
          }}
        />
      </div>

      {/* RIGHT Navigation Zone - Added hide-on-capture */}
      <div 
        className="absolute top-0 bottom-0 right-0 w-[80px] z-40 cursor-pointer group rounded-r-[32px] overflow-hidden hide-on-capture"
        onClick={() => onNavigate(1)}
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-l from-[rgba(240,185,11,0.15)] to-[rgba(240,185,11,0)] pointer-events-none" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 20%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)' 
          }}
        />
      </div>

      {/* 白屏闪光层 (用于 Jump 模式) */}
      <div 
        className={`absolute inset-0 bg-white mix-blend-overlay z-[60] pointer-events-none transition-opacity duration-300 ${flashActive ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* === 核心组件 1: 流光层 (The Sheen) === */}
      <div 
        className="void-sheen"
        style={{ transform: 'skewX(-20deg) translateX(calc(var(--mouse-x, 0%) * -0.2))' }}
      ></div>

      {/* 头部信息 */}
      <div className={`header-bar px-[35px] pt-[30px] md:pt-[35px] flex justify-between items-center z-10 transition-opacity duration-300 ${pickerOpen ? 'opacity-30' : 'opacity-100'}`}>
        <svg 
          className="w-[28px] h-[28px] md:w-[32px] md:h-[32px] drop-shadow-[0_0_10px_rgba(240,185,11,0.5)]" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="fill-binance-yellow">
            {BINANCE_LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}
          </g>
        </svg>
        <div className="font-song text-[14px] md:text-[16px] text-white font-bold tracking-[2px] shadow-white/20 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          二零二六 · 知识年鉴
        </div>
      </div>

      {/* === 核心组件 2: 内容包裹器 === */}
      <div className="content-wrapper z-20 h-full flex flex-col">
        
        {/* 视觉主区域 */}
        <div className="visual-area relative flex-grow flex flex-col justify-center pl-[35px]">
          {/* 背景线框 LOGO */}
          <svg 
            className={`absolute top-[48%] left-[50%] w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none transition-all duration-500 ${pickerOpen ? 'opacity-0 scale-90' : 'opacity-[0.06] scale-100'}`} 
            viewBox="0 0 32 32" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="fill-none stroke-white stroke-[0.8] stroke-opacity-60">
              {BINANCE_LOGO_PATHS.map((d, i) => <path key={i} d={d} />)}
            </g>
          </svg>

          {/* 日期数字 (Mood Engine Applied) */}
          <div className={`date-group relative z-[2] transition-all duration-300 ${pickerOpen ? 'opacity-0 translate-x-4 blur-sm' : 'opacity-100'}`}>
            <div className="month-label font-code text-[14px] text-binance-yellow tracking-[4px] uppercase mb-[5px] flex items-center">
              <span className="inline-block w-[6px] h-[6px] bg-binance-yellow mr-[10px] shadow-[0_0_5px_#F0B90B]"></span>
              {data.month}
            </div>
            
            {/* THE MOOD DATE: 巨大的日期数字 */}
            <div 
              className={getDateStyles(data.mood)}
              onClick={() => setPickerOpen(true)}
            >
              {data.date}
            </div>
            
            <div className="weekday-cn font-hei text-[14px] text-white/70 tracking-[2px] mt-[10px] pl-[5px] border-l border-white/30 ml-[5px]">
              {data.weekday}
            </div>
          </div>
        </div>

        {/* 文本内容区域 */}
        <div 
          className={`content-pane px-[35px] py-[30px] md:py-[35px] z-[5] flex flex-col transition-all duration-300 ${pickerOpen ? 'opacity-0 translate-y-4 blur-md' : 'opacity-100'}`}
          style={{ 
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0) 100%)',
            minHeight: '40%'
          }}
        >
          {/* 上半部：现代信息 */}
          <div>
            <div className="tag-container inline-flex items-center mb-[14px] px-[8px] py-[4px] pl-[6px] bg-white/5 rounded-[4px] border border-white/10 backdrop-blur-[4px]">
              <div className={`tag-dot w-[6px] h-[6px] rounded-full mr-[8px] animate-dot-breathe ${data.mood === 'CRISIS' ? 'bg-red-500 shadow-[0_0_8px_red]' : data.mood === 'FUTURE' ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-binance-yellow shadow-[0_0_8px_#F0B90B]'}`}></div>
              <span className="tag-text font-hei text-[11px] text-white/90 tracking-[1px] font-medium">
                {data.tag}
              </span>
            </div>

            <h1 className="title-cn font-hei text-[24px] md:text-[28px] font-bold text-white m-0 mb-[12px] leading-[1.3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {data.title}
            </h1>

            <div className="desc-wrapper mb-[15px]">
              {renderDescription(data.description)}
            </div>
          </div>

          {/* 底部：地平线布局 */}
          <div className="mt-auto">
            <div className="tech-axis flex items-center justify-between text-[10px] font-code text-white/30 tracking-[1px] mb-[12px]">
              <span className="opacity-70">NO. {String(data.dayOfYear).padStart(3, '0')} / 365</span>
              <div className="h-[1px] flex-grow bg-white/10 mx-4"></div>
              <span className="font-bold tracking-[2px] opacity-80">BINANCE</span>
            </div>
            
            <div className="quote-area text-right">
              <p className="font-song font-bold italic text-[12px] md:text-[14px] text-white/70 leading-relaxed tracking-wide inline-block drop-shadow-md">
                “{data.quote}”
              </p>
            </div>
          </div>
        </div>
      
      </div> 

      {/* 全息选择器 */}
      <div 
        className={`holo-overlay absolute inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${pickerOpen ? 'clip-circle-open opacity-100 pointer-events-auto' : 'clip-circle-closed opacity-0 pointer-events-none'}`}
        style={{ clipPath: pickerOpen ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)' }}
      >
         {/* Picker Stage */}
         <div className="holo-roller-stage flex gap-[30px] relative perspective-[1000px] h-[240px] w-full justify-center mask-gradient">
            {/* Center Highlight Line */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50px] border-t border-b border-binance-yellow/50 bg-binance-yellow/5 shadow-[0_0_30px_rgba(240,185,11,0.1)] pointer-events-none z-0"></div>
            
            {/* Month Column */}
            <div 
                ref={monthListRef}
                className="holo-col w-[80px] h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory text-center py-[95px] z-10 no-scrollbar"
                onScroll={(e) => handleScroll(e, 'month')}
            >
               {months.map((m, idx) => (
                 <div 
                    key={m} 
                    className={`holo-item h-[50px] leading-[50px] font-code text-[18px] snap-center cursor-pointer transition-all duration-300 ${selectedMonth === idx ? 'text-binance-yellow text-[24px] font-bold scale-125 shadow-glow' : 'text-white/20 hover:text-white/60'}`} 
                    onClick={() => handleItemClick(idx, 'month')}
                 >
                    {m}
                 </div>
               ))}
            </div>

            {/* Day Column */}
            <div 
                ref={dayListRef}
                className="holo-col w-[80px] h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory text-center py-[95px] z-10 no-scrollbar"
                onScroll={(e) => handleScroll(e, 'day')}
            >
               {days.map((d, idx) => (
                 <div 
                    key={d} 
                    className={`holo-item h-[50px] leading-[50px] font-code text-[18px] snap-center cursor-pointer transition-all duration-300 ${selectedDay === d ? 'text-binance-yellow text-[24px] font-bold scale-125 shadow-glow' : 'text-white/20 hover:text-white/60'}`} 
                    onClick={() => handleItemClick(idx, 'day')}
                 >
                    {String(d).padStart(2, '0')}
                 </div>
               ))}
            </div>
         </div>

         <button className="holo-btn mt-[60px] px-[40px] py-[12px] bg-transparent border border-binance-yellow text-binance-yellow font-code text-[12px] tracking-[2px] uppercase relative overflow-hidden group transition-all duration-300 hover:text-black hover:shadow-[0_0_30px_rgba(240,185,11,0.4)]" onClick={handleInitiateJump}>
            <span className="relative z-10">Initiate Jump</span>
            <div className="absolute top-0 left-[-100%] w-full h-full bg-binance-yellow transition-all duration-300 group-hover:left-0 z-0"></div>
         </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-gradient { mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent); }
        .shadow-glow { text-shadow: 0 0 15px #F0B90B; }
      `}</style>
    </div>
  );
};
