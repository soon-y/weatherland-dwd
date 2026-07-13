uniform float uProgress;

varying vec2 vUv;
varying float vRandom;
varying vec3 vWorldPos;

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

const float PI = 3.14159265359;

float getSunHeight() {
  if(uProgress <= 0.25 || uProgress >= 0.75)
    return 0.0;

  float t = (uProgress - 0.25) / 0.5;
  return sin(t * PI);
}

vec3 getStreetLight() {
  float lamp = 1.0 - getDayFactor();

  vec2 center = vec2(2.0, -2.0);
  float dist = length(vWorldPos.xz - center);

  float radius = 10.0;
  float light = 1.0 - smoothstep(0.0, radius, dist);
  light *= light;

  vec3 lightColor = vec3(1.0, 0.93, 0.38);

  return lightColor * light * 0.4 * lamp;
}

void main() {
  vec3 base = vec3(0.2, 0.5, 0.25);
  vec3 tip = vec3(0.6, 0.9, 0.4);

  vec3 grassColor = mix(base, tip, vUv.y);
  grassColor *= 0.8 + vRandom * 0.4;

  vec3 nightColor = vec3(0.06, 0.11, 0.08);

  float sunHeight = getSunHeight();
  float light = 0.6 + 0.4 * sunHeight;
  float day = getDayFactor();
  vec3 color = mix(nightColor, mix(nightColor, grassColor, light), day);

  vec3 streetlight = getStreetLight();
  color = mix(color, grassColor, streetlight);

  gl_FragColor = vec4(color, 1.0);
}