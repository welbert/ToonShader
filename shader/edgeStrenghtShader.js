/**
 */

THREE.edgeStrenghtShader = {

	uniforms: {
    "tDiffuse": { type: "t", value: null }
	},

	vertexShader: [

    "attribute vec3 center;",
    "varying vec3 vCenter;",

    "void main() {",
        "vCenter = center;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
    "}"

	].join("\n"),

	fragmentShader: [
    "#extension GL_OES_standard_derivatives: enable",

    "varying vec3 vCenter;",

    "float edgeFactorTri() {",
        "vec3 d = fwidth(vCenter.xyz);",
        "vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vCenter.xyz);",
        "return min(min(a3.x, a3.y), a3.z);",
    "}",

    "void main() {",
        "gl_FragColor.rgb = mix(vec3(1.0), vec3(0.2), edgeFactorTri());",
        "gl_FragColor.a = 1.0;",
    "}"
	].join("\n")
};
