uniform float uProgress;
uniform float uSnowDepth;

varying vec3 vNormal;

float getBrightness(float p) {
    if(p < 0.249) {
        return 0.0;
    }

    if(p < 0.30) {
        return mix(0.5, 0.6, (p - 0.25) / 0.05);
    }

    if(p < 0.35) {
        return mix(0.6, 0.75, (p - 0.30) / 0.05);
    }

    if(p < 0.50) {
        return mix(0.75, 1.0, (p - 0.35) / 0.15);
    }

    if(p < 0.65) {
        return mix(1.0, 0.75, (p - 0.50) / 0.15);
    }

    if(p < 0.70) {
        return mix(0.75, 0.6, (p - 0.65) / 0.05);
    }

    if(p < 0.751) {
        return mix(0.6, 0.5, (p - 0.70) / 0.05);
    }

    return 0.0;
}

void main() {

    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(vec3(0.3, 1.0, 0.2));

    float ndl = dot(normal, lightDir);
    ndl = ndl * 0.5 + 0.5;

    float shading = mix(0.35, 1.0, ndl);

    vec3 leafColor = vec3(0.42, 0.72, 0.05);
    leafColor *= shading;

    vec3 snowColor = vec3(1.0);
    snowColor *= shading;

    float snowAmount = smoothstep(0.1, 0.5, uSnowDepth);

    vec3 surfaceColor = mix(leafColor, snowColor, snowAmount);

    vec3 nightColor = vec3(0.01, 0.02, 0.015);

    float brightness = getBrightness(uProgress);

    vec3 color = mix(nightColor, surfaceColor, brightness);

    gl_FragColor = vec4(color, 1.0);
}