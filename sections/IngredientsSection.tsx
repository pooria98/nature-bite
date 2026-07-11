"use client";

import { useRef } from "react";
import styles from "./IngredientsSection.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface IngredientPanel {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  background: string;
}

const panels: IngredientPanel[] = [
  {
    id: "nature",
    eyebrow: "Our Philosophy",
    title: "Crafted From Nature",
    description:
      "Every jar begins with thoughtfully selected ingredients chosen for their quality, flavor, and texture.",
    background: "/images/ingredients-nature-bg.jpg",
  },
  {
    id: "oat",
    eyebrow: "The Foundation",
    title: "Rolled Oats",
    description:
      "Slow-toasted to a golden hue for a hearty, wholesome crunch in every bite.",
    background: "/images/ingredients-oat-bg.jpg",
  },
  {
    id: "honey",
    eyebrow: "Nature's Sweetener",
    title: "Honey",
    description:
      "A drizzle of golden honey binds every cluster with warmth and depth.",
    background: "/images/ingredients-honey-bg.jpg",
  },
  {
    id: "nuts",
    eyebrow: "Crunch & Nourishment",
    title: "Nuts",
    description:
      "Toasted almonds, cashews, and walnuts add rich texture and lasting energy.",
    background: "/images/ingredients-nuts-bg.jpg",
  },
  {
    id: "grape",
    eyebrow: "Fruity Richness",
    title: "Grape Syrup",
    description: "A subtly tart sweetness that rounds out every spoonful.",
    background: "/images/ingredients-grape-bg.jpg",
  },
  {
    id: "fig",
    eyebrow: "Mediterranean Sweetness",
    title: "Fig Syrup",
    description: "Deep, jammy notes inspired by sun-ripened orchards.",
    background: "/images/ingredients-figs-bg.avif",
  },
  {
    id: "date",
    eyebrow: "Earthy Warmth",
    title: "Date Syrup",
    description:
      "Caramel-like richness, naturally sweet and deeply satisfying.",
    background: "/images/ingredients-dates-bg.jpg",
  },
  {
    id: "mulberry",
    eyebrow: "A Delicate Finish",
    title: "Mulberry Syrup",
    description:
      "Delicate, floral sweetness that lingers long after the last bite.",
    background: "/images/ingredients-mulberry-bg.avif",
  },
];

const nonNull = <T,>(value: T | null | undefined): value is T => value != null;

interface PanelParts {
  index: HTMLElement | null;
  eyebrow: HTMLElement | null;
  title: HTMLElement | null;
  divider: HTMLElement | null;
  description: HTMLElement | null;
}

function getPanelParts(panel: HTMLElement): PanelParts {
  return {
    index: panel.querySelector<HTMLElement>(`.${styles.panelIndex}`),
    eyebrow: panel.querySelector<HTMLElement>(`.${styles.eyebrow}`),
    title: panel.querySelector<HTMLElement>(`.${styles.panelTitle}`),
    divider: panel.querySelector<HTMLElement>(`.${styles.divider}`),
    description: panel.querySelector<HTMLElement>(`.${styles.description}`),
  };
}

function setInitialState(parts: PanelParts) {
  const fadeInParts = [parts.index, parts.eyebrow, parts.description].filter(
    nonNull,
  );

  gsap.set(fadeInParts, { opacity: 0, y: 22 });
  gsap.set(parts.title, { opacity: 0, yPercent: 110 });
  gsap.set(parts.divider, { opacity: 0, y: 22, scaleX: 0 });
}

const IngredientsSection = () => {
  const ingredientsSectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const ingredientsSection = ingredientsSectionRef.current;

    if (!ingredientsSection) return;

    const subsections = Array.from(
      ingredientsSection.querySelectorAll<HTMLElement>(
        ".ingredient-subsection",
      ),
    );

    if (subsections.length === 0) return;

    const [firstPanel, ...restPanels] = subsections;
    const firstParts = getPanelParts(firstPanel);

    setInitialState(firstParts);
    restPanels.forEach((panel) => setInitialState(getPanelParts(panel)));

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ingredientsSection, start: "top 75%" },
      })
      .to(firstParts.index, { opacity: 1, y: 0, duration: 0.5 })
      .to(firstParts.eyebrow, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
      .to(firstParts.title, { opacity: 1, yPercent: 0, duration: 0.9 }, "-=0.3")
      .to(
        firstParts.divider,
        { opacity: 1, y: 0, scaleX: 1, duration: 0.6 },
        "-=0.4",
      )
      .to(firstParts.description, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    if (subsections.length <= 1) return;

    gsap.set(subsections, {
      zIndex: (index) => index,
    });

    gsap.set(restPanels, {
      yPercent: 100,
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ingredientsSection,
        pin: true,
        scrub: 1,
        start: "top top+=64px",
        end: () => `+=${window.innerHeight * (subsections.length - 1)}`,
      },
    });

    restPanels.forEach((panel, i) => {
      const previousPanel = subsections[i];
      const previousParts = getPanelParts(previousPanel);
      const parts = getPanelParts(panel);
      const label = `panel${i}`;

      tl.addLabel(label);

      tl.to(panel, { yPercent: 0, duration: 1, ease: "power2.inOut" }, label);

      tl.to(
        [
          previousParts.index,
          previousParts.eyebrow,
          previousParts.title,
          previousParts.divider,
          previousParts.description,
        ].filter(nonNull),
        { opacity: 0, y: -18, duration: 0.4, ease: "power1.in" },
        label,
      );

      tl.to(
        parts.index,
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        `${label}+=0.25`,
      )
        .to(
          parts.eyebrow,
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          `${label}+=0.32`,
        )
        .to(
          parts.title,
          { opacity: 1, yPercent: 0, duration: 0.5, ease: "power3.out" },
          `${label}+=0.38`,
        )
        .to(
          parts.divider,
          { opacity: 1, y: 0, scaleX: 1, duration: 0.35, ease: "power2.out" },
          `${label}+=0.5`,
        )
        .to(
          parts.description,
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          `${label}+=0.55`,
        );
    });
  }, []);

  return (
    <section className={styles.ingredientsSection} ref={ingredientsSectionRef}>
      {panels.map((panel, index) => (
        <div
          key={panel.id}
          className={`${styles.ingredientsSectionContent} ingredient-subsection`}
          style={{
            backgroundImage: `linear-gradient(rgba(15, 9, 6, 0.58), rgba(15, 9, 6, 0.38)), url('${panel.background}')`,
          }}
        >
          <div className={styles.panelContent}>
            <p className={styles.panelIndex}>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(panels.length).padStart(2, "0")}
            </p>
            <p className={styles.eyebrow}>{panel.eyebrow}</p>
            <div className={styles.titleMask}>
              <h2 className={styles.panelTitle}>{panel.title}</h2>
            </div>
            <span className={styles.divider} />
            <p className={styles.description}>{panel.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default IngredientsSection;
