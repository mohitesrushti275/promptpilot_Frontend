import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchableFontDropdownProps {
  value: string;
  onChange: (value: string) => void;
  fonts: string[];
  placeholder?: string;
}

export function SearchableFontDropdown({ value, onChange, fonts, placeholder = "Select Font" }: SearchableFontDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load font dynamically
  const loadFont = (fontName: string) => {
    if (!fontName) return;
    const fontId = `font-${fontName.replace(/\s+/g, '-')}`;
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  };

  // Load selected font
  useEffect(() => {
    if (value) {
      loadFont(value);
    }
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFonts = useMemo(() => {
    return fonts.filter(font => font.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [fonts, searchQuery]);

  // Load visible fonts (limit to 15 to avoid massive initial requests)
  useEffect(() => {
    if (isOpen) {
      filteredFonts.slice(0, 15).forEach(loadFont);
    }
  }, [isOpen, filteredFonts]);

  // Also load when scrolling? For simplicity, loading first 15 and relying on users to search is fine.
  // We can load all filtered ones since there are ~50 fonts, which isn't huge.
  useEffect(() => {
    if (isOpen && searchQuery) {
       filteredFonts.forEach(loadFont);
    }
  }, [isOpen, searchQuery, filteredFonts]);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Button */}
      <div 
        className="manifest-input" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          fontFamily: value ? `"${value}", system-ui, sans-serif` : 'inherit',
          userSelect: 'none',
          minHeight: '44px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '0 16px',
          color: 'var(--text-primary)',
          fontSize: '13px'
        }}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchQuery('');
        }}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#1a1a1c', // Ensure dark theme consistency
          border: '1px solid var(--border)',
          borderRadius: '8px',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Search Input */}
          <div style={{ 
            padding: '12px', 
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.02)'
          }}>
            <Search size={14} style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              autoFocus
              placeholder="Search fonts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                width: '100%'
              }}
            />
          </div>

          {/* Options List */}
          <div style={{
            maxHeight: '240px',
            overflowY: 'auto',
            padding: '4px'
          }}>
            {filteredFonts.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No fonts found
              </div>
            ) : (
              filteredFonts.map(font => (
                <div
                  key={font}
                  onClick={() => {
                    onChange(font);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: font === value ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: font === value ? 'rgba(51, 104, 247, 0.1)' : 'transparent',
                    fontFamily: `"${font}", system-ui, sans-serif`,
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onMouseEnter={e => {
                    if (font !== value) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (font !== value) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {font}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
