import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Wind, 
  Layers, 
  Sun, 
  Moon, 
  Sparkles, 
  Eye, 
  Camera, 
  RefreshCw,
  Ruler,
  Volume2,
  VolumeX,
  Sliders,
  Check,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';

interface Product3DViewerProps {
  product: Product;
  selectedColorHex?: string;
  isFullScreenModal?: boolean;
  onCloseModal?: () => void;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  product,
  selectedColorHex,
  isFullScreenModal = false,
  onCloseModal
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [explodedView, setExplodedView] = useState<number>(0); // 0 (assembled) to 1 (exploded)
  const [studioTheme, setStudioTheme] = useState<'studio' | 'neon' | 'warm'>('studio');
  const [isVaping, setIsVaping] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [wattage, setWattage] = useState<number>(25);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  
  // Parts references for updates
  const partsRef = useRef<{
    bodyMat?: THREE.MeshStandardMaterial;
    cartridgeMat?: THREE.MeshPhysicalMaterial;
    liquidMat?: THREE.MeshPhysicalMaterial;
    ledRingMat?: THREE.MeshBasicMaterial;
    dripTipMesh?: THREE.Mesh;
    cartridgeGroup?: THREE.Group;
    coilGroup?: THREE.Group;
    baseMesh?: THREE.Mesh;
    frontPanelMesh?: THREE.Mesh;
    screenTexture?: THREE.CanvasTexture;
  }>({});

  const vaporParticlesRef = useRef<{
    points: THREE.Points;
    velocities: THREE.Vector3[];
    lifespans: number[];
    scales: number[];
  } | null>(null);

