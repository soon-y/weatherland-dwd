uniform float uTime;
uniform float uWindSpeed;
uniform float uWindDir;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {

    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    vec3 transformed = position;

    vec2 windDirection = vec2(cos(uWindDir), -sin(uWindDir));

    float windStrength = smoothstep(0.0, 50.0, uWindSpeed);

    float sway = sin(uTime * 1.2) *
        0.35 *
        windStrength;

    float secondarySway = sin(uTime * 0.65) *
        0.15 *
        windStrength;

    float lean = 0.25 *
        windStrength;

    float motion = sway +
        secondarySway +
        lean;

    transformed.x += windDirection.x * motion;

    transformed.z += windDirection.y * motion;

    gl_Position = projectionMatrix *
        modelViewMatrix *
        vec4(transformed, 1.0);
}