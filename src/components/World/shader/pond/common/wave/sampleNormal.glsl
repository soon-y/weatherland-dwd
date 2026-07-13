#pragma glslify: sampleWave = require('./sampleWave.glsl')

uniform float uFreeze;

vec3 sampleNormal(vec2 position, vec2 uv) {
    if(uFreeze > 0.99)
        return vec3(0.0, 0.0, 1.0);

    float eps = 0.01;

    float h = sampleWave(position, uv);
    float hx = sampleWave(position + vec2(eps, 0.0), uv + vec2(eps, 0.0));
    float hy = sampleWave(position + vec2(0.0, eps), uv + vec2(0.0, eps));
    const float NORMAL_STRENGTH = 100.0;

    vec3 dx = vec3(eps, 0.0, (hx - h) * NORMAL_STRENGTH);
    vec3 dy = vec3(0.0, eps, (hy - h) * NORMAL_STRENGTH);

    return normalize(cross(dy, dx));
}

#pragma glslify: export(sampleNormal)