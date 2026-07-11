"use client";

import { Text, Title } from "@mantine/core";
import {
  IconApple,
  IconBowlSpoon,
  IconCherry,
  IconChevronLeft,
  IconChevronRight,
  IconIceCream2,
  IconMilk,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import styles from "./WaysToEnjoySection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin);

interface Way {
  title: string;
  icon: ComponentType<{ size?: number; stroke?: number; color?: string }>;
  img?: string;
}

const ways: Way[] = [
  { title: "With Yogurt", icon: IconBowlSpoon, img: "/images/with-yogurt.jpg" },
  { title: "With Milk", icon: IconMilk, img: "/images/with-milk.jpg" },
  { title: "As a Snack", icon: IconApple, img: "/images/as-a-snack.jpg" },
  { title: "Desserts", icon: IconIceCream2, img: "/images/as-a-dessert.jpg" },
  { title: "Over Fruit", icon: IconCherry, img: "/images/over-fruits.jpg" },
];

const titleWords = ["Enjoy", "It", "Your", "Way"];

const ANGLE_STEP_RAD = (Math.PI * 2) / ways.length;
const CARD_SIZE = 1.85;
const RADIUS = (CARD_SIZE / 2 / Math.tan(Math.PI / ways.length)) * 1.45;
const TEXTURE_SIZE = 768;
const AUTOPLAY_DURATION = 46;
const RESUME_DELAY = 1.4;
const DRAG_SENSITIVITY = 0.006;

function normalizeAngle(angle: number) {
  const twoPi = Math.PI * 2;
  let normalized = angle % twoPi;
  if (normalized > Math.PI) normalized -= twoPi;
  if (normalized < -Math.PI) normalized += twoPi;
  return normalized;
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (currentLine && ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) lines.push(currentLine);
  return lines;
}

async function createIconImage(Icon: Way["icon"]): Promise<HTMLImageElement> {
  const markup = renderToStaticMarkup(
    <Icon size={128} stroke={1.6} color="#2a1810" />,
  );
  const svgMarkup = markup.includes("xmlns=")
    ? markup
    : markup.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
  const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawCardTexture(
  canvas: HTMLCanvasElement,
  title: string,
  iconImage: HTMLImageElement,
) {
  const size = TEXTURE_SIZE;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);

  const pad = size * 0.035;
  roundRectPath(ctx, pad, pad, size - pad * 2, size - pad * 2, size * 0.09);
  const bgGradient = ctx.createLinearGradient(0, 0, size, size);
  bgGradient.addColorStop(0, "rgba(255, 246, 229, 0.18)");
  bgGradient.addColorStop(1, "rgba(193, 152, 90, 0.08)");
  ctx.fillStyle = bgGradient;
  ctx.fill();
  ctx.lineWidth = size * 0.006;
  ctx.strokeStyle = "rgba(193, 152, 90, 0.55)";
  ctx.stroke();

  const iconRadius = size * 0.155;
  const iconCenterX = size / 2;
  const iconCenterY = size * 0.4;

  ctx.beginPath();
  ctx.arc(iconCenterX, iconCenterY, iconRadius, 0, Math.PI * 2);
  const iconGradient = ctx.createLinearGradient(
    iconCenterX - iconRadius,
    iconCenterY - iconRadius,
    iconCenterX + iconRadius,
    iconCenterY + iconRadius,
  );
  iconGradient.addColorStop(0, "#e9c68c");
  iconGradient.addColorStop(1, "#9c6b3e");
  ctx.fillStyle = iconGradient;
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = size * 0.035;
  ctx.fill();
  ctx.shadowBlur = 0;

  const iconSize = iconRadius * 1.2;
  ctx.drawImage(
    iconImage,
    iconCenterX - iconSize / 2,
    iconCenterY - iconSize / 2,
    iconSize,
    iconSize,
  );

  ctx.fillStyle = "#fff6e5";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${Math.round(size * 0.082)}px Canela, serif`;

  const maxTextWidth = size * 0.76;
  const lines = wrapLines(ctx, title, maxTextWidth);
  const lineHeight = size * 0.095;
  const startY = size * 0.72 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, iconCenterX, startY + index * lineHeight);
  });
}

function getPointerPosition(event: MouseEvent | TouchEvent | PointerEvent) {
  if ("touches" in event && event.touches.length > 0) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  if ("changedTouches" in event && event.changedTouches.length > 0) {
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  }
  const mouseEvent = event as MouseEvent;
  return { x: mouseEvent.clientX, y: mouseEvent.clientY };
}

const WaysToEnjoySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);
  const focusCardRef = useRef<(index: number) => void>(() => {});

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const canvas = canvasRef.current;
      const dragProxy = dragProxyRef.current;

      if (!section || !stage || !canvas || !dragProxy) return;

      let disposed = false;
      let rafId = 0;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.15, RADIUS + 3.6);
      camera.lookAt(0, 0, 0);

      const ring = new THREE.Group();
      scene.add(ring);

      const meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>[] =
        [];

      const resizeRenderer = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };

      const resizeObserver = new ResizeObserver(resizeRenderer);
      resizeObserver.observe(stage);

      const renderLoop = () => {
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(renderLoop);
      };

      const refreshActiveCard = (rotation: number) => {
        let closestIndex = 0;
        let closestDiff = Infinity;

        meshes.forEach((mesh, index) => {
          const angle = index * ANGLE_STEP_RAD + rotation;
          const diff = Math.abs(normalizeAngle(angle));

          if (diff < closestDiff) {
            closestDiff = diff;
            closestIndex = index;
          }

          const proximity = gsap.utils.clamp(0, 1, 1 - diff / (Math.PI * 0.55));
          mesh.scale.setScalar(gsap.utils.interpolate(0.72, 1.08, proximity));
          mesh.material.opacity = gsap.utils.interpolate(0.45, 1, proximity);
        });

        if (closestIndex !== activeIndexRef.current) {
          activeIndexRef.current = closestIndex;
          setActiveIndex(closestIndex);
        }
      };

      let autoplayTween: gsap.core.Tween | null = null;
      let resumeCall: gsap.core.Tween | null = null;

      const stopAutoplay = () => {
        autoplayTween?.kill();
        resumeCall?.kill();
      };

      const startAutoplay = () => {
        autoplayTween?.kill();
        autoplayTween = gsap.to(ring.rotation, {
          y: `+=${Math.PI * 2}`,
          duration: AUTOPLAY_DURATION,
          ease: "none",
          repeat: -1,
          onUpdate: () => refreshActiveCard(ring.rotation.y),
        });
      };

      const scheduleAutoplayResume = () => {
        resumeCall?.kill();
        resumeCall = gsap.delayedCall(RESUME_DELAY, startAutoplay);
      };

      const focusCard = (index: number) => {
        stopAutoplay();

        const current = ring.rotation.y;
        const target = -index * ANGLE_STEP_RAD;
        const twoPi = Math.PI * 2;
        const delta =
          ((((target - current) % twoPi) + twoPi * 1.5) % twoPi) - Math.PI;

        gsap.to(ring.rotation, {
          y: current + delta,
          duration: 1,
          ease: "power3.out",
          onUpdate: () => refreshActiveCard(ring.rotation.y),
          onComplete: scheduleAutoplayResume,
        });
      };

      focusCardRef.current = focusCard;

      const raycaster = new THREE.Raycaster();
      const pointerVector = new THREE.Vector2();

      const handleCanvasClick = (
        event: MouseEvent | TouchEvent | PointerEvent,
      ) => {
        const rect = canvas.getBoundingClientRect();
        const point = getPointerPosition(event);
        pointerVector.x = ((point.x - rect.left) / rect.width) * 2 - 1;
        pointerVector.y = -(((point.y - rect.top) / rect.height) * 2 - 1);
        raycaster.setFromCamera(pointerVector, camera);

        const intersections = raycaster.intersectObjects(meshes, false);
        if (intersections.length === 0) return;

        const index = meshes.findIndex(
          (mesh) => mesh === intersections[0].object,
        );
        if (index !== -1) focusCard(index);
      };

      let dragStartRotation = 0;
      let dragStartX = 0;
      let cleanupDraggable: (() => void) | null = null;

      (async () => {
        await document.fonts.load(
          `500 ${Math.round(TEXTURE_SIZE * 0.082)}px Canela`,
        );

        const iconImages = await Promise.all(
          ways.map((way) => createIconImage(way.icon)),
        );

        if (disposed) return;

        ways.forEach((way, index) => {
          const textureCanvas = document.createElement("canvas");
          drawCardTexture(textureCanvas, way.title, iconImages[index]);

          const texture = new THREE.CanvasTexture(textureCanvas);
          texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.needsUpdate = true;

          const geometry = new THREE.PlaneGeometry(CARD_SIZE, CARD_SIZE);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
          });

          const mesh = new THREE.Mesh(geometry, material);
          const angle = index * ANGLE_STEP_RAD;
          mesh.position.set(
            Math.sin(angle) * RADIUS,
            0,
            Math.cos(angle) * RADIUS,
          );
          mesh.rotation.y = angle;

          ring.add(mesh);
          meshes.push(mesh);
        });

        resizeRenderer();
        refreshActiveCard(0);
        rafId = requestAnimationFrame(renderLoop);

        const [draggable] = Draggable.create(dragProxy, {
          type: "x",
          trigger: stage,
          inertia: true,
          onPress() {
            stopAutoplay();
            dragStartRotation = ring.rotation.y;
            dragStartX = draggable.x;
          },
          onDrag() {
            const rotationY =
              dragStartRotation + (draggable.x - dragStartX) * DRAG_SENSITIVITY;
            ring.rotation.y = rotationY;
            refreshActiveCard(rotationY);
          },
          onThrowUpdate() {
            const rotationY =
              dragStartRotation + (draggable.x - dragStartX) * DRAG_SENSITIVITY;
            ring.rotation.y = rotationY;
            refreshActiveCard(rotationY);
          },
          onRelease() {
            if (!draggable.isThrowing) scheduleAutoplayResume();
          },
          onThrowComplete() {
            scheduleAutoplayResume();
          },
          onClick() {
            handleCanvasClick(
              draggable.pointerEvent as MouseEvent | TouchEvent | PointerEvent,
            );
          },
        });

        cleanupDraggable = () => draggable.kill();

        const titleWordElements = section.querySelectorAll<HTMLElement>(
          `.${styles.titleWord}`,
        );

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
            onComplete: startAutoplay,
          })
          .from(`.${styles.eyebrow}`, { opacity: 0, y: 16, duration: 0.6 })
          .from(
            titleWordElements,
            {
              opacity: 0,
              yPercent: 120,
              rotateX: -60,
              duration: 0.8,
              stagger: 0.1,
            },
            "-=0.3",
          )
          .from(
            `.${styles.description}`,
            { opacity: 0, y: 20, duration: 0.6 },
            "-=0.5",
          )
          .from(stage, { opacity: 0, scale: 0.85, duration: 1 }, "-=0.4")
          .from(
            `.${styles.controls}`,
            { opacity: 0, y: 16, duration: 0.5 },
            "-=0.3",
          )
          .from(
            `.${styles.dragHint}`,
            { opacity: 0, y: 10, duration: 0.5 },
            "-=0.3",
          );
      })();

      return () => {
        disposed = true;
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        cleanupDraggable?.();
        meshes.forEach((mesh) => {
          mesh.geometry.dispose();
          mesh.material.map?.dispose();
          mesh.material.dispose();
        });
        renderer.dispose();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.waysSection} ref={sectionRef}>
      <div className={styles.decorativeGlow} />
      <div className={styles.decorativeGlow} />

      <div className={styles.header}>
        <Text className={styles.eyebrow}>Ways to Enjoy</Text>

        <Title order={2} className={styles.title}>
          {titleWords.map((word) => (
            <span className={styles.titleMask} key={word}>
              <span className={styles.titleWord}>{word}</span>
            </span>
          ))}
        </Title>

        <Text className={styles.description}>
          Whether it&apos;s breakfast, a snack, or something creative, Nature
          Bite fits effortlessly into your day.
        </Text>
      </div>

      <div className={styles.stageWrapper}>
        <div className={styles.galleryStage} ref={stageRef}>
          <div className={styles.stageFloor} />
          <canvas className={styles.galleryCanvas} ref={canvasRef} />
          <div className={styles.dragProxy} ref={dragProxyRef} />
        </div>

        <Title order={3} className={styles.activeLabel} key={activeIndex}>
          {ways[activeIndex].title}
        </Title>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.navButton}
            aria-label="Previous way to enjoy"
            onClick={() =>
              focusCardRef.current(
                (activeIndex - 1 + ways.length) % ways.length,
              )
            }
          >
            <IconChevronLeft size={20} stroke={2} />
          </button>

          <div className={styles.dots}>
            {ways.map((way, index) => (
              <button
                key={way.title}
                type="button"
                aria-label={`Show ${way.title}`}
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
                onClick={() => focusCardRef.current(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.navButton}
            aria-label="Next way to enjoy"
            onClick={() =>
              focusCardRef.current((activeIndex + 1) % ways.length)
            }
          >
            <IconChevronRight size={20} stroke={2} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default WaysToEnjoySection;
