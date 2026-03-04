import { useRef } from "react";
import { useAnimationFrame } from "framer-motion";

interface AnimatedBorderCardProps {
  children: React.ReactNode;
  className?: string;
  /** How fast the beam spins — lower = faster. Default 8 */
  speed?: number;
  /** Extra outer blur glow in px. Default 12 */
  glowBlur?: number;
  /** Border-radius class. Default 'rounded-2xl' */
  radius?: string;
}

const AnimatedBorderCard = ({
  children,
  className = "",
  speed = 8,
  glowBlur = 12,
  radius = "rounded-2xl",
}: AnimatedBorderCardProps) => {
  const spinRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useAnimationFrame((t) => {
    const angle = (t / speed) % 360;
    const gradient = `conic-gradient(from ${angle}deg at 50% 50%,
      transparent 0deg,
      transparent 60deg,
      #a855f7 100deg,
      #ffffff 130deg,
      #ec4899 160deg,
      transparent 200deg,
      transparent 360deg
    )`;
    if (spinRef.current) spinRef.current.style.background = gradient;
    if (glowRef.current) glowRef.current.style.background = gradient;
  });

  return (
    // Outer: p-[2px] creates the border gap — no negative insets, no overflow
    <div className={`relative p-[2px] ${radius} ${className}`}>
      {/* Crisp spinning beam ring — fills the 2px padding gap */}
      <div ref={spinRef} className={`absolute inset-0 ${radius}`} />
      {/* Blurred ambient glow — scale(1.05) expands outward softly */}
      <div
        ref={glowRef}
        className={`absolute inset-0 ${radius} opacity-50`}
        style={{ filter: `blur(${glowBlur}px)`, transform: "scale(1.05)" }}
      />
      {/* Dark content area sits on top, leaving 2px ring visible */}
      <div className={`relative z-10 ${radius} bg-[#080b14] overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderCard;
