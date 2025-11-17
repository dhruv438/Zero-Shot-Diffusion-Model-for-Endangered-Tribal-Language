import { useEffect, useRef } from "react";

function createNoise2D(seed = 0.5) {
  const F2 = 0.5 * (Math.sqrt(3) - 1);
  const G2 = (3 - Math.sqrt(3)) / 6;
  const G22 = (3 - Math.sqrt(3)) / 3;
  const p = new Uint8Array(256);

  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }

  const seededRandom = (index) => {
    const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  for (let i = 255; i > 0; i--) {
    const n = Math.floor((i + 1) * seededRandom(i));
    const q = p[i];
    p[i] = p[n];
    p[n] = q;
  }

  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);

  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const grad2 = new Float64Array([
    1, 1, -1, 1, 1, -1, -1, -1, 1, 0, -1, 0, 1, 0, -1, 0, 0, 1, 0, -1, 0, 1, 0,
    -1,
  ]);
  const fastFloor = (x) => Math.floor(x) | 0;

  return function noise2D(x, y) {
    const s = (x + y) * F2;
    const i = fastFloor(x + s);
    const j = fastFloor(y + s);
    const t = (i + j) * G2;
    const x0 = x - (i - t);
    const y0 = y - (j - t);
    let i1;
    let j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + G22;
    const y2 = y0 - 1 + G22;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = permMod12[ii + perm[jj]];
    const gi1 = permMod12[ii + i1 + perm[jj + j1]];
    const gi2 = permMod12[ii + 1 + perm[jj + 1]];
    let t0 = 0.5 - x0 * x0 - y0 * y0;
    let n0;
    if (t0 < 0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * (grad2[gi0 * 2] * x0 + grad2[gi0 * 2 + 1] * y0);
    }
    let t1 = 0.5 - x1 * x1 - y1 * y1;
    let n1;
    if (t1 < 0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * (grad2[gi1 * 2] * x1 + grad2[gi1 * 2 + 1] * y1);
    }
    let t2 = 0.5 - x2 * x2 - y2 * y2;
    let n2;
    if (t2 < 0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * (grad2[gi2 * 2] * x2 + grad2[gi2 * 2 + 1] * y2);
    }
    return 70 * (n0 + n1 + n2);
  };
}

