import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { applyTheme, getSavedTheme, type Theme } from '../../../services/theme';

function SwitchTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    setIsDark(savedTheme==="dark");
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    applyTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-primary text-primary-front px-4 py-2 rounded-lg shadow-md"
    >
      {isDark
        ? <FaSun className="text-xl text-yellow-300" />
        : <FaMoon className="text-xl text-gray-800" />}
    </button>
  );
}

export default SwitchTheme;
