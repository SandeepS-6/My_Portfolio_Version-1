import { useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, Effects } from "@react-three/drei";
import { UnrealBloomPass } from "three-stdlib";
import * as THREE from "three";

extend({ UnrealBloomPass });

const COUNT = 20000;
const PARAMS = {
  gridDensity: 40,
  sep: 3.5,
  dropLength: 30,
  speedBase: 120,
  rotationSpeed: 0.5,
};

function MatrixSwarm() {
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
    const { gridDensity, sep, dropLength, speedBase, rotationSpeed } = PARAMS;
    const numStreams = gridDensity * gridDensity;

    for (let i = 0; i < COUNT; i++) {
      const streamId = i % numStreams;
      const pId = Math.floor(i / numStreams);

      if (pId >= dropLength) {
        target.set(0, 0, 0);
        pColor.setRGB(0, 0, 0);
      } else {
        const gridX = streamId % gridDensity;
        const gridZ = Math.floor(streamId / gridDensity);
        const off = (gridDensity * sep) / 2;

        const posX = gridX * sep - off;
        const posZ = gridZ * sep - off;

        const randOffset = Math.sin(streamId * 34.1234) * 1000.0;
        const fallSpeed =
          speedBase * (0.6 + Math.abs(Math.cos(streamId * 78.4321)) * 0.8);

        const boundsY = gridDensity * sep;
        const halfBoundsY = boundsY / 2;
        const spacingY = sep * 0.8;

        const headY =
          (-((time + randOffset) * fallSpeed) % boundsY + boundsY) % boundsY;
        const posY =
          ((headY + pId * spacingY) % boundsY + boundsY) % boundsY -
          halfBoundsY;

        const angle = time * rotationSpeed;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotatedX = posX * cosA - posZ * sinA;
        const rotatedZ = posX * sinA + posZ * cosA;

        const tiltAngle = 0.3;
        const cosT = Math.cos(tiltAngle);
        const sinT = Math.sin(tiltAngle);
        const finalY = posY * cosT - rotatedZ * sinT;
        const finalZ = posY * sinT + rotatedZ * cosT;

        target.set(rotatedX, finalY, finalZ);

        const isHead = pId === 0 ? 1.0 : 0.0;
        const tailFade = pId / dropLength;
        const flicker =
          Math.max(0.0, Math.sin(time * 20.0 + i * 0.5)) * 0.15;
        const light =
          isHead * 0.98 +
          (1.0 - isHead) * Math.max(0.01, 0.6 - tailFade * 1.0 + flicker);

        pColor.setHSL(0.333, 1.0 - isHead * 0.8, light);
      }

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

function MatrixBackground() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 160], fov: 60 }}>
        <fog attach="fog" args={["#000000", 60, 320]} />
        <MatrixSwarm />
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

export default MatrixBackground;
