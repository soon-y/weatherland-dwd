#pragma glslify: sampleWave = require('./common/wave/sampleWave.glsl')
#pragma glslify: sampleRippleHeight = require('./common/wave/sampleRippleHeight.glsl')
#pragma glslify: sampleNormal = require('./common/wave/sampleNormal.glsl')

uniform float uFreeze;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying vec2 vLocalPos;

void main() {
    vUv = uv;
    vLocalPos = position.xy;

    vec3 pos = position;

    float freezeStrength = 1.0 - smoothstep(0.3, 0.9, uFreeze);

    float height = sampleWave(position.xy, uv) * freezeStrength;
    height += sampleRippleHeight(uv) * 0.05 * freezeStrength;

    pos.z += height;

    vec3 normal = mix(sampleNormal(position.xy, uv), vec3(0.0, 0.0, 1.0), smoothstep(0.7, 1.0, uFreeze));

    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}