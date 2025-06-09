import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import InfoPersonaje from "../InfoPersonaje/InfoPersonaje";


const Model = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [soundRef, setSoundRef] = useState<THREE.Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Escena, cámara, renderer
    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0xeeeeee); //Color de fondo

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

   // Luz 1 abajo
const directionalLight = new THREE.DirectionalLight(0x00ffff, 2.5);
directionalLight.position.set(0, -8, 2);
scene.add(directionalLight);

// Luz 2 izquierda
const directionalLight2 = new THREE.DirectionalLight(0x6633ff, 3);
directionalLight2.position.set(-3, 2, -1);
scene.add(directionalLight2);

// Luz 3 derecha
const directionalLight3 = new THREE.DirectionalLight(0xff77cc, 3);
directionalLight3.position.set(3, 2, -1);
scene.add(directionalLight3);


    //Base Modelo
    const baseModelo = new THREE.Mesh(
    new THREE.CylinderGeometry (0.75, 0.75, 0.1, 20)
    );
    baseModelo.position.y = -1.1;
    scene.add(baseModelo);

    //Cristal
    const cristal = new THREE.Mesh(
    new THREE.CylinderGeometry (0.8, 0.8, 2, 20),
    new THREE.MeshPhongMaterial({
      color:0xb5b5b5,
      opacity: 0.2,
      transparent: true,
      })
    );
    cristal.position.y = -0.15;
    scene.add(cristal);

    // Cargar textura
    const textureLoader = new THREE.TextureLoader();
    const floorTexture = textureLoader.load('piso_madera.jpg');
    const techoTextura = textureLoader.load('techo.png');
    const Pared1Textura = textureLoader.load('pared1.png');
    const Pared2Textura = textureLoader.load('pared2.png');
    const Pared3Textura = textureLoader.load('pared3.png');
    const Pared4Textura = textureLoader.load('pared4.png');

    // Repetir y ajustar si es necesario
    techoTextura.wrapS = techoTextura.wrapT = THREE.RepeatWrapping;
    techoTextura.repeat.set(2, 2); 

    // Crear material con la textura
    const floorMaterial = new THREE.MeshBasicMaterial({
      map: floorTexture,
      color: 0x7c7c7c, //oscurece la textura
    });

    const techoMaterial = new THREE.MeshBasicMaterial({
      map: techoTextura,
      color: 0x7c7c7c, //oscurece la textura
    });

    const Pared1Material = new THREE.MeshBasicMaterial({
      map: Pared1Textura,
      color: 0x7c7c7c, //oscurece la textura
    });

     const Pared2Material = new THREE.MeshBasicMaterial({
      map: Pared2Textura,
      color: 0x7c7c7c, //oscurece la textura
    });

    const Pared3Material = new THREE.MeshBasicMaterial({
      map: Pared3Textura,
      color: 0x7c7c7c, //oscurece la textura
    });

    const Pared4Material = new THREE.MeshBasicMaterial({
      map: Pared4Textura,
      color: 0x7c7c7c, //oscurece la textura
    });



    
    // piso
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.01, 8),
      floorMaterial,
    );
    floor.position.y = -1.2;
    scene.add(floor);

    // Techo
    const techo = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.01, 8),
      techoMaterial,
    );
    techo.position.y = 2.8;
    scene.add(techo);

    // Pared 1
    const pared1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 4, 8),
      Pared1Material
    );
    pared1.position.x = 4;
    pared1.position.y = 0.8;
    scene.add(pared1);

    // Pared 2
    const pared2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 4, 8),
      Pared2Material
    );
    pared2.position.x = -4;
    pared2.position.y = 0.8;
    scene.add(pared2);

    // Pared 3
    const pared3 = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 0.01),
      Pared3Material
    );
    pared3.position.z = 4;
    pared3.position.y = 0.8;
    scene.add(pared3);

    // Pared 4
    const pared4 = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4, 0.01),
      Pared4Material
    );
    pared4.position.z = -4;
    pared4.position.y = 0.8;
    scene.add(pared4);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    controls.minPolarAngle = Math.PI / 3.9; //Rotacion arriba
    controls.maxPolarAngle = Math.PI / 1.8; //Rotacion abajo

    controls.minDistance = 2; // Mínimo alejado de la cámara al objeto
    controls.maxDistance = 4; // Máximo acercamiento
    
    controls.enablePan = false; //Limitar paneo (desactivado)
    
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create a global audio source
    const sound = new THREE.Audio(listener);

    // Cargar cancion
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      "/El Hechicero.ogg",
      function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        setSoundRef(sound);
      }
    );

    // Cargar modelo GLB/GLTF
    const loader = new GLTFLoader();
    loader.load(
      "/patoEspacial.glb", // asegúrate de que la ruta sea correcta
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.2, 1.2, 1.2);
        model.position.y = -1;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error al cargar modelo:", error);
      }
    );

    // PARTICULAS flotantes
