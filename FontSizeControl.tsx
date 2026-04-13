import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Type } from 'lucide-react';

const FontSizeControl: React.FC = () => {
  const [fontSize, setFontSize] = useState(100);
  const [isOpen, setIsOpen] = useState(false);

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(90, Math.min(140, fontSize + delta));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40">
      {isOpen ? (
        <div className="bg-white border-2 border-blue-300 rounded-2xl shadow-xl p-3 flex flex-col items-center gap-2">
          <button
            onClick={() => changeFontSize(10)}
            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            aria-label="Increase text size"
            title="Make Text Bigger"
          >
            <ZoomIn className="w-6 h-6 text-blue-900" />
          </button>
          <span className="text-sm font-bold text-gray-600">{fontSize}%</span>
          <button
            onClick={() => changeFontSize(-10)}
            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
            aria-label="Decrease text size"
            title="Make Text Smaller"
          >
            <ZoomOut className="w-6 h-6 text-blue-900" />
          </button>
          <button
            onClick={() => {
              setFontSize(100);
              document.documentElement.style.fontSize = '100%';
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            Reset
          </button>
          <div className="border-t border-gray-200 pt-2 mt-1 w-full">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white p-3 rounded-2xl shadow-lg transition-all"
          aria-label="Text size controls"
          title="Change Text Size"
        >
          <Type className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FontSizeControl;