  // Interaction tracking (orbit drag & zoom)
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.005 });
  const zoomLevelRef = useRef(4.3);

  // Audio Context for authentic vape airflow hiss and crackle
  const playVapeSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Airflow white noise hiss
      const bufferSize = Math.floor(ctx.sampleRate * 1.6);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // pinkish noise
        data[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 1.6);

      // Subtle coil sizzle oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      oscGain.gain.setValueAtTime(0.001, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  // Helper: Create High-Res procedural studio environment map for realistic metal/glass reflections
  const createStudioEnvironmentMap = (renderer: THREE.WebGLRenderer) => {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x181e2b);

    // Overhead softbox light panel
    const topLightGeo = new THREE.PlaneGeometry(8, 8);
    const topLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const topLight = new THREE.Mesh(topLightGeo, topLightMat);
    topLight.position.set(0, 7, 0);
    topLight.rotation.x = Math.PI / 2;
    envScene.add(topLight);

    // Warm key strip light
    const keyStripGeo = new THREE.PlaneGeometry(2, 10);
    const keyStripMat = new THREE.MeshBasicMaterial({ color: 0xffedd5, side: THREE.DoubleSide });
    const keyStrip = new THREE.Mesh(keyStripGeo, keyStripMat);
    keyStrip.position.set(5, 2, 4);
    keyStrip.lookAt(0, 0, 0);
    envScene.add(keyStrip);

    // Cool rim strip light
    const rimStripGeo = new THREE.PlaneGeometry(2, 10);
    const rimStripMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, side: THREE.DoubleSide });
    const rimStrip = new THREE.Mesh(rimStripGeo, rimStripMat);
    rimStrip.position.set(-5, 1, -4);
    rimStrip.lookAt(0, 0, 0);
    envScene.add(rimStrip);

    // Amber accent spotlight
    const amberGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const amberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const amberMesh = new THREE.Mesh(amberGeo, amberMat);
    amberMesh.position.set(0, -3, -5);
    envScene.add(amberMesh);

    const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
    pmremGenerator.dispose();
    topLightGeo.dispose();
    topLightMat.dispose();
    keyStripGeo.dispose();
    keyStripMat.dispose();
    rimStripGeo.dispose();
    rimStripMat.dispose();
    amberGeo.dispose();
    amberMat.dispose();

    return envMap;
  };

  // Helper: Brushed Aluminum Texture
  const createBrushedMetalTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);

    // Horizontal brush micro-grooves
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 2400; i++) {
      const y = Math.random() * 512;
      const height = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.09;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, y, 512, height);
    }
    for (let i = 0; i < 2400; i++) {
      const y = Math.random() * 512;
      const height = Math.random() * 2 + 1;
      const alpha = Math.random() * 0.09;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, y, 512, height);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    return tex;
  };

  // Helper: Carbon Fiber Texture for decorative inlays
  const createCarbonFiberTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#11151e';
    ctx.fillRect(0, 0, 64, 64);

    ctx.fillStyle = '#1a2233';
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    ctx.fillStyle = '#263147';
    ctx.fillRect(4, 4, 24, 24);
    ctx.fillRect(36, 36, 24, 24);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 20);
    return tex;
  };

  // Helper: Create rounded rectangular prism geometry with smooth chamfered edges
  const createRoundedChassisGeometry = (width: number, height: number, depth: number, radius: number) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: depth - r * 2,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: r,
      bevelThickness: r
    };

    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();
    return geo;
  };

  // Helper: Ultra-realistic OLED Screen Texture
  const createOLEDDisplayTexture = (watts: number = 25) => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 768;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep True Black
    ctx.fillStyle = '#030509';
    ctx.fillRect(0, 0, 384, 768);

    // Micro grid lines for OLED sub-pixel look
    ctx.strokeStyle = '#0a101d';
    ctx.lineWidth = 1;
    for (let y = 0; y < 768; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(384, y);
      ctx.stroke();
    }

    // Top status bar
    // Battery icon
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(36, 44, 60, 26);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(96, 52, 5, 10);
    // Green power level
    ctx.fillStyle = '#10b981';
    ctx.fillRect(40, 48, 44, 18);

    // Battery %
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'right';
    ctx.fillText('96%', 340, 66);

    // Wattage Circle Gauge Arc
    const centerX = 192;
    const centerY = 260;
    const radius = 110;

    // Background track
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Active progress arc
    const ratio = Math.min(watts / 40, 1);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, (0.75 + ratio * 1.5) * Math.PI);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Large Digits
    ctx.textAlign = 'center';
    ctx.font = '900 118px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${watts}`, centerX, 296);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('WATTS', centerX, 342);

    // Resistance & Voltage Box
    ctx.fillStyle = '#0b1120';
    ctx.beginPath();
    ctx.roundRect(36, 410, 312, 100, 16);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.fillText('RES: 0.60 Ω', 60, 452);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('VOLT: 3.82 V', 60, 492);

    // Mode: SMART A-LOCK
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('SMART', 320, 452);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('NORM', 320, 492);

    // Puff Counter & Time
    ctx.fillStyle = '#0b1120';
    ctx.beginPath();
    ctx.roundRect(36, 530, 312, 100, 16);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL PUFFS', 60, 566);

    ctx.font = '900 32px monospace';
    ctx.fillStyle = '#c084fc';
    ctx.fillText('02,845', 60, 608);

    ctx.font = '16px monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';
    ctx.fillText('LAST: 1.4s', 320, 604);

    // Brand Logo at Bottom
    ctx.font = '900 24px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'center';
    ctx.fillText(product.brand.toUpperCase(), centerX, 700);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Main Scene Setup
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.35, zoomLevelRef.current);
    cameraRef.current = camera;

    // 3. Renderer with High-End Color Tone Mapping & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Environment Reflections (IBL)
    const envMap = createStudioEnvironmentMap(renderer);
    scene.environment = envMap;

    // 5. Studio Multi-Point Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Main soft shadow caster)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 9, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    // Warm Rim / Hair Light for edge definition
    const rimLight = new THREE.PointLight(0xf59e0b, 2.0, 16);
    rimLight.position.set(0, -2, -5);
    scene.add(rimLight);

    // Front specular bounce light
    const frontBounce = new THREE.DirectionalLight(0xffffff, 0.9);
    frontBounce.position.set(0, -3, 6);
    scene.add(frontBounce);

    // 6. Construct Photorealistic 3D Model Group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Initial Color
    const deviceColor = new THREE.Color(
      selectedColorHex || (product.colors && product.colors[0] ? product.colors[0].hex : '#1e293b')
    );

    const brushedTex = createBrushedMetalTexture();
    const carbonTex = createCarbonFiberTexture();

    // A. Main Anodized Alloy Chassis (Rounded with subtle bevels)
    const bodyGeo = createRoundedChassisGeometry(1.22, 2.65, 0.58, 0.14);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: deviceColor,
      metalness: 0.88,
      roughness: 0.22,
      roughnessMap: brushedTex,
      envMapIntensity: 1.4
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.set(0, -0.4, 0);
    modelGroup.add(bodyMesh);

    // B. Polished Chrome Side Edge Trim Bands
    const trimGeo = createRoundedChassisGeometry(1.24, 2.68, 0.12, 0.14);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 2.0
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.set(0, -0.4, 0);
    modelGroup.add(trimMesh);

    // C. Carbon Fiber Front Inlay Decorative Plate
    const frontPlateGeo = new THREE.BoxGeometry(0.88, 2.38, 0.03);
    const frontPlateMat = new THREE.MeshStandardMaterial({
      color: 0x182030,
      metalness: 0.45,
      roughness: 0.35,
      map: carbonTex
    });
    const frontPlate = new THREE.Mesh(frontPlateGeo, frontPlateMat);
    frontPlate.position.set(0, -0.4, 0.29);
    modelGroup.add(frontPlate);

    // D. OLED Display Screen with 2.5D Curved Glass Shield
    const screenGeo = new THREE.PlaneGeometry(0.68, 1.34);
    const screenTexture = createOLEDDisplayTexture(wattage);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, -0.32, 0.31);
    modelGroup.add(screenMesh);

    // Screen Protective Glass with Reflections
    const glassCoverGeo = new THREE.BoxGeometry(0.72, 1.38, 0.015);
    const glassCoverMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.05,
      transmission: 0.92,
      ior: 1.52,
      reflectivity: 0.9
    });
    const glassCover = new THREE.Mesh(glassCoverGeo, glassCoverMat);
    glassCover.position.set(0, -0.32, 0.32);
    modelGroup.add(glassCover);

    // E. Tactile Metallic Fire Button with Diamond Knurl Pattern
    const fireBtnGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 36);
    fireBtnGeo.rotateX(Math.PI / 2);
    const fireBtnMat = new THREE.MeshStandardMaterial({
      color: 0x1e2430,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 1.8
    });
    const fireBtnMesh = new THREE.Mesh(fireBtnGeo, fireBtnMat);
    fireBtnMesh.position.set(0, 0.58, 0.30);
    modelGroup.add(fireBtnMesh);

    // Glowing LED Ring Halo around Fire Button
    const ledRingGeo = new THREE.RingGeometry(0.19, 0.23, 36);
    const ledRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide
    });
    const ledRingMesh = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRingMesh.position.set(0, 0.58, 0.325);
    modelGroup.add(ledRingMesh);

    // Regulatory Adjustment Plus/Minus Rocker Button
    const rockerGeo = new THREE.BoxGeometry(0.24, 0.08, 0.04);
    const rockerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
    const rockerMesh = new THREE.Mesh(rockerGeo, rockerMat);
    rockerMesh.position.set(0, -1.18, 0.31);
    modelGroup.add(rockerMesh);

    // F. Precision Airflow Adjustment Lever (Side of device)
    const airflowTrackGeo = new THREE.BoxGeometry(0.03, 0.44, 0.14);
    const airflowTrackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const airflowTrack = new THREE.Mesh(airflowTrackGeo, airflowTrackMat);
    airflowTrack.position.set(-0.62, -0.15, 0);
    modelGroup.add(airflowTrack);

    const airflowPinGeo = new THREE.BoxGeometry(0.08, 0.14, 0.11);
    const airflowPinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.15 });
    const airflowPin = new THREE.Mesh(airflowPinGeo, airflowPinMat);
    airflowPin.position.set(-0.64, -0.1, 0);
    modelGroup.add(airflowPin);

    // G. CARTRIDGE POD ASSEMBLY (Separable Group)
    const cartridgeGroup = new THREE.Group();
    cartridgeGroup.position.set(0, 1.34, 0);
    modelGroup.add(cartridgeGroup);

    // Translucent Smoked PCTG Tank
    const cartGeo = createRoundedChassisGeometry(1.18, 1.25, 0.54, 0.1);
    const cartMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.72,
      roughness: 0.08,
      transmission: 0.86,
      ior: 1.49,
      thickness: 1.2,
      specularIntensity: 1.2,
      envMapIntensity: 1.6
    });
    const cartMesh = new THREE.Mesh(cartGeo, cartMat);
    cartMesh.castShadow = true;
    cartridgeGroup.add(cartMesh);

    // Golden E-Liquid Core Reservoir inside pod
    const liquidGeo = createRoundedChassisGeometry(0.98, 0.82, 0.42, 0.08);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.82,
      roughness: 0.02,
      transmission: 0.92,
      ior: 1.33,
      thickness: 0.8,
      specularIntensity: 1.0
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.set(0, -0.12, 0);
    cartridgeGroup.add(liquidMesh);

    // COIL CORE ASSEMBLY (Inside pod, separable)
    const coilGroup = new THREE.Group();
    coilGroup.position.set(0, 0, 0);
    cartridgeGroup.add(coilGroup);

    // Gold Plated Stainless Steel Mesh Coil Core
    const coilGeo = new THREE.CylinderGeometry(0.21, 0.21, 1.05, 32);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.18,
      envMapIntensity: 2.0
    });
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coilGroup.add(coilMesh);

    // Cotton wick holes
    for (let i = 0; i < 4; i++) {
      const holeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.44, 16);
      const holeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
      const hole = new THREE.Mesh(holeGeo, holeMat);
      hole.rotation.y = (i * Math.PI) / 2;
      hole.position.y = -0.1;
      coilGroup.add(hole);
    }

    // H. Ergonomic Comfort Drip Tip Mouthpiece
    const dripTipShape = new THREE.CylinderGeometry(0.24, 0.38, 0.68, 36);
    const dripTipMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      metalness: 0.15,
      roughness: 0.12,
      envMapIntensity: 1.5
    });
    const dripTipMesh = new THREE.Mesh(dripTipShape, dripTipMat);
    dripTipMesh.position.set(0, 0.88, 0);
    cartridgeGroup.add(dripTipMesh);

    // Inner Chimney Vapor Hole
    const holeGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4, 20);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const holeMesh = new THREE.Mesh(holeGeo, holeMat);
    holeMesh.position.set(0, 1.15, 0);
    cartridgeGroup.add(holeMesh);

    // I. Base Pedestal with Type-C 2A Fast Charge Port & Rubber Feet
    const baseGeo = createRoundedChassisGeometry(1.22, 0.22, 0.58, 0.12);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.6,
      roughness: 0.5
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -1.78, 0);
    modelGroup.add(baseMesh);

    // Metallic Type-C Ring
    const typeCRingGeo = new THREE.BoxGeometry(0.38, 0.1, 0.04);
    const typeCRingMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.1 });
    const typeCRing = new THREE.Mesh(typeCRingGeo, typeCRingMat);
    typeCRing.position.set(0, -1.82, 0.15);
    modelGroup.add(typeCRing);

    // Save part references
    partsRef.current = {
      bodyMat,
      cartridgeMat: cartMat,
      liquidMat,
      ledRingMat,
      dripTipMesh,
      cartridgeGroup,
      coilGroup,
      baseMesh,
      frontPanelMesh: frontPlate,
      screenTexture
    };

    // 7. Volumetric Cloud Vapor Particle System
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: THREE.Vector3[] = [];
    const particleLifespans: number[] = [];
    const particleScales: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = 0;
      particlePositions[i * 3 + 1] = 2.55;
      particlePositions[i * 3 + 2] = 0;

      particleVelocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        0.04 + Math.random() * 0.05,
        (Math.random() - 0.5) * 0.02
      ));
      particleLifespans.push(0);
      particleScales.push(0.3 + Math.random() * 0.4);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // High quality soft cloud radial alpha texture
    const vCanvas = document.createElement('canvas');
    vCanvas.width = 128;
    vCanvas.height = 128;
    const vCtx = vCanvas.getContext('2d');
    if (vCtx) {
      const grad = vCtx.createRadialGradient(64, 64, 4, 64, 64, 60);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(0.3, 'rgba(241, 245, 249, 0.55)');
      grad.addColorStop(0.7, 'rgba(226, 232, 240, 0.18)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      vCtx.fillStyle = grad;
      vCtx.fillRect(0, 0, 128, 128);
    }
    const vaporTex = new THREE.CanvasTexture(vCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.75,
      map: vaporTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const vaporPoints = new THREE.Points(particleGeo, particleMat);
    modelGroup.add(vaporPoints);

    vaporParticlesRef.current = {
      points: vaporPoints,
      velocities: particleVelocities,
      lifespans: particleLifespans,
      scales: particleScales
    };

    // 8. Ground Studio Shadow & Mirror Surface
    const groundGeo = new THREE.PlaneGeometry(16, 16);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.25;
    ground.receiveShadow = true;
    scene.add(ground);

    // 9. High-performance Animation Loop
    let lastTime = performance.now();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Model Rotation (Auto or Inertia from user drag)
      if (modelGroupRef.current) {
        if (!isDraggingRef.current) {
          if (isAutoRotating) {
            modelGroupRef.current.rotation.y += 0.007;
          } else {
            modelGroupRef.current.rotation.y += rotationVelocityRef.current.y;
            modelGroupRef.current.rotation.x += rotationVelocityRef.current.x;
            rotationVelocityRef.current.y *= 0.94;
            rotationVelocityRef.current.x *= 0.94;
          }
        }

        // Clamp tilt angle
        modelGroupRef.current.rotation.x = Math.max(-0.55, Math.min(0.55, modelGroupRef.current.rotation.x));
      }

      // Vapor cloud simulation
      if (vaporParticlesRef.current) {
        const { points, velocities, lifespans } = vaporParticlesRef.current;
        const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const mat = points.material as THREE.PointsMaterial;

        let activeCount = 0;
        for (let i = 0; i < lifespans.length; i++) {
          if (lifespans[i] > 0) {
            activeCount++;
            lifespans[i] -= delta * 0.95;

            posArray[i * 3] += velocities[i].x;
            posArray[i * 3 + 1] += velocities[i].y;
            posArray[i * 3 + 2] += velocities[i].z;

            // Billowing expansion and wind turbulence
            velocities[i].x += (Math.random() - 0.5) * 0.003;
            velocities[i].z += (Math.random() - 0.5) * 0.003;
            velocities[i].y *= 0.99;
          } else if (isVaping) {
            lifespans[i] = 1.0;
            posArray[i * 3] = (Math.random() - 0.5) * 0.06;
            posArray[i * 3 + 1] = 2.55;
            posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
            velocities[i].set(
              (Math.random() - 0.5) * 0.025,
              0.045 + Math.random() * 0.05,
              (Math.random() - 0.5) * 0.025
            );
          } else {
            posArray[i * 3 + 1] = 2.55;
          }
        }

        posAttr.needsUpdate = true;
        mat.opacity = isVaping ? 0.85 : activeCount > 0 ? 0.5 : 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = entry.contentRect.width;
      const newHeight = entry.contentRect.height;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });

    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      trimGeo.dispose();
      trimMat.dispose();
      cartGeo.dispose();
      cartMat.dispose();
      liquidGeo.dispose();
      liquidMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      container.innerHTML = '';
    };
  }, [product.name]);

  // Dynamic Chassis Color Update
  useEffect(() => {
    if (partsRef.current.bodyMat && selectedColorHex) {
      partsRef.current.bodyMat.color.set(selectedColorHex);
      partsRef.current.bodyMat.needsUpdate = true;
    }
  }, [selectedColorHex]);

  // Wireframe Mode
  useEffect(() => {
    const { bodyMat, cartridgeMat } = partsRef.current;
    if (bodyMat) {
      bodyMat.wireframe = wireframeMode;
      bodyMat.needsUpdate = true;
    }
    if (cartridgeMat) {
      cartridgeMat.wireframe = wireframeMode;
      cartridgeMat.needsUpdate = true;
    }
  }, [wireframeMode]);

  // Exploded View Assembly
  useEffect(() => {
    const { cartridgeGroup, coilGroup, dripTipMesh, baseMesh } = partsRef.current;
    const factor = explodedView;

    if (cartridgeGroup) {
      cartridgeGroup.position.y = 1.34 + factor * 0.95;
    }
    if (dripTipMesh) {
      dripTipMesh.position.y = 0.88 + factor * 0.8;
    }
    if (coilGroup) {
      coilGroup.position.y = factor * 0.5;
      coilGroup.position.x = factor * 0.6; // slide out sideways for inspect
    }
    if (baseMesh) {
      baseMesh.position.y = -1.78 - factor * 0.7;
    }
  }, [explodedView]);

  // Studio Lighting Themes
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (studioTheme === 'studio') {
      scene.background = null;
    } else if (studioTheme === 'neon') {
      scene.background = new THREE.Color(0x060913);
    } else if (studioTheme === 'warm') {
      scene.background = new THREE.Color(0x18130d);
    }
  }, [studioTheme]);

  // Vape Puff Simulation
  const triggerVapePuff = () => {
    setIsVaping(true);
    playVapeSound();

    if (partsRef.current.ledRingMat) {
      partsRef.current.ledRingMat.color.set(0x38bdf8); // Cyan glow when firing
    }

    setTimeout(() => {
      setIsVaping(false);
      if (partsRef.current.ledRingMat) {
        partsRef.current.ledRingMat.color.set(0xf59e0b); // Back to amber
      }
    }, 1900);
  };

  // Change Wattage on the fly
  const changeWattage = (delta: number) => {
    const newW = Math.max(5, Math.min(40, wattage + delta));
    setWattage(newW);
    // update texture
    if (partsRef.current.screenTexture) {
      const newTex = createOLEDDisplayTexture(newW);
      partsRef.current.screenTexture.image = newTex.image;
      partsRef.current.screenTexture.needsUpdate = true;
    }
  };

  // Mouse & Touch Gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsAutoRotating(false);
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;

    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };

    modelGroupRef.current.rotation.y += deltaX * 0.009;
    modelGroupRef.current.rotation.x += deltaY * 0.007;

    rotationVelocityRef.current = {
      x: deltaY * 0.003,
      y: deltaX * 0.004
    };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!cameraRef.current) return;
    const newZoom = THREE.MathUtils.clamp(
      zoomLevelRef.current + e.deltaY * 0.003,
      2.5,
      6.5
    );
    zoomLevelRef.current = newZoom;
    cameraRef.current.position.z = newZoom;
  };

  const resetCamera = () => {
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0.1, 0, 0);
    }
    if (cameraRef.current) {
      zoomLevelRef.current = 4.3;
      cameraRef.current.position.set(0, 0.35, 4.3);
    }
    setExplodedView(0);
    setIsAutoRotating(true);
  };

  // Capture High-Res Snapshot
  const handleCaptureSnapshot = () => {
    if (!rendererRef.current) return;
    setIsCapturing(true);
    setTimeout(() => {
      try {
        const dataUrl = rendererRef.current?.domElement.toDataURL('image/png');
        if (dataUrl) {
          const link = document.createElement('a');
          link.download = `${product.nameEn || product.name}_3D_Studio.png`;
          link.href = dataUrl;
          link.click();
        }
      } catch (err) {
        console.error('Snapshot error:', err);
      } finally {
        setIsCapturing(false);
      }
    }, 150);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none overflow-hidden rounded-3xl ${
      isFullScreenModal 
        ? 'w-full h-[88vh] bg-slate-950 text-white' 
        : studioTheme === 'neon' 
        ? 'w-full h-full min-h-[440px] bg-slate-950 text-white' 
        : studioTheme === 'warm'
        ? 'w-full h-full min-h-[440px] bg-stone-900 text-amber-50'
        : 'w-full h-full min-h-[440px] bg-gradient-to-b from-slate-100 via-slate-50 to-slate-200/90 text-slate-800'
    }`}>

      {/* Top 3D Control Header Bar */}
      <div className="absolute top-3 right-3 left-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left Badge: Mode indicator & 360 interactive pill */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>رندر سه‌بعدی استودیویی (PBR)</span>
          </span>

          <span className="bg-slate-900/80 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-xl hidden sm:inline-flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-400" />
            <span>چرخش ۳۶۰° / زوم با اسکرول</span>
          </span>
        </div>

        {/* Right Tools (Sound, Camera, Reset, Close) */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {/* Sound Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl backdrop-blur border transition-colors cursor-pointer ${
              soundEnabled 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
                : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'صدا فعال است' : 'صدا غیرفعال است'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </motion.button>

          {/* Screenshot capture */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="p-2 rounded-xl bg-black/30 backdrop-blur border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="ذخیره تصویر سه‌بعدی با کیفیت بالا (Snapshot)"
          >
            <Camera className="w-4 h-4" />
          </motion.button>

          {/* Reset Camera */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={resetCamera}
            className="p-2 rounded-xl bg-black/30 backdrop-blur border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="تنظیم مجدد زاویه دوربین"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>

          {/* Close if in Modal */}
          {isFullScreenModal && onCloseModal && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onCloseModal}
              className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              title="بستن استودیو سه‌بعدی"
            >
              <Minimize2 className="w-4 h-4" />
            </motion.button>
          )}
        </div>

      </div>

      {/* 3D Canvas Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none"
        title="جهت چرخش دستگاه کلیک کرده و بکشید"
      />

      {/* Wattage Quick Adjustment Floating Controller on Screen */}
      <div className="absolute top-16 left-4 z-10 bg-slate-900/85 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl shadow-xl flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-300">توان خروجی:</span>
        <button
          type="button"
          onClick={() => changeWattage(-1)}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
        >
          -
        </button>
        <span className="font-mono font-black text-amber-400 text-xs px-1">
          {wattage}W
        </span>
        <button
          type="button"
          onClick={() => changeWattage(1)}
          className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs cursor-pointer"
        >
          +
        </button>
      </div>

      {/* Dimensions Overlay */}
      <AnimatePresence>
        {showDimensions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-16 right-4 z-10 bg-slate-900/90 backdrop-blur border border-amber-500/40 text-amber-300 p-3 rounded-2xl shadow-xl text-right text-xs space-y-1.5"
          >
            <div className="font-bold flex items-center gap-1 text-white text-[11px]">
              <Ruler className="w-3.5 h-3.5 text-amber-400" />
              <span>ابعاد مهندسی دستگاه:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300">طول: ۱۱۱ میلی‌متر</div>
            <div className="font-mono text-[11px] text-slate-300">عرض: ۲۵ میلی‌متر</div>
            <div className="font-mono text-[11px] text-slate-300">ضخامت: ۱۴.۳ میلی‌متر</div>
            <div className="font-mono text-[11px] text-amber-400">وزن خالص: ۶۶ گرم</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exploded View Info Callout */}
      <AnimatePresence>
        {explodedView > 0.1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-32 left-4 z-10 bg-slate-900/90 backdrop-blur border border-white/10 text-white p-3 rounded-2xl shadow-xl text-right max-w-xs space-y-1"
          >
            <div className="text-[11px] font-black text-amber-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>تفکیک قطعات مهندسی (Exploded View)</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              اجزای تفکیک‌شده: لبی ارگونومیک، تانک کارتریج PCTG، کویل مش طلایی، چیپست هوشمند، بدنه آلیاژ روی و پورت Type-C.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Interactive Toolbar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-2xl">
        
        {/* Left Action: Real-time Vape Vapor Puff Test Button */}
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={triggerVapePuff}
            disabled={isVaping}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isVaping 
                ? 'bg-sky-500 text-white ring-4 ring-sky-400/30' 
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950'
            }`}
          >
            <Wind className={`w-4 h-4 ${isVaping ? 'animate-pulse text-white' : 'text-slate-950'}`} />
            <span>{isVaping ? 'در حال تولید بخار...' : 'شبیه‌ساز کام‌دهی (Puff Test)'}</span>
          </motion.button>

          {/* Auto Rotate Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              isAutoRotating 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="توقف / ادامه چرخش ۳۶۰ درجه"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <span className="hidden sm:inline text-[11px]">{isAutoRotating ? 'چرخش فعال' : 'چرخش متوقف'}</span>
          </motion.button>
        </div>

        {/* Center: Exploded View Slider */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
          <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-300 whitespace-nowrap">تفکیک قطعات:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodedView}
            onChange={(e) => {
              setExplodedView(parseFloat(e.target.value));
              setIsAutoRotating(false);
            }}
            className="w-20 sm:w-28 accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-slate-700"
          />
          <span className="font-mono text-[10px] text-amber-400 w-7 text-center">
            {Math.round(explodedView * 100)}%
          </span>
        </div>

        {/* Right Tools: Wireframe, Dimensions, Studio lighting switch */}
        <div className="flex items-center gap-1">
          {/* Wireframe Switch */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setWireframeMode(!wireframeMode)}
            className={`p-2 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              wireframeMode 
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="نمای شبکه‌ای مهندسی (Wireframe)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline">وایرفریم</span>
          </motion.button>

          {/* Dimensions Overlay Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-2 rounded-xl border text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              showDimensions 
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="نمایش خط‌کش و ابعاد دقیق"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ابعاد</span>
          </motion.button>

          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setStudioTheme('studio')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                studioTheme === 'studio' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="نورپردازی استودیویی روشن"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setStudioTheme('neon')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                studioTheme === 'neon' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="نورپردازی نئونی دارک"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setStudioTheme('warm')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                studioTheme === 'warm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="نورپردازی لوکس و گرم"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
