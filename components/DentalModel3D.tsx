'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const COLOR_MAP = {
  Healthy: '#ffffff', // Realistic white tooth
  Low: '#fca311',
  Medium: '#f77f00',
  High: '#d62828',
  Treated: '#a8dadc'
};

// Procedural Gum Arch
function Gums({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  const curve = useMemo(() => {
    // Parabolic curve for the gums
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const angle = Math.PI * 0.8 * (t - 0.5); // Spread over an arch
      points.push(new THREE.Vector3(Math.sin(angle) * 1.5, 0, Math.cos(angle) * 1.8));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.35, 16, false]} />
        <meshStandardMaterial color="#d16075" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}

function Tooth({ 
  position, 
  toothNumber, 
  toothType,
  color, 
  isIssue, 
  onHover 
}: { 
  position: [number, number, number], 
  toothNumber: number, 
  toothType: 'incisor' | 'canine' | 'molar',
  color: string, 
  isIssue: boolean,
  onHover: (num: number | null) => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (isIssue && meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 4) * 0.03;
    }
  });

  // Determine geometry scaling based on real tooth anatomy
  const scale: [number, number, number] = 
    toothType === 'incisor' ? [1.2, 1, 0.5] : // Flat and wide
    toothType === 'canine'  ? [0.9, 1.2, 0.8] : // Pointy and slightly thicker
    [1.3, 0.8, 1.2]; // Molars: boxy and thick

  // Is it upper or lower jaw? (Upper teeth point down, lower point up)
  // Our base position sets the height. We'll just rotate them all slightly to face outwards
  const isUpper = position[1] > 0;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(toothNumber); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); }}
        scale={scale}
      >
        {/* Using a rounded capsule to simulate organic tooth shape */}
        <capsuleGeometry args={[0.15, 0.3, 4, 16]} />
        <meshStandardMaterial 
          color={hovered ? '#e0fbfc' : color} 
          roughness={0.15} // Shiny enamel
          metalness={0.05}
          emissive={isIssue ? color : '#000000'}
          emissiveIntensity={isIssue ? 0.6 : 0}
        />
      </mesh>
      {/* Label above/below the tooth */}
      <Text
        position={[0, isUpper ? 0.45 : -0.45, 0.2]}
        fontSize={0.12}
        color={isIssue ? color : "var(--text-muted)"}
        anchorX="center"
        anchorY="middle"
      >
        {toothNumber.toString()}
      </Text>
    </group>
  );
}

export default function DentalModel3D({ findings, beforeAfter }: { findings: any[], beforeAfter: 'before' | 'after' }) {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);

  const teethData = useMemo(() => {
    const data = [];
    
    // Function to place 16 teeth along a curve
    const generateArch = (isUpper: boolean) => {
      const yOffset = isUpper ? 0.3 : -0.3;
      for (let i = 1; i <= 8; i++) {
        // Calculate FDI numbers
        const rightId = (isUpper ? 10 : 40) + i; // Quad 1 or 4
        const leftId  = (isUpper ? 20 : 30) + i; // Quad 2 or 3

        const t = i / 8; // 0.125 to 1
        const angle = t * (Math.PI / 2.3); // Curve angle
        
        // Elliptical arch
        const x = Math.sin(angle) * 1.4;
        const z = Math.cos(angle) * 1.8;

        const type = i <= 2 ? 'incisor' : i === 3 ? 'canine' : 'molar';

        // Right side
        data.push({ id: rightId, pos: [x, yOffset, z] as [number, number, number], type });
        // Left side
        data.push({ id: leftId, pos: [-x, yOffset, z] as [number, number, number], type });
      }
    };

    generateArch(true);  // Upper
    generateArch(false); // Lower
    return data;
  }, []);

  const findingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    findings.forEach(f => {
      if (f.tooth_number) map[f.tooth_number] = f;
    });
    return map;
  }, [findings]);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'radial-gradient(circle at center, #1a1a2e 0%, #0a0a0a 100%)' }}>
      
      {/* HUD UI */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', minWidth: '220px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '8px', fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}>3D Jaw Explorer</h3>
        {hoveredTooth ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Tooth #{hoveredTooth}</div>
            {findingsMap[hoveredTooth] ? (
              <>
                <div style={{ color: beforeAfter === 'after' ? COLOR_MAP.Treated : (findingsMap[hoveredTooth].severity === 'High' ? COLOR_MAP.High : findingsMap[hoveredTooth].severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low), fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
                  {beforeAfter === 'after' ? 'Treated ✨' : findingsMap[hoveredTooth].condition}
                </div>
                {beforeAfter === 'before' && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>{findingsMap[hoveredTooth].explanation}</div>
                )}
              </>
            ) : (
              <div style={{ color: COLOR_MAP.Healthy, fontSize: '0.9rem', marginTop: '4px', fontWeight: 500 }}>Healthy</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Interact with the 3D model to inspect specific AI findings.</div>
        )}
      </div>

      <Canvas camera={{ position: [0, 1.5, -6], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <spotLight position={[5, 10, -5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <spotLight position={[-5, -10, 5]} angle={0.3} penumbra={1} intensity={0.5} color="#4cc9f0" />
        <Environment preset="studio" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group rotation={[0, Math.PI, 0]}>
            {/* Upper and Lower Gums */}
            <Gums position={[0, 0.45, 0]} rotation={[0, 0, 0]} />
            <Gums position={[0, -0.45, 0]} rotation={[0, 0, Math.PI]} />

            {/* Teeth */}
            {teethData.map(tooth => {
              const f = findingsMap[tooth.id];
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
                <Tooth 
                  key={tooth.id} 
                  position={tooth.pos} 
                  toothNumber={tooth.id} 
                  toothType={tooth.type as any}
                  color={color} 
                  isIssue={isIssue}
                  onHover={setHoveredTooth}
                />
              );
            })}
          </group>
        </Float>

        <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} far={4} color="#000000" />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={10} autoRotate={!hoveredTooth} autoRotateSpeed={0.8} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
}
