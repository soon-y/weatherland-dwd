uniform float uStrength;
uniform float uIsDay;

varying float vEdgeFade;

void main() {
  vec2 uv = gl_PointCoord * 2.0 - 1.0;

  float d = length(uv);

  float circle = 1.0 - smoothstep(0.0, 1.0, d);

  circle = pow(circle, 2.5);

  vec3 dayColor = vec3(0.85, 0.88, 0.90);
  vec3 nightColor = vec3(0.20, 0.24, 0.30);
  vec3 color = mix(nightColor, dayColor, uIsDay);

  float alpha = circle * vEdgeFade * uStrength * 0.35;

  if(alpha < 0.001)
    discard;

  gl_FragColor = vec4(color, alpha);
}