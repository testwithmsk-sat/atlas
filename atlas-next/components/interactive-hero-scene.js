"use client";

import { useEffect, useRef } from "react";

const sceneShapes = [
  { type: "icosahedron", radius: 208, angle: "18deg", speed: "20s", delay: "-2s", lift: "-56px", size: 88 },
  { type: "torus", radius: 156, angle: "76deg", speed: "16s", delay: "-9s", lift: "72px", size: 72 },
  { type: "octahedron", radius: 230, angle: "132deg", speed: "22s", delay: "-6s", lift: "18px", size: 76 },
  { type: "icosahedron", radius: 138, angle: "208deg", speed: "15s", delay: "-4s", lift: "-92px", size: 54 },
  { type: "torus", radius: 246, angle: "248deg", speed: "24s", delay: "-11s", lift: "86px", size: 94 },
  { type: "octahedron", radius: 174, angle: "312deg", speed: "19s", delay: "-15s", lift: "-8px", size: 64 }
];

function createParticle(index) {
  return {
    angle: Math.random() * Math.PI * 2,
    orbit: 48 + Math.random() * 280,
    drift: 0.3 + Math.random() * 1.2,
    alpha: 0.08 + Math.random() * 0.65,
    size: 0.5 + Math.random() * 2.3,
    depth: 0.15 + Math.random() * 1.25,
    wobble: Math.random() * 6.28,
    hue: index % 3 === 0 ? 281 : index % 3 === 1 ? 325 : 212
  };
}

function drawLight(context, x, y, radius, color) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

export function InteractiveHeroScene() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const leftPupil = leftPupilRef.current;
    const rightPupil = rightPupilRef.current;

    if (!canvas || !stage || !leftPupil || !rightPupil) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = Array.from({ length: 640 }, (_, index) => createParticle(index));
    const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    const scrollState = { current: 0, target: 0 };
    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setPointerTarget = (clientX, clientY) => {
      pointer.targetX = (clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (clientY / window.innerHeight) * 2 - 1;
    };

    const handlePointerMove = (event) => {
      setPointerTarget(event.clientX, event.clientY);
    };

    const handleScroll = () => {
      scrollState.target = window.scrollY;
    };

    const renderFrame = (time) => {
      pointer.currentX += (pointer.targetX - pointer.currentX) * 0.08;
      pointer.currentY += (pointer.targetY - pointer.currentY) * 0.08;
      scrollState.current += (scrollState.target - scrollState.current) * 0.06;

      const normalizedScroll = Math.min(1, scrollState.current / Math.max(window.innerHeight, 1));
      const sceneTiltX = prefersReducedMotion ? -4 : -pointer.currentY * 10 - normalizedScroll * 8;
      const sceneTiltY = prefersReducedMotion ? 6 : pointer.currentX * 16;
      const sceneFloat = prefersReducedMotion ? 0 : Math.sin(time * 0.0012) * 12 - normalizedScroll * 28;

      stage.style.setProperty("--scene-tilt-x", `${sceneTiltX.toFixed(2)}deg`);
      stage.style.setProperty("--scene-tilt-y", `${sceneTiltY.toFixed(2)}deg`);
      stage.style.setProperty("--scene-float-y", `${sceneFloat.toFixed(2)}px`);
      stage.style.setProperty("--scene-wave", `${(Math.sin(time * 0.0035) * 18 + pointer.currentX * 18).toFixed(2)}deg`);

      const pupilTranslateX = pointer.currentX * 7;
      const pupilTranslateY = pointer.currentY * 5;
      leftPupil.style.transform = `translate(calc(-50% + ${pupilTranslateX.toFixed(2)}px), calc(-50% + ${pupilTranslateY.toFixed(2)}px))`;
      rightPupil.style.transform = `translate(calc(-50% + ${pupilTranslateX.toFixed(2)}px), calc(-50% + ${pupilTranslateY.toFixed(2)}px))`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";

      const purpleLightX = width * 0.28 + pointer.currentX * 48;
      const purpleLightY = height * 0.24 + Math.sin(time * 0.001) * 18;
      const pinkLightX = width * 0.74 - pointer.currentX * 42;
      const pinkLightY = height * 0.34 + Math.cos(time * 0.0012) * 22;
      const blueLightX = width * 0.52 + Math.sin(time * 0.0008) * 74;
      const blueLightY = height * 0.76 - normalizedScroll * 60;

      drawLight(context, purpleLightX, purpleLightY, 190, "rgba(153, 74, 255, 0.22)");
      drawLight(context, pinkLightX, pinkLightY, 170, "rgba(255, 89, 184, 0.18)");
      drawLight(context, blueLightX, blueLightY, 200, "rgba(60, 167, 255, 0.18)");

      context.globalCompositeOperation = "lighter";

      particles.forEach((particle, index) => {
        const angle = particle.angle + time * 0.00018 * particle.drift;
        const wobble = Math.sin(time * 0.0008 * particle.depth + particle.wobble) * 16;
        const orbitX = Math.cos(angle + pointer.currentX * 0.8) * (particle.orbit + wobble);
        const orbitY =
          Math.sin(angle * 1.35 - normalizedScroll * 2.8) * (particle.orbit * 0.42 + wobble * 0.6);
        const x = width * 0.5 + orbitX + pointer.currentX * 52 * particle.depth;
        const y = height * 0.5 + orbitY + pointer.currentY * 36 * particle.depth;
        const alpha = particle.alpha * (0.7 + 0.3 * Math.sin(time * 0.0016 + index));
        const radius = particle.size * (1 + particle.depth * 0.6);

        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 100%, 72%, ${Math.max(0.04, alpha).toFixed(3)})`;
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrameId = window.requestAnimationFrame(renderFrame);
    };

    resizeCanvas();
    setPointerTarget(window.innerWidth * 0.72, window.innerHeight * 0.32);
    handleScroll();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    animationFrameId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="interactive-scene" aria-hidden="true">
      <canvas className="interactive-scene-canvas" ref={canvasRef} />
      <div className="interactive-scene-stage" ref={stageRef}>
        <div className="interactive-scene-shapes">
          {sceneShapes.map((shape, index) => (
            <div
              className="scene-orbit"
              key={`${shape.type}-${index}`}
              style={{
                "--orbit-radius": shape.radius,
                "--orbit-angle": shape.angle,
                "--orbit-speed": shape.speed,
                "--orbit-delay": shape.delay,
                "--orbit-lift": shape.lift,
                "--shape-size": shape.size
              }}
            >
              <div className={`scene-shape scene-shape--${shape.type}`}>
                <span></span>
              </div>
            </div>
          ))}
        </div>

        <div className="scene-blob">
          <div className="scene-blob-shadow"></div>
          <div className="scene-blob-arm scene-blob-arm--left">
            <span className="scene-blob-glove"></span>
          </div>
          <div className="scene-blob-arm scene-blob-arm--right">
            <span className="scene-blob-glove"></span>
          </div>
          <div className="scene-blob-body">
            <div className="scene-blob-face">
              <div className="scene-eye">
                <span className="scene-pupil" ref={leftPupilRef}></span>
              </div>
              <div className="scene-eye">
                <span className="scene-pupil" ref={rightPupilRef}></span>
              </div>
            </div>
            <div className="scene-blob-mouth"></div>
            <div className="scene-blob-cheek scene-blob-cheek--left"></div>
            <div className="scene-blob-cheek scene-blob-cheek--right"></div>
          </div>
          <div className="scene-blob-badge">PLAY MODE</div>
        </div>
      </div>
    </div>
  );
}
