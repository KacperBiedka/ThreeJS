import '../styles/index.scss';

// global variables
var renderer;
var scene;
var camera;
var light;

var orbit;

var canvas = document.querySelector('#c');

var MAX_P = 800;
var particles = [];
var activeParticles = [];
var ps;

function init() {



    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render, sets the background color and the size
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);

    light = new THREE.DirectionalLight( 0xffffff, 2 );
    scene.add( light );

    // position and point the camera to the center of the scene
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;
    camera.lookAt(scene.position);

    setupParticleSystem();
    makeParticle(100);


    // call the render function
    render();
}

function setupParticleSystem() {

    // initially render the particles off screen
    var geometry = new THREE.Geometry();

    for (var i = 0 ; i < MAX_P ; i++) {
        var v = new THREE.Vector3(-10000,-10000,-10000);
        var rnd = Math.random()/4;
        geometry.colors.push(new THREE.Color(rnd,0,0 ));
        particles[i] = v;
    }


    geometry.vertices = particles;

    var psMat = new THREE.PointsMaterial();
    psMat.vertexColors = true;
    psMat.map = THREE.TextureLoader(require("../assets/ps_ball.png"));
    psMat.blending = THREE.AdditiveBlending;
    psMat.transparent = true;
    psMat.opacity = 0.6;
//        psMat.size = 0.7;

    ps = new THREE.Points(geometry, psMat);
    ps.sizeAttenuation = true;
    ps.sortParticles = true;


    scene.add(ps);
}

function makeParticle(pCount) {
    for (var i = 0 ; i < pCount ; i++) {
        var particle =  new THREE.Vector3(Math.random() /2,
            Math.random() /2,
            Math.random() /2);

//            var particle = new THREE.Vector3(0,0,0);
        particle.velX = randomRange(-0.04,0.04);
        particle.velY = randomRange(0.02,0.07);
        particle.velZ = randomRange(-0.04,0.04);
        particle.gravity = -0.000002;

        if (activeParticles.length == MAX_P) {
            activeParticles.shift();

        }

        activeParticles.push(particle);
    }
}

function updateParticle(particle) {
    particle.x+=particle.velX;
    particle.y+=particle.velY;
    particle.z+=particle.velZ;

    particle.velY+=particle.gravity;
}

function randomRange(min,max) {
    return (Math.random()*max) + min;
}

function render() {
    renderer.render(scene, camera);

    // update the position of the particles



    // update the visualisation of the particels
    for (var i = 0 ; i < activeParticles.length ; i++) {
        updateParticle(activeParticles[i]);
        particles[i].set(activeParticles[i].x,activeParticles[i].y,activeParticles[i].z);
    }

    makeParticle(10);

    ps.geometry.verticesNeedUpdate = true;

    requestAnimationFrame(render);
}

// calls the init function when the window is done loading.
window.onload = init;

