attribute float aScale;

uniform float uTime;
uniform float uArea;

varying float vAlpha;
varying float vEdgeFade;

void main() {
  vec3 pos = position;

  pos.x += sin(uTime * 0.2 + position.z * 0.15) * 0.4;
  pos.y += sin(uTime * 0.15 + position.x * 0.1) * 0.2;

  float radius = length(position);
  float edge = 1.0 - smoothstep(uArea * 0.3, uArea, radius);
  vEdgeFade = edge * edge;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  vAlpha = 1.0;

  gl_PointSize = aScale * (250.0 / -mvPosition.z);

  gl_Position = projectionMatrix * mvPosition;
}