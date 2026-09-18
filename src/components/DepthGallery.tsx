"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const images = [
  "https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1200&q=80",
];

export function DepthGallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      canvas.dataset.unavailable = "true";
      return;
    }
    canvas.dataset.ready = "true";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.z = 7;
    const group = new THREE.Group();
    scene.add(group);
    const meshes: THREE.Mesh[] = [];

    images.forEach((source, index) => {
      const texture = new THREE.TextureLoader().load(source);
      texture.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.15, 2.8), new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.72 }));
      mesh.position.set((index - 1) * 2.25, index === 1 ? 0.25 : -0.2, index * -0.8);
      mesh.userData.baseY = mesh.position.y;
      mesh.rotation.z = (index - 1) * -0.06;
      group.add(mesh);
      meshes.push(mesh);
    });

    const pointer = { x: 0, y: 0 };
    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const move = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", move, { passive: true });
    resize();
    let frame = 0;
    const render = () => {
      group.rotation.y += ((pointer.x * 0.12) - group.rotation.y) * 0.04;
      group.rotation.x += ((pointer.y * -0.05) - group.rotation.x) * 0.04;
      if (!reducedMotion) meshes.forEach((mesh, index) => { mesh.position.y = mesh.userData.baseY + Math.sin(Date.now() * 0.0004 + index) * 0.015; });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      meshes.forEach((mesh) => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
      renderer.dispose();
    };
  }, []);

  return <div className="depth-gallery" aria-label="Selected work gallery"><canvas ref={canvasRef} className="depth-gallery-canvas" aria-hidden="true" /><div className="depth-gallery-caption"><span>01—03</span><span>SELECTED SIGNALS / 2026</span></div><div className="depth-gallery-fallback" aria-hidden="true">WEBGL / IMAGE PLANES / ACTIVE</div></div>;
}