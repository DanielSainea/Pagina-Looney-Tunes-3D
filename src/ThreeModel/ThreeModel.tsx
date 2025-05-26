
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Model = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const [soundRef, setSoundRef] = useState<THREE.Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xff45f, 10, 15);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(2, 4, 5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.8;

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      "/Music.ogg",
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        setSoundRef(sound);
      }
    );

////////////// contenedor del cube 
    const cubeGroup = new THREE.Group(); // contenedor del modelo
    scene.add(cubeGroup);

    const targetPositionCube = new THREE.Vector3(); // punto que seguirá la etiqueta


 ////////////// cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
    const cube = new THREE.Mesh( geometry, material ); 
    cubeGroup.add(cube);

    cube.position.set(1,1,1);

    /////////// centrar target 7////// 
     // Establece un punto como "cabeza" del modelo (ajústalo si no queda bien)
        cube.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(cube);
        const center = new THREE.Vector3();
        box.getCenter(center);
        center.y += 1; // eleva la etiqueta para que aparezca encima
        targetPositionCube.copy(center);


        ///////////////////// MODElADO




    const modelGroup = new THREE.Group(); // contenedor del modelo
    scene.add(modelGroup);

    const targetPosition = new THREE.Vector3(); // punto que seguirá la etiqueta

    const loader = new GLTFLoader();
    loader.load(
      "/werewolf_warrior.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        modelGroup.add(model);

        // Establece un punto como "cabeza" del modelo (ajústalo si no queda bien)
        model.updateWorldMatrix(true, true);
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        center.y += 1; // eleva la etiqueta para que aparezca encima
        targetPosition.copy(center);


      },


      undefined,
      (error) => {
        console.error("Error al cargar modelo:", error);
      }
    );

     // PARTICULAS flotantes
    const particleCount = 600;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20; // rango -10 a 10
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

       // Partículas flotando (simple movimiento)
      const pos = particles.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 1; i < pos.count; i += 3) {
        pos.array[i] += 0.1; // eje Y
        if (pos.array[i] > 10) pos.array[i] = -10;
      }
      pos.needsUpdate = true;

      renderer.render(scene, camera);

      // Actualiza posición de la etiqueta flotante
      if (labelRef.current && targetPosition) {
        const screenPos = targetPosition.clone().project(camera);

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (1 - (screenPos.y * 0.5 + 0.5)) * window.innerHeight;

        labelRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
     
        

    }
    };

       

    animate();

    window.addEventListener("resize", onWindowResize);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return () => {
      renderer.dispose();
      window.removeEventListener("resize", onWindowResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const handlePlaySound = () => {
    if (soundRef && !soundRef.isPlaying) {
      soundRef.play();
      setIsPlaying(true);
    }
  };

  const handlePauseSound = () => {
    if (soundRef && soundRef.isPlaying) {
      soundRef.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Canvas 3D */}
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Etiqueta flotante */}
      <div
        ref={labelRef}
        style={{
          position: "absolute",
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "14px",
          zIndex: 10,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        👹 Hombre Lobo
      </div>

      

      {/* Botones de audio */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 10,
          display: "flex",
          gap: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <button onClick={handlePlaySound} disabled={isPlaying}>
          ▶️ Play
        </button>
        <button onClick={handlePauseSound} disabled={!isPlaying}>
          ⏸️ Pause
        </button>
      </div>
    </div>
  );
};

export default Model;