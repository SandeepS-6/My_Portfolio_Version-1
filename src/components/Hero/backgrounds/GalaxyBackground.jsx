import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { radius: 180, arms: 4, twist: 4.5, spin: 0.25 };

function GalaxySwarm() {
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
    const { radius, arms, twist, spin } = PARAMS;
    const g = 2.399963229728653;

    for (let i = 0; i < COUNT; i++) {
      const u = (i + 0.5) / COUNT;
      const r = radius * Math.pow(u, 0.55);
      const arm = (i % arms) / arms;
      const a =
        arm * 6.283185307179586 + r * twist * 0.055 + time * spin + i * g * 0.002;

      const bulge = 1.0 - u;
      const spread = bulge * bulge * radius * 0.12;
      const wave = Math.sin(r * 0.09 + a * 2.0);

      const x = Math.cos(a) * (r + spread * wave);
      const z = Math.sin(a) * (r + spread * wave);
      const y = radius * 0.015 * bulge * Math.sin(a * 6.0 + time * 0.8);

      target.set(x, y, z);

      const core = Math.exp(-r / (radius * 0.18));
      pColor.setHSL(
        0.6 - 0.47 * core,
        0.25 + 0.75 * (1.0 - core),
        0.45 + 0.5 * core,
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

function GalaxyBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 80, 140], fov: 60 }}>
        <fog attach="fog" args={["#000000", 60, 320]} />
        <GalaxySwarm />
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

export default GalaxyBackground;
