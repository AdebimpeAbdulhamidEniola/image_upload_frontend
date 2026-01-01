"use client";

import Image from "next/image";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

const HeaderLayout = () => {
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();

  return (
    <div className="flex px-4 sm:px-8 md:px-12 lg:px-16 m-2 sm:m-3 justify-between items-center">
      <span className="flex items-center justify-center gap-3">
        <Image src="/logo-small.svg" alt="logo-small" width={22} height={26} />
        <span className="font-bold text-gray-900 dark:text-white">
          ImageUpload
        </span>
      </span>

      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {!mounted ? (
          // Render moon icon as placeholder during SSR
          <Image src="/Moon_fill.svg" alt="theme icon" width={28} height={28} />
        ) : isDarkMode ? (
          <Image
            src="/Sun_fill.svg"
            alt="sun icon"
            width={28}
            height={28}
            className="dark:invert"
          />
        ) : (
          <Image src="/Moon_fill.svg" alt="moon icon" width={28} height={28} />
        )}
      </button>
    </div>
  );
};

export default HeaderLayout;