import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * SYSTEM ORB — the hero visual.
 *
 * A slowly rotating point-cloud sphere (Fibonacci lattice). The pointer acts as
 * a lens: points near it bulge outward and the underlying network lattice is
 * revealed. Labelled system nodes orbit the sphere and signal pulses travel
 * across its surface — systems talking to each other.
 *
 * Canvas 2D only. Pauses when off-screen or the tab is hidden, draws one static
 * frame under prefers-reduced-motion, and scales point count to the viewport.
 */

const FG = "237,235,230";
const ACCENT = "255,91,46";
const NODES = ["API", "DB", "SEARCH", "MODEL", "QUEUE", "EDGE", "AUTH"];

type Signal = { a: number; b: number; t: number; speed: number };

function fibonacciSphere(n: number) {
  const pts = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts[i * 3] = Math.cos(th) * r;
    pts[i * 3 + 1] = y;
    pts[i * 3 + 2] = Math.sin(th) * r;
  }
  return pts;
}

function nearestPairs(pts: Float32Array, n: number, k: number) {
  const pairs: number[] = [];
  for (let i = 0; i < n; i++) {
    const best: [number, number][] = [];
    for (let j = 0; j < n; j++) {
      if (j === i) continue;
      const dx = pts[i * 3] - pts[j * 3];
      const dy = pts[i * 3 + 1] - pts[j * 3 + 1];
      const dz = pts[i * 3 + 2] - pts[j * 3 + 2];
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < k) best.push([d, j]);
      else if (d < best[k - 1][0]) best[k - 1] = [d, j];
      else continue;
      best.sort((p, q) => p[0] - q[0]);
    }
    for (const [, j] of best) if (j > i) pairs.push(i, j);
  }
  return new Uint16Array(pairs);
}

