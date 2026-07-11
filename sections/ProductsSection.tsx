"use client";

import type { CSSProperties } from "react";
import { useRef } from "react";
import styles from "./ProductsSection.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface ProductAccentStyle extends CSSProperties {
  "--accent-start"?: string;
  "--accent-end"?: string;
}

interface ProductData {
  id: string;
  eyebrow: string;
  title: string;
  tagline: string;
  accentStart: string;
  accentEnd: string;
  bgImage: string;
  mainImage: string;
}

const products: ProductData[] = [
  {
    id: "chocolate",
    eyebrow: "Rich & Indulgent",
    title: "Chocolate",
    tagline:
      "Deep cocoa clusters folded with roasted almonds for an indulgent bite.",
    accentStart: "#e8c48c",
    accentEnd: "#7a4a2c",
    bgImage: "/images/product-chocolate-bg.png",
    mainImage: "/images/product-chocolate.png",
  },
  {
    id: "berry",
    eyebrow: "Bright & Tangy",
    title: "Berry",
    tagline:
      "Tart mixed berries and toasted oats balanced with a delicate honey finish.",
    accentStart: "#f2a9b0",
    accentEnd: "#8a3b46",
    bgImage: "/images/product-berry-bg.png",
    mainImage: "/images/product-berry.png",
  },
  {
    id: "nuts",
    eyebrow: "Hearty & Crunchy",
    title: "Nuts",
    tagline:
      "A hearty blend of almonds, cashews, and walnuts for lasting crunch.",
    accentStart: "#d9c08f",
    accentEnd: "#6b5636",
    bgImage: "/images/product-nuts-bg.png",
    mainImage: "/images/product-nuts.png",
  },
];

