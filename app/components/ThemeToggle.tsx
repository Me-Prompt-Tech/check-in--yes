'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleToggle = () => {
    setAnimating(true);
    toggleTheme();
    setTimeout(() => setAnimating(false), 500);
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={handleToggle}
      title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}
      className={`
        relative overflow-hidden w-9 h-9 rounded-xl flex items-center justify-center shrink-0
        transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer
        ${isDark
          ? 'bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-amber-400'
          : 'bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 shadow-sm'
        }
        ${animating ? 'scale-95' : ''}
      `}
      aria-label="Toggle theme"
    >
      {/* Icon */}
      <span
        className={`
          relative transition-all duration-300 flex items-center justify-center
          ${animating ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}
        `}
      >
        {isDark ? (
          /* Sun icon */
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m8.66-13H20m-16 0H2.34M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ) : (
          /* Moon icon */
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </span>
    </button>
  );
}
