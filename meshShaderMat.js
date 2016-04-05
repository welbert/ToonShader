var scene 			= null;
var renderer		= null;
var camera 			= null;
var pointLight		= null;
var orbitControls	= null;
var day 			= 0.0;
var year			= 0.0;
var month			= 0.0;
var clock;
var effectController,uniforms,obj;
var Modelo = "Models/Luigi.obj";
var fs, fh, bs, bb, bh, ssb, sbh;
fs = 0.0;
fh = 0.5;
bs = 0.6;
bb = 0.5;
bh = 0.7;
ssb = 0.0;
sbh = 0.5;

function init() {

	clock = new THREE.Clock();
	
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60.0, 1.0, 0.1, 1000.0);
	
	// Controle de Camera Orbital
	orbitControls = new THREE.OrbitControls(camera);
	orbitControls.autoRotate = false;

	// Adiciona luz ambiente
	var ambientLight = new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0));
	scene.add(ambientLight);
	initGUI();
	loadMeshes();
		
	renderer.clear();
}

function initGUI() {
	effectController = {
			fs : fs,
			fh : fh,
			bs : bs, 
			bb : bb, 
			bh : bh, 
			ssb : ssb, 
			sbh : sbh,
			dummy: function () {
			}
	};

	var gui = new dat.GUI(); //fs, fh, bs, bb, bh, ssb, sbh
	var folder = gui.addFolder("Constantes Limites");
	folder.add(effectController, "fs", 0.0, 1.0, 0.025).name("fs").onChange(
			function (value) {
				changeUniform("fs",value);
	});
	folder.add(effectController, "fh", 0.0, 1.0, 0.025).name("fh").onChange(
			function (value) {
				changeUniform("fh",value);
	});
	folder.add(effectController, "bs", 0.0, 1.0, 0.025).name("bs").onChange(
			function (value) {
				changeUniform("bs",value);
	});
	folder.add(effectController, "bb", 0.0, 1.0, 0.025).name("bb").onChange(
			function (value) {
				changeUniform("bb",value);
	});
	folder.add(effectController, "bh", 0.0, 1.0, 0.025).name("bh").onChange(
			function (value) {
				changeUniform("bh",value);
	});
	folder.add(effectController, "ssb", 0.0, 1.0, 0.025).name("ssb").onChange(
			function (value) {
				changeUniform("ssb",value);
	});
	folder.add(effectController, "sbh", 0.0, 1.0, 0.025).name("sbh").onChange(
			function (value) {
				changeUniform("sbh",value);
	});

	
};

function changeUniform(arg,value) {
	switch(arg) {
	    case "fs":
	    	uniforms.ufs.value = value;
	        break;
	    case "fh":
	    	uniforms.ufh.value = value;
	        break;
	    case "bs":
	    	uniforms.ubs.value = value;
	        break;
	    case "bb":
	    	uniforms.ubb.value = value;
	        break;
	    case "bh":
	    	uniforms.ubh.value = value;
	        break;
	    case "ssb":
	    	uniforms.ussb.value = value;
	        break;
	    case "sbh":
	    	uniforms.usbh.value = value;
	        break;
	} 	
	//updateUniform();
}

function loadMeshes() {
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load(Modelo, buildScene);	
}

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

    matShader.needsUpdate = true;

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function updateUniform() {
		loadMeshes();
}

function buildScene(loadedMesh) { 
	// Bounding Box	
	var BBox = new THREE.BoundingBoxHelper(loadedMesh, 0xffffff);
	BBox.update();
	
	// Adjust Camera Position and LookAt	
	var maxCoord = Math.max(BBox.box.max.x,BBox.box.max.y,BBox.box.max.z);
	
	camera.position.x 	= maxCoord*-0.1;
	camera.position.y 	= maxCoord*0.7;
	camera.position.z 	= maxCoord*1.8;
	camera.far 			= new THREE.Vector3(	maxCoord*2.5, 
												maxCoord*2.5, 
												maxCoord*2.5).length();

	camera.lookAt(new THREE.Vector3(	(BBox.box.max.x + BBox.box.min.x)/2.0,
										(BBox.box.max.y + BBox.box.min.y)/2.0,
										(BBox.box.max.z + BBox.box.min.z)/2.0));
	camera.updateProjectionMatrix();
	
	// Global Axis
	var globalAxis = new THREE.AxisHelper(maxCoord*1.3);
	scene.add( globalAxis );
	
	// Ground
	var groundGeom = new THREE.PlaneBufferGeometry(maxCoord*2.5, maxCoord*2.5, 50, 50);
	groundGeom.computeFaceNormals();
	groundGeom.computeVertexNormals();
	groundGeom.normalsNeedUpdate = true;
	var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
	groundMesh.material.side 	= THREE.DoubleSide;
	groundMesh.material.shading	= THREE.SmoothShading;
	groundMesh.rotation.x = -Math.PI / 2;
	groundMesh.position.y = -0.1;
	scene.add(groundMesh);
	
	//Add point light Source
	pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight.distance = 0.0;
	pointLight.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(pointLight);
	
	// Fonte de luz 1 - representacao geometrica
	var sphereLight = new THREE.SphereGeometry(maxCoord*0.02);
	var sphereLightMaterial = new THREE.MeshBasicMaterial(new THREE.Color(1.0, 1.0, 1.0));
	var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

	sphereLightMesh.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(sphereLightMesh);
	
	uniforms = {
		uCamPos	: 	{ type: "v3", value:camera.position},
		uLPos	:	{ type: "v3", value:pointLight.position},
		ufs 	: 	{ type: "f", value:fs} , 
		ufh 	: 	{ type: "f", value:fh} , 
		ubs 	: 	{ type: "f", value:bs} , 
		ubb 	: 	{ type: "f", value:bb} , 
		ubh 	: 	{ type: "f", value:bh} , 
		ussb 	: 	{ type: "f", value:ssb} , 
		usbh 	: 	{ type: "f", value:sbh} 
		};
	
	matShader = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'phong-vs' ).textContent,
			fragmentShader: document.getElementById( 'toon-fs' ).textContent
			} );
	
	
	loadedMesh.traverse(function (child) {	
		if (child instanceof THREE.Mesh) {
			child.material = matShader;
			if ( (child.geometry.attributes.normal != undefined) && (child.geometry.attributes.normal.length == 0)) {
				console.log(child.geometry.attributes.normal.length);
				child.geometry.computeFaceNormals();
				child.geometry.computeVertexNormals();
				child.geometry.normalsNeedUpdate = true;
				}
			}
		});
	obj = loadedMesh;
	scene.add(loadedMesh);
	render();
}