const particleCount = 100;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
const angles = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  speeds[i] = 0.002 + Math.random() * 0.003;
  angles[i] = Math.random() * Math.PI * 2;
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  vertexColors: true,
  size: 0.1,
  transparent: true,
  opacity: 0.6,
});

const colors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  colors[i * 3] = 0.5 + Math.random() * 0.5;   // R
  colors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G
  colors[i * 3 + 2] = 0.8 + Math.random() * 0.2; // B
}
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors,2));

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);



// Animación 
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();

  const time = performance.now() * 0.001;
  const pos = particles.geometry.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < particleCount; i++) {
    const ix = i * 3;

    // Movimiento espiral dinámico
    const radius = 1.5 + Math.sin(time + i) * 0.3;
    angles[i] += 0.01 + Math.random() * 0.002;
    pos.array[ix] = Math.cos(angles[i]) * radius;
    pos.array[ix + 2] = Math.sin(angles[i]) * radius;

    // Suben con velocidad variable
    pos.array[ix + 89] += speeds[i];

    // Pulso tipo "parpadeo espacial"
    const scale = 0.1 + 0.05 * Math.sin(time * 5 + i);
    particles.material.size = scale;

    // Reinicio de partícula si sube demasiado
    if (pos.array[ix + 1] > 5) {
      pos.array[ix + 1] = -5;
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.002 + Math.random() * 0.003;
    }
  }

  pos.needsUpdate = true;
  renderer.render(scene, camera);
};

animate();



    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);



 // Handlers
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


      {/* Botones de audio */}
      <div
  style={{
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 10,
    display: "flex",
    gap: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "2px solid #fff",
    backdropFilter: "blur(6px)",
  }}
>
  <button
    onClick={handlePlaySound}
    disabled={isPlaying}
    style={{
      padding: "8px 16px",
      borderRadius: "8px",
      border: "2px solid #222",
      backgroundColor: isPlaying ? "#ccc" : "#ffcf33",
      color: "#000",
      fontFamily: '"Comic Sans MS", "cursive"',
      fontSize: "16px",
      cursor: isPlaying ? "not-allowed" : "pointer",
      transition: "transform 0.2s",
      boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    ▶️ Play
  </button>

  <button
    onClick={handlePauseSound}
    disabled={!isPlaying}
    style={{
      padding: "8px 16px",
      borderRadius: "8px",
      border: "2px solid #222",
      backgroundColor: !isPlaying ? "#ccc" : "#66d9ef",
      color: "#000",
      fontFamily: '"Comic Sans MS", "cursive"',
      fontSize: "16px",
      cursor: !isPlaying ? "not-allowed" : "pointer",
      transition: "transform 0.2s",
      boxShadow: "2px 2px 4px rgba(0,0,0,0.4)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    ⏸️ Pause
  </button>
</div>
  <InfoPersonaje /> {/* Card personaje */}
    </div>
  );
};

export default Model;