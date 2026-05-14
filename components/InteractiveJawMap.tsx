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

export default function InteractiveJawMap({ findings, beforeAfter }: { findings: any[], beforeAfter?: string }) {
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
    <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '32px', overflow: 'hidden', background: '#FDFDFD', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Arch Toggle */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => setArch('upper')}
          style={{ padding: '8px 16px', borderRadius: '8px', background: arch === 'upper' ? '#fff' : 'transparent', color: '#0f172a', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', boxShadow: arch === 'upper' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          Upper Jaw
        </button>
        <button 
          onClick={() => setArch('lower')}
          style={{ padding: '8px 16px', borderRadius: '8px', background: arch === 'lower' ? '#fff' : 'transparent', color: '#0f172a', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', boxShadow: arch === 'lower' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}
        >
          Lower Jaw
        </button>
      </div>

      {/* HUD UI - Frosted Light Glass */}
      <div style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '24px', borderRadius: '20px', backdropFilter: 'blur(16px)', border: '1px solid #e2e8f0', minWidth: '240px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '12px', color: '#94a3b8' }}>Tooth Details</h3>
        {hoveredTooth ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Tooth #{hoveredTooth}</div>
            {findingsMap[hoveredTooth] ? (
              <>
                <div style={{ color: (findingsMap[hoveredTooth].severity === 'High' ? '#ef4444' : findingsMap[hoveredTooth].severity === 'Medium' ? '#f59e0b' : '#3b82f6'), fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                  {findingsMap[hoveredTooth].condition}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '12px', lineHeight: 1.5 }}>{findingsMap[hoveredTooth].explanation}</div>
              </>
            ) : (
              <div style={{ color: '#10b981', fontSize: '0.9rem', marginTop: '4px', fontWeight: 700 }}>✓ Healthy / No Findings</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>Hover over a tooth marker to view detailed AI diagnostics.</div>
        )}
      </div>

      {/* Photorealistic Render Container */}
      <div style={{ position: 'relative', width: '450px', height: '450px', transform: arch === 'lower' ? 'rotate(180deg)' : 'none', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <img 
          src="/jaw-render.png" 
          alt="Photorealistic Jaw Render" 
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.1))' }} 
        />
        
        {/* CSS Coordinate Overlays */}
        {teethList.map(toothId => {
          const f = findingsMap[toothId];
          let color = COLOR_MAP.Healthy;
          let isIssue = false;

          if (f && f.condition !== 'Healthy') {
            isIssue = true;
            color = f.severity === 'High' ? COLOR_MAP.High : f.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low;
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
