import { useState, useEffect } from "react";

// Define the main App component
export default function CommingSoon() {
  // State to hold the remaining time
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Set your target date for the coming soon page
  // Example: October 27, 2025, 10:00:00 AM
  const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();

  // Function to calculate time remaining
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
      // If the target date has passed, set all to 0
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  // useEffect hook to set up the countdown timer
  useEffect(() => {
    // Call calculateTimeLeft immediately on component mount
    calculateTimeLeft();
    // Set up an interval to update the timer every second
    const timer = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <>
      <div className="min-h-screen mt-[-20px] flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white font-inter p-4">
        {/* Container for the coming soon content, centered and with rounded corners */}
        <div className="bg-gray-700 bg-opacity-10 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-2xl text-center max-w-lg w-full transform transition-all duration-500 ease-in-out hover:scale-105">
          {/* Main "Coming Soon" title with a subtle pulse animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 animate-pulse">
            Coming Soon!
          </h1>

          {/* Subtitle/message */}
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            We're working hard to bring you something amazing. Stay tuned!
          </p>

          {/* Countdown timer display */}
          <div className="flex justify-center items-center space-x-4 sm:space-x-6 mb-10">
            {/* Individual timer units (Days, Hours, Minutes, Seconds) */}
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                {/* Value of the timer unit */}
                <span className="text-3xl sm:text-4xl font-bold bg-sky-400 bg-opacity-20 px-4 py-2 rounded-xl">
                  {String(value).padStart(2, "0")}
                </span>
                {/* Label for the timer unit */}
                <span className="text-sm sm:text-base mt-2 capitalize opacity-80">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
