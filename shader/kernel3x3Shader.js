/**
 */

THREE.kernel3x3Shader = {

	uniforms: {

		"tDiffuse"	: { type: "t", 	value: null },
		"uPixelSize": { type: "v2", value: new THREE.Vector2(0.1, 0.1) },
		"uKernel"	: { type: "m3", value: null},
		"uShift"	: { type: "f", 	value: 0.0}
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
		"uniform vec2 uPixelSize;",
		"uniform mat3 uKernel;",
		"uniform float uShift;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 c = (	uKernel[0][0]*texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, 	uPixelSize.y)) +",
			"			uKernel[0][1]*texture2D(tDiffuse, vUv + vec2(  0.0, 			uPixelSize.y)) +",
			"			uKernel[0][2]*texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, 	uPixelSize.y)) +",
			"			uKernel[1][0]*texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, 	0.0)) +",
			"			uKernel[1][1]*texture2D(tDiffuse, vUv + vec2(  0.0, 			0.0)) +",
			"			uKernel[1][2]*texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, 	0.0)) +",
			"			uKernel[2][0]*texture2D(tDiffuse, vUv + vec2( -uPixelSize.x,  	-uPixelSize.y)) +",
			"			uKernel[2][1]*texture2D(tDiffuse, vUv + vec2(  0.0, 			-uPixelSize.y)) +",
			"			uKernel[2][2]*texture2D(tDiffuse, vUv + vec2(  uPixelSize.x,  	-uPixelSize.y))",
			"		  );",

			"gl_FragColor = uShift+c;",
		"}"
	].join("\n")
};
