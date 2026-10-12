import React, { useEffect, useRef } from 'react';

interface NightSkyBackgroundProps {
  customImage: string | null;
  dimLevel: number; // 0 to 1
  blurLevel: number; // 0 to 20
  enableStarsOverImage: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: number; // Slight natural color tint: bluish, golden, white
}

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  width: number;
  decay: number;
  headGlow: number;
}

export const NightSkyBackground: React.FC<NightSkyBackgroundProps> = ({
  customImage,
  dimLevel,
  blurLevel,
  enableStarsOverImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Initialize multi-layered stars
    let stars: Star[] = [];
    const initStars = () => {
      const starCount = Math.floor((width * height) / 4500); // Responsive density
      stars = [];
      for (let i = 0; i < Math.max(120, starCount); i++) {
        // Star color variations: mostly cool white (210-230), warm white (40-50), pure white
        const hues = [210, 220, 45, 0, 240];
        const hue = hues[Math.floor(Math.random() * hues.length)];

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.7 + 0.3,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          twinklePhase: Math.random() * Math.PI * 2,
          hue,
        });
      }
    };

    initStars();

    // Meteors (Shooting stars)
    const meteors: Meteor[] = [];
    let nextMeteorTime = Date.now() + 1500; // First shooting star appears soon

    const createMeteor = () => {
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees
      const startX = Math.random() * width * 1.2 - width * 0.2;
      const startY = Math.random() * (height * 0.4);

      meteors.push({
        x: startX,
        y: startY,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 9 + 11,
        angle,
        opacity: 1,
        width: Math.random() * 1.8 + 1.2,
        decay: Math.random() * 0.015 + 0.012,
        headGlow: Math.random() * 3 + 2,
      });

      // Schedule next meteor: random interval between 3.5s and 8s
      nextMeteorTime = Date.now() + Math.random() * 4500 + 3500;
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // If no custom image, render deep cosmic midnight sky gradient
      if (!customImage) {
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#040714'); // Deep dark cosmic navy
        skyGrad.addColorStop(0.4, '#090d24');
        skyGrad.addColorStop(0.75, '#0b1338');
        skyGrad.addColorStop(1, '#070b1e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Cosmic nebula glow in top corners
        const nebula1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 10, width * 0.8, height * 0.2, width * 0.5);
        nebula1.addColorStop(0, 'rgba(88, 28, 135, 0.12)'); // violet
        nebula1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula1;
        ctx.fillRect(0, 0, width, height);

        const nebula2 = ctx.createRadialGradient(width * 0.2, height * 0.4, 20, width * 0.2, height * 0.4, width * 0.45);
        nebula2.addColorStop(0, 'rgba(30, 58, 138, 0.14)'); // blue
        nebula2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebula2;
        ctx.fillRect(0, 0, width, height);
      }

      // Check if we should draw stars
      if (!customImage || enableStarsOverImage) {
        // Draw Twinkling Stars
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.twinklePhase += star.twinkleSpeed;
          // Natural sine wave twinkling
          const currentAlpha = Math.max(0.15, Math.min(1, star.alpha + Math.sin(star.twinklePhase) * 0.45));

          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

          if (star.size > 1.2) {
            // Bright stars have subtle glow
            const glowGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2.8);
            glowGrad.addColorStop(0, `hsla(${star.hue}, 80%, 95%, ${currentAlpha})`);
            glowGrad.addColorStop(0.4, `hsla(${star.hue}, 90%, 80%, ${currentAlpha * 0.6})`);
            glowGrad.addColorStop(1, `hsla(${star.hue}, 100%, 70%, 0)`);
            ctx.fillStyle = glowGrad;
            ctx.arc(star.x, star.y, star.size * 2.8, 0, Math.PI * 2);
          } else {
            ctx.fillStyle = `hsla(${star.hue}, 60%, 90%, ${currentAlpha})`;
          }
          ctx.fill();
        }

        // Check if it's time for a shooting star
        if (Date.now() > nextMeteorTime) {
          createMeteor();
          // Occasionally spawn a twin meteor for visual wonder
          if (Math.random() < 0.25) {
            setTimeout(createMeteor, 250);
          }
        }

        // Draw Meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];

          const tailX = m.x - Math.cos(m.angle) * m.length;
          const tailY = m.y - Math.sin(m.angle) * m.length;

          // Meteor streak gradient
          const meteorGrad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
          meteorGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
          meteorGrad.addColorStop(0.7, `rgba(167, 218, 255, ${m.opacity * 0.6})`);
          meteorGrad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = meteorGrad;
          ctx.lineWidth = m.width;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Glowing meteor head
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.headGlow, 0, Math.PI * 2);
          const headGrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.headGlow);
          headGrad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
          headGrad.addColorStop(0.5, `rgba(147, 197, 253, ${m.opacity * 0.8})`);
          headGrad.addColorStop(1, `rgba(147, 197, 253, 0)`);
          ctx.fillStyle = headGrad;
          ctx.fill();

          // Move meteor
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.opacity -= m.decay;

          // Remove meteor if faded out or off screen
          if (m.opacity <= 0 || m.x > width + 100 || m.y > height + 100) {
            meteors.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [customImage, enableStarsOverImage]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Custom image background if provided */}
      {customImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
          style={{
            backgroundImage: `url(${customImage})`,
            filter: `blur(${blurLevel}px)`,
            transform: blurLevel > 0 ? 'scale(1.05)' : 'none',
          }}
        />
      )}

      {/* Dim / Contrast overlay protecting text readability on any background */}
      <div
        className="absolute inset-0 transition-colors duration-300"
        style={{
          backgroundColor: customImage
            ? `rgba(7, 11, 28, ${dimLevel})`
            : 'rgba(5, 8, 22, 0.4)',
        }}
      />

      {/* Subtle radial vignette gradient to focus content on center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(3,6,18,0.7)_100%)] pointer-events-none" />

      {/* Realistic Stars & Shooting Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
