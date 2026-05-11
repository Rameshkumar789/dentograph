'use client';
import { useState, useMemo } from 'react';

const COLOR_MAP = {
  Healthy: 'rgba(76, 201, 240, 0)', // Transparent when healthy
  Low: 'rgba(252, 163, 17, 0.7)',
  Medium: 'rgba(247, 127, 0, 0.8)',
  High: 'rgba(214, 40, 40, 0.9)',
  Treated: 'rgba(42, 157, 143, 0.7)'
};

// Approximate top/left percentages for the 16 teeth in the U-shaped image
const UPPER_COORDS: Record<number, { top: string, left: string }> = {
  // Right side (18 to 11) - left side of image
  18: { top: '82%', left: '19%' },
  17: { top: '69%', left: '19%' },
  16: { top: '56%', left: '20%' },
  15: { top: '44%', left: '23%' },
  14: { top: '34%', left: '26%' },
  13: { top: '25%', left: '32%' },
  12: { top: '19%', left: '39%' },
  11: { top: '16%', left: '46%' },
  // Left side (21 to 28) - right side of image
  21: { top: '16%', left: '54%' },
  22: { top: '19%', left: '61%' },
  23: { top: '25%', left: '68%' },
  24: { top: '34%', left: '74%' },
  25: { top: '44%', left: '77%' },
  26: { top: '56%', left: '80%' },
  27: { top: '69%', left: '81%' },
  28: { top: '82%', left: '81%' },
};

// Lower coordinates are the same visual positions, just different FDI numbers
const LOWER_COORDS: Record<number, { top: string, left: string }> = {
  // Right side (48 to 41)
  48: { top: '82%', left: '19%' },
  47: { top: '69%', left: '19%' },
  46: { top: '56%', left: '20%' },
  45: { top: '44%', left: '23%' },
  44: { top: '34%', left: '26%' },
  43: { top: '25%', left: '32%' },
  42: { top: '19%', left: '39%' },
  41: { top: '16%', left: '46%' },
  // Left side (31 to 38)
  31: { top: '16%', left: '54%' },
  32: { top: '19%', left: '61%' },
  33: { top: '25%', left: '68%' },
  34: { top: '34%', left: '74%' },
  35: { top: '44%', left: '77%' },
  36: { top: '56%', left: '80%' },
  37: { top: '69%', left: '81%' },
  38: { top: '82%', left: '81%' },
};

export default function InteractiveJawMap({ findings, beforeAfter }: { findings: any[], beforeAfter: 'before' | 'after' }) {
  const [arch, setArch] = useState<'upper' | 'lower'>('upper');
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);

  const findingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    findings.forEach(f => {
      if (f.tooth_number) map[f.tooth_number] = f;
    });
    return map;
  }, [findings]);

  const coords = arch === 'upper' ? UPPER_COORDS : LOWER_COORDS;
  const teethList = Object.keys(coords).map(Number);

  return (
    <div style={{ width: '100%', height: '550px', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#050505', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Arch Toggle */}
      <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 'var(--radius-full)' }}>
        <button 
          onClick={() => setArch('upper')}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: arch === 'upper' ? 'var(--primary)' : 'transparent', color: arch === 'upper' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Upper Jaw
        </button>
        <button 
          onClick={() => setArch('lower')}
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: arch === 'lower' ? 'var(--primary)' : 'transparent', color: arch === 'lower' ? '#000' : '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
        >
          Lower Jaw
        </button>
      </div>

      {/* HUD UI */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', minWidth: '220px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}>Clinical View</h3>
        {hoveredTooth ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Tooth #{hoveredTooth}</div>
            {findingsMap[hoveredTooth] ? (
              <>
                <div style={{ color: beforeAfter === 'after' ? '#2a9d8f' : (findingsMap[hoveredTooth].severity === 'High' ? '#d62828' : findingsMap[hoveredTooth].severity === 'Medium' ? '#f77f00' : '#fca311'), fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
                  {beforeAfter === 'after' ? 'Treated ✨' : findingsMap[hoveredTooth].condition}
                </div>
                {beforeAfter === 'before' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>{findingsMap[hoveredTooth].explanation}</div>
                )}
              </>
            ) : (
              <div style={{ color: '#fff', fontSize: '0.9rem', marginTop: '4px', fontWeight: 500 }}>Healthy</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Hover over a tooth marker to inspect AI findings.</div>
        )}
      </div>

      {/* Photorealistic Render Container */}
      <div style={{ position: 'relative', width: '450px', height: '450px', transform: arch === 'lower' ? 'rotate(180deg)' : 'none', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <img 
          src="/jaw-render.png" 
          alt="Photorealistic Jaw Render" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))' }} 
        />
        
        {/* CSS Coordinate Overlays */}
        {teethList.map(toothId => {
          const f = findingsMap[toothId];
          let color = COLOR_MAP.Healthy;
          let isIssue = false;

          if (f && f.condition !== 'Healthy') {
            if (beforeAfter === 'after') {
              color = COLOR_MAP.Treated;
            } else {
              isIssue = true;
              color = f.severity === 'High' ? COLOR_MAP.High : f.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low;
            }
          }

          return (
            <div
              key={toothId}
              onMouseEnter={() => setHoveredTooth(toothId)}
              onMouseLeave={() => setHoveredTooth(null)}
              style={{
                position: 'absolute',
                top: coords[toothId].top,
                left: coords[toothId].left,
                width: '10%',
                height: '10%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                backgroundColor: color,
                boxShadow: isIssue ? `0 0 20px ${color}, inset 0 0 10px ${color}` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                mixBlendMode: isIssue ? 'overlay' : 'normal',
                opacity: hoveredTooth === toothId ? 1 : (isIssue ? 0.8 : 0),
                zIndex: 5
              }}
            >
              {/* Invisible touch target to make hover easier */}
              <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
