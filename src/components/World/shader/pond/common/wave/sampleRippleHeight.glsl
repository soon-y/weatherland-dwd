uniform int uRippleCount;
uniform vec2 uRipplePos[20];
uniform float uRippleAge[20];

float sampleRippleHeight(vec2 uv) {
    vec2 pondUv = uv * 2.0 - 1.0;
    float ripple = 0.0;

    for (int i = 0; i < 20; i++) {

        if (i >= uRippleCount)
            break;

        vec2 diff = pondUv - uRipplePos[i];
        float d = length(diff);
        float radius = uRippleAge[i] * 0.35;
        float ring = sin((d - radius) * 60.0);
        ring *= exp(-25.0 * abs(d - radius));
        float fade = 1.0 - clamp(uRippleAge[i], 0.0, 1.0);

        ripple += ring * fade;
    }

    return ripple;
}

#pragma glslify: export(sampleRippleHeight)