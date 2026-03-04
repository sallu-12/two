import { useRef, useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      setIsAnimating(!mobile); // Disable animation on mobile
    };

    checkMobile();

    // Update on resize
    const handleResize = () => checkMobile();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only animate on desktop
  useAnimationFrame((t) => {
    if (!isAnimating || !spinRef.current || !glowRef.current) return;

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
    spinRef.current.style.background = gradient;
    glowRef.current.style.background = gradient;
  });

  return (
    <div className={`relative p-[2px] ${radius} ${className}`}>
      {/* Animated border - only visible on desktop */}
      {isAnimating && (
        <>
          <div ref={spinRef} className={`absolute inset-0 ${radius}`} />
          <div
            ref={glowRef}
            className={`absolute inset-0 ${radius} opacity-50`}
            style={{ filter: `blur(${glowBlur}px)`, transform: "scale(1.05)" }}
          />
        </>
      )}
      
      {/* Static border - visible on mobile */}
      {!isAnimating && (
        <div
          className={`absolute inset-0 ${radius}`}
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
          }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 ${radius} bg-[#080b14] overflow-hidden`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBorderCard;

