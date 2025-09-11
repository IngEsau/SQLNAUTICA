import React from "react";
import {GeneralColors} from '../../GeneralColors/GeneralColors.tsx';


// Tipos de texto para ocupar en el proyecto
type TextVariant = "logo" | "title" | "subtitle" | "body" | "caption" | "eidolon" | "eidolon_subtitulo";

// Propiedades del texto 
type TextProps = {
    children: React.ReactNode;
    variant?: TextVariant;
    className?: string;
}


// Propiedades de diseño del texto
const variantClasses: Record<TextVariant, string> = {
    logo: `font-[400] text-[96px] bg-gradient-to-b from-[${GeneralColors.azulMedio}] via-[#ADDDFF] to-[#3A7199] bg-clip-text text-transparent`,
    title: "text-2xl font-bold",
    subtitle: "sm:text-[16px] md:text-[32px] py-[40px] font-[400]  text-[#8A9BA8]",
    eidolon: `w-[800] text-[96px] text-[${GeneralColors.blancoSuave}]`,
    eidolon_subtitulo: `w-[400] text-[48px] text-[${GeneralColors.blancoSuave}]`,
    body: `w-[400] text-[18px] text-[${GeneralColors.blancoSuave}]`,
    caption: ""
};

export default function Text({
    children,
    variant = "body",
    className = "",
    }: TextProps){
        return <p className={`${variantClasses[variant]} ${className}`}>{children}</p>;
    }