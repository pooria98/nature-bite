// components/Preloader.tsx
"use client";

import { useState, useEffect } from "react";
import { useAssetsLoader } from "@/hooks/useAssetsLoader";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const { progress, isReady } = useAssetsLoader();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isReady) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isReady]);

  return (
    <>
      {!isReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "radial-gradient(at center, #fff6e5 60%, #ffdb96 120%)",
            color: "#c0985b",
            fontSize: "2rem",
            fontWeight: 700,
            textShadow: "1px 1px 1px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div>
            {isLoading
              ? "loading animations..."
              : !isReady
                ? "loading images..."
                : "ready"}
          </div>
          <div style={{ fontSize: "1.25rem" }}>
            {!isLoading && `${progress}%`}
          </div>
        </div>
      )}
      {children}
    </>
  );
}
