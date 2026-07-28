import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = { speed: 1, amplitude: 2 };

function RaysSwarm() {
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
    const simSpeed = PARAMS.speed;
    const waveAmp = PARAMS.amplitude;

    for (let i = 0; i < COUNT; i++) {
      let x = 0;
      let y = 0;
      let z = 0;
      let h = 0;
      let s = 0;
      let l = 0;

      const rx = Math.abs(Math.sin(i * 13.456) * 43758.545) % 1;
      const ry = Math.abs(Math.sin(i * 45.678) * 43758.545) % 1;
      const rz = Math.abs(Math.sin(i * 78.912) * 43758.545) % 1;
      const p = i / COUNT;

      if (p < 0.05) {
        x = -20 + rx * 0.5;
        y = 10 + ry * 10;
        z = -10 + rz * 20;
        h = 0.1;
        s = 0.1;
        l = 0.8 + rx * 0.1;
      } else if (p < 0.15) {
        x = 10 + rx * 1.0;
        y = 0 + ry * 20;
        z = -10 + rz * 20;
        h = 0.6;
        s = 0.2;
        l = 0.5 + ry * 0.2;
      } else if (p < 0.3) {
        x = 40 + rx * 5.0;
        y = -20 + ry * 40;
        z = -10 + rz * 20;
        h = 0.7;
        s = 0.1;
        l = 0.2 + rz * 0.1;
      } else {
        const rayBase = COUNT * 0.3;
        const rayTotal = COUNT * 0.7;
        const localI = i - rayBase;
        const typeCount = rayTotal / 4;
        const type = Math.floor(localI / typeCount);
        const pType = localI % typeCount;
        const tRatio = pType / typeCount;

        let startY = 0;
        let endX = 0;
        let hue = 0;
        let speed = 0;
        let freq = 0;
        let waveScale = 0;

        if (type === 0) {
          startY = 15;
          endX = -20;
          hue = 0.0;
          speed = 10;
          freq = 0.0;
          waveScale = 0.0;
        } else if (type === 1) {
          startY = 5;
          endX = 10;
          hue = 0.5;
          speed = 25;
          freq = 2.0;
          waveScale = 1.5;
        } else if (type === 2) {
          startY = -5;
          endX = 42.5;
          hue = 0.75;
          speed = 40;
          freq = 1.5;
          waveScale = 1.2;
        } else {
          startY = -15;
          endX = 55;
          hue = 0.33;
          speed = 50;
          freq = 3.0;
          waveScale = 0.8;
        }

        if (tRatio < 0.1) {
          const theta = rx * Math.PI * 2;
          const phi = Math.acos(2 * ry - 1);
          const r = 1.5 + Math.sin(time * 5 + type) * 0.2;

          x = -50 + r * Math.sin(phi) * Math.cos(theta);
          y = startY + r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);

          h = hue;
          s = 0.9;
          l = 0.6 + Math.sin(time * 10 + localI) * 0.2;
        } else {
          const emRatio = (tRatio - 0.1) / 0.9;
          const rayDist = endX - -50;

          h = hue;
          s = 0.9;

          if (type === 0) {
            const clumpStep = Math.floor(emRatio * 20) / 20;
            const travel =
              (time * speed * simSpeed + clumpStep * rayDist) % rayDist;
            x = -50 + travel + (rx - 0.5) * 1.5;
            y = startY + (ry - 0.5) * 1.5;
            z = (rz - 0.5) * 1.5;
            l = 0.6 - Math.pow(travel / rayDist, 3.0) * 0.5;
          } else if (type === 1) {
            const travel =
              (time * speed * simSpeed + emRatio * rayDist) % rayDist;
            x = -50 + travel;
            y =
              startY +
              (rx - 0.5) * 2.0 +
              Math.sin(travel * 0.5) * waveAmp * 0.5;
            z =
              (rz - 0.5) * 2.0 + Math.cos(travel * 0.5) * waveAmp * 0.5;
            l = 0.6 - Math.pow(travel / rayDist, 3.0) * 0.5;
          } else {
            const travel =
              (time * speed * simSpeed + emRatio * rayDist) % rayDist;
            x = -50 + travel;
            const phase = travel * freq;
            const isEField = localI % 2 === 0;
            const thickness = 0.3;

            if (isEField) {
              y =
                startY +
                Math.sin(phase) * waveAmp * waveScale +
                (ry - 0.5) * thickness;
              z = (rz - 0.5) * thickness;
            } else {
              y = startY + (ry - 0.5) * thickness;
              z =
                Math.sin(phase) * waveAmp * waveScale +
                (rz - 0.5) * thickness;
            }
            l = 0.7 - Math.pow(travel / rayDist, 3.0) * 0.6;
          }
        }
      }

      target.set(x, y, z);
      pColor.setHSL(h, s, l);

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

function RaysBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
        <fog attach="fog" args={["#000000", 40, 220]} />
        <RaysSwarm />
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

export default RaysBackground;
