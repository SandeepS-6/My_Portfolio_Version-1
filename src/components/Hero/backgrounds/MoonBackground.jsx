import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { radius: 60, crater: 2.5, spin: 0.25 };

function MoonSwarm() {
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
    const { radius, crater, spin } = PARAMS;
    const t = time * spin;
    const ga = 2.399963229728653;

    for (let i = 0; i < COUNT; i++) {
      const f = i / (COUNT - 1);
      const y = 1 - 2 * f;
      const r = Math.sqrt(1 - y * y);
      const theta = i * ga + t * 0.25;

      let x = Math.cos(theta) * r;
      let z = Math.sin(theta) * r;

      const n =
        Math.sin(x * 18.0 + t * 0.2) *
        Math.sin(y * 22.0) *
        Math.sin(z * 18.0);

      const displacement = 1 + n * crater * 0.05;
      x *= radius * displacement;
      const yy = y * radius * displacement;
      z *= radius * displacement;

      const ct = Math.cos(t);
      const st = Math.sin(t);
      const rx = x * ct - z * st;
      const rz = x * st + z * ct;

      target.set(rx, yy, rz);

      const invLen = 1 / Math.sqrt(rx * rx + yy * yy + rz * rz);
      const light = Math.max(
        0,
        rx * invLen * 0.4 + yy * invLen * 0.7 + rz * invLen * 0.5,
      );
      const l = 0.25 + light * 0.55 + n * 0.05;
      pColor.setHSL(0, 0, l);

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

function MoonBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 40, 220]} />
        <MoonSwarm />
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

export default MoonBackground;
