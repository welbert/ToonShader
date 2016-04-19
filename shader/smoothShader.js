/**
Aplica um filtro de suavização 3x3 em uma imagem. 
A "dimensão" do pixel é dada por uPixelSize
 */

THREE.smoothShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"uPixelSize": { type: "v2", value: new THREE.Vector2(0.1, 0.1) }
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

		"varying vec2 vUv;",

		"void main() {",

			"vec4 c = (	texture2D(tDiffuse, vUv) +",
			"			texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, 0.0)) +",
			"			texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, 0.0)) +",
			"			texture2D(tDiffuse, vUv + vec2(  0.0, -uPixelSize.y)) +",
			"			texture2D(tDiffuse, vUv + vec2(  0.0, uPixelSize.y)) +",
			"			texture2D(tDiffuse, vUv + vec2(  uPixelSize.x,  uPixelSize.y)) +",	   				
			"			texture2D(tDiffuse, vUv + vec2( -uPixelSize.x,  uPixelSize.y)) +",  				
			"			texture2D(tDiffuse, vUv + vec2(  uPixelSize.x, -uPixelSize.y)) +",	   				
			"			texture2D(tDiffuse, vUv + vec2( -uPixelSize.x, -uPixelSize.y))",   				
			"		  ) / 9.0;",

			"gl_FragColor = c;",
		"}"
	].join("\n")
};
