#pragma glslify: snoise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec2 uWindDir;
uniform float uWindSpeed;
uniform float uSnowDepth;

attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying vec3 vWorldPos;
varying float vDepth;
varying vec3 vNormal;

void main() {
  vRandom = aRandom;
  vUv = uv;

  vec3 pos = position;

  float taper = pow(1.0 - pos.y, 2.0);
  pos.x *= taper;

  float bend = pow(pos.y, 1.5);
  pos.z += bend * 0.2;

  float heightFactor = pow(pos.y, 2.0);

  vec4 instancePos = instanceMatrix * vec4(pos, 1.0);
  vec4 worldPos = modelMatrix * instancePos;

  float snowDamping = 1.0 - smoothstep(0.05, 0.1, uSnowDepth);

  float windCoord = dot(worldPos.xz, uWindDir);
  float wave = sin(windCoord * 1.5 - uTime * 2.5);
  float noise = snoise(vec3(worldPos.xz * 0.25, uTime * 0.4 + aRandom * 10.0));
  float combined = wave + noise * 0.6;
  float windStrength = clamp(uWindSpeed / 25.0, 0.0, 2.0);
  float sway = combined * heightFactor * windStrength * 0.2 * snowDamping;

  pos.x += uWindDir.x * sway;
  pos.z += uWindDir.y * sway;

  instancePos = instanceMatrix * vec4(pos, 1.0);

  worldPos = modelMatrix * instancePos;
  vWorldPos = worldPos.xyz;

  vec4 viewPos = viewMatrix * worldPos;

  vDepth = -viewPos.z;

  vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

  gl_Position = projectionMatrix * viewPos;
}