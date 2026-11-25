import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  LineSegments,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

// The scene is registered to the 2:1 crop of the painted backdrop.
const lightsFragment = /* glsl */ `
  uniform float time;
  uniform float intensity;
  uniform float impact;
  varying vec2 screenUv;

  float glow(vec2 point, vec2 center, vec2 size) {
    vec2 distance = (point - center) / size;
    return exp(-dot(distance, distance));
  }

  void main() {
    vec2 p = screenUv;
    float beacon = 0.52 + 0.35 * sin(time * 3.1);
    float otherBeacon = 0.52 + 0.35 * sin(time * 3.1 + 2.1);
    vec3 color = vec3(0.17, 0.42, 0.92) * glow(p, vec2(0.718, 0.966), vec2(0.096, 0.21)) * 0.23;
    color += vec3(1.0, 0.12, 0.24) * glow(p, vec2(0.409, 0.671), vec2(0.032, 0.072)) * beacon * intensity;
    color += vec3(1.0, 0.15, 0.28) * glow(p, vec2(0.628, 0.666), vec2(0.041, 0.085)) * otherBeacon * intensity;
    color += vec3(1.0, 0.43, 0.21) * glow(p, vec2(0.504, 0.576), vec2(0.17, 0.11)) * 0.09;

    float drift = sin(p.x * 16.0 + time * 0.62) + 0.42 * sin(p.x * 28.0 - time * 0.38);
    float mist = glow(vec2(p.x, p.y + drift * 0.035), vec2(0.53, 0.40), vec2(0.65, 0.091));
    color += vec3(0.28, 0.46, 0.72) * max(0.0, mist * (0.105 + drift * 0.032));

    float ripple = 0.06 + 0.04 * sin(135.0 * p.y + 17.0 * p.x - time * 3.0);
    float wetRoad = glow(p, vec2(0.697, 0.290), vec2(0.071, 0.12));
    wetRoad += glow(p, vec2(0.174, 0.268), vec2(0.051, 0.13));
    color += vec3(1.0, 0.58, 0.29) * wetRoad * ripple;
    color += vec3(0.98, 0.61, 0.37) * impact * glow(p, vec2(0.19, 0.43), vec2(0.27, 0.35));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createRain(camera) {
  const count = 210;
  const positions = new Float32Array(count * 6);
  const properties = new Float32Array(count * 4);
  const halfAngle = Math.tan(camera.fov * Math.PI / 360);
  let seed = 421;
  const random = () => {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < count; i++) {
    const depth = 5 + random() * 28;
    const height = depth * halfAngle * 2;
    const x = (random() - 0.5) * height * camera.aspect * 1.14;
    const phase = random();
    const opacity = 0.25 + random() * 0.67;
    const length = 0.065 + opacity * 0.16;
    positions.set([x, 0, -depth, x - length * 0.23, length, -depth], i * 6);
    properties.set([phase, opacity, phase, opacity * 0.12], i * 4);
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('drop', new BufferAttribute(properties, 2));
  const material = new ShaderMaterial({
    uniforms: { time: { value: 0 }, halfAngle: { value: halfAngle } },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec2 drop;
      uniform float time;
      uniform float halfAngle;
      varying float opacity;

      void main() {
        vec3 p = position;
        float height = -p.z * halfAngle * 2.4;
        float fall = fract(drop.x + time * (0.22 + drop.x * 0.29));
        p.x += (fall - 0.5) * height * 0.20;
        p.y += (0.5 - fall) * height;
        opacity = drop.y * smoothstep(0.0, 0.10, fall) * (1.0 - smoothstep(0.9, 1.0, fall));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      varying float opacity;

      void main() {
        gl_FragColor = vec4(0.35, 0.55, 0.82, opacity * 0.37);
      }
    `,
  });
  const rain = new LineSegments(geometry, material);
  rain.frustumCulled = false;
  rain.renderOrder = 1;
  return rain;
}

export function createArena(host) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    const context = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    if (!context) return null;
    renderer = new WebGLRenderer({ canvas, context, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 2, 0.1, 40);
  const lights = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({
    uniforms: { time: { value: 0 }, intensity: { value: 0.2 }, impact: { value: 0 } },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec2 screenUv;
      void main() {
        screenUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: lightsFragment,
  }));
  lights.frustumCulled = false;
  const rain = createRain(camera);
  scene.add(lights, rain);
  host.append(canvas);

  let dirty = true;
  let contextLost = false;
  let viewportWidth = 0;
  let viewportHeight = 0;
  let pixelRatio = 0;
  function hide() {
    if (host.hidden) return;
    host.hidden = true;
    dirty = true;
  }
  function onContextLost() {
    contextLost = true;
    hide();
  }
  function onContextRestored() {
    contextLost = false;
    dirty = true;
  }
  canvas.addEventListener('webglcontextlost', onContextLost);
  canvas.addEventListener('webglcontextrestored', onContextRestored);

  return {
    resize(width, height) {
      if (width < 1 || height < 1) return;
      const density = Math.min(window.devicePixelRatio || 1, 1.5, 1200 / width);
      if (width === viewportWidth && height === viewportHeight && density === pixelRatio) return;
      viewportWidth = width;
      viewportHeight = height;
      pixelRatio = density;
      host.style.width = `${width}px`;
      host.style.height = `${height}px`;
      renderer.setDrawingBufferSize(width, height, density);
      dirty = true;
    },
    render({ time, stage, impact, reducedMotion }) {
      if (contextLost || renderer.getContext().isContextLost()) {
        hide();
        return false;
      }
      const frameTime = reducedMotion ? 0 : Math.floor(time * 30) / 30;
      const flash = reducedMotion ? 0 : Math.round(impact * 20) / 20;
      const intensity = 0.12 + stage * 0.065;
      const uniforms = lights.material.uniforms;
      if (dirty || uniforms.time.value !== frameTime || uniforms.impact.value !== flash || uniforms.intensity.value !== intensity) {
        uniforms.time.value = frameTime;
        uniforms.impact.value = flash;
        uniforms.intensity.value = intensity;
        rain.material.uniforms.time.value = frameTime;
        renderer.render(scene, camera);
        dirty = false;
      }
      if (host.hidden) host.hidden = false;
      return true;
    },
    hide,
    dispose() {
      hide();
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      lights.geometry.dispose();
      lights.material.dispose();
      rain.geometry.dispose();
      rain.material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
