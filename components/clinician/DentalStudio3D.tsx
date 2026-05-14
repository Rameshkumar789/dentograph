'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Map severity to colors
const COLOR_MAP = {
  Healthy: '#4cc9f0',
  Low: '#fca311',
  Medium: '#f77f00',
  High: '#d62828',
  Treated: '#2a9d8f'
};

function Tooth({ 
  position, 
  toothNumber, 
  color, 
  isIssue, 
  isSelected,
  onHover,
  onClick
}: { 
  position: [number, number, number], 
  toothNumber: number, 
  color: string, 
  isIssue: boolean,
  isSelected: boolean,
  onHover: (num: number | null) => void,
  onClick: (num: number) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (isIssue && meshRef.current) {
      const time = performance.now() / 1000;
      meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(toothNumber); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onClick(toothNumber); }}
      >
        <capsuleGeometry args={[0.15, 0.2, 8, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#6366f1' : hovered ? '#ffffff' : color} 
          roughness={0.2}
          metalness={isSelected ? 0.5 : 0.1}
          emissive={isSelected ? '#6366f1' : isIssue ? color : '#000000'}
          emissiveIntensity={isSelected ? 0.8 : isIssue ? 0.4 : 0}
        />
      </mesh>
      <Text
        position={[0, position[1] > 0 ? 0.35 : -0.35, 0]}
        fontSize={0.15}
        color={isSelected ? '#6366f1' : isIssue ? color : "#888888"}
        anchorX="center"
        anchorY="middle"
      >
        {toothNumber.toString()}
      </Text>
    </group>
  );
}

export default function DentalModel3D({ 
  findings,
  selectedTooth,
  onSelectTooth,
  progression = 0
}: { 
  findings: any[],
  selectedTooth?: number | null,
  onSelectTooth?: (num: number | null) => void,
  progression?: number
}) {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);
  const activeTooth = hoveredTooth || selectedTooth;

  // ... (teethData useMemo remains the same)
  const teethData = useMemo(() => {
    const data = [];
    const radiusX = 1.5;
    const radiusZ = 2.0;
    for (let i = 1; i <= 8; i++) {
      const angle1 = (i / 8) * (Math.PI / 2.5);
      data.push({ id: 10 + i, pos: [Math.sin(angle1) * radiusX, 0.4, Math.cos(angle1) * radiusZ] as [number, number, number] });
      const angle2 = -(i / 8) * (Math.PI / 2.5);
      data.push({ id: 20 + i, pos: [Math.sin(angle2) * radiusX, 0.4, Math.cos(angle2) * radiusZ] as [number, number, number] });
    }
    for (let i = 1; i <= 8; i++) {
      const angle1 = (i / 8) * (Math.PI / 2.5);
      data.push({ id: 40 + i, pos: [Math.sin(angle1) * radiusX, -0.4, Math.cos(angle1) * radiusZ] as [number, number, number] });
      const angle2 = -(i / 8) * (Math.PI / 2.5);
      data.push({ id: 30 + i, pos: [Math.sin(angle2) * radiusX, -0.4, Math.cos(angle2) * radiusZ] as [number, number, number] });
    }
    return data;
  }, []);

  const findingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    findings.forEach(f => { if (f.tooth_number) map[f.tooth_number] = f; });
    return map;
  }, [findings]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
      
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(15, 23, 42, 0.9)', padding: '16px', borderRadius: '12px', backdropFilter: 'blur(12px)', border: '1px solid #334155', minWidth: '240px', color: '#fff' }}>
        <h3 style={{ fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Surgical Studio: AI Detection</h3>
        {activeTooth ? (
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Tooth #{activeTooth}</div>
            {findingsMap[activeTooth] ? (
              <>
                <div style={{ color: findingsMap[activeTooth].severity === 'High' ? COLOR_MAP.High : findingsMap[activeTooth].severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low, fontSize: '0.9rem', fontWeight: 800, marginTop: '8px', textTransform: 'uppercase' }}>
                   DETECTED: {findingsMap[activeTooth].condition}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px', lineHeight: '1.5', fontWeight: 500 }}>
                  {findingsMap[activeTooth].clinical_explanation || findingsMap[activeTooth].explanation}
                </div>
              </>
            ) : (
              <div style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '8px', fontWeight: 700 }}>ASSET CLEAR / HEALTHY</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>Select dental unit to inspect clinical manifest.</div>
        )}
        {progression > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #334155', fontSize: '0.7rem', color: '#fb7185', fontWeight: 800 }}>
             ⚠️ PATHOLOGY PROJECTION ACTIVE: +{(progression * 5).toFixed(0)} MONTHS
          </div>
        )}
      </div>

      <Canvas camera={{ position: [0, 2, -5], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} color="#38bdf8" intensity={1} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#ffffff" />
        <directionalLight position={[0, 5, -10]} intensity={1} color="#ffffff" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group rotation={[0, Math.PI, 0]}>
            {teethData.map(tooth => {
              const f = findingsMap[tooth.id];
              let color = COLOR_MAP.Healthy;
              let isIssue = false;

              if (f && f.condition !== 'Healthy') {
                isIssue = true;
                // Progression effect: make colors darker/redder
                if (progression > 0.5) {
                   color = COLOR_MAP.High;
                } else {
                   color = f.severity === 'High' ? COLOR_MAP.High : f.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low;
                }
              }

              return (
                <Tooth 
                  key={tooth.id} 
                  position={tooth.pos} 
                  toothNumber={tooth.id} 
                  color={color} 
                  isIssue={isIssue}
                  isSelected={selectedTooth === tooth.id}
                  onHover={setHoveredTooth}
                  onClick={(id) => onSelectTooth?.(id)}
                />
              );
            })}
          </group>
        </Float>

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate={!activeTooth} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
