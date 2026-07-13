#pragma glslify: sampleRippleNormal = require('../wave/sampleRippleNormal.glsl')

vec3 getRippleHighlight(vec2 uv, float freeze) {
    vec2 rn = sampleRippleNormal(uv);
    float ripple = length(rn);
    ripple = smoothstep(0.02, 0.25, ripple);
    ripple *= pow(1.0 - freeze, 2.0);
    ripple *= (1.0 - freeze);

    return vec3(1.0) * ripple * 0.18;
}

#pragma glslify: export(getRippleHighlight)