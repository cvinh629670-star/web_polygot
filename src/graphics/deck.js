import {
  AmbientLight, BufferGeometry, CanvasTexture, DirectionalLight, ExtrudeGeometry,
  Group, LineBasicMaterial, LineLoop, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  OctahedronGeometry, OrthographicCamera, PlaneGeometry, Scene, Shape, SRGBColorSpace,
  Vector3, WebGLRenderer,
} from 'three';

const palettes = {
  en: { glyph: 'Aa', accent: '#78e3d1', edge: '#60bfb6' },
  ko: { glyph: '한', accent: '#ffb8dc', edge: '#c982b6' },
  zh: { glyph: '字', accent: '#ffc7ab', edge: '#d8937d' },
  ja: { glyph: 'あ', accent: '#ffd395', edge: '#d7a367' },
};

function roundedCard() {
  const x = 1.04;
  const y = 1.27;
  const radius = 0.15;
  const shape = new Shape();
  shape.moveTo(-x + radius, -y);
  shape.lineTo(x - radius, -y);
  shape.quadraticCurveTo(x, -y, x, -y + radius);
  shape.lineTo(x, y - radius);
  shape.quadraticCurveTo(x, y, x - radius, y);
  shape.lineTo(-x + radius, y);
  shape.quadraticCurveTo(-x, y, -x, y - radius);
  shape.lineTo(-x, -y + radius);
  shape.quadraticCurveTo(-x, -y, -x + radius, -y);
  return new ExtrudeGeometry(shape, {
    depth: 0.1, bevelSize: 0.035, bevelThickness: 0.032, bevelSegments: 2, curveSegments: 8,
  });
}

function paintCard(surface, language, { glyph, accent }) {
  const ink = surface.getContext('2d');
  ink.clearRect(0, 0, 360, 440);
  const gradient = ink.createLinearGradient(0, 0, 360, 440);
  gradient.addColorStop(0, '#244a50');
  gradient.addColorStop(0.58, '#153237');
  gradient.addColorStop(1, '#10222d');
  ink.beginPath();
  ink.roundRect(2, 2, 356, 436, 23);
  ink.fillStyle = gradient;
  ink.fill();

  ink.strokeStyle = accent;
  ink.globalAlpha = 0.4;
  ink.lineWidth = 2;
  ink.stroke();
  ink.beginPath();
  ink.roundRect(24, 24, 312, 392, 12);
  ink.stroke();
  ink.globalAlpha = 1;

  ink.fillStyle = accent;
  ink.textBaseline = 'middle';
  ink.textAlign = 'left';
  ink.font = '700 22px system-ui, sans-serif';
  ink.fillText(language.toUpperCase(), 44, 62);
  ink.textAlign = 'center';
  ink.font = language === 'en' ? 'italic 154px Georgia, serif' : '600 135px system-ui, sans-serif';
  ink.fillText(glyph, 180, 226);

  ink.strokeStyle = accent;
  ink.lineWidth = 3;
  ink.beginPath();
  ink.moveTo(44, 375);
  ink.lineTo(134, 375);
  ink.moveTo(44, 388);
  ink.lineTo(96, 388);
  ink.moveTo(297, 57);
  ink.lineTo(315, 57);
  ink.moveTo(306, 48);
  ink.lineTo(306, 66);
  ink.stroke();
}

