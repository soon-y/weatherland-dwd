uniform int uRippleCount;
uniform vec2 uRipplePos[20];
uniform float uRippleAge[20];

vec2 sampleRippleNormal(vec2 uv) {
    vec2 pondUv = uv * 2.0 - 1.0;
    vec2 rippleNormal = vec2(0.0);

    for(int i = 0; i < 20; i++) {
        if(i >= uRippleCount)
            break;

        vec2 diff = pondUv - uRipplePos[i];
        float d = length(diff);
        float radius = uRippleAge[i] * 0.18;
        float ring = sin((d - radius) * 80.0);
        ring *= exp(-40.0 * abs(d - radius));
        ring = max(ring, 0.0);

        float fade = exp(-2.5 * uRippleAge[i]);
        float contribution = ring * fade;

        if(d > 0.001)
            rippleNormal += normalize(diff) * contribution;
    }
    return rippleNormal;
}

#pragma glslify: export(sampleRippleNormal)