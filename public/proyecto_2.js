import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './jsm/postprocessing/RenderPass.js';
import { OutlinePass } from './jsm/postprocessing/OutlinePass.js';

var camera, scene, renderer, controls, composer;
var moon, stars, rose, fox, prince, earth, arbol1, arbol2, arbol3, plane, venus, crown, selectedObjects;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1 , 1000);
  camera.position.set(0,1, 20);
  

  window.camera = camera;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);

  var moonGeom = new THREE.SphereGeometry(6, 32, 32);
  var moonMat = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/luna.jpg') });
  moon = new THREE.Mesh(moonGeom, moonMat);
  scene.add(moon);

  var earthGeom = new THREE.SphereGeometry(4, 32, 32);
  var earthMat = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/earth.jpg') });
  earth = new THREE.Mesh(earthGeom, earthMat);
  earth.position.set(15, 10, -18);
  scene.add(earth);

  var venusGeom = new THREE.SphereGeometry(3, 32, 32);
  var venusMat = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/venus.jpg') });
  venus = new THREE.Mesh(venusGeom, venusMat);
  venus.position.set(-7, 25, -35);
  scene.add(venus);

  var groundGeom = new THREE.SphereGeometry(2, 32, 32);
  var groundMat = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/ground.jpg') });
  var ground = new THREE.Mesh(groundGeom, groundMat);
  ground.position.set(-15, 5, -10);
  scene.add(ground);

  // Crear una luz puntual de la avion
  var SpotLight = new THREE.SpotLight(0xffffff, 5, 50); // Color blanco, intensidad 1, distancia máxima de 10 unidades
  SpotLight.position.set(15, 14, -18);
  SpotLight.intensity = 2;
  SpotLight.angle = Math.PI / 1;
  scene.add(SpotLight);

  // Crear las estrellas como partículas
  var starCount = 2000;
  var starGeometry = new THREE.BufferGeometry();
  var starPositions = [];

  for (var i = 0; i < starCount; i++) {
    var x = THREE.MathUtils.randFloatSpread(300);
    var y = THREE.MathUtils.randFloatSpread(300);
    var z = THREE.MathUtils.randFloatSpread(300);

    starPositions.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  var starTexture = new THREE.TextureLoader().load('textures/star.png');
  var starMaterial = new THREE.PointsMaterial({ map: starTexture, size: 4, transparent: true });
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);


   // Crear el skybox
  var skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);

  var textureLoader = new THREE.TextureLoader();
  var skyboxMaterials = [
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/front.png'), side: THREE.BackSide }), // Frente
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/back.png'), side: THREE.BackSide }), // Atrás
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/up.png'), side: THREE.BackSide }), // Arriba
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/down.png'), side: THREE.BackSide }), // Abajo
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/right.png'), side: THREE.BackSide }), // Derecha
    new THREE.MeshPhongMaterial({ map: textureLoader.load('textures/hdri/left.png'), side: THREE.BackSide }), // Izquierda
  ];

  var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
  scene.add(skybox);

  // Cargar archivo GLTF
  var loader = new GLTFLoader();
  // Cargar la rosa
  loader.load('textures/modelo/rosa/scene.gltf', function (gltf) {
    rose = gltf.scene;
    scene.add(rose);

    // Recorrer los materiales de la rosa y asignar las texturas
    rose.traverse(function (node) {
      if (node.isMesh) {
        if (node.name === 'base') {
          // Asignar textura a la base
          node.material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/modelo/rosa/Textures/Rosejar_MAT_metallicRoughness.png') });
        } else if (node.name === 'rosa') {
          // Asignar textura a la rosa
          node.material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/modelo/rosa/Textures/Rosejar_MAT_baseColor.png') });
        }
      }
    });

    // Ajustar la posición y escala de la rosa
    rose.rotation.set(THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(10)); // Rotar 
    rose.position.set(-1.5, 5, 2); // Colocar en la parte superior de la luna
    rose.scale.set(30, 30, 30); // Ajustar la escala según sea necesario

    // Crear la luz de la rosa
    var roseLight = new THREE.PointLight(0xffd700, 1.5, 10);
    roseLight.position.copy(rose.position); // Establece la posición de la rosa como la posición de la luz
    scene.add(roseLight);

    // crear segundo punto de luz
    var roseLight2 = new THREE.PointLight(0xEC48FF, 1, 5);
    roseLight2.position.set(-1.5, 7, 3); // Establece la posición de la rosa como la posición de la luz
    scene.add(roseLight2);

  });
