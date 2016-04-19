/** 
Converte a textura de entrada em tons de cinza, utilizando os pesos fornecidos
em uGrayW como ponderadores.
 */

THREE.grayShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"uGrayW": { type: "v3", value: new THREE.Vector3(0.21, 0.72, 0.07) }
	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec3 uGrayW;",
		"varying vec2 vUv;",

		"void main() {",

			"vec4 c = texture2D(tDiffuse, vUv);",
			"float gray = c.r * uGrayW.r + c.g * uGrayW.g + c.b * uGrayW.b;",
			"gl_FragColor = vec4(vec3(gray), c.a);",
		"}"

	].join("\n")

};
