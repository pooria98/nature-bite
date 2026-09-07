// components/Preloader.tsx
"use client";

import { useState, useEffect } from "react";

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "radial-gradient(at center, #fff6e5 60%, #ffdb96 120%)",
            color: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div className="spinner" />
          <div>Loading...</div>
        </div>
      )}
      {children}
    </>
  );
}