const ProductsSection = () => {
  const productsSectionRef = useRef<HTMLElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const mainSubtitleRef = useRef<HTMLParagraphElement>(null);
  const mainEyebrowRef = useRef<HTMLParagraphElement>(null);
  const comingSoonRef = useRef<HTMLDivElement>(null);

  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const taglineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const eyebrowRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const bgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgImageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mainImageRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      const productsSection = productsSectionRef.current;

      if (!productsSection) return;

      // Hero intro: eyebrow, title, and subtitle revealed as one coordinated
      // sequence instead of three independently-triggered tweens.
      const mainSubtitleSplit = SplitText.create(mainSubtitleRef.current, {
        type: "lines",
      });

      gsap.set(mainEyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(mainSubtitleSplit.lines, { opacity: 0, y: 20 });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: productsSection, start: "top 65%" },
        })
        .to(mainEyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(
          mainSubtitleSplit.lines,
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
          "-=0.3",
        );

      // Horizontal scroll timeline. `end` is a function so ScrollTrigger
      // recalculates the pinned scroll distance correctly on resize.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: productsSection,
          pin: true,
          scrub: 1,
          start: "top top+=64px",
          end: () =>
            `+=${(productsSection.scrollWidth - window.innerWidth) * 1.4}`,
        },
      });

      gsap.utils.toArray<HTMLElement>(".product-subsection").forEach((item) => {
        tl.to(
          item,
          { x: () => -(productsSection.scrollWidth - window.innerWidth) },
          "<",
        );
      });

      // Each product's title, tagline, plate, and images are revealed together
      // inside a single scrubbed timeline, so they can never drift out of sync.
      products.forEach((_, index) => {
        const titleEl = titleRefs.current[index];
        const taglineEl = taglineRefs.current[index];
        const eyebrowEl = eyebrowRefs.current[index];
        const bgEl = bgRefs.current[index];
        const bgImageEl = bgImageRefs.current[index];
        const mainImageEl = mainImageRefs.current[index];

        if (!titleEl) return;

        const titleSplit = SplitText.create(titleEl, { type: "chars" });
        const bgRotate = index % 2 === 0 ? 5 : -5;
        const imageRotate = index % 2 === 0 ? -3 : 3;

        gsap.set(titleSplit.chars, { opacity: 0, y: 30 });
        gsap.set([eyebrowEl, taglineEl].filter(Boolean), {
          opacity: 0,
          y: 16,
        });
        gsap.set(bgEl, { opacity: 0, scale: 0.75, rotate: 0 });
        gsap.set(bgImageEl, { scale: 0, rotate: 90 });
        gsap.set(mainImageEl, { rotate: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: titleEl,
              containerAnimation: tl,
              start: `left ${78 + index * (40 - window.innerWidth / 100)}%`,
              end: `left ${52 + index * (40 - window.innerWidth / 100)}%`,
              scrub: 0.6,
            },
          })
          .to(
            bgEl,
            {
              opacity: 1,
              scale: 1,
              rotate: bgRotate,
              duration: 1,
              ease: "power2.out",
            },
            0,
          )
          .to(
            bgImageEl,
            { scale: 1, rotate: 0, duration: 1, ease: "power2.out" },
            0,
          )
          .to(
            mainImageEl,
            { rotate: imageRotate, duration: 1, ease: "power2.out" },
            0,
          )
          .to(
            eyebrowEl,
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.05,
          )
          .to(
            titleSplit.chars,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.035,
              ease: "power2.out",
            },
            0.15,
          )
          .to(
            taglineEl,
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            0.55,
          );
      });

      // Closing "coming soon" card gets the same treatment as the products.
      gsap.set(comingSoonRef.current, { opacity: 0, y: 24 });

      gsap.to(comingSoonRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: comingSoonRef.current,
          containerAnimation: tl,
          start: "left 85%",
          end: "left 60%",
          scrub: 0.6,
        },
      });
    });
  }, []);

  return (
    <section className={styles.productsSection} ref={productsSectionRef}>
      <div className={styles.backgroundPattern} />

      <div className={`${styles.heroPanel} product-subsection`}>
        <p className={styles.heroEyebrow} ref={mainEyebrowRef}>
          Our Signature Blends
        </p>
        <h2 className={styles.heroTitle} ref={mainTitleRef}>
          Find Your Favorite Flavor
        </h2>
        <p className={styles.heroSubtitle} ref={mainSubtitleRef}>
          Three carefully crafted granolas, each with its own unique character
          and taste.
        </p>
      </div>

      {products.map((product, index) => (
        <div
          key={product.id}
          className={`${styles.productCard} product-subsection`}
        >
          <div className={styles.productCardText}>
            <p
              className={styles.productEyebrow}
              ref={(el) => {
                eyebrowRefs.current[index] = el;
              }}
            >
              {product.eyebrow}
            </p>
            <h2
              className={styles.productTitle}
              ref={(el) => {
                titleRefs.current[index] = el;
              }}
            >
              {product.title}
            </h2>
          </div>

          <div
            className={styles.productCardBg}
            ref={(el) => {
              bgRefs.current[index] = el;
            }}
            style={
              {
                "--accent-start": product.accentStart,
                "--accent-end": product.accentEnd,
              } as ProductAccentStyle
            }
          />
          <Image
            ref={(el) => {
              bgImageRefs.current[index] = el;
            }}
            className={styles.productCardBgImage}
            src={product.bgImage}
            alt={`${product.title} granola texture`}
            width={500}
            height={500}
          />
          <Image
            ref={(el) => {
              mainImageRefs.current[index] = el;
            }}
            className={styles.productCardMainImage}
            src={product.mainImage}
            alt={`${product.title} granola jar`}
            width={500}
            height={500}
          />
        </div>
      ))}

      <div
        className={`${styles.comingSoonCard} product-subsection`}
        ref={comingSoonRef}
      >
        <p className={styles.comingSoonEyebrow}>Stay Tuned</p>
        <h3 className={styles.comingSoonTitle}>More Flavors Coming Soon</h3>
        <p className={styles.comingSoonText}>
          We&apos;re always experimenting with new combinations worth the wait.
        </p>
        <button className="btn bg-[#c1985a] text-white">
          View All Flavors
        </button>
      </div>
    </section>
  );
};

export default ProductsSection;
