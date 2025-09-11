// Button.tsx
import React from "react";
import { GeneralColors } from "../../GeneralColors/GeneralColors.tsx";

type ButtonVariant = "normal" | "exclusive";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void; 

};

const variantClasses: Record<ButtonVariant, string> = {
  normal: `border text-[${GeneralColors.grisAcero}] rounded-[16px] p-[16px] gap-[10px] text-[24px] font-[400]`,
  exclusive: `border text-[${GeneralColors.azulCianBrillante}] rounded-[16px] p-[16px] gap-[10px] text-[24px] font-[400]`,
};

export default function Boton({
  children,
  variant = "normal",
  className = "",
  onClick,

}: ButtonProps) {
  return (
    <button
      onClick={onClick} 
      className={`${variantClasses[variant]} ${className}`}
      style={variant === "normal" ? { borderColor: GeneralColors.azulNormal } : {}}
    >
      {children}
    </button>
  );
}
