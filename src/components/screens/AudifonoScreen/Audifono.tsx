import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import bgImage from "../../../assets/background_audifonos.png";
import audifonos from "../../../assets/audifonos.png";
import Text from "../../Text/Text.tsx";
import F11 from "../../../assets/f11.png";
import "../../../GeneralLetra.css"; // importa como hoja global, no como default

const Audifono: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/eidolon"); 
    }, 6000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="bg-cover bg-no-repeat place-items-center place-content-center font-jetbrains h-screen flex flex-col justify-center items-center gap-6 text-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <img src={audifonos} alt="Audífonos" />

      <Text variant="subtitle">SUGERENCIA:</Text>
      <Text variant="subtitle">
        USA AUDÍFONOS PARA UNA EXPERIENCIA INMERSIVA
      </Text>

      <div className="flex flex-row gap-2 items-center">
        <Text variant="body">También puedes poner la pantalla completa</Text>
        <img src={F11} alt="F11" />
        <Text variant="body">para una experiencia completa</Text>
      </div>
    </div>
  );
};

export default Audifono;
