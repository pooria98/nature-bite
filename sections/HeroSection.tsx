"use client";

import Image from "next/image";
// import styles from "./HeroSection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { NatureBiteSvg } from "@/components/NatureBiteSvg";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HeroSection = () => {
  const millBladeRef = useRef<HTMLImageElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const heroImageBgRef = useRef<HTMLDivElement>(null);
  const heroImagePlantForegroundRightRef = useRef<HTMLDivElement>(null);
  const heroImagePlantForegroundLeftRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const natureBiteSvgRef = useRef<SVGSVGElement>(null);
  const heroDescriptionRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    gsap.to(millBladeRef.current, {
      rotate: 360,
      duration: 5,
      ease: "steps(36)",
      repeat: -1,
      transformOrigin: "50% 51.7%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: "top top",
        end: "100%",
        scrub: 1,
        pin: true,
      },
    });

    tl.to([heroImageBgRef.current, millBladeRef.current], {
      y: "150vh",
      scaleX: 1.5,
    });

    tl.to(
      heroImagePlantForegroundRightRef.current,
      {
        x: "200%",
      },
      "<",
    );

    tl.to(
      heroImagePlantForegroundLeftRef.current,
      {
        x: "-200%",
      },
      "<",
    );

    gsap.to(natureBiteSvgRef.current, {
      scrollTrigger: {
        trigger: heroDescriptionRef.current,
        start: "top top",
        scrub: 1,
      },
      opacity: 1,
      width: 250,
      duration: 1,
    });

    gsap.to(heroDescriptionRef.current, {
      scrollTrigger: {
        trigger: heroDescriptionRef.current,
        start: "top top",
        scrub: 1,
      },
      opacity: 1,
      duration: 1,
    });

    gsap.utils
      .toArray<HTMLButtonElement>(".cta-buttons")
      .forEach((button, i) => {
        gsap.set(button, { scale: 0 });
        gsap.to(button, {
          scrollTrigger: {
            trigger: heroDescriptionRef.current,
            start: "top top",
            scrub: 1,
          },
          scale: 1,
          duration: 1,
          delay: i * 0.2 + 0.5,
          ease: "expo.out",
        });
      });
  }, []);

  return (
    <section className="hero-section" ref={heroSectionRef}>
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 z-2 w-full h-full"
          ref={heroImageBgRef}
        >
          <Image
            className="w-full h-full object-cover block"
            src="/images/hero-bg-main.png"
            width={1600}
            height={900}
            alt="village-background"
          />
        </div>

        <div
          className="absolute z-3 top-[58%] left-1/2 -translate-1/2 w-87.5 h-auto"
          ref={millBladeRef}
        >
          <Image
            className="img-cover"
            src="/images/mill blades.png"
            width={400}
            height={400}
            alt="village-background"
          />
        </div>

        <div
          className="absolute z-4 bottom-0 right-0 w-[clamp(200px,30%,400px)] h-auto"
          ref={heroImagePlantForegroundRightRef}
        >
          <Image
            className="img-cover"
            src="/images/plant foreground right.png"
            width={400}
            height={400}
            alt="village-background"
          />
        </div>

        <div
          className="absolute z-4 bottom-0 left-0 w-[clamp(200px,30%,400px)] h-auto"
          ref={heroImagePlantForegroundLeftRef}
        >
          <Image
            className="img-cover"
            src="/images/plant foreground left.png"
            width={400}
            height={400}
            alt="village-background"
          />
        </div>
      </div>

      <div
        className="absolute z-1 top-1/2 left-1/2 -translate-1/2 w-full max-w-125 px-4 flex flex-col justify-center items-center"
        ref={heroTextRef}
      >
        <NatureBiteSvg
          width={200}
          color="#c0985b"
          ref={natureBiteSvgRef}
          style={{ filter: "drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.6))" }}
          className="opacity-0"
        />
        <p
          className="text-xl font-semibold mb-8 opacity-0 text-center text-[#633a28]"
          ref={heroDescriptionRef}
        >
          Premium granola crafted with carefully selected ingredients for a
          delicious and satisfying start to your day.
        </p>
        <div className="flex justify-center items-center gap-8">
          <button
            color="#c0985b"
            className="cta-buttons btn bg-[#c0985b] text-white"
          >
            Shop Now
          </button>
          <button
            color="#c0985b"
            className="cta-buttons btn bg-[#c0985b] text-white"
          >
            Explore
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
