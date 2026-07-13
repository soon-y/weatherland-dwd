#pragma glslify: sampleNormal = require('./common/wave/sampleNormal.glsl')
#pragma glslify: sampleWave = require('./common/wave/sampleWave.glsl')
#pragma glslify: sampleRippleNormal = require('./common/wave/sampleRippleNormal.glsl')
#pragma glslify: getRippleHighlight = require('./common/light/getRippleHighlight.glsl')

uniform float uFreeze;
uniform float uProgress;

varying vec2 vUv;
varying vec2 vLocalPos;

float getDayFactor() {
  if(uProgress < 0.24)
    return 0.0;

  if(uProgress < 0.26)
    return smoothstep(0.24, 0.26, uProgress);

  if(uProgress < 0.74)
    return 1.0;

  if(uProgress < 0.76)
    return 1.0 - smoothstep(0.74, 0.76, uProgress);

  return 0.0;
}

float getSunHeight() {
  const float PI = 3.14159265359;
  float day = getDayFactor();

  if(day <= 0.0)
    return 0.0;

  float t = clamp((uProgress - 0.25) / 0.5, 0.0, 1.0);
  return sin(t * PI);
}

vec3 applyFreeze(vec3 color) {
  if(uFreeze <= 0.0)
    return color;

  float day = getDayFactor();
  float sun = getSunHeight();

  vec3 nightIceColor = vec3(0.16, 0.20, 0.24);
  vec3 noonIceColor = vec3(0.86, 0.92, 0.96);
  vec3 sunsetIceColor = vec3(0.76, 0.84, 0.90);

  vec3 iceColor = mix(nightIceColor, mix(sunsetIceColor, noonIceColor, sun), day);

  color = mix(color, iceColor, uFreeze * 0.8);
  return color;
}

vec3 getWaterColor() {
  float day = getDayFactor();
  float sun = getSunHeight();

  vec3 night = vec3(0.05, 0.08, 0.10);
  vec3 noon = vec3(0.17, 0.34, 0.28);
  vec3 sunset = vec3(0.20, 0.30, 0.24);

  vec3 dayColor = mix(sunset, noon, sun);

  return mix(night, dayColor, day);
}

float getStreetLight(vec2 uv) {
  float night = 1.0 - getDayFactor();

  vec2 p = uv * 2.0 - 1.0;
  p -= vec2(0.2, 0.1);

  float d = length(p);

  float light = 1.0 - smoothstep(0.65, 1.0, d);
  light = pow(light, 1.5);

  return mix(1.0, light, night);
}

void main() {
  vec3 normal = sampleNormal(vLocalPos, vUv);
  normal += vec3(sampleRippleNormal(vUv), 0.0);
  normal = normalize(normal);

  vec3 color = getWaterColor();
  float streetLight = getStreetLight(vUv);

  float bigWave = sampleWave(vLocalPos, vUv);
  float waveFade = 1.0 - smoothstep(0.15, 0.45, uFreeze);

  bigWave = abs(bigWave);
  bigWave = smoothstep(0.02, 0.05, bigWave);
  bigWave *= waveFade;

  color = mix(color, vec3(1.0), bigWave * 0.18 * streetLight);
  color += getRippleHighlight(vUv, uFreeze) * streetLight;
  color = applyFreeze(color);

  vec3 lightColor = vec3(1.0, 0.98, 0.68);
  color += lightColor * streetLight * 0.18;

  vec2 p = vUv * 2.0 - 1.0;

  if(p.y > 0.0)
    discard;

  if(length(p) > 1.0)
    discard;

  float alpha = 1.0 - smoothstep(0.95, 1.0, length(p));
  float waterAlpha = 0.55;
  float iceAlpha = 0.92;
  float finalAlpha = alpha * mix(waterAlpha, iceAlpha, uFreeze);

  gl_FragColor = vec4(color, finalAlpha);
}
