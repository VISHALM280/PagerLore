"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Database, ShieldCheck, Activity, ArrowRight, X } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  category: "active" | "verified" | "historical" | "infra";
  service: string;
  metric: string;
  description: string;
  position: [number, number, number];
  color: number;
  size: number;
}

export function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  const nodesData: NodeData[] = [
    {
      id: "n-active",
      label: "INC-2024-142",
      sublabel: "Checkout 500 Spike",
      category: "active",
      service: "payments-service",
      metric: "98.6% Pool Saturation",
      description: "Active SEV-1 incident immediately correlated with deployment v2.8.1.",
      position: [-2.1, 0.4, 0.4],
      color: 0xc94f4f, // Crimson
      size: 0.22,
    },
    {
      id: "n-gateway",
      label: "payments-service",
      sublabel: "Core Service",
      category: "infra",
      service: "ingress-pod",
      metric: "342 rps checkout",
      description: "Primary payment processing cluster experiencing thread starvation.",
      position: [-0.7, 1.3, -0.3],
      color: 0x24352d, // Dark forest
      size: 0.18,
    },
    {
      id: "n-recall",
      label: "INC-2024-089",
      sublabel: "Hindsight Recall",
      category: "verified",
      service: "payments-service",
      metric: "96% Confidence Match",
      description: "Resolved 5 months ago. Root cause: HikariCP maxLifetime vs pgBouncer idle timeout mismatch.",
      position: [0.7, 0.8, 0.7],
      color: 0x21845f, // Emerald
      size: 0.26,
    },
    {
      id: "n-rule",
      label: "HikariCP <= 540s",
      sublabel: "Verified Rule",
      category: "verified",
      service: "db-proxy",
      metric: "Remediation Constraint",
      description: "Connection maxLifetime must strictly precede proxy idle timeout (600s).",
      position: [2.1, 1.3, -0.4],
      color: 0x21845f, // Emerald
      size: 0.2,
    },
    {
      id: "n-proxy",
      label: "pgBouncer:10m",
      sublabel: "Proxy Layer",
      category: "infra",
      service: "postgres-proxy",
      metric: "server_idle_timeout=600s",
      description: "Connection pooler silently dropping TCP sockets after 10m of inactivity.",
      position: [2.3, -0.3, 0.3],
      color: 0xb8a17a, // Muted gold
      size: 0.17,
    },
    {
      id: "n-auth",
      label: "auth-service",
      sublabel: "Session Cluster",
      category: "infra",
      service: "auth-replica",
      metric: "185 rps token auth",
      description: "User authentication gateway connected to Redis token store.",
      position: [-1.4, -1.2, 0.5],
      color: 0x788579, // Slate
      size: 0.16,
    },
    {
      id: "n-redis",
      label: "INC-2024-118",
      sublabel: "Historical Memory",
      category: "historical",
      service: "redis-cache",
      metric: "Thundering Herd Resolved",
      description: "Past incident where top-of-hour token expiration saturated replica databases.",
      position: [0.1, -1.5, -0.4],
      color: 0xb8a17a, // Muted gold
      size: 0.19,
    },
    {
      id: "n-jitter",
      label: "TTL Jitter 15%",
      sublabel: "Architectural Rule",
      category: "verified",
      service: "cache-layer",
      metric: "Go Singleflight Applied",
      description: "Prevents concurrent cache stampedes on duplicate session token fetches.",
      position: [1.7, -1.7, 0.4],
      color: 0x21845f, // Emerald
      size: 0.19,
    },
  ];

  const edgePairs = [
    ["n-active", "n-gateway"],
    ["n-gateway", "n-recall"],
    ["n-recall", "n-rule"],
    ["n-rule", "n-proxy"],
    ["n-active", "n-auth"],
    ["n-auth", "n-redis"],
    ["n-redis", "n-jitter"],
    ["n-recall", "n-redis"],
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

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 460;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8f7f2, 0.035);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8f7f2, 0); // Transparent to blend with background
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x21845f, 1.0);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    const warmLight = new THREE.PointLight(0xb8a17a, 1.2, 10);
    warmLight.position.set(-3, -2, 2);
    scene.add(warmLight);

    // Group for all network components
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Create 3D Nodes
    const nodeMeshes: { mesh: THREE.Mesh; pulseRing?: THREE.Line; data: NodeData; originalScale: number }[] = [];

    nodesData.forEach((node) => {
      const geometry = new THREE.SphereGeometry(node.size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.35,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...node.position);
      mesh.userData = node;
      networkGroup.add(mesh);

      // Inner core sphere for active and verified nodes
      const coreGeom = new THREE.SphereGeometry(node.size * 0.45, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      mesh.add(coreMesh);

      // Pulse ring for active incident node
      let pulseRing: THREE.Line | undefined;
      if (node.category === "active") {
        const ringGeom = new THREE.BufferGeometry();
        const segments = 48;
        const ringPoints: THREE.Vector3[] = [];
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          ringPoints.push(new THREE.Vector3(Math.cos(theta) * 0.4, Math.sin(theta) * 0.4, 0));
        }
        ringGeom.setFromPoints(ringPoints);
        const ringMat = new THREE.LineBasicMaterial({ color: 0xc94f4f, transparent: true, opacity: 0.8 });
        pulseRing = new THREE.Line(ringGeom, ringMat);
        mesh.add(pulseRing);
      }

      nodeMeshes.push({ mesh, pulseRing, data: node, originalScale: 1 });
    });

    // Create Connection Lines and Curve Paths for flowing signal particles
    const connectionLines: THREE.Line[] = [];
    const curves: { curve: THREE.LineCurve3; packetMesh: THREE.Mesh; t: number; speed: number }[] = [];

    edgePairs.forEach(([fromId, toId]) => {
      const fromNode = nodesData.find((n) => n.id === fromId);
      const toNode = nodesData.find((n) => n.id === toId);
      if (!fromNode || !toNode) return;

      const p1 = new THREE.Vector3(...fromNode.position);
      const p2 = new THREE.Vector3(...toNode.position);

      const isKeyAttribution =
        (fromId === "n-active" && toId === "n-gateway") ||
        (fromId === "n-gateway" && toId === "n-recall") ||
        (fromId === "n-recall" && toId === "n-rule");

      const lineGeom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: isKeyAttribution ? 0x21845f : 0xd8d4c8,
        transparent: true,
        opacity: isKeyAttribution ? 0.75 : 0.4,
        linewidth: isKeyAttribution ? 2 : 1,
      });

      const line = new THREE.Line(lineGeom, lineMat);
      networkGroup.add(line);
      connectionLines.push(line);

      // Signal Packet flowing on this connection
      const curve = new THREE.LineCurve3(p1, p2);
      const packetGeom = new THREE.SphereGeometry(isKeyAttribution ? 0.045 : 0.03, 16, 16);
      const packetMat = new THREE.MeshBasicMaterial({
        color: isKeyAttribution ? 0x21845f : 0xb8a17a,
      });
      const packetMesh = new THREE.Mesh(packetGeom, packetMat);
      networkGroup.add(packetMesh);

      curves.push({
        curve,
        packetMesh,
        t: Math.random(), // Stagger packet initial positions
        speed: 0.006 + Math.random() * 0.004,
      });
    });

    // Ambient Floating Particles (Environmental depth)
    const particleCount = 75;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x21845f,
      size: 0.035,
      transparent: true,
      opacity: 0.35,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    networkGroup.add(particleSystem);

    // Mouse Interaction / Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      targetX = x * 0.35;
      targetY = y * 0.25;

      mouseVector.x = x;
      mouseVector.y = y;

      // Raycast to find hovered node
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(
        nodeMeshes.map((n) => n.mesh),
        false
      );

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const hitData = hit.userData as NodeData;
        setHoveredNode(hitData);
        container.style.cursor = "pointer";

        // Calculate 2D screen coordinates for HUD tooltip
        const screenPos = hit.position.clone().project(camera);
        const screenX = ((screenPos.x + 1) * rect.width) / 2;
        const screenY = ((-screenPos.y + 1) * rect.height) / 2;
        setTooltipPos({ x: screenX, y: screenY });
      } else {
        setHoveredNode(null);
        container.style.cursor = "default";
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(
        nodeMeshes.map((n) => n.mesh),
        false
      );
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setSelectedNode(hit.userData as NodeData);
      } else {
        setSelectedNode(null);
      }
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
      setHoveredNode(null);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      networkGroup.rotation.y = mouseX * 0.45;
      networkGroup.rotation.x = -mouseY * 0.35;

      // Gentle continuous ambient drift
      networkGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.06;

      // Animate flowing signal packets along curves
      curves.forEach((c) => {
        c.t += c.speed;
        if (c.t > 1) c.t = 0;
        const pos = c.curve.getPoint(c.t);
        c.packetMesh.position.copy(pos);
      });

      // Animate active incident pulse ring
      nodeMeshes.forEach((n) => {
        if (n.pulseRing) {
          const scale = 1 + ((Math.sin(elapsedTime * 3) + 1) / 2) * 0.6;
          n.pulseRing.scale.set(scale, scale, 1);
          (n.pulseRing.material as THREE.LineBasicMaterial).opacity = 0.9 - scale * 0.4;
        }

        // Hover scale animation
        const isHovered = hoveredNode?.id === n.data.id || selectedNode?.id === n.data.id;
        const targetScale = isHovered ? 1.35 : 1.0;
        n.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
      });

      // Slowly rotate particle field
      particleSystem.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseleave", handleMouseLeave);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      renderer.dispose();
      ambientLight.dispose();
      dirLight.dispose();
      warmLight.dispose();
      scene.clear();
    };
  }, [hoveredNode?.id, selectedNode?.id]);

  if (!isWebGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 text-center font-mono text-xs text-[#788579] bg-white rounded-2xl border border-[#E9E8DF]">
        3D WebGL acceleration not available. Running fallback graph view.
      </div>
    );
  }

  const activeDisplayNode = selectedNode || hoveredNode;

  return (
    <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl bg-white border border-[#E9E8DF] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col justify-between">
      {/* Visualizer Header HUD */}
      <div className="relative z-20 flex items-center justify-between border-b border-[#E9E8DF] px-6 py-3.5 bg-white/90 backdrop-blur-sm text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#21845F] animate-pulse" />
          <span className="text-[#24352D] font-bold">3D Persistent Memory Mesh</span>
        </div>
        <div className="flex items-center gap-3 text-[#788579] text-[11px]">
          <span className="hidden sm:inline">Orbit Active · Move cursor to tilt</span>
          <span className="px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[#21845F] font-bold border border-[#21845F]/20">
            8 Nodes
          </span>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="relative w-full flex-1 touch-none cursor-default" />

      {/* Floating Raycast Node HUD Tooltip */}
      {activeDisplayNode && tooltipPos && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-75 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${Math.max(120, Math.min(tooltipPos.x, 420))}px`,
            top: `${Math.max(80, tooltipPos.y - 12)}px`,
          }}
        >
          <div className="p-3.5 rounded-xl bg-white/95 border border-[#E9E8DF] shadow-[0_12px_32px_-4px_rgba(36,53,45,0.14)] backdrop-blur-md text-xs font-mono w-64 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#24352D]">{activeDisplayNode.label}</span>
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  activeDisplayNode.category === "active"
                    ? "bg-[#FAF0F0] text-[#C94F4F] border border-[#E8BABA]"
                    : activeDisplayNode.category === "verified"
                    ? "bg-[#EAF2EC] text-[#21845F] border border-[#21845F]/30"
                    : "bg-[#FDF8F0] text-[#B8A17A] border border-[#B8A17A]/30"
                }`}
              >
                {activeDisplayNode.category}
              </span>
            </div>
            <div className="text-[11px] text-[#21845F] font-semibold">{activeDisplayNode.metric}</div>
            <p className="text-[11px] text-[#788579] font-sans leading-relaxed">
              {activeDisplayNode.description}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Status / Legend Bar */}
      <div className="relative z-20 border-t border-[#E9E8DF] px-6 py-3 bg-white/90 backdrop-blur-sm flex items-center justify-between text-[11px] font-mono text-[#788579]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C94F4F]" />
            <span>Active Incident</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#21845F]" />
            <span>Recalled Fix</span>
          </span>
          <span className="flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-[#B8A17A]" />
            <span>Proxy Anchor</span>
          </span>
        </div>

        <span className="text-[#21845F] font-semibold">Live Signals</span>
      </div>
    </div>
  );
}

