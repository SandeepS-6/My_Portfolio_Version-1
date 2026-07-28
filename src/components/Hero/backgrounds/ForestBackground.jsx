import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { forest: 180, height: 10, canopy: 4, sway: 0.6 };

function ForestSwarm() {
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
    const { forest: forestSize, height: treeHeight, canopy: canopySize, sway } =
      PARAMS;

    const trees = 1000;
    const partsPerTree = Math.floor(COUNT / trees);
    const cols = 32;

    for (let i = 0; i < COUNT; i++) {
      const treeIndex = Math.floor(i / partsPerTree);
      const local = i - treeIndex * partsPerTree;

      const gx = treeIndex % cols;
      const gz = Math.floor(treeIndex / cols);
      const spread = forestSize / cols;

      let baseX = (gx - cols * 0.5) * spread;
      let baseZ = (gz - cols * 0.5) * spread;

      const hash = Math.sin(treeIndex * 12.9898) * 43758.5453;
      const rnd = hash - Math.floor(hash);

      const height = treeHeight * (0.7 + rnd * 0.6);
      const canopy = canopySize * (0.8 + rnd * 0.5);
      const wind = Math.sin(time * 0.8 + treeIndex) * sway;

      baseX += wind * (0.3 + rnd);
      baseZ += Math.cos(time * 0.6 + treeIndex) * sway * 0.2;

      let x;
      let y;
      let z;

      if (local < partsPerTree * 0.3) {
        const t = local / (partsPerTree * 0.3);
        x = baseX + (rnd - 0.5) * 0.3;
        y = t * height;
        z = baseZ + (rnd - 0.5) * 0.3;
        pColor.setHSL(0.08 + rnd * 0.05, 0.6, 0.25);
      } else {
        const k = (local - partsPerTree * 0.3) / (partsPerTree * 0.7);
        const a = k * 6.28318 * 3.0;
        const r = Math.sqrt(k) * canopy;

        x = baseX + Math.cos(a) * r;
        y = height * 0.8 + Math.sin(k * 3.1415) * canopy;
        z = baseZ + Math.sin(a) * r;

        const green = 0.25 + rnd * 0.25 + Math.sin(time + treeIndex) * 0.05;
        pColor.setHSL(0.28 + rnd * 0.05, 0.7, green);
      }

      target.set(x, y, z);
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

function ForestBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 40, 120], fov: 60 }}>
        <fog attach="fog" args={["#000000", 40, 280]} />
        <ForestSwarm />
        <OrbitControls
          autoRotate
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          target={[0, 8, 0]}
        />
        <Effects disableGamma>
          <unrealBloomPass threshold={0} strength={1.8} radius={0.4} />
        </Effects>
      </Canvas>
    </div>
  );
}

export default ForestBackground;
