"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";

const HERO_MODEL_URL = "/3d-assests/3d%20iconglb.glb";

function HeroModelMesh() {
  const { scene } = useGLTF(HERO_MODEL_URL);

  return (
    <Center>
      <primitive object={scene} scale={1.15} />
    </Center>
  );
}

export default function HeroLogoModel() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5], fov: 34 }}
      gl={{ alpha: true, antialias: true }}
      className="h-full w-full"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 4]} intensity={1.25} />
      <directionalLight position={[-3, -2, -4]} intensity={0.45} />
      <Suspense fallback={null}>
        <HeroModelMesh />
        <Environment preset="city" />
      </Suspense>
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.65}
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}

useGLTF.preload(HERO_MODEL_URL);
