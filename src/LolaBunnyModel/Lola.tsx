import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Model = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
    const labelRef2 = useRef<HTMLDivElement | null>(null)
  const [soundRef, setSoundRef] = useState<THREE.Audio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

const fondito = new THREE.TextureLoader();
fondito.load('/planetas.jpg', (texture) => {
    scene.background = texture;
  });

scene.fog = new THREE.Fog(0x0d0d2b, 10, 40);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(2, 9, 5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 3; // Mínimo alejado de la cámara al objeto
    controls.maxDistance = 5; // Máximo acercamiento
    controls.minAzimuthAngle = -Math.PI / 3; 
    controls.maxAzimuthAngle = Math.PI / 2; 

    
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      "/Looney-Tunes-en-Latino-Día-del-presidente_-con-Lola-Bunny-WB-Kids.ogg",
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        setSoundRef(sound);
      }
    );






    const modelGroup = new THREE.Group(); // contenedor del modelo
    scene.add(modelGroup);

    const targetPosition = new THREE.Vector3(); // punto que seguirá la etiqueta

    const loader = new GLTFLoader();
    loader.load(
      "/lola_bunny.glb",
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        modelGroup.add(model);

          // Piso
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(5, 1, 5),
      new THREE.MeshStandardMaterial({ color: 0x444444 })
    );
    floor.position.y = 0.6;
    scene.add(floor);

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
const particleCount = 220;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const angles = new Float32Array(particleCount); // nuevo: ángulo para movimiento

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 20;
  positions[i3 + 1] = (Math.random() - 0.5) * 10;
  positions[i3 + 2] = (Math.random() - 0.5) * 20;
  angles[i] = Math.random() * Math.PI * 2;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute(
  "angle",
  new THREE.Float32BufferAttribute(angles, 1)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff9300,
  size: 0.1,
  transparent: true,
  opacity: 0.8,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

       // Partículas flotando (simple movimiento)
     const posAttr = particles.geometry.getAttribute("position");
const angleAttr = particles.geometry.getAttribute("angle");

for (let i = 0; i < particleCount; i++) {
  const angle = angleAttr.getX(i) + 0.01; // incrementamos el ángulo

  posAttr.setX(i, posAttr.getX(i) + Math.cos(angle) * 0.04); // movimiento circular
  posAttr.setY(i, posAttr.getY(i) + Math.sin(angle * 0.5) * 0.01); // leve flotación

  angleAttr.setX(i, angle); // actualizamos ángulo
}

posAttr.needsUpdate = true;
angleAttr.needsUpdate = true;

      renderer.render(scene, camera);

   if (labelRef.current && targetPosition) {
  const screenPos = targetPosition.clone().project(camera);

  const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (screenPos.y * 0.5 + 0.5)) * window.innerHeight;

  // Nombre (arriba del personaje)
  labelRef.current.style.transform = `translate(-50%, 20%) translate(${x}px, ${y}px)`;

  // Descripción (a la derecha del personaje)
  if (labelRef2.current) {
    const offsetX = 400; // píxeles a la derecha
    const offsetY = 100; // puedes ajustar si quieres moverlo verticalmente

    labelRef2.current.style.transform = `translate(-50%, -30%) translate(${x + offsetX}px, ${y + offsetY}px)`;
  }
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
    background: "rgba(0, 0, 0, 0.7)",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "16px",
    zIndex: 10,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    fontFamily: '"Comic Sans MS", "cursive"',
    letterSpacing: "0.5px",
    textShadow: "1px 1px 2px black",
    border: "2px solid white",
  }}
>
  Lola Bunn
</div>

<div  
  ref={labelRef2}
  style={{
    position: "absolute",
    color: "white",
    background: "rgba(0, 0, 0, 0.6)",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "14px",
    zIndex: 9,
    pointerEvents: "none",
    maxWidth: "300px",
    lineHeight: "1.6",
    fontFamily: '"Comic Sans MS", "cursive"',
    letterSpacing: "0.3px",
    textShadow: "1px 1px 2px black",
    border: "1.5px solid white",
  }}
>
  Lola Bunny es un personaje del universo Looney Tunes, conocida por su habilidad en el baloncesto. Apareció por primera vez en Space Jam (1996) como una jugadora ágil, precisa y segura de sí misma, destacando en el equipo Tune Squad junto a Bugs Bunny. Es rápida, competitiva y con gran destreza en la cancha. En Space Jam: A New Legacy (2021), su diseño fue actualizado para enfocarse más en su rol deportivo y de liderazgo, resaltando su talento y trabajo en equipo.

</div>



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
    </div>
  );
};

export default Model;