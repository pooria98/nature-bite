"use client";

import { useEffect, useState } from "react";

export default function Loader({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => setLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
      return;
    }

    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  if (!loaded) {
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    );
  }

  return <>{children}</>;
}
