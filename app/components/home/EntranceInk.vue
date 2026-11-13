<script setup lang="ts">
/**
 * Interactive lilac ink wash for the home entrance.
 * Rising fill (coloring-in) + soft noise + pointer bloom.
 */
const canvas = ref<HTMLCanvasElement | null>(null)
const reducedMotion = ref(false)

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let uniforms: {
  res: WebGLUniformLocation | null
  time: WebGLUniformLocation | null
  fill: WebGLUniformLocation | null
  mouse: WebGLUniformLocation | null
  paper: WebGLUniformLocation | null
  lilac: WebGLUniformLocation | null
  soft: WebGLUniformLocation | null
  glow: WebGLUniformLocation | null
  blush: WebGLUniformLocation | null
  ink: WebGLUniformLocation | null
} | null = null
let raf = 0
let start = 0
let visible = true
let disposed = false
let host: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let motionQuery: MediaQueryList | null = null

const mouse = { x: 0.5, y: 0.45, tx: 0.5, ty: 0.45 }
const fill = { value: 0, target: 1 }

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform float u_fill;
uniform vec2 u_mouse;
uniform vec3 u_paper;
uniform vec3 u_lilac;
uniform vec3 u_soft;
uniform vec3 u_glow;
uniform vec3 u_blush;
uniform vec3 u_ink;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.02 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float md = length(p - m);
  float brush = exp(-md * md * 7.5);

  float t = u_time;
  vec2 q = p * 2.4;
  q += 0.18 * vec2(
    fbm(q + vec2(0.0, t * 0.08)),
    fbm(q + vec2(5.2, -t * 0.07))
  );
  q += brush * 0.22 * vec2(
    sin(t * 0.9 + md * 8.0),
    cos(t * 0.7 - md * 6.0)
  );

  float wash = fbm(q * 1.35 + vec2(t * 0.05, -t * 0.04));
  float veins = fbm(q * 3.2 - vec2(t * 0.03, t * 0.05));
  float grain = hash(gl_FragCoord.xy + t) * 0.045;

  float wave =
    0.02 * sin(uv.x * 18.0 + t * 1.4)
    + 0.016 * sin(uv.x * 31.0 - t * 1.1 + wash * 4.0)
    + brush * 0.045;
  float level = clamp(u_fill, 0.0, 1.0);
  float surfaceY = level + wave;
  float liquid = 1.0 - smoothstep(surfaceY - 0.03, surfaceY + 0.025, uv.y);

  float foamBand = smoothstep(surfaceY - 0.11, surfaceY - 0.02, uv.y)
    * (1.0 - smoothstep(surfaceY - 0.02, surfaceY + 0.05, uv.y));
  float foamShape = fbm(vec2(uv.x * 7.5 + t * 0.08, (uv.y - surfaceY) * 18.0));
  float foam = foamBand * smoothstep(0.38, 0.78, foamShape);

  float moteSoft = 0.0;
  float moteSpeck = 0.0;
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float seed = fract(sin(fi * 17.13) * 43758.5);
    float seed2 = fract(sin(fi * 29.71) * 23421.1);
    float seed3 = fract(sin(fi * 7.7) * 91.0);
    float speed = 0.035 + seed3 * 0.06;
    float sway = 0.012 + seed * 0.014;
    float bx = mix(0.08, 0.92, seed) + sway * sin(t * (0.28 + seed2 * 0.4) + fi * 1.4);
    float rise = fract(seed2 + t * speed);
    float by = rise * max(level * 0.88, 0.08);
    float life = smoothstep(0.0, 0.18, rise) * (1.0 - smoothstep(0.62, 0.98, rise));
    life *= smoothstep(surfaceY + 0.02, surfaceY - 0.08, by);

    vec2 bUv = vec2(bx, by);
    vec2 b = (bUv - 0.5) * vec2(aspect, 1.0);
    float d = length(p - b);
    float rad = 0.012 + seed3 * 0.016;
    float halo = exp(-(d * d) / (rad * rad * 1.8));
    float core = exp(-(d * d) / (rad * rad * 0.35));
    moteSoft += halo * life * liquid;
    moteSpeck += core * life * liquid * (0.2 + seed * 0.2);
  }

  float dust = smoothstep(0.88, 0.985, fbm(p * 14.0 + vec2(t * 0.03, -t * 0.02)))
    * liquid
    * (0.15 + 0.45 * foamBand);

  vec3 paper = mix(u_paper, u_lilac, 0.22);
  vec3 deep = mix(u_ink, vec3(0.34, 0.26, 0.5), 0.4);
  vec3 mid = mix(u_glow, u_ink, 0.42);
  vec3 bright = mix(u_blush, u_glow, 0.4);
  vec3 pearl = mix(u_paper, u_glow, 0.3);

  float depth = clamp((level - uv.y) * 1.45 + wash * 0.28, 0.0, 1.0);
  vec3 pigment = mix(bright, mid, wash * 0.8);
  pigment = mix(pigment, deep, depth * 0.72 + veins * 0.24);
  pigment = mix(pigment, bright, brush * 0.65);

  vec3 col = mix(paper, pigment, liquid * (0.9 + wash * 0.1));
  col = mix(col, pearl, foam * 0.4);
  col = mix(col, pearl, clamp(moteSoft * 0.3, 0.0, 0.5));
  col += pearl * moteSpeck * 0.15;
  col += pearl * dust * 0.12;
  col = mix(col, bright, brush * 0.26 * max(liquid, 0.15));
  col += grain * 0.35;

  float vignette = smoothstep(1.2, 0.28, length((uv - 0.5) * vec2(1.2, 1.0)));
  col *= mix(0.9, 1.0, vignette);

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(ctx: WebGLRenderingContext, type: number, source: string) {
  const shader = ctx.createShader(type)
  if (!shader) return null
  ctx.shaderSource(shader, source)
  ctx.compileShader(shader)
  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    ctx.deleteShader(shader)
    return null
  }
  return shader
}

