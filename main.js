import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const donut_geo = new THREE.TorusGeometry(8, 2.5, 16, 100);
const donut_tex = new THREE.MeshBasicMaterial({ color: 0xffffff });
const donut = new THREE.Mesh(donut_geo, donut_tex);
scene.add(donut);

function add_star() {
    const star_geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const star_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(star_geometry, star_material);

    const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(200));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(add_star);

// UV Mapping Texture on Pyramid stuff (I hate myself)
const positions = [
    0, 1, 0,
    -1, -1, 1,
    1, -1, 1,

    0, 1, 0,
    1, -1, 1,
    1, -1, -1,

    0, 1, 0,
    1, -1, -1,
    -1, -1, -1,

    0, 1, 0,
    -1, -1, -1,
    -1, -1, 1,

    -1, -1, 1,
    1, -1, 1,
    1, -1, -1,
    -1, -1, 1,
    1, -1, -1,
    -1, -1, -1,
];

const uvs = [
    0.5, 0,
    0, 1,
    1, 1,

    0.5, 0,
    0, 1,
    1, 1,

    0.5, 0,
    0, 1,
    1, 1,

    0.5, 0,
    0, 1,
    1, 1,

    0, 0,
    1, 0,
    1, 1,
    0, 0,
    1, 1,
    0, 1,
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
geometry.computeVertexNormals();

const texture = new THREE.TextureLoader().load('/textures/obamium_baseColor.png', (tex) => {
    tex.flipY = true;
    tex.colorSpace = THREE.SRGBColorSpace;
});



const material = new THREE.MeshBasicMaterial({ color: 0x6a4a3a, map: texture, side: THREE.DoubleSide });
const pyramid = new THREE.Mesh(geometry, material);
scene.add(pyramid);

camera.position.setZ(10);

function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    const targetZ = THREE.MathUtils.clamp(10 + t * -0.01, 12, 60);
    camera.position.z = targetZ;
    pyramid.rotation.y += 0.005;
    pyramid.rotation.z += 0.005;

    const scroll = -t;
    const hue = ((scroll * 0.001) % 1 + 1) % 1;
    donut_tex.color.setHSL(hue, 0.7, 0.55);

}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
    donut.rotation.x += 0.01;
    donut.rotation.y += 0.01;
    pyramid.rotation.y += 0.015;
    pyramid.rotation.z += 0.015;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
