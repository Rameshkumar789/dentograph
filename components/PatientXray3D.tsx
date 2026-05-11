'use client';
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const COLOR_MAP = {
  Healthy: '#4cc9f0',
  Low: '#fca311',
  Medium: '#f77f00',
  High: '#d62828',
  Treated: '#2a9d8f'
};

function GlowingMarker({ position, color, data, onHover }: { position: [number, number, number], color: string, data: any, onHover: (d: any) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(clock.elapsedTime * 4) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover(data); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); onHover(null); }}
      >
        <sphereGeometry args={[hovered ? 0.4 : 0.25, 32, 32]} />
        <meshBasicMaterial color={hovered ? '#ffffff' : color} transparent opacity={0.8} />
      </mesh>
      {/* Outer Glow */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function XrayScene({ findingsMap, markers, imageUrl, beforeAfter, setHoveredData }: { findingsMap: any, markers: any[], imageUrl: string, beforeAfter: string, setHoveredData: (d: any) => void }) {
  // Use Drei's robust useTexture hook inside the Canvas context
  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <ambientLight intensity={1} />
      
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <group rotation={[0, Math.PI, 0]}>
          
          {/* The 2D X-Ray bent into a 3D Panoramic Cylinder! */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[5, 5, 6, 64, 1, true, 0, Math.PI]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.85} />
          </mesh>

          {/* Glowing AI Issue Markers projected onto the 3D X-ray */}
          {markers.map(marker => {
            let color = COLOR_MAP.Healthy;
            if (beforeAfter === 'after') {
              color = COLOR_MAP.Treated;
            } else {
              color = marker.data.severity === 'High' ? COLOR_MAP.High : marker.data.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low;
            }

            return (
              <GlowingMarker 
                key={marker.id} 
                position={marker.pos} 
                color={color} 
                data={marker.data}
                onHover={setHoveredData} 
              />
            );
          })}
        </group>
      </Float>

      <OrbitControls enablePan={true} minDistance={3} maxDistance={15} />
    </>
  );
}

export default function PatientXray3D({ findings, imageUrl, beforeAfter }: { findings: any[], imageUrl: string, beforeAfter: 'before' | 'after' }) {
  const [hoveredData, setHoveredData] = useState<any | null>(null);

  const findingsMap = useMemo(() => {
    const map: Record<number, any> = {};
    findings.forEach(f => {
      if (f.tooth_number) map[f.tooth_number] = f;
    });
    return map;
  }, [findings]);

  // Calculate coordinates to map 2D FDI tooth numbers onto the 3D curved X-ray
  const markers = useMemo(() => {
    const arr = [];
    const radius = 5;
    
    for (const [key, f] of Object.entries(findingsMap)) {
      const toothNum = parseInt(key);
      if (f.condition === 'Healthy') continue;

      let isUpper = toothNum < 30;
      let isRightSide = toothNum >= 11 && toothNum <= 18 || toothNum >= 41 && toothNum <= 48;
      
      const pos = toothNum % 10;
      const centerAngle = Math.PI / 2;
      const angleSpread = Math.PI / 2.5;
      const angleOffset = (pos / 8) * angleSpread;
      
      const finalAngle = isRightSide ? centerAngle + angleOffset : centerAngle - angleOffset;
      
      const x = Math.cos(finalAngle) * radius;
      const z = Math.sin(finalAngle) * radius;
      const y = isUpper ? 1.5 : -1.5;

      arr.push({ id: toothNum, data: f, pos: [x, y, z] as [number, number, number] });
    }
    return arr;
  }, [findingsMap]);

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000' }}>
      
      {/* Disruptive HUD UI */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'rgba(0,0,0,0.7)', padding: '16px', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(12px)', border: '1px solid var(--primary)', minWidth: '250px' }}>
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', color: 'var(--primary)' }}>Patient-Specific 3D Reconstruction</h3>
        {hoveredData ? (
          <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Tooth #{hoveredData.tooth_number}</div>
            <div style={{ color: beforeAfter === 'after' ? COLOR_MAP.Treated : (hoveredData.severity === 'High' ? COLOR_MAP.High : hoveredData.severity === 'Medium' ? COLOR_MAP.Medium : COLOR_MAP.Low), fontSize: '1rem', fontWeight: 600, marginTop: '4px' }}>
              {beforeAfter === 'after' ? 'Treated ✨' : hoveredData.condition}
            </div>
            {beforeAfter === 'before' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>{hoveredData.explanation}</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>Hover over the anomalies mapped directly onto the patient's spatial X-ray projection.</div>
        )}
      </div>

      <Canvas camera={{ position: [0, 0, -8], fov: 60 }}>
        <XrayScene findingsMap={findingsMap} markers={markers} imageUrl={imageUrl} beforeAfter={beforeAfter} setHoveredData={setHoveredData} />
      </Canvas>
    </div>
  );
}
