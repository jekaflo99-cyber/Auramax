// High-Performance WebGL Shader Engine for Silhouette-Bound Anime Aura (SDF + Ridged Multi-Fractal Ki Flames + SSJ2 Lightning)

export const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

export const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform sampler2D u_image;       // Camera video frame
uniform sampler2D u_mask;        // MediaPipe silhouette mask (white = person, black = background)
uniform vec2 u_resolution;       // Canvas width and height in pixels
uniform float u_time;            // Continuous deterministic time
uniform int u_filterMode;        // 0: SSJ2 Gold, 1: Ultra Instinct, 2: SSJ Blue, 3: Getsuga Red, 4: Bankai Purple, 5: Berserk, 6: None
uniform float u_intensity;       // Aura intensity multiplier (0.3 to 1.0)
uniform float u_spread;          // Flame radius (15.0 to 60.0 px)
uniform int u_hasMask;           // 1 if AI mask is ready, 0 if fallback

varying vec2 v_texCoord;

// --- Simplex / Perlin / Ridged Multifractal Noise (Deterministic) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Ridged Multi-Fractal Noise: |noise| inverted to create ultra sharp spiky teeth (as in Dragon Ball Z)
float ridgedFbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.6;
  float freq = 1.0;
  for(int i = 0; i < 4; i++) {
    float n = abs(snoise(p * freq));
    n = 1.0 - n;        // Invert to form ridge/spikes
    n = n * n;          // Sharpen peaks
    sum += n * amp;
    freq *= 2.15;
    amp *= 0.48;
  }
  return sum;
}

// 16-Tap Radial Approximate Signed Distance Field (SDF) to the body silhouette
// Returns distance in normalized 0.0 - 1.0 coordinates: negative inside body, positive outside
float sampleSDF(vec2 uv, vec2 pixelSize, float maxRadiusPixels) {
  float centerVal = texture2D(u_mask, uv).r;
  
  // Quick check: If deep inside body or far outside, shortcut
  float outerSum = 0.0;
  float innerSum = centerVal;
  
  // 16 radial taps at 0, 22.5, 45, 67.5, 90... degrees with 3 concentric radius rings
  const int TAPS = 16;
  float stepAngle = 6.28318530718 / float(TAPS);
  
  for(int r = 1; r <= 3; r++) {
    float curRadius = (float(r) / 3.0) * maxRadiusPixels;
    for(int i = 0; i < TAPS; i++) {
      float angle = float(i) * stepAngle;
      vec2 offset = vec2(cos(angle), sin(angle)) * pixelSize * curRadius;
      float sampleM = texture2D(u_mask, uv + offset).r;
      outerSum += sampleM;
    }
  }
  
  float avgCoverage = outerSum / float(TAPS * 3);
  
  // Distance estimate: 0.0 at exact boundary, > 0.0 outside body, < 0.0 inside body
  float signedDist = (1.0 - avgCoverage) - centerVal * 0.5;
  return signedDist;
}

