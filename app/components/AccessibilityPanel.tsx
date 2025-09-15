'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AccessibilitySettings {
  contrast: number;
  saturation: number;
  textSize: number;
}

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    contrast: 100,
    saturation: 100,
    textSize: 100
  });

  useEffect(() => {
    // Apply settings to document
    const root = document.documentElement;
    root.style.setProperty('--accessibility-contrast', `${settings.contrast}%`);
    root.style.setProperty('--accessibility-saturation', `${settings.saturation}%`);
    
    // Apply text size directly via JavaScript
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, input, textarea, label, li');
    
    textElements.forEach(element => {
      if (settings.textSize === 100) {
        // Reset to normal size
        (element as HTMLElement).style.fontSize = '';
      } else {
        // Apply custom size
        const baseSize = window.getComputedStyle(element).fontSize;
        const baseValue = parseFloat(baseSize);
        const newSize = (baseValue * settings.textSize) / 100;
        (element as HTMLElement).style.fontSize = `${newSize}px`;
      }
    });
  }, [settings]);

  const handleSettingChange = (setting: keyof AccessibilitySettings, value: number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const resetSettings = () => {
    setSettings({
      contrast: 100,
      saturation: 100,
      textSize: 100
    });
  };

  return (
    <div className="relative">
      {/* Accessibility Icon Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer hover:opacity-80 transition-opacity duration-200 flex items-center"
        style={{ cursor: 'pointer' }}
        aria-label="הגדרות נגישות"
        title="הגדרות נגישות"
      >
        <Image
          src="/images/accessibility01.png"
          alt="נגישות"
          width={40}
          height={40}
        />
      </div>

      {/* Accessibility Panel */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-6 z-50 accessibility-panel"
          style={{ 
            width: '400px', 
            backgroundColor: 'white'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">הגדרות נגישות</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="סגור"
            >
              ✕
            </button>
          </div>

          {/* Contrast Setting */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ניגודיות: {settings.contrast}%
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={settings.contrast}
              onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>נמוך</span>
              <span>גבוה</span>
            </div>
          </div>

          {/* Saturation Setting */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              רוויה: {settings.saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={settings.saturation}
              onChange={(e) => handleSettingChange('saturation', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>שחור-לבן</span>
              <span>צבעוני</span>
            </div>
          </div>

          {/* Text Size Setting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              גודל טקסט: {settings.textSize}%
            </label>
            <input
              type="range"
              min="75"
              max="200"
              value={settings.textSize}
              onChange={(e) => handleSettingChange('textSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>קטן</span>
              <span>גדול</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetSettings}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            איפוס הגדרות
          </button>
        </div>
      )}

      {/* Overlay to close panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }

        /* Apply accessibility settings globally */
        :root {
          --accessibility-contrast: 100%;
          --accessibility-saturation: 100%;
        }

        * {
          filter: contrast(var(--accessibility-contrast)) saturate(var(--accessibility-saturation));
        }

        /* Exclude accessibility panel elements from filters to prevent interference */
        .accessibility-panel,
        .accessibility-panel * {
          filter: none !important;
        }

        /* Only exclude specific text elements from font-size changes, not inputs */
        .accessibility-panel h1,
        .accessibility-panel h2,
        .accessibility-panel h3,
        .accessibility-panel h4,
        .accessibility-panel h5,
        .accessibility-panel h6,
        .accessibility-panel p,
        .accessibility-panel span,
        .accessibility-panel label,
        .accessibility-panel button {
          font-size: initial !important;
        }

        /* Ensure reset button hover works properly */
        .accessibility-panel button:hover {
          cursor: pointer !important;
          background-color: #e5e7eb !important;
        }
      `}</style>
    </div>
  );
};

export default AccessibilityPanel;