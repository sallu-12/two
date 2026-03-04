import React from "react";

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  /** Border-radius class. Default 'rounded-2xl' */
  radius?: string;
}

const AnimatedBorderCard = ({
  children,
  className = "",
  radius = "rounded-2xl",
}: AnimatedBorderCardProps) => {
  return (
    // Static border: p-[2px] creates the border gap
    <div 
      className={`relative p-[2px] ${radius} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      }}
    >
      {/* Dark content area sits on top, leaving 2px ring visible */}
      <div className={`relative z-10 ${radius} bg-[#080b14] overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderCard;

