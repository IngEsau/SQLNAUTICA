import React, { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Ajusta las rutas según tu árbol de proyecto:
import videoBg from "../../../assets/videoBg.mp4";
import menuMusic from "../../../songs/inicio.mp3";
import "./HomeScreen.css";

type Props = {
  onStart?: () => void; // opcional: navegar o abrir siguiente pantalla
};

const Landing: React.FC<Props> = ({ onStart }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const triedAutoplayRef = useRef(false);

  // Intento silencioso de reproducir tras montar (fallará en la mayoría de navegadores).
  useEffect(() => {
    if (!audioRef.current || triedAutoplayRef.current) return;
    triedAutoplayRef.current = true;
    audioRef.current.volume = 0.6;
    audioRef.current.loop = true;
    audioRef.current.play().catch(() => {
      // Ignorado: se resolverá en la primera interacción del usuario
    });
  }, []);

  // Primer gesto del usuario => reproducir audio
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const handleStart = () => {
    ensureAudio();
    onStart?.(); // navega o abre la siguiente vista si pasas esta prop
  };
  const navigate = useNavigate();

  return (
    <div className="">
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        id="background-video"
        className="background-video"
      >
        <source src={videoBg} type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>

      {/* Capa oscura */}
      <div className="overlay" />

      {/* Contenido principal */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-screen w-full"
        onPointerDown={ensureAudio}
        onKeyDown={ensureAudio}
      >
        <div className="text-center flex flex-col gap-y-16 space-y-8">
          <h1 className="title">sqlnautica</h1>
          <p className="description">
            ¡Aprende SQL en una aventura submarina interactiva!
          </p>
          <div className="flex mt-20 place-content-center">
            <button className="cta-btn" onClick={() => navigate('Login')}>
              Comenzar misión
            </button>
          </div>
        </div>
      </div>

      {/* Audio (controlado por React en vez de script externo) */}
      <audio ref={audioRef} src={menuMusic} id="menuMusic" />
    </div>
  );
};

export default Landing;
