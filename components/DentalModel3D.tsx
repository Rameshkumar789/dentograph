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
  onHover 
}: { 
  position: [number, number, number], 
  toothNumber: number, 
  color: string, 
  isIssue: boolean,
  onHover: (num: number | null) => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle pulsing animation for teeth with issues
  useFrame((state) => {
    if (isIssue && meshRef.current) {
      const time = state.performance.now() / 1000;
      meshRef.current.position.y = position[1] + Math.sin(time * 3) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(toothNumber); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); }}
      >
        {/* More anatomical tooth shape instead of a box */}
        <capsuleGeometry args={[0.15, 0.2, 8, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          roughness={0.2}
          metalness={0.1}
          emissive={isIssue ? color : '#000000'}
          emissiveIntensity={isIssue ? 0.4 : 0}
        />
      </mesh>
      {/* Label above/below the tooth */}
      <Text
        position={[0, position[1] > 0 ? 0.35 : -0.35, 0]}
        fontSize={0.15}
        color={isIssue ? color : "#888888"}
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
}: { 
  findings: any[], 
}) {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);

  // Generate procedural arch coordinates based on FDI notation
  const teethData = useMemo(() => {
    const data = [];
    const radiusX = 1.5;
    const radiusZ = 2.0;

    // Upper Arch (Quadrants 1 & 2)
    for (let i = 1; i <= 8; i++) {
      // Quad 1 (Right): 11 is center, 18 is back
      const angle1 = (i / 8) * (Math.PI / 2.5);
      data.push({
        id: 10 + i,
        pos: [Math.sin(angle1) * radiusX, 0.4, Math.cos(angle1) * radiusZ] as [number, number, number]
      });
      // Quad 2 (Left): 21 is center, 28 is back
      const angle2 = -(i / 8) * (Math.PI / 2.5);
      data.push({
        id: 20 + i,
        pos: [Math.sin(angle2) * radiusX, 0.4, Math.cos(angle2) * radiusZ] as [number, number, number]
      });
    }

    // Lower Arch (Quadrants 4 & 3)
    for (let i = 1; i <= 8; i++) {
      // Quad 4 (Right): 41 is center, 48 is back
      const angle1 = (i / 8) * (Math.PI / 2.5);
      data.push({
        id: 40 + i,
        pos: [Math.sin(angle1) * radiusX, -0.4, Math.cos(angle1) * radiusZ] as [number, number, number]
      });
      // Quad 3 (Left): 31 is center, 38 is back
      const angle2 = -(i / 8) * (Math.PI / 2.5);
      data.push({
        id: 30 + i,
        pos: [Math.sin(angle2) * radiusX, -0.4, Math.cos(angle2) * radiusZ] as [number, number, number]
      });
    }
    return data;
  }, []);

  // Map findings to a dictionary for quick lookup
  const findingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    findings.forEach(f => {
      if (f.tooth_number) map[f.tooth_number] = f;
    });
    return map;
  }, [findings]);

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      
      {/* Overlay UI for hovered tooth details */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(8px)', border: '1px solid var(--border)', minWidth: '200px' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '4px', fontFamily: 'var(--font-display)' }}>3D Jaw Explorer</h3>
        {hoveredTooth ? (
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tooth #{hoveredTooth}</div>
            {findingsMap[hoveredTooth] ? (
              <>
                <div style={{ color: findingsMap[hoveredTooth].severity === 'High' ? COLOR_MAP.High : findingsMap[hoveredTooth].severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low, fontSize: '0.85rem', fontWeight: 600, marginTop: '4px' }}>
                  {findingsMap[hoveredTooth].condition}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{findingsMap[hoveredTooth].explanation}</div>
              </>
            ) : (
              <div style={{ color: COLOR_MAP.Healthy, fontSize: '0.85rem', marginTop: '4px' }}>Healthy</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Hover over a tooth to inspect AI findings.</div>
        )}
      </div>

      <Canvas camera={{ position: [0, 2, -5], fov: 45 }}>
        <color attach="background" args={['#FDFDFD']} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#ffffff" />
        <directionalLight position={[0, 5, -10]} intensity={0.5} color="#ffffff" />

        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group rotation={[0, Math.PI, 0]}>
            {teethData.map(tooth => {
              const f = findingsMap[tooth.id];
              let color = COLOR_MAP.Healthy;
              let isIssue = false;

              if (f && f.condition !== 'Healthy') {
                isIssue = true;
                color = f.severity === 'High' ? COLOR_MAP.High : f.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low;
              }

              return (
                <Tooth 
                  key={tooth.id} 
                  position={tooth.pos} 
                  toothNumber={tooth.id} 
                  color={color} 
                  isIssue={isIssue}
                  onHover={setHoveredTooth}
                />
              );
            })}
          </group>
        </Float>

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate={!hoveredTooth} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
