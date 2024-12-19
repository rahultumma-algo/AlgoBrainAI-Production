import React, { useState, useEffect, useRef } from "react";
import tilt from "vanilla-tilt";

export type Props = {
  children: React.ReactNode;
  backgroundColor: string;
  direction: string;
  left: string;
  astroChild?: React.ReactNode;
  childrenType?: "react" | "astro";
};

const HoverCard: React.FC<Props> = ({
  children,
  backgroundColor,
  direction,
  left,
  childrenType = "react",
  astroChild,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
  const [hovered, setIsHovered] = useState(false);
  useEffect(() => {
    const div: HTMLDivElement | null = ref.current;
    tilt.init(div!, { reset: true, max: 4, scale: 1.02 });

    const handleMouseMove = (event: MouseEvent) => {
      if (div) {
        const rect = div.getBoundingClientRect();
        const x = event.clientX - rect.left-120;
        const y = event.clientY - rect.top-120;
        setCursorCoords({ x, y });
      }
    };

    div?.addEventListener("mousemove", handleMouseMove);

    return () => {
      div?.removeEventListener("mousemove", handleMouseMove);
      if (ref.current) {
        (ref.current as any).vanillaTilt.destroy(ref.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={ref}
      className="overflow-hidden flex flex-col mb-3 md:mb-8 rounded-xl h-full"
    >
      <div
        className={`z-[1] relative bg-white dark:bg-[#161b22] h-full border-[#30363d] border-[0.5px] rounded-xl shadow-xl md:flex ${direction} justify-between`}
      >
        {childrenType == "astro" ? astroChild : children}
        <div
          className={`absolute w-[250px] border-none h-[250px] z-[-1] back ${
            hovered ? "opacity-95" : "opacity-0"
          } `}
          style={{
            background: backgroundColor,
            borderRadius: "100%",
            filter: "blur(20px)",
            mixBlendMode: "soft-light",
            willChange: "transform",
            transition: "transform 0.2s cubic-bezier",
            transform: `translateX(${cursorCoords.x}px) translateY(${cursorCoords.y}px)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default HoverCard;