/** Soft day-lilac wash in every theme — dark tokens make this feel murky. */
const WASH = {
  paper: [0.98, 0.976, 0.988] as [number, number, number],
  lilac: [0.937, 0.918, 0.969] as [number, number, number],
  soft: [0.894, 0.855, 0.953] as [number, number, number],
  glow: [0.835, 0.78, 0.918] as [number, number, number],
  blush: [1, 0.839, 0.898] as [number, number, number],
  ink: [0.698, 0.643, 0.831] as [number, number, number],
}

function createProgram(ctx: WebGLRenderingContext) {
  const vs = compile(ctx, ctx.VERTEX_SHADER, VERT)
  const fs = compile(ctx, ctx.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = ctx.createProgram()
  if (!prog) return null
  ctx.attachShader(prog, vs)
  ctx.attachShader(prog, fs)
  ctx.linkProgram(prog)
  ctx.deleteShader(vs)
  ctx.deleteShader(fs)
  if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) {
    ctx.deleteProgram(prog)
    return null
  }
  return prog
}

function resize() {
  if (!canvas.value || !gl) return
  // CSS pixels only. A retina buffer on a full Chrome window misses frames,
  // and the sparkle (same thread) falls behind the pointer. Safari also
  // flashes if this buffer is resized mid-scroll, so size stays here.
  const rect = canvas.value.getBoundingClientRect()
  const width = Math.max(1, Math.floor(rect.width))
  const height = Math.max(1, Math.floor(rect.height))
  // Ignore 1px layout jitter from sticky chrome / subpixel scroll.
  if (
    Math.abs(canvas.value.width - width) < 2
    && Math.abs(canvas.value.height - height) < 2
  ) {
    return
  }
  canvas.value.width = width
  canvas.value.height = height
  gl.viewport(0, 0, width, height)
}

const bounds = { left: 0, top: 0, width: 1, height: 1, ready: false }
let boundsDirty = true
let inkClientX = 0
let inkClientY = 0
let inkHasPointer = false

function measureBounds() {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return
  bounds.left = rect.left
  bounds.top = rect.top
  bounds.width = rect.width
  bounds.height = rect.height
  bounds.ready = true
  boundsDirty = false
}

function setPointer(clientX: number, clientY: number) {
  inkClientX = clientX
  inkClientY = clientY
  inkHasPointer = true
  if (boundsDirty) measureBounds()
  if (!bounds.ready) return
  mouse.tx = (clientX - bounds.left) / bounds.width
  mouse.ty = 1 - (clientY - bounds.top) / bounds.height
  mouse.x = mouse.tx
  mouse.y = mouse.ty
}

