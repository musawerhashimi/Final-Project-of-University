import { useState, useEffect } from "react";

interface BouncingCircleProps {
  color?: string; // Color for big
  initialSize?: string;
  bouncingSize?: string;
  animationDuration?: number;
}

function CircleAnimation({
  color = "bg-green-500",
  initialSize = "w-5 h-5",
  bouncingSize = "w-12 h-12",
  animationDuration = 700,
}: BouncingCircleProps) {
  const [isBig, setIsBig] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBig((prev) => !prev);
    }, animationDuration / 2);
    return () => clearInterval(interval);
  }, [animationDuration]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <div
        className={`rounded-full transition-all duration-300 ease-in-out
          ${
            isBig ? `${color} ${bouncingSize}` : `bg-transparent ${initialSize}`
          }`}
        aria-label="Bouncing Circle"
      ></div>
    </div>
  );
}

export default CircleAnimation;
