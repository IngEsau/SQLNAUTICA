import React from "react";
import bgImage from "../../../assets/background_eidolon.png";
import audifonos from "../../../assets/audifonos.png";
import Text from "../../Text/Text.tsx";
import F11 from "../../../assets/f11.png";
import GeneralLetra from "../../../GeneralLetra.css";
import Card from "../../Card/Card";
import Boton from '../../Button/Button.tsx';
import '../../../GeneralLetra.css';
import { useNavigate } from "react-router-dom";

const Audifono = () => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-cover bg-no-repeat place-items-center place-content-center font-jetbrains lg:h-screen"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-2">
        <div className="flex flex-col text-center xl:text-start pl-10">
          <Text variant="eidolon" children="EIDOLON" className="font-jetbrains font-bold"/>
          <Text variant="eidolon_subtitulo" children="EL SUMERGIBLE Y SUS REGISTROS" className="font-jetbrains"/>
        </div>
        <div className="flex place-content-center align-items-center lg:pl-20">
            <Card/>
        </div>
      </div>
        <div className="flex justify-content-center text-center px-10 py-10">
            <Text children="Solo quien sepa “leer” esa huella digital —construida en tablas y consultas— podrá reactivar sistemas, abrir compuertas y reclamar el tesoro que el tiempo ocultó. Tu misión es: reconstruir la base de datos del Eidolon, interrogarla y extraer la verdad."/>
        </div>
      <div className="pb-10">
        <Boton children="Siguiente" variant="exclusive" onClick={() => navigate('/MissionOne')}/>
      </div>
    </div>
  );
};

export default Audifono;
