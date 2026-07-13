#pragma glslify: fbm = require('../noise/fbm.glsl')

uniform float uWaveOffset;
uniform vec2 uWindDir;
uniform float uWindSpeed;
uniform float uFreeze;

float sampleWave(vec2 position, vec2 uv) {
    vec2 dir = normalize(uWindDir);

    float wind = clamp(uWindSpeed / 15.0, 0.0, 1.0);
    float travelSpeed = mix(0.4, 0.9, wind);

    vec2 flow = position - dir * uWaveOffset * travelSpeed;
    vec2 perp = vec2(-dir.y, dir.x);

    flow += perp * fbm(flow * 0.15) * 0.15;
    float offset = fbm(flow * 0.35) * 0.8;
    float cross = fbm(flow * 0.12);

    float wave = 0.0;

    wave += sin((dot(flow, dir) + offset) * 4.0);
    wave += 0.35 * sin((dot(flow, dir) + offset * 0.6) * 8.0 + 1.7);
    wave += 0.15 * sin((dot(flow, dir) + offset * 0.3) * 14.0 + 3.4);
    wave += 0.15 * sin(dot(flow, perp) * 2.5 + cross * 2.0);

    float amp = mix(0.01, 0.05, wind);
    float height = wave * amp;
    float waveFade = smoothstep(6.0, 10.0, uWindSpeed);
    height *= waveFade;

    vec2 p = uv * 2.0 - 1.0;

    float circleFade = 1.0 - smoothstep(0.80, 0.95, length(p));
    float topFade = 1.0 - smoothstep(-0.50, 0.0, p.y);
    float edgeFade = circleFade * topFade;
    height *= edgeFade;
    height *= (1.0 - uFreeze);

    return height;
}

#pragma glslify: export(sampleWave)