/* 
* 
* Computacion Grafica y Visual
* Proyecto 2
* 
* Por:
* Diego Frauca
* Oliver Pineda
* Jonathan Salazar
* 
* Grupo 1SF-141
* 
*/

import * as THREE from 'three';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';

// Variables globales estándar
let container, scene, camera, renderer, controls;

init();
animate();

// Funciones		
function init() {
	// Escena
	scene = new THREE.Scene();
	// Camara
	let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,350,1000);
	camera.lookAt(scene.position);	
	// Renderer
	renderer = new THREE.WebGLRenderer();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );
	// Controles
	controls = new OrbitControls( camera, renderer.domElement );

    // Modulo Resize
    window.addEventListener(
        'resize',
        () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            // render()
        },
        false
    )

    // Texturas
    const planks = new THREE.TextureLoader().load('textures/planks.jpg', function(planks){
        planks.wrapS = planks.wrapT = THREE.RepeatWrapping;
        planks.offset.set( 0, 0 );
        planks.repeat.set( 7, 7 );
    });
    const bookshelves = new THREE.TextureLoader().load('textures/bookshelf.jpg', function(bookshelves){
        bookshelves.wrapS = bookshelves.wrapT = THREE.RepeatWrapping;
        bookshelves.offset.set( 0, 0 );
        bookshelves.repeat.set( 3, 3 );
    });
    const bookshelf = new THREE.TextureLoader().load('textures/bookshelf.jpg' );

	// Plano de suelo
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    const floorMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planks, side: THREE.DoubleSide})
	const floor = new THREE.Mesh( floorGeometry, floorMaterial );
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);

    // Primer cubo
    const cubeGeometry = new THREE.BoxGeometry( 100, 100, 100 );
    const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookshelf, side: THREE.DoubleSide } );
    const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.set(100,100,0);
    scene.add(cube);

    // Segundo cubo
    const cube1Geometry = new THREE.BoxGeometry( 100, 100, 100 );
    const cube1Material = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookshelves, side: THREE.DoubleSide } );
    const cube1 = new THREE.Mesh( cube1Geometry, cube1Material );
    cube1.position.set(-100,100,0);
    scene.add(cube1);

    // Luz blanca central
    const light = new THREE.AmbientLight( 0xeeeeee );
    light.position.set( 0, 1500, 0 );
    light.castShadow = true;
    scene.add( light );

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    render();
}

function render() {
    renderer.render(scene, camera);
}

// Skybox
const skyBoxGeometry = new THREE.SphereGeometry(1900,1900,1900); // geometría
const textureLoader = new THREE.TextureLoader();
const skyboxTexture = textureLoader.load('textures/nieve.png');
const skyBoxMaterial = new THREE.MeshBasicMaterial({map:skyboxTexture, side:THREE.BackSide}) // material
const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial) // fusionar geometría y material 
scene.add(skyBox)
