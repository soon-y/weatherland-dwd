#pragma glslify: snoise = require('glsl-noise/simplex/3d')

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    value += snoise(vec3(p, 0.0)) * amplitude;

    p *= 2.02;
    amplitude *= 0.5;

    value += snoise(vec3(p, 31.7)) * amplitude;

    p *= 2.03;
    amplitude *= 0.5;

    value += snoise(vec3(p, 79.2)) * amplitude;

    return value;
}

#pragma glslify: export(fbm)