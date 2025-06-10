import { useState, useEffect } from "react";

const useDetectDevice = () => {
  const [device, setDevice] = useState("");
  useEffect(() => {
    const handleDeviceDetection = () => {
      const isMobile = window.innerWidth < 768;
      const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;

      if (isMobile) {
        setDevice("brena-mobile");
      } else if (isTablet) {
        setDevice('brena-tablet');
      } else {
        setDevice("brena-desktop");
      }
    };

    handleDeviceDetection();
    window.addEventListener("resize", handleDeviceDetection);

    return () => {
      window.removeEventListener("resize", handleDeviceDetection);
    };
  }, []);

  return device;
};

export { useDetectDevice };