// Cargar el zorro
loader.load('textures/modelo/zorro.gltf', function (gltf) {
  fox = gltf.scene;
  scene.add(fox);

  // Ajustar la posición y escala del zorro
  fox.rotation.set(THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(20)); // Rotar 
  fox.position.set(2, 5.3, 2); // Colocar en una posición específica
  fox.scale.set(0.50, 0.50, 0.50); // Ajustar la escala según sea necesario
  });
  // Cargar el Príncipe
  loader.load('textures/modelo/principito.gltf', function (gltf) {
    prince = gltf.scene;
    scene.add(prince);

    // Ajustar la posición y escala del Príncipe
    prince.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(180), 0); // Rotar 
    prince.position.set(0, 4.8, 4); // Colocar en una posición específica
    prince.scale.set(0.65, 0.65, 0.65); // Ajustar la escala según sea necesario
    // Asignar color al Príncipe
    
  });

  loader.load('textures/modelo/arbol.gltf', function (gltf) {
    arbol1 = gltf.scene;
    scene.add(arbol1);

    // Ajustar la posición y escala del arbol
    arbol1.rotation.set(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-90)); // Rotar 
    arbol1.position.set(-16.8, 5, -10); // Colocar en una posición específica
    arbol1.scale.set(0.25, 0.25, 0.25); // Ajustar la escala según sea necesario

    var arbol1Light = new THREE.PointLight(0xffd700, 2, 10);
    arbol1Light.position.copy(arbol1.position); // Establece la posición de la rosa como la posición de la luz
    scene.add(arbol1Light);

  });

  loader.load('textures/modelo/arbol.gltf', function (gltf) {
    arbol2 = gltf.scene;
    scene.add(arbol2);

    // Ajustar la posición y escala del arbol
    arbol2.rotation.set(THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(-180), THREE.MathUtils.degToRad(90)); // Rotar 
    arbol2.position.set(-13.2, 5, -10); // Colocar en una posición específica
    arbol2.scale.set(0.25, 0.25, 0.25); // Ajustar la escala según sea necesario

    var arbol2Light = new THREE.PointLight(0xECBA5C, 2, 10);
    arbol2Light.position.copy(arbol2.position);
    scene.add(arbol2Light);
  });

  loader.load('textures/modelo/arbol.gltf', function (gltf) {
    arbol3 = gltf.scene;
    scene.add(arbol3);

    // Ajustar la posición y escala del arbol
    arbol3.rotation.set(0, THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(20)); // Rotar 
    arbol3.position.set(-15, 6.6, -10.5); // Colocar en una posición específica
    arbol3.scale.set(0.25, 0.25, 0.25); // Ajustar la escala según sea necesario

  });

  // Cargar el avion
  loader.load('textures/modelo/plane/scene.gltf', function (gltf) {
    plane = gltf.scene;
    
    scene.add(plane);

    // Recorrer los materiales de la rosa y asignar las texturas
    plane.traverse(function (node) {
      if (node.isMesh) {
        if (node.name === 'base') {
          // Asignar textura a la base
          node.material = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('textures/modelo/plane/textures/material_baseColor.png') });
        } 
      }
    });

    // Ajustar la posición y escala de la rosa
    plane.rotation.set(THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(-90), 0); // Rotar 
    plane.scale.set(0.80, 0.80, 0.80); // Ajustar la escala según sea necesario
  });

  // Cargar la corona
  loader.load('textures/modelo/corona/scene.gltf', function (gltf) {
    crown = gltf.scene;
    scene.add(crown);
    
    // Ajustar la posición y escala de la corona
    crown.rotation.set(0, 0, 0); // Rotar 
    crown.position.set(-7, 28.2, -35); // Colocar en una posición específica
    crown.scale.set(0.20, 0.20, 0.20); // Ajustar la escala según sea necesario
  });

  // Crear una luz puntual
  var pointLight1 = new THREE.PointLight(0xffd700, 1, 10); // Color dorado, intensidad 1, distancia máxima de 10 unidades
  pointLight1.position.set(-7, 28.2, -35); // Posición de la corona

  // Agregar la luz puntual a la escena
  scene.add(pointLight1);

  //objetos a resaltar
  selectedObjects = [moon, earth, venus, ground];

  // Crear el efecto de resaltado
  var outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
  outlinePass.visibleEdgeColor.set(0xffffff);
  outlinePass.hiddenEdgeColor.set(0xffffff);
  outlinePass.edgeThickness = 2;

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(outlinePass);

  // Evento de detección de interacción con el mouse
  document.addEventListener('mousemove', onMouseMove);

  animate();
}

function onMouseMove(event) {
  var mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(selectedObjects, true);

  if (intersects.length > 0) {
    var object = intersects[0].object;

    // Resaltar el objeto
    composer.passes[1].selectedObjects = [object];
  } else {
    // Desactivar el resaltado
    composer.passes[1].selectedObjects = [];
  }
}


function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;

  var earthPosition = earth.position;  
  var planeRadius = 6.50;
  var planeSpeed = 0.0005;
  var planeAngle = Date.now() * planeSpeed;
  var planeX = Math.cos(planeAngle) * planeRadius + earthPosition.x;
  var planeZ = Math.sin(planeAngle) * planeRadius + earthPosition.z;
  plane.position.set(planeX, 12.5, planeZ);
  plane.lookAt(earth.position);
  camera.lookAt(prince.position);

  renderer.render(scene, camera);
  controls.update();
  composer.render();
  
}



