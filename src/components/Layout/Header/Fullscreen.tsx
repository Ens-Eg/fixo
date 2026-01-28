"use client";

import React, { useState } from "react";
import { IoIosExit, IoIosExpand } from "react-icons/io";

const Fullscreen: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(
          `Error toggling full-screen mode: ${err.message} (${err.name})`
        );
      } else {
        console.error("Unknown error occurred while toggling full-screen mode.");
      }
    }
  };

  return (
    <>
      <div className="relative mx-[8px] md:mx-[10px] lg:mx-[12px] ltr:first:ml-0 ltr:last:mr-0 rtl:first:mr-0 rtl:last:ml-0">
        <button
          type="button"
          className="leading-none inline-block transition-all relative top-[2px] hover:text-primary-500"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
        >
          {isFullscreen ? <IoIosExit className=" !text-[22px] md:!text-[24px]" /> : <IoIosExpand className=" !text-[22px] md:!text-[24px]" />}
        </button>
      </div>
    </>
  );
};

export default Fullscreen;
