import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { radius: 120, arms: 4, twist: 3.5, spin: 0.4 };

function DrgSwarm() {
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
      const r = radius * Math.sqrt(u);
      const arm = (i % arms) / arms;
      const angle =
        arm * 6.283185307179586 + r * twist * 0.08 + i * g * 0.01 + time * spin;

      const wave = Math.sin(r * 0.18 - time * 1.2);
      const spread = (1.0 - u) * radius * 0.12;

      const x = Math.cos(angle) * (r + spread * wave);
      const z = Math.sin(angle) * (r + spread * wave);
      const y =
        (1.0 - u) * (1.0 - u) * radius * 0.08 * Math.sin(angle * 3.0 + time);

      target.set(x, y, z);
      pColor.setHSL(0.6 - 0.08 * (1.0 - u), 0.55 + 0.45 * u, 0.95 - 0.55 * u);

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

function DrgBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 60, 120], fov: 60 }}>
        <fog attach="fog" args={["#000000", 40, 260]} />
        <DrgSwarm />
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

export default DrgBackground;
