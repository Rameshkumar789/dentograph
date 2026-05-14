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
  onHover,
  onSelect,
  isSelected,
  progression = 0
}: { 
  position: [number, number, number], 
  toothNumber: number, 
  color: string, 
  isIssue: boolean,
  onHover: (num: number | null) => void,
  onSelect: (num: number) => void,
  isSelected: boolean,
  progression?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle pulsing animation for teeth with issues
  useFrame(() => {
    if ((isIssue || isSelected) && meshRef.current) {
      const time = performance.now() / 1000;
      // Faster, more intense pulse if selected or progressing
      const speed = isSelected ? 5 : 3;
      const amplitude = isSelected ? 0.08 : 0.05;
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * amplitude;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(toothNumber); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); }}
        onClick={(e) => { e.stopPropagation(); onSelect(toothNumber); }}
      >
        <capsuleGeometry args={[0.15, 0.2, 8, 16]} />
        <meshStandardMaterial 
          color={isSelected ? '#ffffff' : hovered ? '#ffffff' : color} 
          roughness={0.2}
          metalness={0.1}
          emissive={isSelected ? '#3b82f6' : isIssue ? color : '#000000'}
          emissiveIntensity={isSelected ? 1.0 + progression : isIssue ? 0.4 + (progression * 0.5) : 0}
        />
      </mesh>
      <Text
        position={[0, position[1] > 0 ? 0.35 : -0.35, 0]}
        fontSize={isSelected ? 0.25 : 0.15}
        color={isSelected ? '#3b82f6' : isIssue ? color : "#888888"}
        anchorX="center"
        anchorY="middle"
        fontWeight={isSelected ? 800 : 400}
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
  onSelectTooth?: (num: number) => void,
  progression?: number
}) {
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);

  // Generate procedural arch coordinates based on FDI notation
  const teethData = useMemo(() => {
    const data = [];
    const radiusX = 1.5;
    const radiusZ = 2.0;

    // Upper Arch (Quadrants 1 & 2)
    for (let i = 1; i <= 8; i++) {
      const angle1 = (i / 8) * (Math.PI / 2.5);
      data.push({ id: 10 + i, pos: [Math.sin(angle1) * radiusX, 0.4, Math.cos(angle1) * radiusZ] as [number, number, number] });
      const angle2 = -(i / 8) * (Math.PI / 2.5);
      data.push({ id: 20 + i, pos: [Math.sin(angle2) * radiusX, 0.4, Math.cos(angle2) * radiusZ] as [number, number, number] });
    }

    // Lower Arch (Quadrants 4 & 3)
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
    findings.forEach(f => {
      if (f.tooth_number) map[f.tooth_number] = f;
    });
    return map;
  }, [findings]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 2, -5], fov: 45 }}>
        <color attach="background" args={['#f8fafc']} />
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
                  onSelect={onSelectTooth || (() => {})}
                  isSelected={selectedTooth === tooth.id}
                  progression={progression}
                />
              );
            })}
          </group>
        </Float>

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate={!hoveredTooth && !selectedTooth} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
