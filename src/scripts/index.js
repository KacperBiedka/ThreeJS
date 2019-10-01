import '../styles/index.scss';
import Stats from 'stats-js';

var camera, scene, renderer,
    stats, clock, cubeSineDriver,
    textGeo, textTexture, textMaterial,
    light, text, smokeTexture, smokeMaterial,
    smokeGeo, smokeParticles, delta,
    geometry, material, mesh,
    mainScene, mainCamera,
    plane, planeGeometry, planeMaterial;

var canvas = document.querySelector('#c');
renderer = new THREE.WebGLRenderer({canvas});
const rtWidth = 512;
const rtHeight = 512;
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

init();
animate();

function init() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    clock = new THREE.Clock();

    scene = new THREE.Scene();
    mainScene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    scene.add( camera );
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    mainCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    mainCamera.position.z = 2;
    mainScene.add( mainCamera );

    textGeo = new THREE.PlaneGeometry(300 , 300);
    THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    textTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/quickText.png');
    textMaterial = new THREE.MeshLambertMaterial({color: 0x00ffff, opacity: 1, map: textTexture, transparent: true, blending: THREE.AdditiveBlending});
    text = new THREE.Mesh(textGeo,textMaterial);
    text.position.z = 800;
    scene.add(text);

    light = new THREE.DirectionalLight(0xffffff,0.5);
    light.position.set(-1,0,1);
    scene.add(light);

    smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    smokeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: smokeTexture, transparent: true});
    smokeGeo = new THREE.PlaneGeometry(300,300);
    smokeParticles = [];


    for (var p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        mainScene.add(light);
    }

    planeGeometry = new THREE.PlaneGeometry( 5, 5, 5 );
    const planeTexture = renderTarget.texture;
    planeMaterial = new THREE.MeshPhongMaterial( {map: planeTexture });
    plane = new THREE.Mesh( planeGeometry, planeMaterial );
    mainScene.add(plane);


    document.body.appendChild( renderer.domElement );

}

window.scene = scene;

function animate() {

    // note: three.js includes requestAnimationFrame shim
    stats.begin();
    delta = clock.getDelta();
    requestAnimationFrame( animate );
    evolveSmoke();
    render();
    stats.end();
}

function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (delta * 0.2);
    }
}

function render() {
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( mainScene, mainCamera );
}