export default function InteractiveWaveBackground({
  strokeColor = "#ffffff",
  backgroundColor = "transparent",
  waveSpeed = 0.5,
  waveAmplitude = 0.5,
  mouseInfluence = 0.5,
  lineSpacing = 0.5,
  seed = 0.5,
  resolution = 0.5,
  preview = true,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const mouseRef = useRef({
    x: -10,
    y: 0,
    lx: 0,
    ly: 0,
    sx: 0,
    sy: 0,
    v: 0,
    vs: 0,
    a: 0,
    set: false,
  });
  const pathsRef = useRef([]);
  const linesRef = useRef([]);
  const noiseRef = useRef(null);
  const rafRef = useRef(null);
  const boundingRef = useRef(null);
  const zoomProbeRef = useRef(null);
  const lastSizeRef = useRef({ width: 0, height: 0, zoom: 1 });
  const isVisibleRef = useRef(true);
  const isCanvasRef = useRef(false);

  const setSize = () => {
    if (!containerRef.current || !svgRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || container.offsetWidth || 1;
    const height = container.clientHeight || container.offsetHeight || 1;
    boundingRef.current = {
      width,
      height,
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    };
    svgRef.current.style.width = `${width}px`;
    svgRef.current.style.height = `${height}px`;
  };

  const setLines = () => {
    if (!svgRef.current || !boundingRef.current) return;
    const { width, height } = boundingRef.current;
    linesRef.current = [];
    pathsRef.current.forEach((path) => path.remove());
    pathsRef.current = [];
    const baseSpacing = 8;
    const xGap = baseSpacing + (1 - lineSpacing) * 159;
    const baseYGap = 4;
    const yGap = baseYGap + (1 - resolution) * 20;
    const oWidth = width + 200;
    const oHeight = height + 30;
    const totalLines = Math.ceil(oWidth / xGap);
    const totalPoints = Math.ceil(oHeight / yGap);
    const xStart = (width - xGap * totalLines) / 2;
    const yStart = (height - yGap * totalPoints) / 2;

    for (let i = 0; i < totalLines; i++) {
      const points = [];
      for (let j = 0; j < totalPoints; j++) {
        const point = {
          x: xStart + xGap * i,
          y: yStart + yGap * j,
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 },
        };
        points.push(point);
      }
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("wave-line");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", strokeColor);
      path.setAttribute("stroke-width", "1");
      svgRef.current.appendChild(path);
      pathsRef.current.push(path);
      linesRef.current.push(points);
    }
  };

  const movePoints = (time) => {
    const { current: lines } = linesRef;
    const { current: mouse } = mouseRef;
    const { current: noise } = noiseRef;
    if (!noise) return;
    const speedMultiplier = waveSpeed * 0.002;
    const amplitudeMultiplier = waveAmplitude * 2;
    const influenceMultiplier = mouseInfluence * 0.0007;
    const mouseSx = mouse.sx;
    const mouseSy = mouse.sy;
    const mouseVs = mouse.vs;
    const l = Math.max(175, mouseVs);

    for (let i = 0; i < lines.length; i++) {
      const points = lines[i];
      for (let j = 0; j < points.length; j++) {
        const p = points[j];
        const baseMove = noise(p.x * 0.003, p.y * 0.002) * 8;
        const move = waveSpeed > 0 ? baseMove + time * speedMultiplier : baseMove;
        p.wave.x = Math.cos(move) * 12 * amplitudeMultiplier;
        p.wave.y = Math.sin(move) * 6 * amplitudeMultiplier;
        const dx = p.x - mouseSx;
        const dy = p.y - mouseSy;
        const d = Math.hypot(dx, dy);
        if (d < l) {
          const s = 1 - d / l;
          const f = Math.cos(d * 0.001) * s * l * mouseVs * influenceMultiplier;
          const angleToPoint = Math.atan2(dy, dx);
          p.cursor.vx += Math.cos(angleToPoint) * f;
          p.cursor.vy += Math.sin(angleToPoint) * f;
        }
        p.cursor.vx += -p.cursor.x * 0.01;
        p.cursor.vy += -p.cursor.y * 0.01;
        p.cursor.vx *= 0.95;
        p.cursor.vy *= 0.95;
        p.cursor.x += p.cursor.vx;
        p.cursor.y += p.cursor.vy;
        p.cursor.x = Math.min(50, Math.max(-50, p.cursor.x));
        p.cursor.y = Math.min(50, Math.max(-50, p.cursor.y));
      }
    }
  };

  const moved = (point, withCursorForce = true) => ({
    x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
    y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
  });

  const drawLines = () => {
    const { current: lines } = linesRef;
    const { current: paths } = pathsRef;
    for (let lIndex = 0; lIndex < lines.length; lIndex++) {
      const points = lines[lIndex];
      const path = paths[lIndex];
      if (!points || points.length < 2 || !path) continue;
      const pathParts = [];
      const firstPoint = moved(points[0], false);
      pathParts.push(`M ${firstPoint.x} ${firstPoint.y}`);
      for (let i = 1; i < points.length; i++) {
        const current = moved(points[i]);
        pathParts.push(`L ${current.x} ${current.y}`);
      }
      path.setAttribute("d", pathParts.join(""));
    }
  };

  const updateMousePosition = (x, y) => {
    if (!boundingRef.current || !containerRef.current) return;
    const mouse = mouseRef.current;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.x = x - rect.left;
    mouse.y = y - rect.top + window.scrollY;
    if (!mouse.set) {
      mouse.sx = mouse.x;
      mouse.sy = mouse.y;
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.set = true;
    }
  };

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;
    noiseRef.current = createNoise2D(seed);
    setSize();
    setLines();
    movePoints(0);
    drawLines();
    const onMouseMove = (e) => updateMousePosition(e.pageX, e.pageY);
    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateMousePosition(touch.clientX, touch.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    containerRef.current.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      containerRef.current?.removeEventListener("touchmove", onTouchMove);
      observer.disconnect();
    };
  }, [seed]);

  useEffect(() => {
    const onResize = () => {
      const container = containerRef.current;
      const probe = zoomProbeRef.current;
      if (!container || !probe) return;
      const rawWidth = container.clientWidth || container.offsetWidth || 1;
      const rawHeight = container.clientHeight || container.offsetHeight || 1;
      const zoom = probe.getBoundingClientRect().width / 20;
      const safeZoom = Math.max(zoom, 0.0001);
      const width = rawWidth / safeZoom;
      const height = rawHeight / safeZoom;
      const EPSILON = 1;
      const lastSize = lastSizeRef.current;
      const sizeChanged =
        Math.abs(width - lastSize.width) > EPSILON ||
        Math.abs(height - lastSize.height) > EPSILON;
      if (!sizeChanged) return;
      lastSizeRef.current = { width, height, zoom: safeZoom };
      setSize();
      setLines();
      const shouldAnimate =
        (!isCanvasRef.current || preview) && isVisibleRef.current;
      if (!shouldAnimate) {
        movePoints(0);
        drawLines();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [lineSpacing, seed, resolution, preview, waveSpeed, waveAmplitude, mouseInfluence]);

  useEffect(() => {
    setLines();
    const shouldAnimate =
      (!isCanvasRef.current || preview) && isVisibleRef.current;
    if (shouldAnimate) {
      movePoints(performance.now());
    } else {
      movePoints(0);
    }
    drawLines();
  }, [lineSpacing, seed, resolution, preview]);

  useEffect(() => {
    const shouldAnimate =
      (!isCanvasRef.current || preview) && isVisibleRef.current;
    if (shouldAnimate) {
      movePoints(performance.now());
    } else {
      movePoints(0);
    }
    drawLines();
  }, [waveSpeed, waveAmplitude, mouseInfluence]);

  useEffect(() => {
    pathsRef.current.forEach((path) => {
      path.setAttribute("stroke", strokeColor);
    });
    drawLines();
  }, [strokeColor]);

  useEffect(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const shouldAnimate =
      (!isCanvasRef.current || preview) && isVisibleRef.current;
    if (!shouldAnimate) return;
    const tick = (time) => {
      const stillShouldAnimate =
        (!isCanvasRef.current || preview) && isVisibleRef.current;
      if (!stillShouldAnimate) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
      if (
        !pathsRef.current ||
        pathsRef.current.length === 0 ||
        !linesRef.current ||
        linesRef.current.length === 0
      ) {
        return;
      }
      const mouse = mouseRef.current;
      mouse.sx += (mouse.x - mouse.sx) * 0.1;
      mouse.sy += (mouse.y - mouse.sy) * 0.1;
      const dx = mouse.x - mouse.lx;
      const dy = mouse.y - mouse.ly;
      const d = Math.hypot(dx, dy);
      mouse.v = d;
      mouse.vs += (d - mouse.vs) * 0.1;
      mouse.vs = Math.min(100, mouse.vs);
      mouse.lx = mouse.x;
      mouse.ly = mouse.y;
      mouse.a = Math.atan2(dy, dx);
      movePoints(time);
      drawLines();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [waveSpeed, waveAmplitude, mouseInfluence, seed, preview]);

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: backgroundColor || "transparent",
        position: "relative",
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      />
      <div
        ref={zoomProbeRef}
        style={{ position: "absolute", width: 20, height: 20, opacity: 0, pointerEvents: "none" }}
      />
      <div
        style={{
          position: "relative",
          width: boundingRef.current?.width || 800,
          height: boundingRef.current?.height || 600,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
}

