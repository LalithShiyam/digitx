import { useEffect, useRef, useState } from 'react';

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  targetX: number;
  targetY: number;
  trail: { x: number; y: number; age: number }[];
}

// Story sequence: scatter → grid → graph → lightbulb → heart → scatter
type ShapeType = 'scatter' | 'grid' | 'graph' | 'lightbulb' | 'heart';

const NetworkGraph = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();
  const shapeRef = useRef<{ 
    type: ShapeType; 
    startTime: number; 
    centerX: number; 
    centerY: number;
  }>({ 
    type: 'scatter', 
    startTime: 0,
    centerX: 0,
    centerY: 0,
  });
  const storyIndexRef = useRef(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      numBoids: 81,
      maxSpeed: 3,
      minSpeed: 0.15,
      cruiseSpeed: 0.4,
      perception: 80,
      separationDist: 40,
      alignmentWeight: 0.006,
      cohesionWeight: 0.001,
      separationWeight: 0.035,
      targetWeight: 0.02,
      cursorRadius: 100,
      cursorWeight: 0.01,
      trailLength: 14,
      edgeMargin: 50,
      edgeTurnForce: 0.08,
    };

    // Story: scatter → grid → graph → lightbulb → heart → back to scatter
    const storySequence: ShapeType[] = ['grid', 'graph', 'lightbulb', 'heart'];

    // Generate positions for different shapes centered at click position
    const generateShapeTargets = (shape: ShapeType, centerX: number, centerY: number, numBoids: number): { x: number; y: number }[] => {
      const scale = Math.min(window.innerWidth, window.innerHeight) * 0.22;
      const targets: { x: number; y: number }[] = [];

      switch (shape) {
        case 'grid': {
          // Structured grid/matrix - representing data becoming structured
          const cols = Math.ceil(Math.sqrt(numBoids));
          const rows = Math.ceil(numBoids / cols);
          const cellSize = scale * 2 / Math.max(cols, rows);
          const startX = centerX - (cols - 1) * cellSize / 2;
          const startY = centerY - (rows - 1) * cellSize / 2;
          
          for (let i = 0; i < numBoids; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            targets.push({
              x: startX + col * cellSize,
              y: startY + row * cellSize,
            });
          }
          break;
        }

        case 'graph': {
          // Knowledge graph with nodes and connections
          const nodes = 8;
          const nodePositions: { x: number; y: number }[] = [];
          
          // Create outer ring of nodes
          for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2 - Math.PI / 2;
            const radius = scale * 0.85;
            nodePositions.push({
              x: centerX + Math.cos(angle) * radius,
              y: centerY + Math.sin(angle) * radius,
            });
          }
          // Center node
          nodePositions.push({ x: centerX, y: centerY });
          
          // Distribute boids to nodes and edges
          const boidsPerNode = Math.floor(numBoids * 0.6 / nodePositions.length);
          nodePositions.forEach((node) => {
            for (let j = 0; j < boidsPerNode; j++) {
              targets.push({
                x: node.x + (Math.random() - 0.5) * 18,
                y: node.y + (Math.random() - 0.5) * 18,
              });
            }
          });
          
          // Rest on edges connecting to center
          while (targets.length < numBoids) {
            const nodeIdx = Math.floor(Math.random() * (nodePositions.length - 1));
            const t = Math.random();
            targets.push({
              x: nodePositions[nodeIdx].x + (centerX - nodePositions[nodeIdx].x) * t,
              y: nodePositions[nodeIdx].y + (centerY - nodePositions[nodeIdx].y) * t,
            });
          }
          break;
        }

        case 'lightbulb': {
          // Lightbulb shape - representing insight/reasoning
          for (let i = 0; i < numBoids; i++) {
            const t = i / numBoids;
            let x, y;
            
            if (t < 0.65) {
              // Bulb part (circle)
              const angle = (t / 0.65) * Math.PI * 2 - Math.PI / 2;
              const bulbRadius = scale * 0.55;
              x = Math.cos(angle) * bulbRadius;
              y = Math.sin(angle) * bulbRadius - scale * 0.15;
            } else if (t < 0.8) {
              // Neck
              const neckT = (t - 0.65) / 0.15;
              x = (Math.random() - 0.5) * scale * 0.35;
              y = scale * 0.4 + neckT * scale * 0.25;
            } else {
              // Base/screw threads
              const baseT = (t - 0.8) / 0.2;
              const baseWidth = scale * 0.3 * (1 - baseT * 0.3);
              x = (Math.random() - 0.5) * baseWidth;
              y = scale * 0.65 + baseT * scale * 0.2;
            }
            
            targets.push({ x: centerX + x, y: centerY + y });
          }
          break;
        }

        case 'heart': {
          // Heart shape - representing human/clinical trust
          for (let i = 0; i < numBoids; i++) {
            const t = (i / numBoids) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            targets.push({
              x: centerX + x * scale * 0.045,
              y: centerY + y * scale * 0.045,
            });
          }
          break;
        }

        default: // scatter
          return boidsRef.current.map(b => ({ x: b.homeX, y: b.homeY }));
      }

      return targets;
    };

    const initBoids = (width: number, height: number) => {
      const boids: Boid[] = [];
      const cols = Math.ceil(Math.sqrt(config.numBoids * (width / height)));
      const rows = Math.ceil(config.numBoids / cols);
      const spacingX = width / (cols + 1);
      const spacingY = height / (rows + 1);
      
      for (let i = 0; i < config.numBoids; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const homeX = spacingX * (col + 1) + (Math.random() - 0.5) * spacingX * 0.5;
        const homeY = spacingY * (row + 1) + (Math.random() - 0.5) * spacingY * 0.5;
        const angle = Math.random() * Math.PI * 2;
        const speed = config.cruiseSpeed;
        boids.push({
          x: homeX,
          y: homeY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          homeX,
          homeY,
          targetX: homeX,
          targetY: homeY,
          trail: [],
        });
      }
      boidsRef.current = boids;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initBoids(window.innerWidth, window.innerHeight);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onClick = (e: MouseEvent) => {
      // Only trigger on background clicks, not on interactive elements
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, [role="button"], nav')) return;
      
      const boids = boidsRef.current;
      const currentIndex = storyIndexRef.current;
      
      // Story progression: scatter → grid → graph → lightbulb → heart → scatter
      if (currentIndex < storySequence.length) {
        // Progress to next shape in story
        const newShape = storySequence[currentIndex];
        storyIndexRef.current++;
        shapeRef.current = { 
          type: newShape, 
          startTime: Date.now(),
          centerX: e.clientX,
          centerY: e.clientY,
        };
        const targets = generateShapeTargets(newShape, e.clientX, e.clientY, boids.length);
        boids.forEach((boid, i) => {
          if (targets[i]) {
            boid.targetX = targets[i].x;
            boid.targetY = targets[i].y;
          }
        });
      } else {
        // End of story - disperse back to scatter and reset
        storyIndexRef.current = 0;
        shapeRef.current = { type: 'scatter', startTime: Date.now(), centerX: 0, centerY: 0 };
        boids.forEach(boid => {
          // Add dispersal velocity away from click
          const dx = boid.x - e.clientX;
          const dy = boid.y - e.clientY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const pushStrength = 6;
          boid.vx += (dx / dist) * pushStrength;
          boid.vy += (dy / dist) * pushStrength;
          boid.targetX = boid.homeX;
          boid.targetY = boid.homeY;
        });
      }
    };

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const boids = boidsRef.current;
      const mouse = mouseRef.current;
      const shape = shapeRef.current;
      const elapsed = Date.now() - shape.startTime;

      // Auto-disperse after heart shape (3 seconds)
      if (shape.type === 'heart' && elapsed > 3000 && storyIndexRef.current >= storySequence.length) {
        storyIndexRef.current = 0;
        shapeRef.current = { type: 'scatter', startTime: Date.now(), centerX: 0, centerY: 0 };
        boids.forEach(boid => {
          // Gentle dispersal from center
          const dx = boid.x - shape.centerX;
          const dy = boid.y - shape.centerY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const pushStrength = 4;
          boid.vx += (dx / dist) * pushStrength;
          boid.vy += (dy / dist) * pushStrength;
          boid.targetX = boid.homeX;
          boid.targetY = boid.homeY;
        });
      }

      // Smooth transition easing
      const transitionProgress = Math.min(elapsed / 1500, 1);
      const easeProgress = transitionProgress < 0.5 
        ? 2 * transitionProgress * transitionProgress 
        : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2;
      
      const targetWeight = shape.type === 'scatter' 
        ? config.targetWeight * 0.3
        : config.targetWeight * (0.5 + easeProgress * 1.5);

      const bgColor = isDark ? 'rgb(18, 22, 28)' : 'rgb(245, 240, 230)';
      const boidColor = isDark 
        ? { r: 210, g: 125, b: 85 }
        : { r: 165, g: 90, b: 55 };

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw connecting lines when forming shapes
      if (shape.type !== 'scatter' && easeProgress > 0.3) {
        const baseOpacity = shape.type === 'graph' ? 0.4 : 0.2; // More visible for graph
        const lineOpacity = (easeProgress - 0.3) * baseOpacity;
        const maxDist = shape.type === 'graph' ? 120 : 60; // Longer connections for graph
        const lineWidth = shape.type === 'graph' ? 1.5 : 1;
        
        ctx.strokeStyle = `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, ${lineOpacity})`;
        ctx.lineWidth = lineWidth;
        
        boids.forEach((boid, i) => {
          // Connect to more neighbors for graph shape
          const checkCount = shape.type === 'graph' ? 8 : 3;
          boids.slice(i + 1, i + 1 + checkCount).forEach(other => {
            const dx = other.x - boid.x;
            const dy = other.y - boid.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              // Fade edges by distance
              const edgeOpacity = lineOpacity * (1 - dist / maxDist);
              ctx.strokeStyle = `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, ${edgeOpacity})`;
              ctx.beginPath();
              ctx.moveTo(boid.x, boid.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          });
        });
      }

      boids.forEach((boid, i) => {
        let ax = 0, ay = 0;
        let alignX = 0, alignY = 0;
        let cohesionX = 0, cohesionY = 0;
        let separationX = 0, separationY = 0;
        let neighbors = 0;

        const flockingStrength = shape.type === 'scatter' ? 1 : (1 - easeProgress * 0.8);

        boids.forEach((other, j) => {
          if (i === j) return;
          const dx = other.x - boid.x;
          const dy = other.y - boid.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.perception) {
            neighbors++;
            alignX += other.vx;
            alignY += other.vy;
            cohesionX += other.x;
            cohesionY += other.y;
          }
          
          if (dist < config.separationDist && dist > 0) {
            const force = (config.separationDist - dist) / config.separationDist;
            separationX -= (dx / dist) * force * force;
            separationY -= (dy / dist) * force * force;
          }
        });

        if (neighbors > 0) {
          alignX /= neighbors;
          alignY /= neighbors;
          ax += (alignX - boid.vx) * config.alignmentWeight * flockingStrength;
          ay += (alignY - boid.vy) * config.alignmentWeight * flockingStrength;

          cohesionX /= neighbors;
          cohesionY /= neighbors;
          ax += (cohesionX - boid.x) * config.cohesionWeight * flockingStrength;
          ay += (cohesionY - boid.y) * config.cohesionWeight * flockingStrength;
        }

        ax += separationX * config.separationWeight;
        ay += separationY * config.separationWeight;

        // Move toward target
        const targetDistX = boid.targetX - boid.x;
        const targetDistY = boid.targetY - boid.y;
        ax += targetDistX * targetWeight;
        ay += targetDistY * targetWeight;

        // Gentle cursor attraction
        const dxMouse = mouse.x - boid.x;
        const dyMouse = mouse.y - boid.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < config.cursorRadius && distMouse > 20) {
          const curiosity = Math.pow(1 - distMouse / config.cursorRadius, 2);
          ax += (dxMouse / distMouse) * curiosity * config.cursorWeight;
          ay += (dyMouse / distMouse) * curiosity * config.cursorWeight;
        }

        // Soft edge avoidance
        if (boid.x < config.edgeMargin) ax += config.edgeTurnForce * (1 - boid.x / config.edgeMargin);
        if (boid.x > width - config.edgeMargin) ax -= config.edgeTurnForce * (1 - (width - boid.x) / config.edgeMargin);
        if (boid.y < config.edgeMargin) ay += config.edgeTurnForce * (1 - boid.y / config.edgeMargin);
        if (boid.y > height - config.edgeMargin) ay -= config.edgeTurnForce * (1 - (height - boid.y) / config.edgeMargin);

        // Apply with damping
        boid.vx = boid.vx * 0.96 + ax;
        boid.vy = boid.vy * 0.96 + ay;

        // Speed limits
        const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
        if (speed > config.maxSpeed) {
          boid.vx = (boid.vx / speed) * config.maxSpeed;
          boid.vy = (boid.vy / speed) * config.maxSpeed;
        } else if (speed < config.minSpeed && speed > 0) {
          boid.vx = (boid.vx / speed) * config.minSpeed;
          boid.vy = (boid.vy / speed) * config.minSpeed;
        }

        boid.x += boid.vx;
        boid.y += boid.vy;

        // Update trail
        if (frameCount % 2 === 0) {
          boid.trail.unshift({ x: boid.x, y: boid.y, age: 0 });
          if (boid.trail.length > config.trailLength) boid.trail.pop();
        }
        boid.trail.forEach(t => t.age++);

        // Draw trail
        if (boid.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(boid.trail[0].x, boid.trail[0].y);
          for (let t = 1; t < boid.trail.length - 1; t++) {
            const xc = (boid.trail[t].x + boid.trail[t + 1].x) / 2;
            const yc = (boid.trail[t].y + boid.trail[t + 1].y) / 2;
            ctx.quadraticCurveTo(boid.trail[t].x, boid.trail[t].y, xc, yc);
          }
          const gradient = ctx.createLinearGradient(
            boid.trail[0].x, boid.trail[0].y,
            boid.trail[boid.trail.length - 1].x, boid.trail[boid.trail.length - 1].y
          );
          gradient.addColorStop(0, `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0.25)`);
          gradient.addColorStop(1, `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0)`);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw boid glow
        const glow = ctx.createRadialGradient(boid.x, boid.y, 0, boid.x, boid.y, 12);
        glow.addColorStop(0, `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0.6)`);
        glow.addColorStop(0.4, `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0.2)`);
        glow.addColorStop(1, `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(boid.x, boid.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${boidColor.r}, ${boidColor.g}, ${boidColor.b}, 0.9)`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onClick);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDark]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: 0 }} 
    />
  );
};

export default NetworkGraph;