void main() {
  vec2 uv = v_texCoord;
  vec2 pixelSize = 1.0 / u_resolution;
  
  vec4 cameraColor = texture2D(u_image, uv);
  
  if (u_filterMode == 6) {
    gl_FragColor = cameraColor;
    return;
  }
  
  float personMask = 0.0;
  if (u_hasMask == 1) {
    personMask = texture2D(u_mask, uv).r;
  } else {
    // Elliptical torso fallback if camera started before AI mask ready
    vec2 center = vec2(0.5, 0.55);
    vec2 norm = (uv - center) / vec2(0.24, 0.38);
    personMask = smoothstep(1.0, 0.8, length(norm));
  }
  
  // --- PALETTE DEFINITIONS ---
  vec3 c_whiteHot   = vec3(1.0, 1.0, 0.95);
  vec3 c_intenseMid = vec3(1.0, 0.88, 0.15); // Vivid Super Saiyan Gold (#fde047)
  vec3 c_outerSpike = vec3(0.96, 0.48, 0.04); // Deep Amber Flame (#f59e0b)
  vec3 c_rimColor   = vec3(1.0, 0.95, 0.55);
  vec3 c_lightCore  = vec3(1.0, 1.0, 1.0);
  vec3 c_lightGlow  = vec3(0.72, 0.55, 0.98); // Lavender / Purple-Blue SSJ2 lightning (#b88cfc)
  
  if (u_filterMode == 1) {
    // Ultra Instinct (Silver / White / Sky Blue)
    c_intenseMid = vec3(0.75, 0.92, 1.0);
    c_outerSpike = vec3(0.18, 0.65, 0.98);
    c_rimColor   = vec3(0.85, 0.95, 1.0);
    c_lightGlow  = vec3(0.22, 0.74, 0.98);
  } else if (u_filterMode == 2) {
    // Super Saiyan Blue (God Ki Cyan)
    c_intenseMid = vec3(0.25, 0.88, 0.98);
    c_outerSpike = vec3(0.01, 0.45, 0.85);
    c_rimColor   = vec3(0.45, 0.92, 1.0);
    c_lightGlow  = vec3(0.35, 0.92, 1.0);
  } else if (u_filterMode == 3) {
    // Getsuga Tenshō (Bleach - Crimson / Dark Blood)
    c_intenseMid = vec3(0.95, 0.15, 0.15);
    c_outerSpike = vec3(0.55, 0.02, 0.02);
    c_rimColor   = vec3(1.0, 0.35, 0.35);
    c_lightGlow  = vec3(0.95, 0.25, 0.25);
  } else if (u_filterMode == 4) {
    // Bankai Purple (Bleach - Dark Violet / Magenta)
    c_intenseMid = vec3(0.75, 0.35, 0.98);
    c_outerSpike = vec3(0.42, 0.08, 0.72);
    c_rimColor   = vec3(0.85, 0.55, 1.0);
    c_lightGlow  = vec3(0.82, 0.45, 1.0);
  } else if (u_filterMode == 5) {
    // Berserk Rage (Deep Rose)
    c_intenseMid = vec3(0.98, 0.22, 0.45);
    c_outerSpike = vec3(0.68, 0.05, 0.22);
    c_rimColor   = vec3(1.0, 0.45, 0.65);
    c_lightGlow  = vec3(0.98, 0.25, 0.45);
  }

  // --- 1. SDF & DISTANCE ESTIMATION ---
  // Approximate signed distance: d > 0 outside body, d < 0 inside
  float maxRadiusPixels = u_spread * 1.8 * u_intensity;
  float signedDist = sampleSDF(uv, pixelSize, maxRadiusPixels);
  
  // We only paint the aura strictly OUTSIDE the body (d > 0.0), with smooth feather
  float outsideBodyFactor = smoothstep(0.02, 0.18, signedDist);
  
  // --- 2. RIDGED MULTI-FRACTAL SPIKY FLAME SHADER ---
  // Coordinates for vertical upward fire ascent (v = uv.y - u_time * speed + noise)
  float flameSpeed = 2.8;
  vec2 fireCoord = vec2(uv.x * 3.2, uv.y * 2.8 - u_time * flameSpeed);
  
  // Sample ridged noise (|noise| inverted) to generate sharp teeth/spikes
  float ridgedNoise = ridgedFbm(fireCoord);
  float microDetail = snoise(vec2(uv.x * 9.0, uv.y * 7.0 - u_time * 4.5)) * 0.15;
  
  // Flame height threshold: base + ridged noise amplitude (higher near head/shoulders)
  float flameHeight = 0.25 + ridgedNoise * 0.75 + microDetail;
  
  // Normalized distance in flame field [0.0 = at body boundary, 1.0 = tip of highest flame spike]
  float flameDist = clamp(signedDist / (0.65 * u_intensity), 0.0, 1.0);
  
  // Flame density envelope with sharp spiky cut-off
  float flameIntensity = smoothstep(flameHeight + 0.1, flameHeight - 0.25, flameDist);
  flameIntensity *= outsideBodyFactor * u_intensity;
  
  // Flame Color Gradient (White-Hot Core -> Vivid Intense Mid -> Deep Amber/Red Spike Tips)
  vec3 flameColor = mix(c_whiteHot, c_intenseMid, smoothstep(0.0, 0.35, flameDist));
  flameColor = mix(flameColor, c_outerSpike, smoothstep(0.35, 0.95, flameDist));
  
  // Soft Outer Ki Glow Decay: exp(-d * k)
  float softGlow = exp(-signedDist * 6.5) * outsideBodyFactor * 0.55 * u_intensity;
  vec3 glowColor = c_intenseMid * softGlow;

  // --- 3. SSJ2 LIGHTNING ARCS (High frequency jagged streaks with purple/blue halo) ---
  vec3 lightningFinal = vec3(0.0);
  if (u_filterMode == 0 || u_filterMode == 2 || u_filterMode == 5) {
    // High-frequency vertical noise for jagged arcs
    float lTime = u_time * 8.0;
    float lNoise1 = snoise(vec2(uv.x * 24.0, uv.y * 6.0 + floor(lTime)));
    float lNoise2 = snoise(vec2(uv.x * 48.0 + 10.0, uv.y * 12.0 - floor(lTime * 1.5)));
    
    // Thin threshold to produce sharp lightning streaks
    float arcStreak = abs(lNoise1 + lNoise2 * 0.5);
    arcStreak = smoothstep(0.06, 0.01, arcStreak);
    
    // Position lightning in the active aura zone around body
    float arcMask = smoothstep(0.05, 0.25, signedDist) * smoothstep(0.7, 0.3, signedDist);
    float arcFlicker = step(0.45, fract(sin(floor(lTime) * 43758.5453)));
    
    float arcTotal = arcStreak * arcMask * arcFlicker * u_intensity;
    lightningFinal = mix(c_lightGlow, c_lightCore, arcTotal * 0.7) * arcTotal * 2.5;
  }

  // --- 4. RIM LIGHT ON THE PERSON'S CONTOUR ---
  // A thin, warm luminous halo hugging the inside edge of the person
  float rimMask = smoothstep(0.0, 0.12, 1.0 - signedDist) * smoothstep(0.35, 0.05, 1.0 - signedDist) * personMask;
  vec3 rimLight = c_rimColor * rimMask * 0.85 * u_intensity;

  // --- 5. COMPOSITION: AURA BEHIND (ADDITIVE) + PERSON ON TOP + POST-BLOOM ---
  // Person layer (original camera video + rim light)
  vec3 personLayer = cameraColor.rgb + rimLight;
  
  // Total Aura background layer (Spiky Flames + Soft Ki Glow + SSJ2 Lightning)
  vec3 auraBehind = (flameColor * flameIntensity * 1.4) + glowColor + lightningFinal;
  
  // Blend: Where person is present (personMask ~ 1.0), draw person; behind (personMask ~ 0.0), draw camera + aura
  vec3 finalColor = mix(cameraColor.rgb + auraBehind, personLayer + (auraBehind * 0.15), personMask);
  
  // Post-Process Anime Contrast & Warmth Tuning (LUT / Tint)
  finalColor = pow(finalColor, vec3(0.92)); // Slight gamma pop
  finalColor = finalColor * 1.05;          // Exposure pop
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;
