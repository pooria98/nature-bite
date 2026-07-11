"use client";

import {
  IconBrandInstagram,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./InstagramSection.module.css";
import useEmblaCarousel from "embla-carousel-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  comments: number;
}

const posts: InstagramPost[] = [
  { id: "post-1", image: "/images/with-milk.jpg", likes: 482, comments: 12 },
  {
    id: "post-2",
    image: "/images/as-a-desert.jpg",
    likes: 356,
    comments: 8,
  },
  {
    id: "post-3",
    image: "/images/ingredients-honey-bg.jpg",
    likes: 291,
    comments: 5,
  },
  {
    id: "post-4",
    image: "/images/over-fruits.jpg",
    likes: 410,
    comments: 14,
  },
  {
    id: "post-5",
    image: "/images/ingredients-oat-bg.jpg",
    likes: 268,
    comments: 6,
  },
  { id: "post-6", image: "/images/as-a-snack.jpg", likes: 337, comments: 9 },
  {
    id: "post-7",
    image: "/images/ingredients-grape-bg.jpg",
    likes: 224,
    comments: 4,
  },
  {
    id: "post-8",
    image: "/images/ingredients-nature-bg.jpg",
    likes: 389,
    comments: 11,
  },
];

const titleWords = ["Follow", "Us", "On", "Instagram"];

const INSTAGRAM_URL = "https://www.instagram.com/naturebiteco";

const InstagramSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const titleWordElements = section.querySelectorAll<HTMLElement>(
      `.${styles.titleWord}`,
    );

    gsap.set(`.${styles.eyebrow}`, { opacity: 0, y: 16 });
    gsap.set(titleWordElements, { opacity: 0, yPercent: 120 });
    gsap.set(`.${styles.description}`, { opacity: 0, y: 16 });
    gsap.set(`.${styles.carouselWrapper}`, { opacity: 0, y: 32 });
    gsap.set(`.${styles.viewMoreLink}`, { opacity: 0, y: 16 });

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 72%" },
      })
      .to(`.${styles.eyebrow}`, { opacity: 1, y: 0, duration: 0.5 })
      .to(
        titleWordElements,
        { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.08 },
        "-=0.3",
      )
      .to(
        `.${styles.description}`,
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.35",
      )
      .to(
        `.${styles.carouselWrapper}`,
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.25",
      )
      .to(
        `.${styles.viewMoreLink}`,
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.4",
      );
  }, []);

  return (
    <section className={styles.instagramSection} ref={sectionRef}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>@naturebite</p>

        <h2 className={styles.title}>
          {titleWords.map((word) => (
            <span className={styles.titleMask} key={word}>
              <span className={styles.titleWord}>{word}</span>
            </span>
          ))}
        </h2>

        <p className={styles.description}>
          A peek into our process and the little moments in between.
        </p>
      </div>

      <div className={styles.carouselWrapper}>
        <button
          className={`${styles.carouselButton} ${styles.prevButton}`}
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous posts"
        >
          <IconChevronLeft />
        </button>

        <button
          className={`${styles.carouselButton} ${styles.nextButton}`}
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next posts"
        >
          <IconChevronRight />
        </button>
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.emblaContainer}>
            {posts.map((post) => (
              <div className={styles.emblaSlide} key={post.id}>
                <a
                  className={styles.postCard}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View post on Instagram"
                >
                  <Image
                    src={post.image}
                    alt="Nature Bite on Instagram"
                    fill
                    className={styles.postImage}
                    sizes="(max-width: 768px) 70vw, 300px"
                  />

                  <div className={styles.postOverlay}>
                    <span className={styles.postStat}>
                      <IconHeart size={18} stroke={1.8} />
                      {post.likes}
                    </span>

                    <span className={styles.postStat}>
                      <IconMessageCircle size={18} stroke={1.8} />
                      {post.comments}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <a
        className={styles.viewMoreLink}
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconBrandInstagram size={20} stroke={1.8} />
        View More on Instagram
      </a>
    </section>
  );
};

export default InstagramSection;
