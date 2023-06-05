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
import { GLTFLoader } from '../jsm/loaders/GLTFLoader.js';

// Variables globales estándar
let container, scene, camera, renderer, controls, island;

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

    // **TEXTURAS Y MODELOS**
    // Textura para la Isla de nieve
    const snow = new THREE.TextureLoader().load('textures/descarga4.jpg', function(snow){
        snow.wrapS = snow.wrapT = THREE.RepeatWrapping;
        snow.offset.set( 5, 5 );
        snow.repeat.set( 4, 4 );
    });
    
    // Material para la Isla de nieve
    const materialSnow = new THREE.MeshToonMaterial({
        map: snow,
        color: 0xffffff,
        brightness: 1.5,
        contrast: 1.5,
        side: THREE.DoubleSide
    });
    
    // Isla de nieve https://sketchfab.com/3d-models/low-poly-snow-island-34eeb35d2a514f499d277d535e7999d9
    const islandLoader = new GLTFLoader();
    islandLoader.load('model/islandScene.gltf', (gltf) => {
        // Se ejecuta cuando el objeto se ha cargado correctamente
        const island = gltf.scene;
        island.scale.set(50, 50, 50); // Ejemplo: aumentar la escala del objeto en un factor de 50
    
        island.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialSnow;
            }
        });
    
        scene.add(island); // Añade el objeto a la escena
    });

    // Textura para el pinguino
    const penguinTextureLoader = new THREE.TextureLoader();
        penguinTextureLoader.load('model/penguin/textures/Material.002_baseColor.png', function(texture) {
        // Material para el pinguino
        const materialPenguin = new THREE.MeshToonMaterial({
            map: texture,
            side: THREE.DoubleSide
    });

    // Modelo del pinguino
    const penguinLoader = new GLTFLoader();
    penguinLoader.load('model/penguin/penguin.gltf', (gltf) => {
        const penguin = gltf.scene;
        penguin.scale.set(50, 50, 50); 
        
        penguin.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialPenguin;
            }
        });
    
        scene.add(penguin);
        });
    });


    // Configuración de las partículas
    var snowflake = new THREE.PointsMaterial({
        color: 0xffffff, // Color blanco
        size: 5.0, // Tamaño de las partículas
        transparent: true, // Permite la transparencia
        opacity: 0.8, // Opacidad de las partículas
    });
  
    var snowparticleCount = 10000; // Cantidad de partículas
    var range = 3250; // Rango de coordenadas
    
    // Crear geometría de partículas y array de posiciones
    var snowparticles = new THREE.BufferGeometry();
    var snowpositions = new Float32Array(snowparticleCount * 3);
    
    // Generar posiciones aleatorias para las partículas
    for (var i = 0; i < snowparticleCount; i++) {
        snowpositions[i * 3] = Math.random() * range - range / 2; // Coordenada x
        snowpositions[i * 3 + 1] = Math.random() * range - range / 2; // Coordenada y
        snowpositions[i * 3 + 2] = Math.random() * range - range / 2; // Coordenada z
    }
  
    // Añadir los datos de posición a la geometría
    snowparticles.setAttribute('position', new THREE.BufferAttribute(snowpositions, 3));
    
    // Crear sistema de partículas
    var snowparticleSystem = new THREE.Points(snowparticles, snowflake);
    scene.add(snowparticleSystem);
    
    // Función para animar las partículas
    function animateParticles() {
        requestAnimationFrame(animateParticles);
    
        var positions = snowparticles.getAttribute('position').array;
    
        for (var i = 0; i < snowparticleCount; i++) {
            var y = positions[i * 3 + 1];
            
            // Ajustar la posición en el eje Y para simular la caída
            y -= Math.random() * 5; // Velocidad de caída ajustable
        
            // Si la partícula llega al fondo, resetear su posición en el eje Y
            if (y < -100) {
                y = Math.random() * range - range / 2; // Rango de alturas ajustable
            }
        
            positions[i * 3 + 1] = y; // Actualizar la posición en el array
        }
    
        // Actualizar los datos de posición en la geometría
        snowparticles.getAttribute('position').needsUpdate = true;
    
        // Renderizar la escena
        renderer.render(scene, camera);
    }
  
    // Llamar a la función para iniciar la animación
    animateParticles();     

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
