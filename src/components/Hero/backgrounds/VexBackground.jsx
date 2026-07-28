import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { flow: 0.15, glitch: 1, scale: 300 };

function VexSwarm() {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < COUNT; i++) {
      pos.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 100,
        ),
      );
    }
    return pos;
  }, []);

  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: 0xffffff }),
    [],
  );
  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.25), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const { flow, glitch, scale } = PARAMS;
    const gridSize = Math.max(2.0, Math.ceil(Math.pow(COUNT, 0.333333)));
    const halfGrid = gridSize * 0.5;

    for (let i = 0; i < COUNT; i++) {
      const gx = (i % gridSize) - halfGrid;
      const gy = (Math.floor(i / gridSize) % gridSize) - halfGrid;
      const gz = Math.floor(i / (gridSize * gridSize)) - halfGrid;
      const nx = gx / halfGrid;
      const ny = gy / halfGrid;
      const nz = gz / halfGrid;
      const dist = Math.max(0.0001, Math.sqrt(nx * nx + ny * ny + nz * nz));
      const pulse = Math.sin(dist * 12.0 - time * flow * 4.0);
      const gNoise = Math.sin(i * 98.72 + time * flow * 15.0);
      const isGlitch = Math.max(
        0.0,
        Math.min(1.0, (gNoise - (1.0 - glitch)) * 50.0),
      );

      const t = time * 0.1 * flow;
      const c1 = Math.cos(t);
      const s1 = Math.sin(t);
      const c2 = Math.cos(t * 1.618);
      const s2 = Math.sin(t * 1.618);

      const rx = nx * c1 - nz * s1;
      const rz = nx * s1 + nz * c1;
      const ry = ny * c2 - rz * s2;
      const rz2 = ny * s2 + rz * c2;

      const gOffset = 0.5 * isGlitch;
      const fx = rx + Math.cos(time * 41.0 + i) * gOffset;
      const fy = ry + Math.sin(time * 37.0 + i) * gOffset;
      const fz = rz2 + Math.cos(time * 29.0 + i) * gOffset;
      const expand = 1.0 + Math.max(0.0, pulse) * 0.2;

      target.set(
        fx * scale * expand,
        fy * scale * expand,
        fz * scale * expand,
      );

      const baseHue = 0.52 + pulse * 0.03;
      const hue = baseHue * (1.0 - isGlitch) + 0.03 * isGlitch;
      const pSq = Math.max(0.0, pulse * pulse * pulse);
      const sat = 0.8 * (1.0 - pSq) * (1.0 - isGlitch) + 1.0 * isGlitch;
      const lit = 0.15 + pSq * 0.6 + isGlitch * 0.6;

      pColor.setHSL(
        Math.abs(hue % 1.0),
        sat,
        Math.max(0.0, Math.min(1.0, lit)),
      );

      positions[i].lerp(target, 0.1);
      dummy.position.copy(positions[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, pColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} />;
}

function VexBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 420], fov: 60 }}>
        <fog attach="fog" args={["#000000", 80, 600]} />
        <VexSwarm />
        <OrbitControls
          autoRotate
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}

export default VexBackground;