export function createDeck(host, language) {
  const canvas = document.createElement('canvas');
  let renderer;
  try {
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!context) return null;
    renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  } catch {
    return null;
  }

  renderer.setClearColor(0, 0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-4, 4, 2, -2, 0.1, 30);
  camera.position.set(0, 0.12, 10);
  camera.lookAt(0, 0, 0);
  const key = new DirectionalLight('#b7ffe9', 2.1);
  key.position.set(-3, 4, 5);
  const rim = new DirectionalLight('#ffd6ac', 1.5);
  rim.position.set(4, -1, 3);
  scene.add(new AmbientLight('#e0e7ff', 1.4), key, rim);

  const deck = new Group();
  deck.scale.setScalar(0.94);
  scene.add(deck);

  const geometry = roundedCard();
  const frontEdge = new MeshStandardMaterial({ metalness: 0.45, roughness: 0.32 });
  const leftMaterial = new MeshStandardMaterial({ color: '#d9a774', metalness: 0.32, roughness: 0.48 });
  const rightMaterial = new MeshStandardMaterial({ color: '#7493b6', metalness: 0.38, roughness: 0.36 });
  const leftCard = new Mesh(geometry, leftMaterial);
  leftCard.position.set(-0.92, 0.05, -1.12);
  leftCard.rotation.set(-0.12, -0.36, 0.38);
  const rightCard = new Mesh(geometry, rightMaterial);
  rightCard.position.set(0.85, -0.12, -1.13);
  rightCard.rotation.set(0.23, 0.38, -0.4);
  const frontCard = new Mesh(geometry, frontEdge);
  frontCard.rotation.set(-0.09, -0.19, 0.11);
  deck.add(leftCard, rightCard, frontCard);

  const surface = document.createElement('canvas');
  surface.width = 360;
  surface.height = 440;
  const texture = new CanvasTexture(surface);
  texture.colorSpace = SRGBColorSpace;
  const faceGeometry = new PlaneGeometry(2.02, 2.47);
  const faceMaterial = new MeshBasicMaterial({ map: texture, alphaTest: 0.5 });
  const face = new Mesh(faceGeometry, faceMaterial);
  face.position.z = 0.134;
  frontCard.add(face);

  const orbitGeometry = new BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => {
    const angle = i / 96 * Math.PI * 2;
    return new Vector3(3.05 * Math.cos(angle), 0.89 * Math.sin(angle), 0);
  }));
  const orbitMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.45 });
  const orbit = new LineLoop(orbitGeometry, orbitMaterial);
  orbit.rotation.set(-0.49, -0.06, -0.4);
  orbit.position.z = -1.8;
  scene.add(orbit);

  const gemGeometry = new OctahedronGeometry(0.12);
  const gemMaterial = new MeshStandardMaterial({ color: '#f4c094', roughness: 0.23, metalness: 0.17 });
  const gems = [[-2.35, 0.78, 0.2], [2.33, 0.86, 0.4], [2.53, -0.48, -0.35]].map(([x, y, z], i) => {
    const gem = new Mesh(gemGeometry, gemMaterial);
    gem.position.set(x, y, z);
    gem.scale.setScalar(1 - i * 0.2);
    scene.add(gem);
    return gem;
  });

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = 0;
  let lastFrame = -Infinity;
  let elapsed = 0;
  let animateUntil = performance.now() + 1400;
  let contextLost = false;
  let sized = false;
  let targetX = 0;
  let targetY = 0;

  function render() {
    if (!sized || contextLost || document.hidden) return;
    const still = motion.matches;
    const time = still ? 0 : elapsed;
    deck.position.y = Math.sin(time * 0.85) * 0.1;
    deck.rotation.x = still ? 0 : deck.rotation.x + (targetY - deck.rotation.x) * 0.12;
    deck.rotation.y = still ? 0 : deck.rotation.y + (targetX - deck.rotation.y) * 0.12;
    gems.forEach((gem, i) => {
      gem.rotation.x = i + time * 0.45;
      gem.rotation.y = i - time * 0.55;
    });
    renderer.render(scene, camera);
    if (!host.dataset.renderer) host.dataset.renderer = 'webgl';
  }

  function tick(now) {
    frame = 0;
    if (now - lastFrame >= 1000 / 30 - 1) {
      elapsed += Math.min(50, now - lastFrame) / 1000;
      render();
      lastFrame = now;
    }
    syncFrames();
  }

  function syncFrames() {
    if (visible && sized && !document.hidden && !motion.matches && !contextLost && performance.now() < animateUntil) {
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = host;
    sized = width > 0 && height > 0;
    if (sized && !contextLost) {
      const aspect = width / height;
      const heightHalf = Math.max(1.88, 2.95 / aspect);
      camera.top = heightHalf;
      camera.bottom = -heightHalf;
      camera.left = -heightHalf * aspect;
      camera.right = heightHalf * aspect;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height, false);
      render();
    }
    syncFrames();
  }

  function setLanguage(value) {
    const id = Object.hasOwn(palettes, value) ? value : 'en';
    const palette = palettes[id];
    frontEdge.color.set(palette.edge);
    orbitMaterial.color.set(palette.accent);
    paintCard(surface, id, palette);
    texture.needsUpdate = true;
    render();
  }

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncFrames();
  });

  function animateTilt() {
    animateUntil = performance.now() + 600;
    syncFrames();
  }

  function movePointer(event) {
    const { left, top, width, height } = host.getBoundingClientRect();
    targetX = (event.clientX - left - width / 2) / width * 0.46;
    targetY = (event.clientY - top - height / 2) / height * 0.31;
    animateTilt();
  }

  function resetPointer() {
    targetX = 0;
    targetY = 0;
    animateTilt();
  }

  function updateVisibility() {
    if (!document.hidden) render();
    syncFrames();
  }

  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    delete host.dataset.renderer;
    syncFrames();
  }

  function onContextRestored() {
    contextLost = false;
    resize();
  }

  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  setLanguage(language);
  resizeObserver.observe(host);
  visibilityObserver.observe(host);
  host.addEventListener('pointermove', movePointer);
  host.addEventListener('pointerleave', resetPointer);
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);
  motion.addEventListener('change', updateVisibility);
  document.addEventListener('visibilitychange', updateVisibility);
  resize();

  return {
    setLanguage,
    dispose() {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener('pointermove', movePointer);
      host.removeEventListener('pointerleave', resetPointer);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      motion.removeEventListener('change', updateVisibility);
      document.removeEventListener('visibilitychange', updateVisibility);
      [
        geometry, frontEdge, leftMaterial, rightMaterial, faceGeometry, faceMaterial,
        texture, orbitGeometry, orbitMaterial, gemGeometry, gemMaterial,
      ].forEach(resource => resource.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete host.dataset.renderer;
    },
  };
}
