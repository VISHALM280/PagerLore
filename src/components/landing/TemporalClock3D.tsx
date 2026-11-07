"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Database, Clock, ShieldCheck, ArrowRight, Activity, RotateCcw } from "lucide-react";

interface IncidentMarker {
  id: string;
  code: string;
  title: string;
  timeAgo: string;
  category: "active" | "historical" | "rule";
  color: number;
  position: [number, number, number];
  relevance?: string;
  details: string;
}

export function TemporalClock3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<IncidentMarker | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);
  const [clockSpeed, setClockSpeed] = useState<number>(-1); // negative = time reversing

  const markers: IncidentMarker[] = [
    {
      id: "m-active",
      code: "INC-2024-142",
      title: "Active SEV-1 Outage",
      timeAgo: "Present (T-0m)",
      category: "active",
      color: 0xc94f4f, // Crimson
      position: [-2.4, 1.2, 0.4],
      details: "Payments service 500 spike & 98.6% pool saturation immediately following v2.8.1.",
    },
    {
      id: "m-commit",
      code: "commit:a4f91e8",
      title: "Breaking Config Diff",
      timeAgo: "T-14m ago",
      category: "historical",
      color: 0xb8a17a, // Muted gold
      position: [-1.4, 2.1, -0.3],
      details: "diff: hikari.max-lifetime bumped from 540000ms to 1800000ms (30m).",
    },
    {
      id: "m-recall",
      code: "INC-2024-089",
      title: "Hindsight Recalled Outage",
      timeAgo: "T-5mo ago",
      category: "historical",
      color: 0x267b5b, // Emerald
      position: [2.3, 0.8, 0.5],
      relevance: "96% Confidence Match",
      details: "Resolved pool starvation caused by pgBouncer 10-minute TCP idle severance.",
    },
    {
      id: "m-rule",
      code: "RULE: HIKARI <= 540s",
      title: "Verified SRE Constraint",
      timeAgo: "Permanent Memory",
      category: "rule",
      color: 0x267b5b, // Emerald
      position: [1.8, -1.8, 0.3],
      details: "Client maxLifetime must strictly precede proxy server_idle_timeout.",
    },
    {
      id: "m-redis",
      code: "INC-2024-118",
      title: "Session Cache Stampede",
      timeAgo: "T-2mo ago",
      category: "historical",
      color: 0xb8a17a, // Muted gold
      position: [-1.9, -1.6, -0.2],
      details: "Un-jittered 1h TTL caused concurrent 92k key eviction and replica failure.",
    },
  ];

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setIsWebGLSupported(false);
        return;
      }
    } catch {
      setIsWebGLSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 560;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1513, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0c1513, 0); // Transparent blend with midnight CSS background
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const emeraldKeyLight = new THREE.DirectionalLight(0x267b5b, 2.2);
    emeraldKeyLight.position.set(4, 5, 5);
    scene.add(emeraldKeyLight);

    const warmRimLight = new THREE.PointLight(0xb8a17a, 2.0, 15);
    warmRimLight.position.set(-4, -3, 3);
    scene.add(warmRimLight);

    const centerGlow = new THREE.PointLight(0x267b5b, 1.5, 6);
    centerGlow.position.set(0, 0, 0.5);
    scene.add(centerGlow);

    // Root Group for the Astronomical Clock
    const clockGroup = new THREE.Group();
    scene.add(clockGroup);

    // ─────────────────────────────────────────────────────────────────────────
    // 1. ASTRONOMICAL CONCENTRIC RINGS (Astrolabe Structure)
    // ─────────────────────────────────────────────────────────────────────────

    // Outer Zodiac / Temporal Ring (Radius 2.6)
    const outerRingGeom = new THREE.RingGeometry(2.55, 2.62, 96);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xb8a17a,
      roughness: 0.3,
      metalness: 0.8,
      side: THREE.DoubleSide,
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeom, goldMat);
    clockGroup.add(outerRingMesh);

    // 12 Temporal Tick Markers along outer ring
    const tickMat = new THREE.MeshBasicMaterial({ color: 0xb8a17a });
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const tickGeom = new THREE.BoxGeometry(0.04, 0.18, 0.02);
      const tick = new THREE.Mesh(tickGeom, tickMat);
      tick.position.set(Math.cos(angle) * 2.58, Math.sin(angle) * 2.58, 0.02);
      tick.rotation.z = angle + Math.PI / 2;
      clockGroup.add(tick);
    }

    // Secondary Astrolabe Track (Radius 2.1)
    const midRingGeom = new THREE.RingGeometry(2.05, 2.12, 80);
    const emeraldRingMat = new THREE.MeshStandardMaterial({
      color: 0x267b5b,
      roughness: 0.4,
      metalness: 0.6,
      side: THREE.DoubleSide,
    });
    const midRingMesh = new THREE.Mesh(midRingGeom, emeraldRingMat);
    clockGroup.add(midRingMesh);

    // 24 Minor Minute Notches
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const minorTickGeom = new THREE.BoxGeometry(0.02, 0.09, 0.02);
      const minorTick = new THREE.Mesh(minorTickGeom, emeraldRingMat);
      minorTick.position.set(Math.cos(angle) * 2.08, Math.sin(angle) * 2.08, 0.02);
      minorTick.rotation.z = angle + Math.PI / 2;
      clockGroup.add(minorTick);
    }

    // Inner Astrolabe Planetary Arcs (Interlocking Curves)
    const astrolabeGroup = new THREE.Group();
    clockGroup.add(astrolabeGroup);

    const arcMat = new THREE.LineBasicMaterial({
      color: 0xb8a17a,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < 3; i++) {
      const curve = new THREE.EllipseCurve(
        0,
        0,
        1.45 - i * 0.25,
        1.45 - i * 0.25,
        0,
        2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(64);
      const arcGeom = new THREE.BufferGeometry().setFromPoints(points);
      const arcLine = new THREE.Line(arcGeom, arcMat);
      arcLine.rotation.x = 0.3 * (i + 1);
      arcLine.rotation.y = 0.2 * (i + 1);
      astrolabeGroup.add(arcLine);
    }

    // Center Mechanical Pinion Gear (Radius 0.75)
    const gearGroup = new THREE.Group();
    clockGroup.add(gearGroup);

    const gearCoreGeom = new THREE.RingGeometry(0.3, 0.65, 32);
    const darkSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1f2e27,
      roughness: 0.4,
      metalness: 0.7,
      side: THREE.DoubleSide,
    });
    const gearCore = new THREE.Mesh(gearCoreGeom, darkSteelMat);
    gearGroup.add(gearCore);

    // 16 Gear Teeth
    const toothGeom = new THREE.BoxGeometry(0.06, 0.14, 0.03);
    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xb8a17a,
      roughness: 0.4,
      metalness: 0.8,
    });
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const tooth = new THREE.Mesh(toothGeom, toothMat);
      tooth.position.set(Math.cos(angle) * 0.68, Math.sin(angle) * 0.68, 0.01);
      tooth.rotation.z = angle + Math.PI / 2;
      gearGroup.add(tooth);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. REVERSING MECHANICAL CLOCK HANDS
    // ─────────────────────────────────────────────────────────────────────────
    const handsGroup = new THREE.Group();
    clockGroup.add(handsGroup);

    // Hour Hand (Short, Ornate Lance)
    const hourHandGroup = new THREE.Group();
    handsGroup.add(hourHandGroup);

    const hourShaftGeom = new THREE.BoxGeometry(0.05, 1.15, 0.04);
    const hourHandMesh = new THREE.Mesh(hourShaftGeom, goldMat);
    hourHandMesh.position.y = 0.55;
    hourHandGroup.add(hourHandMesh);

    // Hour Hand Diamond Tip
    const hourTipGeom = new THREE.ConeGeometry(0.1, 0.25, 4);
    const hourTip = new THREE.Mesh(hourTipGeom, goldMat);
    hourTip.position.y = 1.2;
    hourHandGroup.add(hourTip);

    // Minute Hand (Slender, Long Pierced Needle)
    const minuteHandGroup = new THREE.Group();
    handsGroup.add(minuteHandGroup);

    const minuteShaftGeom = new THREE.BoxGeometry(0.035, 1.75, 0.04);
    const emeraldHandMat = new THREE.MeshStandardMaterial({
      color: 0x267b5b,
      roughness: 0.2,
      metalness: 0.8,
    });
    const minuteHandMesh = new THREE.Mesh(minuteShaftGeom, emeraldHandMat);
    minuteHandMesh.position.y = 0.85;
    minuteHandGroup.add(minuteHandMesh);

    const minuteTipGeom = new THREE.ConeGeometry(0.07, 0.3, 4);
    const minuteTip = new THREE.Mesh(minuteTipGeom, emeraldHandMat);
    minuteTip.position.y = 1.85;
    minuteHandGroup.add(minuteTip);

    // Center Jewel Hub
    const hubGeom = new THREE.SphereGeometry(0.18, 32, 32);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x267b5b,
      roughness: 0.1,
      metalness: 0.9,
    });
    const hubMesh = new THREE.Mesh(hubGeom, hubMat);
    hubMesh.position.z = 0.1;
    handsGroup.add(hubMesh);

    // Active Pulse Ring on Hub
    const hubPulseGeom = new THREE.RingGeometry(0.22, 0.26, 32);
    const hubPulseMat = new THREE.MeshBasicMaterial({
      color: 0x267b5b,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });
    const hubPulse = new THREE.Mesh(hubPulseGeom, hubPulseMat);
    hubPulse.position.z = 0.08;
    handsGroup.add(hubPulse);

    // ─────────────────────────────────────────────────────────────────────────
    // 3. FLOATING HISTORICAL INCIDENT MARKERS
    // ─────────────────────────────────────────────────────────────────────────
    const markerMeshes: { mesh: THREE.Mesh; pulseRing?: THREE.Mesh; data: IncidentMarker }[] = [];

    markers.forEach((m) => {
      const isAct = m.category === "active";
      const geom = new THREE.SphereGeometry(isAct ? 0.18 : 0.14, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: m.color,
        roughness: 0.3,
        metalness: 0.4,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...m.position);
      mesh.userData = m;
      clockGroup.add(mesh);

      // Inner glowing core
      const coreGeom = new THREE.SphereGeometry(isAct ? 0.08 : 0.06, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const core = new THREE.Mesh(coreGeom, coreMat);
      mesh.add(core);

      // Pulse ring for active incident
      let pulseRing: THREE.Mesh | undefined;
      if (isAct) {
        const ringGeom = new THREE.RingGeometry(0.24, 0.28, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xc94f4f,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        pulseRing = new THREE.Mesh(ringGeom, ringMat);
        mesh.add(pulseRing);
      }

      markerMeshes.push({ mesh, pulseRing, data: m });
    });

    // Connecting Emerald Traces between active incident and historical recall
    const connectionPairs: [string, string][] = [
      ["m-active", "m-commit"],
      ["m-commit", "m-recall"],
      ["m-recall", "m-rule"],
      ["m-recall", "m-redis"],
    ];

    const connectionLines: THREE.Line[] = [];
    const signalPackets: { curve: THREE.LineCurve3; mesh: THREE.Mesh; t: number; speed: number }[] = [];

    connectionPairs.forEach(([fromId, toId]) => {
      const from = markers.find((m) => m.id === fromId);
      const to = markers.find((m) => m.id === toId);
      if (!from || !to) return;

      const p1 = new THREE.Vector3(...from.position);
      const p2 = new THREE.Vector3(...to.position);

      const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x267b5b,
        transparent: true,
        opacity: 0.5,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      clockGroup.add(line);
      connectionLines.push(line);

      // Traveling signal packet
      const curve = new THREE.LineCurve3(p1, p2);
      const packetGeom = new THREE.SphereGeometry(0.04, 16, 16);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x267b5b });
      const packetMesh = new THREE.Mesh(packetGeom, packetMat);
      clockGroup.add(packetMesh);

      signalPackets.push({
        curve,
        mesh: packetMesh,
        t: Math.random(),
        speed: 0.006 + Math.random() * 0.004,
      });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 4. CURVED SPIRAL PARTICLES (Temporal Inflow Streams)
    // ─────────────────────────────────────────────────────────────────────────
    const particleCount = 120;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleZ = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleRadii[i] = 0.8 + Math.random() * 2.8;
      particleZ[i] = (Math.random() - 0.5) * 1.5;

      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = Math.sin(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 2] = particleZ[i];
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x267b5b,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    clockGroup.add(particleSystem);

    // ─────────────────────────────────────────────────────────────────────────
    // 5. INTERACTIVE MOUSE PARALLAX & RAYCASTING
    // ─────────────────────────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      targetX = x * 0.35;
      targetY = y * 0.25;

      mouseVector.x = x;
      mouseVector.y = y;

      raycaster.setFromCamera(mouseVector, camera);
      const hits = raycaster.intersectObjects(
        markerMeshes.map((m) => m.mesh),
        false
      );

      if (hits.length > 0) {
        const hitData = hits[0].object.userData as IncidentMarker;
        setHoveredMarker(hitData);
        container.style.cursor = "pointer";

        const screenPos = hits[0].object.position.clone().project(camera);
        const screenX = ((screenPos.x + 1) * rect.width) / 2;
        const screenY = ((-screenPos.y + 1) * rect.height) / 2;
        setTooltipPos({ x: screenX, y: screenY });
      } else {
        setHoveredMarker(null);
        setTooltipPos(null);
        container.style.cursor = "default";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 640;
      const newH = container.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // ─────────────────────────────────────────────────────────────────────────
    // 6. ANIMATION LOOP (REVERSING CLOCKWORK)
    // ─────────────────────────────────────────────────────────────────────────
    let animationFrameId: number;
    let clockTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clockTime += 0.016;

      // Smooth camera parallax lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      camera.position.x = mouseX * 1.5;
      camera.position.y = mouseY * 1.2;
      camera.lookAt(0, 0, 0);

      // Subtle 3D clock tilt
      clockGroup.rotation.y = mouseX * 0.25;
      clockGroup.rotation.x = -mouseY * 0.2;

      // Reversing Clock Hands (Counter-clockwise rotation: clockSpeed < 0)
      minuteHandGroup.rotation.z += clockSpeed * 0.018; // Revolving backwards
      hourHandGroup.rotation.z += clockSpeed * 0.003;

      // Gears rotate in mechanical synchronization
      gearGroup.rotation.z -= clockSpeed * 0.025;
      midRingMesh.rotation.z += clockSpeed * 0.004;
      astrolabeGroup.rotation.z -= clockSpeed * 0.006;
      outerRingMesh.rotation.z -= clockSpeed * 0.001;

      // Pulse ring scaling
      const pulseScale = 1 + Math.sin(clockTime * 3) * 0.2;
      markerMeshes.forEach((item) => {
        if (item.pulseRing) {
          item.pulseRing.scale.set(pulseScale, pulseScale, 1);
        }
      });
      hubPulse.scale.set(1 + Math.sin(clockTime * 2.5) * 0.25, 1 + Math.sin(clockTime * 2.5) * 0.25, 1);

      // Animate signal packets traveling backwards and forwards
      signalPackets.forEach((p) => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const pt = p.curve.getPoint(p.t);
        p.mesh.position.copy(pt);
      });

      // Spiral particles drifting backwards towards center
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        // Increment angle in reverse
        particleAngles[i] += 0.008;
        // Radius contracts towards center then loops out
        particleRadii[i] -= 0.003;
        if (particleRadii[i] < 0.6) {
          particleRadii[i] = 3.2;
        }

        posAttr.setXYZ(
          i,
          Math.cos(particleAngles[i]) * particleRadii[i],
          Math.sin(particleAngles[i]) * particleRadii[i],
          particleZ[i] + Math.sin(clockTime + i) * 0.05
        );
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerRingGeom.dispose();
      midRingGeom.dispose();
      gearCoreGeom.dispose();
      hourShaftGeom.dispose();
      minuteShaftGeom.dispose();
      hubGeom.dispose();
      particleGeom.dispose();
    };
  }, [clockSpeed]);

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] select-none flex items-center justify-center">
      {/* Three.js Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Reversing Status Indicator Pill */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E1B17]/90 border border-[#267B5B]/40 text-[#267B5B] text-xs font-mono backdrop-blur-md">
        <RotateCcw className="w-3.5 h-3.5 animate-spin" style={{ animationDirection: "reverse", animationDuration: "6s" }} />
        <span>TEMPORAL REVERSAL ACTIVE</span>
      </div>

      {/* Floating Raycasted HUD Card */}
      {hoveredMarker && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="w-72 p-4 rounded-xl bg-[#0C1513]/95 border border-[#267B5B]/50 shadow-2xl backdrop-blur-md text-xs font-mono text-white space-y-2">
            <div className="flex items-center justify-between border-b border-[#267B5B]/30 pb-2">
              <span
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  hoveredMarker.category === "active"
                    ? "bg-[#C94F4F]/20 text-[#C94F4F] border border-[#C94F4F]/40"
                    : hoveredMarker.category === "rule"
                    ? "bg-[#267B5B]/20 text-[#267B5B] border border-[#267B5B]/40"
                    : "bg-[#B8A17A]/20 text-[#B8A17A] border border-[#B8A17A]/40"
                }`}
              >
                {hoveredMarker.code}
              </span>
              <span className="text-[10px] text-[#788579]">{hoveredMarker.timeAgo}</span>
            </div>

            <div className="font-sans font-bold text-sm text-[#F8F7F2]">
              {hoveredMarker.title}
            </div>

            <p className="text-[11px] text-[#A3B2A8] font-sans leading-relaxed">
              {hoveredMarker.details}
            </p>

            {hoveredMarker.relevance && (
              <div className="pt-2 border-t border-[#267B5B]/20 flex items-center justify-between text-[10px] text-[#267B5B]">
                <span>Grounding:</span>
                <span className="font-bold">{hoveredMarker.relevance}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WebGL Fallback if device does not support WebGL */}
      {!isWebGLSupported && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-xs font-mono text-[#788579] bg-[#0E1715]/95 rounded-2xl border border-[#E9E8DF]">
          <div>
            <Clock className="w-10 h-10 text-[#267B5B] mx-auto mb-2 animate-pulse" />
            <div className="text-white font-bold mb-1">Astronomical Temporal Clock</div>
            <div>Three.js WebGL rendering is not available on this device. Displaying telemetry matrix.</div>
          </div>
        </div>
      )}
    </div>
  );
}

