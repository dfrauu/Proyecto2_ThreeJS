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
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../jsm/postprocessing/UnrealBloomPass.js';

// Variables globales estándar
let container, scene, camera, renderer, controls, island;

// Escena
scene = new THREE.Scene();
// Camara
let SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
let VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
scene.add(camera);
scene.background = new THREE.Color( 0x130f2e );
camera.position.set(0,750,1700);
camera.lookAt(scene.position);	
// Renderer
renderer = new THREE.WebGLRenderer();

renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.35,
    0.1,
    0.1
);
composer.addPass(bloomPass);

init();
animate();

// Funciones		
function init() {

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

    // Skybox
    const skyBoxGeometry = new THREE.SphereGeometry(1900,1900,1900); // geometría
    const textureLoader = new THREE.TextureLoader();
    const skyboxTexture = textureLoader.load('Proyecto2_Threejs/textures/nieve1.png');
    const skyBoxMaterial = new THREE.MeshBasicMaterial({map:skyboxTexture, side:THREE.BackSide}) // material
    const skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial) // fusionar geometría y material 
    scene.add(skyBox)

    // **TEXTURAS Y MODELOS**
    // Textura para la Isla de nieve
    const snow = new THREE.TextureLoader().load('Proyecto2_Threejs/textures/island.jpg', function(snow){
        snow.wrapS = snow.wrapT = THREE.RepeatWrapping;
        snow.offset.set( 5, 5 );
        snow.repeat.set( 4, 4 );
    });
    
    // Material para la Isla de nieve
    const materialSnow = new THREE.MeshToonMaterial({
        map: snow,
        color: 0xeeeeee,
        brightness: 1.5,
        contrast: 1.5,
        side: THREE.DoubleSide
    });
    
    // Isla de nieve https://sketchfab.com/3d-models/low-poly-snow-island-34eeb35d2a514f499d277d535e7999d9
    const islandLoader = new GLTFLoader();
    islandLoader.load('Proyecto2_Threejs/model/islandScene.gltf', (gltf) => {
        // Se ejecuta cuando el objeto se ha cargado correctamente
        const island = gltf.scene;
        island.scale.set(60, 60, 60); // Ejemplo: aumentar la escala del objeto en un factor de 50
    
        island.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialSnow;
            }
        });
    
        scene.add(island); // Añade el objeto a la escena
    });

    
    // island base
    const islandbaseGeometry = new THREE.CylinderGeometry( 1175, 1175, 75, 32 );
    // const islandbaseGeometry = new THREE.BoxGeometry( 1700, 75, 1700 );
    const islandbasematerial = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
    const islandbase = new THREE.Mesh( islandbaseGeometry, islandbasematerial );
    islandbase.position.set(0, -190, -0);
    scene.add( islandbase );

    // Textura para el pinguino
    const penguinTextureLoader = new THREE.TextureLoader();
        penguinTextureLoader.load('Proyecto2_Threejs/model/penguin/textures/DJCadence_baseColor.png', 
        function(texture) {
        // Material para el pinguino
        const materialPenguin = new THREE.MeshToonMaterial({
            map: texture,
            side: THREE.DoubleSide
    });

    // Modelo del pinguino
    const penguinLoader = new GLTFLoader();
    penguinLoader.load('Proyecto2_Threejs/model/penguin/penguin.glb', (gltf) => {
        const penguin = gltf.scene;
        penguin.scale.set(70, 70, 70);
        penguin.position.set(250, 30, 180)
        penguin.rotation.set(0, 80, 0)
        
        penguin.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialPenguin;
            }
        });
    
        scene.add(penguin);
        });
    });

    // Textura para la caña de pescar
    const fishingrodTextureLoader = new THREE.TextureLoader();
    const fishingrodTexture = fishingrodTextureLoader.load('Proyecto2_Threejs/model/fishing_rod/textures/fishing.png');
    // Material para la caña de pescar
    const materialfishingrod = new THREE.MeshToonMaterial({
        map: fishingrodTexture,
        side: THREE.DoubleSide
    });
    // Modelo de la caña de pescar
    const fishingrodLoader = new GLTFLoader();
    fishingrodLoader.load('Proyecto2_Threejs/model/fishing_rod/fishing.glb', (gltf) => {
        const fishingrod = gltf.scene;
        fishingrod.scale.set(0.05, 0.05, 0.05);
        fishingrod.position.set(250, 30 - 35.5, 180 - 20);
        fishingrod.rotation.set(0, 50.25, 50);

        fishingrod.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialfishingrod;
            }
        });

        scene.add(fishingrod);
    });

    // Textura para el pez
    const fishTextureLoader = new THREE.TextureLoader();
    const fishTexture = fishTextureLoader.load('Proyecto2_Threejs/model/fish/textures/clownfish.png');

    // Material para el pez
    const materialfish = new THREE.MeshToonMaterial({
        map: fishTexture,
        side: THREE.DoubleSide
    });

    // Modelo del pez
    const fishLoader = new GLTFLoader();
    fishLoader.load('Proyecto2_Threejs/model/fish/fish.glb', (gltf) => {
        const fish = gltf.scene;
        fish.scale.set(350, 350, 350);
        fish.position.set(140, 15, 160);
        fish.rotation.set(-1.5708, 0, 1.5708);

        fish.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialfish;
            }
        });

        scene.add(fish);
    });

    // fishing line
    const fishlineGeometry = new THREE.CylinderGeometry( 0.5, 0.5, 60, 8 );
    const fishlinematerial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const fishline = new THREE.Mesh( fishlineGeometry, fishlinematerial );
    fishline.position.set(142, 60, 160);
    scene.add( fishline );

    // Textura para el iglú
    const iglooTextureLoader = new THREE.TextureLoader();
    iglooTextureLoader.load('Proyecto2_Threejs/model/igloo/textures/igloo.jpg', function(iglooTexture) {
        iglooTexture.wrapS = iglooTexture.wrapT = THREE.RepeatWrapping;
        iglooTexture.offset.set(5, 5);
        iglooTexture.repeat.set(4, 4);

        // Material para el iglú
        const materialIgloo = new THREE.MeshToonMaterial({
            map: iglooTexture,
            side: THREE.DoubleSide
        });

        // Modelo del iglú
        const iglooLoader = new GLTFLoader();
        iglooLoader.load('Proyecto2_Threejs/model/igloo/iglu1.glb', (gltf) => {
            const igloo = gltf.scene;
            igloo.scale.set(47, 47, 47);
            igloo.position.set(500, 17, -450);
            //rotate the igloo 45 degrees in radians
            igloo.rotation.set(0, 4.7124, 0);

            igloo.traverse(function(child) {
                if (child.isMesh) {
                    child.material = materialIgloo;
                }
            });

            scene.add(igloo);
        });
    });

    // igloo base
    const igloobase = new THREE.CylinderGeometry( 150, 150, 100, 32 );
    const igloobasematerial = new THREE.MeshLambertMaterial({ color: 0xfefefe });
    const iglooBase = new THREE.Mesh( igloobase, igloobasematerial );
    iglooBase.position.set(500, -35, -450);
    scene.add( iglooBase );

    // Textura para la bandera
    const flagTextureLoader = new THREE.TextureLoader();
    const flagTexture = flagTextureLoader.load('Proyecto2_Threejs/model/flag/textures/penguin_snow.png');

    // Material para la bandera
    const materialFlag = new THREE.MeshToonMaterial({
        map: flagTexture,
        side: THREE.DoubleSide
    });

    // Modelo del la bandera
    const flagLoader = new GLTFLoader();
    flagLoader.load('Proyecto2_Threejs/model/flag/flag_pole_nato.glb', (gltf) => {
        const flag = gltf.scene;
        flag.scale.set(60, 60, 60);
        flag.position.set(-400, -85, 580);
        flag.rotation.set(0, 0, 0);

        flag.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialFlag;
            }
        });

        scene.add(flag);
    });

    // Textura para el árbol
    const treeTextureLoader = new THREE.TextureLoader();
    const treeTexture = treeTextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    treeTexture.offset.y = -0.005
    treeTexture.offset.x = -0.015

    // Material para el árbol
    const materialTree = new THREE.MeshToonMaterial({
        map: treeTexture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol
    const treeLoader = new GLTFLoader();
    treeLoader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree = gltf.scene;
        tree.scale.set(0.2, 0.2, 0.2);
        tree.position.set(400, -10, 580);
        tree.rotation.set(0, 0, 0);
        tree.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree;
            }
        });
        scene.add(tree);


    });

    // Textura para el árbol 2
    const tree2TextureLoader = new THREE.TextureLoader();
    const tree2Texture = tree2TextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    tree2Texture.offset.y = -0.005
    tree2Texture.offset.x = -0.015

    // Material para el árbol 2
    const materialTree2 = new THREE.MeshToonMaterial({
        map: tree2Texture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol 2
    const tree2Loader = new GLTFLoader();
    tree2Loader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree2 = gltf.scene;
        tree2.scale.set(0.25, 0.25, 0.25);
        tree2.position.set(-400, -40, -580);
        tree2.rotation.set(0, 0, 0);
        tree2.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree2;
            }
        });
        scene.add(tree2);

    });

    // Textura para el árbol 3
    const tree3TextureLoader = new THREE.TextureLoader();
    const tree3Texture = tree3TextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    tree3Texture.offset.y = -0.005
    tree3Texture.offset.x = -0.015

    // Material para el árbol 3
    const materialTree3 = new THREE.MeshToonMaterial({
        map: tree3Texture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol 3
    const tree3Loader = new GLTFLoader();
    tree3Loader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree3 = gltf.scene;
        tree3.scale.set(0.3, 0.3, 0.3);
        tree3.position.set(150, -40, -380);
        tree3.rotation.set(0, 0, 0);
        tree3.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree3;
            }
        });
        scene.add(tree3);

    });

    // Textura para el árbol 4
    const tree4TextureLoader = new THREE.TextureLoader();
    const tree4Texture = tree4TextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    tree4Texture.offset.y = -0.005
    tree4Texture.offset.x = -0.015

    // Material para el árbol 4
    const materialTree4 = new THREE.MeshToonMaterial({
        map: tree4Texture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol 4
    const tree4Loader = new GLTFLoader();
    tree4Loader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree4 = gltf.scene;
        tree4.scale.set(0.22, 0.22, 0.22);
        tree4.position.set(-500, 60, -180);
        tree4.rotation.set(0, 0, 0);
        tree4.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree4;
            }
        });
        scene.add(tree4);

    });

    // Textura para el árbol 5
    const tree5TextureLoader = new THREE.TextureLoader();
    const tree5Texture = tree5TextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    tree5Texture.offset.y = -0.005
    tree5Texture.offset.x = -0.015

    // Material para el árbol 5
    const materialTree5 = new THREE.MeshToonMaterial({
        map: tree5Texture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol 5
    const tree5Loader = new GLTFLoader();
    tree5Loader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree5 = gltf.scene;
        tree5.scale.set(0.27, 0.27, 0.27);
        tree5.position.set(-602, -95, 280);
        tree5.rotation.set(0, 0, 0);
        tree5.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree5;
            }
        });
        scene.add(tree5);

    });

    // Textura para el árbol 6
    const tree6TextureLoader = new THREE.TextureLoader();
    const tree6Texture = tree6TextureLoader.load('Proyecto2_Threejs/model/tree/textures/Texture_baseColor.png');

    tree6Texture.offset.y = -0.005
    tree6Texture.offset.x = -0.015

    // Material para el árbol 6
    const materialTree6 = new THREE.MeshToonMaterial({
        map: tree6Texture,
        side: THREE.DoubleSide
    });

    // Modelo del árbol 6
    const tree6Loader = new GLTFLoader();
    tree6Loader.load('Proyecto2_Threejs/model/tree/tree.glb', (gltf) => {
        const tree6 = gltf.scene;
        tree6.scale.set(0.17, 0.17, 0.17);
        tree6.position.set(652, -30, 210);
        tree6.rotation.set(0, 0, 0);
        tree6.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialTree6;
            }
        });
        scene.add(tree6);

    });


    // Textura para el hielo
    const iceTextureLoader = new THREE.TextureLoader();
    const icenormalMap = iceTextureLoader.load('Proyecto2_Threejs/model/ice/textures/Ice_Cube_normal.jpeg');
    const iceocclusionMap = iceTextureLoader.load('Proyecto2_Threejs/model/ice/textures/Ice_Cube_occlusion.png');
    const icespecularMap = iceTextureLoader.load('Proyecto2_Threejs/model/ice/textures/Ice_Cube_specularGlossiness.png');
    const icediffuseMap = iceTextureLoader.load('Proyecto2_Threejs/model/ice/textures/Ice_Cube_diffuse.png');

    // Material para el hielo
    const materialIce = new THREE.MeshPhongMaterial({
        color: 0xa2cef2, // Color del material
        normalMap: icenormalMap, // Mapa de normales
        aoMap: iceocclusionMap, // Mapa de oclusión
        specularMap: icespecularMap, // Mapa de especular
        diffuseMap: icediffuseMap // Mapa de difusión
    });

    // Modelo del hielo
    const iceLoader = new GLTFLoader();
    iceLoader.load('Proyecto2_Threejs/model/ice/ice_cube.glb', (gltf) => {
        const ice = gltf.scene;
        ice.scale.set(2, 0.5, 3.5);
        ice.position.set(80, -65, -10);
        ice.rotation.set(0, 0, 0);

        ice.traverse(function(child) {
            if (child.isMesh) {
                child.material = materialIce;
            }
        });

        scene.add(ice);
    });

    // Configuración de las partículas
    let snowflake = new THREE.PointsMaterial({
        color: 0xffffff, // Color blanco
        size: 5.0, // Tamaño de las partículas
        transparent: true, // Permite la transparencia
        opacity: 0.8, // Opacidad de las partículas
    });
  
    let snowparticleCount = 1000; // Cantidad de partículas
    let range = 3300; // Rango de coordenadas
    
    // Crear geometría de partículas y array de posiciones
    let snowparticles = new THREE.BufferGeometry();
    let snowpositions = new Float32Array(snowparticleCount * 3);
    
    // Generar posiciones aleatorias para las partículas
    for (let i = 0; i < snowparticleCount; i++) {
        snowpositions[i * 3] = Math.random() * range - range / 2; // Coordenada x
        snowpositions[i * 3 + 1] = Math.random() * range - range / 2; // Coordenada y
        snowpositions[i * 3 + 2] = Math.random() * range - range / 2; // Coordenada z
    }
  
    // Añadir los datos de posición a la geometría
    snowparticles.setAttribute('position', new THREE.BufferAttribute(snowpositions, 3));
    
    // Crear sistema de partículas
    let snowparticleSystem = new THREE.Points(snowparticles, snowflake);
    scene.add(snowparticleSystem);
    
    // Función para animar las partículas
    function animateParticles() {
        requestAnimationFrame(animateParticles);
    
        let positions = snowparticles.getAttribute('position').array;
    
        for (let i = 0; i < snowparticleCount; i++) {
            let y = positions[i * 3 + 1];
            
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
    const light = new THREE.AmbientLight( 0x666666 );
    light.position.set( 0, 1500, 0 );
    light.castShadow = true;
    scene.add( light );

    // Luz tenue lunar
    const sunlight = new THREE.DirectionalLight( 0x101010 );
    sunlight.position.set( 0, 500, 500 );
    sunlight.castShadow = true;
    sunlight.target.position.set( 140, 5, 15 );
    scene.add( sunlight );

    // Luz emitida por el pez
    const fishlight = new THREE.PointLight( 0xffffee, 1, 250 );
    fishlight.position.set( 142, 60, 160 );
    fishlight.castShadow = true;
    fishlight.intensity = 0.35;
    scene.add( fishlight );

    // Luz de lampara desde el iglu
    const igloolamp = new THREE.SpotLight( 0xdc672e, 1, 400, Math.PI / 5.5 );
    igloolamp.position.set( 500 - 15, 20, -450 + 50 );
    scene.add( igloolamp.target );
    igloolamp.target.position.set( 500 - 15, 20, 0 );
    igloolamp.castShadow = true;
    scene.add( igloolamp );

    // Luz de lampara desde la bandera al suelo
    const flaglight = new THREE.SpotLight( 0x86a6bf, 1, 0, Math.PI / 5.5 );
    flaglight.position.set( -400, 150, 580 );
    scene.add( flaglight.target );
    flaglight.target.position.set( -400, 50, 580 );
    flaglight.castShadow = true;
    flaglight.intensity = 0.15;
    scene.add( flaglight );

}


function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // renderer.render(scene, camera);
    composer.render();
}

