"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, useGSAP, SplitText);

export default function ProductTypes() {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      let currentZone = 0;

      ScrollTrigger.create({
        trigger: containerRef.current,
        pin: true,
        start: "top top",
        end: "+=2500",
        onUpdate: (self) => {
          const progress = self.progress;

          // Determine which zone we are currently in
          let newZone = 1;
          if (progress > 0.33 && progress <= 0.66) {
            newZone = 2;
          } else if (progress > 0.66) {
            newZone = 3;
          }

          // Only trigger animations if the zone has actually changed
          if (newZone !== currentZone) {
            // -------------------- PANEL 1 --------------------
            if (newZone === 1) {
              // Show Panel 1
              gsap.to(".panel-1", {
                autoAlpha: 1,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              // show title 1 and description 1
              const splitDescription1 = SplitText.create(
                ".panel-1-description",
                {
                  type: "lines",
                  mask: "lines",
                  autoSplit: true,
                },
              );
              const splitTitle1 = SplitText.create(".panel-1-title", {
                type: "lines",
                mask: "lines",
                autoSplit: true,
              });
              gsap.fromTo(
                [splitTitle1.lines, splitDescription1.lines],
                { yPercent: 100 },
                { yPercent: 0, stagger: 0.05, delay: 0.5, duration: 1 },
              );
              // show image 1
              gsap.fromTo(
                ".panel-1-img",
                { scale: 0.3, opacity: 0, y: 200 },
                {
                  scale: 1,
                  opacity: 1,
                  y: 0,
                  delay: 0.25,
                  duration: 1,
                  ease: "power2.out",
                },
              );
              // Hide Panel 2 & 3
              gsap.to([".panel-2", ".panel-3"], {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              // -------------------- PANEL 2 --------------------
            } else if (newZone === 2) {
              // Show Panel 2
              gsap.to(".panel-2", {
                autoAlpha: 1,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              // show title 2 and description 2
              const splitDescription2 = SplitText.create(
                ".panel-2-description",
                {
                  type: "lines",
                  mask: "lines",
                  autoSplit: true,
                },
              );
              const splitTitle2 = SplitText.create(".panel-2-title", {
                type: "lines",
                mask: "lines",
                autoSplit: true,
              });
              gsap.fromTo(
                [splitTitle2.lines, splitDescription2.lines],
                { yPercent: 100 },
                { yPercent: 0, stagger: 0.05, delay: 0.5, duration: 1 },
              );
              // show image 2
              gsap.fromTo(
                ".panel-2-img",
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  delay: 0.25,
                  duration: 1,
                  ease: "power2.out",
                },
              );
              // Hide Panel 1 & 3
              gsap.to([".panel-1", ".panel-3"], {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              // -------------------- PANEL 3 --------------------
            } else if (newZone === 3) {
              // Show Panel 3,
              gsap.to(".panel-3", {
                autoAlpha: 1,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
              // show title 3 and description 3
              const splitDescription3 = SplitText.create(
                ".panel-3-description",
                {
                  type: "lines",
                  mask: "lines",
                  autoSplit: true,
                },
              );
              const splitTitle3 = SplitText.create(".panel-3-title", {
                type: "lines",
                mask: "lines",
                autoSplit: true,
              });
              gsap.fromTo(
                [splitTitle3.lines, splitDescription3.lines],
                { yPercent: 100 },
                { yPercent: 0, stagger: 0.05, delay: 0.5, duration: 1 },
              );
              // show image 3
              gsap.fromTo(
                ".panel-3-img",
                { scale: 0.3, opacity: 0, x: 200 },
                {
                  scale: 1,
                  opacity: 1,
                  x: 0,
                  delay: 0.25,
                  duration: 1,
                  ease: "power2.out",
                },
              );
              // Hide Panel 1 & 2
              gsap.to([".panel-1", ".panel-2"], {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.inOut",
                overwrite: "auto",
              });
            }

            currentZone = newZone;
          }
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="h-screen w-full relative overflow-hidden bg-radial from-[#eaecf2] to-[#aea49b]"
    >
      {/* Step 1 */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-radial from-[#eaecf2] to-[#aea49b] p-4 panel-1 opacity-0">
        <div className="w-full max-w-100 order-2 md:order-1">
          <h1 className="text-5xl font-canela tracking-wide font-bold mb-4 panel-1-title">
            Granola
          </h1>
          <p className="text-slate-800 font-semibold text-lg panel-1-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero,
            omnis. Expedita architecto laborum, sunt itaque.
          </p>
        </div>
        <Image
          className="w-full h-1/2 md:w-1/2 md:h-full object-contain panel-1-img order-1: md:order-2"
          src="/images/granola.webp"
          width={690}
          height={1116}
          alt="granola"
        />
      </div>

      {/* Step 2 */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-radial from-[#915d40] to-[#2f170b] p-4 panel-2 opacity-0">
        <div className="w-full max-w-100 order-2">
          <h1 className="text-5xl font-canela tracking-wide text-[#ffefb9] text-shadow-[1px_1px_2px_black] font-bold mb-4 panel-2-title">
            Oat Chocolate
          </h1>
          <p className="text-[#fff8e0] font-semibold text-lg panel-2-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit, Vero omnis.
          </p>
        </div>
        <Image
          className="w-full h-auto md:w-1/2 panel-2-img order-1"
          src="/images/oat-chocolate.webp"
          width={1120}
          height={959}
          alt="oat-chocolate"
        />
      </div>

      {/* Step 3 */}
      <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-radial from-[#eeeae7] to-[#a8a8a8] p-4 panel-3 opacity-0">
        <div className="w-full max-w-100 order-2 md:order-1">
          <h1 className="text-5xl font-canela tracking-wide font-bold mb-4 panel-3-title">
            Biscuit Variety
          </h1>
          <p className="text-slate-800 font-semibold text-lg panel-3-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero,
            omnis. Expedita architecto laborum, sunt itaque laudantium maxime
            ducimus.
          </p>
        </div>
        <Image
          className="w-full h-1/2 md:w-1/2 md:h-full object-contain panel-3-img order-1: md:order-2"
          src="/images/biscuit-variety.webp"
          width={1264}
          height={846}
          alt="biscuit-variety"
        />
      </div>
    </section>
  );
}
