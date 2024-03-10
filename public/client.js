import * as THREE from 'three';
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 2
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

//luces
const light1 = new THREE.PointLight(0x404040)
light1.position.z = 20
scene.add(light1)

const light2 = new THREE.PointLight(0x404040)
light2.position.z = 40
scene.add(light2)

const geometry1 = new THREE.CylinderGeometry( 5, 5, 20, 32 )
const material1 = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    wireframe: false,
})
const geometry2 = new THREE.CylinderGeometry( 5, 5, 20, 32 )
const material2 = new THREE.MeshBasicMaterial({
    color: 0x1230f5,
    wireframe: false,
})
const geometry3 = new THREE.CylinderGeometry( 5, 5, 20, 32 )
const material3 = new THREE.MeshPhongMaterial({
    color: 0x43FF21,
    wireframe: false,
})
const cylinder1 = new THREE.Mesh(geometry1, material1)
scene.add(cylinder1)

const cylinder2 = new THREE.Mesh(geometry2, material2)
cylinder2.position.x = -15
scene.add(cylinder2)

const cylinder3 = new THREE.Mesh(geometry3, material3)
cylinder2.position.x = 30
scene.add(cylinder3)

window. addEventListener(
    'resize',
    () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        render()
    },
    false
)
const stats = Stats()
document.body.appendChild(stats.dom)
    
const gui = new GUI()
    
const cylinderFolder = gui.addFolder('Cylinder')
cylinderFolder.add(cylinder1.scale, 'x', -5, 5)
cylinderFolder.add(cylinder1.scale, 'y', -5, 5)
cylinderFolder.add(cylinder1.scale, 'z', -5, 5)
cylinderFolder.open()   
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.open()
function animate() {
    requestAnimationFrame(animate)
    //cylinder.rotation.x += 0.01
    //cylinder.rotation.y += 0.01
    controls.update()
    render()
    stats.update()
}
    
function render() {
    renderer.render(scene, camera)
}
animate ()