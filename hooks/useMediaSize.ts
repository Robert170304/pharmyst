// useMediaSize.ts
import { useEffect, useState } from "react";

export const useMediaSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // call once in case window resizes before hook mounts
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};
