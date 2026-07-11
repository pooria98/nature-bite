"use client";

import {
  IconDiamond,
  IconHeart,
  IconLeaf,
  IconPalette,
  IconScale,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { useRef } from "react";
import styles from "./WhySection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Reason {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
}

const reasons: Reason[] = [
  {
    title: "Made with Carefully Selected Ingredients",
    description:
      "Chosen with intention for honest flavor, quality, and a naturally refined bite.",
    icon: IconLeaf,
  },
  {
    title: "Rich Crunchy Texture",
    description:
      "Golden clusters with a satisfying crunch that feels indulgent from the first spoonful.",
    icon: IconSparkles,
  },
  {
    title: "Crafted for Everyday Enjoyment",
    description:
      "Elegant enough for slow mornings, simple enough for every day rituals.",
    icon: IconHeart,
  },
  {
    title: "Premium Quality",
    description:
      "A polished granola experience made with care, consistency, and attention to detail.",
    icon: IconShieldCheck,
  },
  {
    title: "Balanced Flavors",
    description:
      "Naturally layered notes that feel warm, rounded, and never overwhelming.",
    icon: IconScale,
  },
  {
    title: "Beautifully Made",
    description:
      "Designed to look as special as it tastes, from the jar to the final sprinkle.",
    icon: IconPalette,
  },
];

const titleWords = ["Why", "Choose", "Nature", "Bite"];

const WhySection = () => {
  const whySectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const whySection = whySectionRef.current;

    if (!whySection) return;

    const titleWordElements = whySection.querySelectorAll<HTMLElement>(
      `.${styles.titleWord}`,
    );
    const reasonCards = whySection.querySelectorAll<HTMLElement>(
      `.${styles.reasonCard}`,
    );
    const decorativeElements = whySection.querySelectorAll<HTMLElement>(
      `.${styles.decorativeGlow}, .${styles.goldRing}, .${styles.centerDiamond}`,
    );

    gsap.set(titleWordElements, {
      opacity: 0,
      yPercent: 120,
      rotateX: -70,
      transformOrigin: "50% 100%",
    });

    gsap.set(reasonCards, {
      opacity: 0,
      y: 80,
      scale: 0.92,
      rotateX: -14,
      transformOrigin: "50% 100%",
    });

    gsap.set(decorativeElements, {
      opacity: 0,
      scale: 0.75,
    });

    const introTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: {
        trigger: whySection,
        start: "top 70%",
      },
    });

    introTl
      .to(decorativeElements, {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        stagger: 0.08,
      })
      .to(
        titleWordElements,
        {
          opacity: 1,
          yPercent: 0,
          rotateX: 0,
          duration: 0.9,
          stagger: 0.12,
        },
        "-=0.65",
      )
      .to(
        reasonCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.9,
          stagger: {
            amount: 0.65,
          },
        },
        "-=0.35",
      );

    gsap.to(`.${styles.goldRing}`, {
      rotate: 360,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    gsap.to(`.${styles.decorativeGlow}`, {
      y: -18,
      scale: 1.08,
      duration: 3.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.4,
    });
  }, []);

  return (
    <section className={styles.whySection} ref={whySectionRef}>
      <div className={styles.backgroundPattern} />
      <div className={styles.decorativeGlow} />
      <div className={styles.decorativeGlow} />
      <div className={styles.goldRing} />
      <IconDiamond className={styles.centerDiamond} size={34} stroke={1.5} />

      <div className={styles.content}>
        <p className={styles.eyebrow}>The Nature Bite Difference</p>

        <h2 className={styles.mainTitle}>
          {titleWords.map((word) => (
            <span className={styles.titleMask} key={word}>
              <span className={styles.titleWord}>{word}</span>
            </span>
          ))}
        </h2>

        <div className={styles.reasonsGrid}>
          {reasons.map(({ title, description, icon: Icon }) => (
            <article className={styles.reasonCard} key={title}>
              <div className={styles.iconFrame}>
                <Icon size={30} stroke={1.6} />
              </div>
              <div>
                <h3 className={styles.reasonTitle}>{title}</h3>
                <p className={styles.reasonDescription}>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
