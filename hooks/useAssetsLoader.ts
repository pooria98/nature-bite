"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  extraImages?: string[]; // e.g. CSS background images not rendered as <img> yet
  timeoutMs?: number; // hard cap so one slow/broken asset can't hang forever
}

export function useAssetsLoader({
  extraImages = [],
  timeoutMs = 100000,
}: Options = {}) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // guards React StrictMode double-invoke
    started.current = true;

    // Only target images you've flagged as loader-critical, not every <img>
    // on the page — e.g. <img data-preload="true" ...> for hero/fold images.
    const domImages = Array.from(
      document.querySelectorAll<HTMLImageElement>("img[data-preload]"),
    );
    const tasks: Array<() => Promise<void>> = [];

    domImages.forEach((img) => {
      tasks.push(() =>
        img.decode
          ? img.decode().catch(() => {})
          : new Promise<void>((resolve) => {
              if (img.complete) return resolve();
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }),
      );
    });

    extraImages.forEach((src) => {
      tasks.push(
        () =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = src;
          }),
      );
    });

    const total = tasks.length || 1;
    let done = 0;
    const bump = () => setProgress(Math.round((++done / total) * 100));

    const assets = tasks.map((run) => run().then(bump));
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, timeoutMs),
    );

    Promise.race([Promise.all([...assets, fonts]), timeout]).then(() => {
      setProgress(100);
      setIsReady(true);
    });
  }, [extraImages, timeoutMs]);

  return { progress, isReady };
}