function onInkScroll() {
  boundsDirty = true
  if (!inkHasPointer) return
  setPointer(inkClientX, inkClientY)
}

function onPointerMove(event: PointerEvent) {
  setPointer(event.clientX, event.clientY)
}

function onTouchMove(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch) return
  setPointer(touch.clientX, touch.clientY)
}

function onMotionChange() {
  if (!motionQuery) return
  reducedMotion.value = motionQuery.matches
  if (reducedMotion.value) fill.value = 0.88
}

function frame(now: number) {
  if (disposed || !gl || !program || !canvas.value) return
  raf = requestAnimationFrame(frame)
  if (!visible) return

  if (!start) start = now
  const elapsed = (now - start) / 1000

  mouse.x = mouse.tx
  mouse.y = mouse.ty

  if (!reducedMotion.value) {
    fill.value += (fill.target - fill.value) * 0.035
  }
  else {
    fill.value = 0.88
  }

  // Size only via ResizeObserver / boot. Per-frame resize clears the buffer (Safari scroll flash).

  if (!uniforms) return
  gl.useProgram(program)
  gl.uniform2f(uniforms.res, canvas.value.width, canvas.value.height)
  gl.uniform1f(uniforms.time, reducedMotion.value ? 0 : elapsed)
  gl.uniform1f(uniforms.fill, fill.value)
  gl.uniform2f(uniforms.mouse, mouse.x, mouse.y)

  gl.uniform3fv(uniforms.paper, WASH.paper)
  gl.uniform3fv(uniforms.lilac, WASH.lilac)
  gl.uniform3fv(uniforms.soft, WASH.soft)
  gl.uniform3fv(uniforms.glow, WASH.glow)
  gl.uniform3fv(uniforms.blush, WASH.blush)
  gl.uniform3fv(uniforms.ink, WASH.ink)

  gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function boot() {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  })
  if (!ctx) return
  gl = ctx
  program = createProgram(ctx)
  if (!program) return

  const buffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), ctx.STATIC_DRAW)

  ctx.useProgram(program)
  uniforms = {
    res: ctx.getUniformLocation(program, 'u_res'),
    time: ctx.getUniformLocation(program, 'u_time'),
    fill: ctx.getUniformLocation(program, 'u_fill'),
    mouse: ctx.getUniformLocation(program, 'u_mouse'),
    paper: ctx.getUniformLocation(program, 'u_paper'),
    lilac: ctx.getUniformLocation(program, 'u_lilac'),
    soft: ctx.getUniformLocation(program, 'u_soft'),
    glow: ctx.getUniformLocation(program, 'u_glow'),
    blush: ctx.getUniformLocation(program, 'u_blush'),
    ink: ctx.getUniformLocation(program, 'u_ink'),
  }
  const loc = ctx.getAttribLocation(program, 'a_pos')
  ctx.enableVertexAttribArray(loc)
  ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0)

  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion.value = motionQuery.matches
  fill.value = reducedMotion.value ? 0.88 : 0.42
  fill.target = 0.94

  resize()
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  boot()

  const stage = canvas.value?.parentElement ?? null
  host = canvas.value?.closest('.entrance') ?? stage
  if (host) {
    host.addEventListener('pointermove', onPointerMove, { passive: true })
    host.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('scroll', onInkScroll, { passive: true, capture: true })
  }
  if (stage) {
    resizeObserver = new ResizeObserver(() => {
      boundsDirty = true
      resize()
    })
    resizeObserver.observe(stage)
    intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting)
    }, { threshold: 0.05 })
    intersectionObserver.observe(stage)
  }

  motionQuery?.addEventListener('change', onMotionChange)
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(raf)
  motionQuery?.removeEventListener('change', onMotionChange)
  host?.removeEventListener('pointermove', onPointerMove)
  host?.removeEventListener('touchmove', onTouchMove)
  window.removeEventListener('scroll', onInkScroll, true)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
  if (gl && program) gl.deleteProgram(program)
  gl = null
  program = null
  uniforms = null
})
</script>

<template>
  <canvas
    ref="canvas"
    class="entrance-ink"
    aria-hidden="true"
  />
</template>
