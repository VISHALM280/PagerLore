"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Database, Search, Sparkles, ExternalLink, ArrowRight, ShieldCheck, Tag } from "lucide-react";

interface VaultMemoryNode {
  id: string;
  service: string;
  title: string;
  rule: string;
  type: "experience" | "observation" | "world";
  position: [number, number, number];
  color: number;
}

export function Vault3DScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<VaultMemoryNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5.8);

  const vaultNodes: VaultMemoryNode[] = [
    {
      id: "mem-hindsight-8901-hikari",
      service: "payments-service",
      title: "HikariCP maxLifetime Constraint",
      rule: "HikariCP maxLifetime must be <= pgBouncer server_idle_timeout (600s). Current proven value: 540s.",
      type: "experience",
      position: [0, 0, 0], // Center anchor
      color: 0x21845f,
    },
    {
      id: "mem-hindsight-7104-redis",
      service: "auth-service",
      title: "Redis TTL Jitter 15%",
      rule: "Prevent cache thundering herds during hourly token expirations using Go singleflight deduplication.",
      type: "world",
      position: [-1.8, 1.2, 0.4],
      color: 0xb8a17a,
    },
    {
      id: "mem-hindsight-9921-kafka",
      service: "order-processor",
      title: "Kafka Max Poll Interval",
      rule: "Set max.poll.interval.ms to 600000ms when processing heavy PDF invoice render payloads.",
      type: "experience",
      position: [1.9, 1.1, -0.5],
      color: 0x21845f,
    },
    {
      id: "mem-hindsight-4402-ingress",
      service: "edge-router",
      title: "Envoy Buffer Threshold",
      rule: "HTTP/2 connection resets triggered when upstream client chunk sizes exceed 64KB.",
      type: "observation",
      position: [-1.6, -1.3, -0.6],
      color: 0x788579,
    },
    {
      id: "mem-hindsight-3199-replica",
      service: "postgres-replica",
      title: "WAL Receiver Heartbeat",
      rule: "Failover watchdog requires wal_sender_timeout=15s to avert split-brain leadership switches.",
      type: "world",
      position: [1.7, -1.4, 0.6],
      color: 0xb8a17a,
    },
    {
      id: "mem-hindsight-6012-circuit",
      service: "checkout-api",
      title: "Circuit Breaker Tripping",
      rule: "Trip circuit after 15 consecutive 503s with 5s exponential backoff probe window.",
      type: "observation",
      position: [0.2, 2.1, -0.2],
      color: 0x24352d,
    },
  ];

  const vaultEdges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [1, 3],
    [2, 4],
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8f7f2, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, zoomLevel);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xf8f7f2, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x21845f, 1.0);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Meshes array
    const meshes: { mesh: THREE.Mesh; node: VaultMemoryNode }[] = [];

    vaultNodes.forEach((node, index) => {
      const isCentral = index === 0;
      const geom = new THREE.SphereGeometry(isCentral ? 0.32 : 0.22, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        roughness: 0.3,
        metalness: 0.2,
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...node.position);
      mesh.userData = node;
      worldGroup.add(mesh);

      // Core white dot
      const coreGeom = new THREE.SphereGeometry(isCentral ? 0.12 : 0.08, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      mesh.add(new THREE.Mesh(coreGeom, coreMat));

      // Orbit ring around central node
      if (isCentral) {
        const ringGeom = new THREE.RingGeometry(0.48, 0.52, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x21845f,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }

      meshes.push({ mesh, node });
    });

    // Edges
    vaultEdges.forEach(([fromIdx, toIdx]) => {
      const n1 = vaultNodes[fromIdx];
      const n2 = vaultNodes[toIdx];
      const p1 = new THREE.Vector3(...n1.position);
      const p2 = new THREE.Vector3(...n2.position);

      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const mat = new THREE.LineBasicMaterial({
        color: fromIdx === 0 ? 0x21845f : 0xd0cbbd,
        transparent: true,
        opacity: fromIdx === 0 ? 0.65 : 0.35,
      });
      worldGroup.add(new THREE.Line(geom, mat));
    });

    // Drag Orbit interaction state
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0.003; // Gentle auto-rotate

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rotationVelocityY = deltaX * 0.005;
        rotationVelocityX = deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        meshes.map((m) => m.mesh),
        false
      );
      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setSelectedNode(hit.userData as VaultMemoryNode);
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("click", onClick);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Apply drag rotation with inertia decay
      worldGroup.rotation.y += rotationVelocityY;
      worldGroup.rotation.x += rotationVelocityX;

      if (!isDragging) {
        rotationVelocityY += (0.003 - rotationVelocityY) * 0.05;
        rotationVelocityX *= 0.92;
      }

      // Camera zoom interpolation
      camera.position.z += (zoomLevel - camera.position.z) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("click", onClick);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [zoomLevel]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl bg-[#F8F7F2] border border-[#E9E8DF] overflow-hidden flex flex-col justify-between">
      {/* 3D Orbit Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 font-mono text-xs">
        <div className="px-3 py-1.5 rounded-xl bg-white border border-[#E9E8DF] shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#21845F] animate-ping" />
          <span className="text-[#24352D] font-bold">Interactive 3D Vault</span>
        </div>
        <span className="text-[11px] text-[#788579] hidden sm:inline">Drag to Orbit · Click Node</span>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 font-mono text-xs">
        <button
          onClick={() => setZoomLevel((z) => Math.max(4.2, z - 0.8))}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E9E8DF] text-[#24352D] font-bold shadow-sm hover:bg-[#F1F0E9]"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.min(8.0, z + 0.8))}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#E9E8DF] text-[#24352D] font-bold shadow-sm hover:bg-[#F1F0E9]"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Selected Node HUD Card */}
      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 z-20 p-4 rounded-xl bg-white/95 border border-[#E9E8DF] shadow-[0_12px_32px_-4px_rgba(36,53,45,0.12)] backdrop-blur-md font-mono text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#21845F]" />
              <span className="font-bold text-[#24352D]">{selectedNode.title}</span>
              <span className="text-[10px] text-[#788579]">({selectedNode.service})</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#EAF2EC] text-[#21845F] border border-[#21845F]/20">
              {selectedNode.type}
            </span>
          </div>
          <p className="text-xs text-[#24352D] font-sans">{selectedNode.rule}</p>
        </div>
      )}
    </div>
  );
}