export function SystemOrb({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0,
      h = 0,
      dpr = 1;
    let cx = 0,
      cy = 0,
      R = 0;
    let isMobile = false;

    let N = 0;
    let base = new Float32Array(0);
    let pairs = new Uint16Array(0);
    let sx = new Float32Array(0),
      sy = new Float32Array(0),
      sz = new Float32Array(0);

    const pointer = { x: -9999, y: -9999, nx: 0, ny: 0, active: false };
    const rot = { yaw: 0.4, tiltX: -0.25, tx: 0, ty: 0 };
    const signals: Signal[] = [];
    let lastSpawn = 0;

    const build = () => {
      // layout size (ignores CSS transforms on ancestors)
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      isMobile = w < 768;
      cx = isMobile ? w * 0.5 : w * 0.7;
      cy = isMobile ? h * 0.3 : h * 0.5;
      R = isMobile ? Math.min(w * 0.38, h * 0.22) : Math.min(w * 0.22, h * 0.34);

      const nextN = isMobile ? 420 : w < 1280 ? 700 : 900;
      if (nextN !== N) {
        N = nextN;
        base = fibonacciSphere(N);
        pairs = nearestPairs(base, N, 3);
        sx = new Float32Array(N);
        sy = new Float32Array(N);
        sz = new Float32Array(N);
      }
    };

    const project = (x: number, y: number, z: number, out: { x: number; y: number; z: number }) => {
      // yaw (Y axis) then tilt (X axis), then perspective
      const cyw = Math.cos(rot.yaw),
        syw = Math.sin(rot.yaw);
      const x1 = x * cyw + z * syw;
      const z1 = -x * syw + z * cyw;
      const ct = Math.cos(rot.tiltX),
        st = Math.sin(rot.tiltX);
      const y2 = y * ct - z1 * st;
      const z2 = y * st + z1 * ct;
      const persp = 3.2 / (3.2 - z2);
      out.x = cx + x1 * R * persp;
      out.y = cy + y2 * R * persp;
      out.z = z2;
    };

    const tmp = { x: 0, y: 0, z: 0 };

    const draw = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, w, h);

      // pointer → rotation (eased)
      const targetTilt = -0.25 + pointer.ny * 0.35;
      const targetYawOff = pointer.nx * 0.5;
      rot.tiltX += (targetTilt - rot.tiltX) * 0.04;
      rot.ty += (targetYawOff - rot.ty) * 0.04;
      rot.tx += reduced ? 0 : 0.0016;
      rot.yaw = 0.4 + rot.tx + rot.ty;

      // core glow
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.25);
      g.addColorStop(0, `rgba(${ACCENT},0.16)`);
      g.addColorStop(0.45, `rgba(${ACCENT},0.04)`);
      g.addColorStop(1, `rgba(${ACCENT},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(cx - R * 1.3, cy - R * 1.3, R * 2.6, R * 2.6);

      const lens = isMobile ? 110 : 170;
      const px = pointer.x,
        py = pointer.y;

      // project points (+ breathing displacement + lens bulge)
      for (let i = 0; i < N; i++) {
        const bx = base[i * 3],
          by = base[i * 3 + 1],
          bz = base[i * 3 + 2];
        const breathe = 1 + 0.035 * Math.sin(3 * by + t * 0.9) * Math.cos(2 * bx - t * 0.6);
        project(bx * breathe, by * breathe, bz * breathe, tmp);
        let x = tmp.x,
          y = tmp.y;
        if (pointer.active) {
          const dx = x - px,
            dy = y - py;
          const d = Math.hypot(dx, dy);
          if (d < lens && d > 0.001 && tmp.z > -0.2) {
            const f = (1 - d / lens) ** 2 * 16;
            x += (dx / d) * f;
            y += (dy / d) * f;
          }
        }
        sx[i] = x;
        sy[i] = y;
        sz[i] = tmp.z;
      }

      // lattice revealed under the lens
      if (pointer.active) {
        ctx.lineWidth = 0.6;
        for (let k = 0; k < pairs.length; k += 2) {
          const a = pairs[k],
            b = pairs[k + 1];
          if (sz[a] < -0.1 || sz[b] < -0.1) continue;
          const mx = (sx[a] + sx[b]) * 0.5 - px;
          const my = (sy[a] + sy[b]) * 0.5 - py;
          const d = Math.hypot(mx, my);
          if (d > lens) continue;
          const alpha = (1 - d / lens) * 0.55;
          ctx.strokeStyle = `rgba(${ACCENT},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(sx[a], sy[a]);
          ctx.lineTo(sx[b], sy[b]);
          ctx.stroke();
        }
      }

      // points
      for (let i = 0; i < N; i++) {
        const depth = (sz[i] + 1) * 0.5; // 0 back → 1 front
        let alpha = 0.06 + depth * depth * 0.62;
        let size = 0.7 + depth * 1.1;
        let color = FG;
        if (pointer.active) {
          const d = Math.hypot(sx[i] - px, sy[i] - py);
          if (d < lens && sz[i] > -0.1) {
            const f = 1 - d / lens;
            alpha = Math.min(1, alpha + f * 0.6);
            size += f * 1.2;
            if (f > 0.35) color = ACCENT;
          }
        }
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(3)})`;
        ctx.fillRect(sx[i] - size / 2, sy[i] - size / 2, size, size);
      }

      // signals travelling along great circles
      if (!reduced && time - lastSpawn > (isMobile ? 1400 : 900) && signals.length < 5) {
        lastSpawn = time;
        signals.push({
          a: (Math.random() * N) | 0,
          b: (Math.random() * N) | 0,
          t: 0,
          speed: 0.006 + Math.random() * 0.006,
        });
      }
      for (let s = signals.length - 1; s >= 0; s--) {
        const sig = signals[s];
        sig.t += sig.speed;
        if (sig.t > 1.25) {
          signals.splice(s, 1);
          continue;
        }
        const ax = base[sig.a * 3],
          ay = base[sig.a * 3 + 1],
          az = base[sig.a * 3 + 2];
        const bx = base[sig.b * 3],
          by = base[sig.b * 3 + 1],
          bz = base[sig.b * 3 + 2];
        const omega = Math.acos(Math.max(-1, Math.min(1, ax * bx + ay * by + az * bz)));
        if (omega < 0.01) continue;
        const so = Math.sin(omega);
        const steps = 22;
        const head = Math.min(1, sig.t);
        const tail = Math.max(0, sig.t - 0.25);
        let prevX = 0,
          prevY = 0;
        for (let k = 0; k <= steps; k++) {
          const u = tail + (head - tail) * (k / steps);
          const fa = Math.sin((1 - u) * omega) / so,
            fb = Math.sin(u * omega) / so;
          const lift = 1.03 + Math.sin(u * Math.PI) * 0.12;
          project((ax * fa + bx * fb) * lift, (ay * fa + by * fb) * lift, (az * fa + bz * fb) * lift, tmp);
          if (k > 0) {
            const vis = tmp.z > -0.15 ? 1 : 0.25;
            ctx.strokeStyle = `rgba(${ACCENT},${((k / steps) * 0.8 * vis).toFixed(3)})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(tmp.x, tmp.y);
            ctx.stroke();
          }
          prevX = tmp.x;
          prevY = tmp.y;
        }
        if (sig.t <= 1) {
          ctx.fillStyle = `rgba(${ACCENT},0.95)`;
          ctx.beginPath();
          ctx.arc(prevX, prevY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // orbiting system nodes
      const orbitR = isMobile ? 1.32 : 1.5;
      ctx.font = `500 ${isMobile ? 9 : 10}px "Geist Mono Variable", ui-monospace, monospace`;
      ctx.textBaseline = "middle";
      const nodes = isMobile ? NODES.slice(0, 5) : NODES;
      for (let n = 0; n < nodes.length; n++) {
        const ang = (n / nodes.length) * Math.PI * 2 + t * (reduced ? 0 : 0.07);
        const ox = Math.cos(ang) * orbitR,
          oz = Math.sin(ang) * orbitR,
          oy = Math.sin(ang * 2 + n) * 0.28;
        project(ox, oy, oz, tmp);
        const nx = tmp.x,
          ny = tmp.y,
          nz = tmp.z;
        const front = (nz / orbitR + 1) * 0.5;
        // tether to the sphere surface
        const len = Math.hypot(ox, oy, oz);
        project(ox / len, oy / len, oz / len, tmp);
        const near = pointer.active && Math.hypot(nx - px, ny - py) < 80;
        const a = 0.08 + front * 0.35;
        ctx.strokeStyle = near ? `rgba(${ACCENT},0.8)` : `rgba(${FG},${(a * 0.6).toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(tmp.x, tmp.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const box = 5;
        ctx.strokeStyle = near ? `rgba(${ACCENT},1)` : `rgba(${FG},${(a + 0.15).toFixed(3)})`;
        ctx.strokeRect(nx - box / 2, ny - box / 2, box, box);
        if (near) {
          ctx.fillStyle = `rgba(${ACCENT},1)`;
          ctx.fillRect(nx - 1.5, ny - 1.5, 3, 3);
        }
        ctx.fillStyle = near ? `rgba(${ACCENT},1)` : `rgba(${FG},${(0.2 + front * 0.5).toFixed(3)})`;
        ctx.fillText(nodes[n], nx + 9, ny);
      }
    };

    // --- lifecycle -------------------------------------------------------
    build();
    let raf = 0;
    let running = false;
    let inView = true;

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (reduced) draw(performance.now());
    else start();

    const onMove = (e: PointerEvent) => {
      // map screen → canvas space, accounting for any scale transform
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.x = ((e.clientX - r.left) / r.width) * w;
      pointer.y = ((e.clientY - r.top) / r.height) * h;
      pointer.nx = (pointer.x / w - 0.5) * 2;
      pointer.ny = (pointer.y / h - 0.5) * 2;
      pointer.active = pointer.y >= 0 && pointer.y <= h;
      if (reduced) draw(performance.now());
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.nx = pointer.ny = 0;
    };
    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden || !inView ? stop() : start());

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full", className)} />;
}
