// 3d
const canvas = document.getElementById("webgl");

const scene = new THREE.Scene();

let mouseX = 0,
  mouseY = 0,
  windowHalfX = window.innerWidth / 2,
  windowHalfY = window.innerHeight / 2;
const spheres = [];

document.addEventListener("mousemove", onDocumentMouseMove);

const geometry = new THREE.TetrahedronGeometry(3);
const material = new THREE.MeshPhongMaterial({
  specular: 0x333333,
  shininess: 100,
  combine: THREE.MixOperation,
  reflectivity: 0.4,
});

var light1 = new THREE.DirectionalLight(0x7342d6, 1.5);
light1.position.set(0, 0, 100);
scene.add(light1);

const loader = new GLTFLoader();

loader.load(
  boatModel,
  function (gltf) {
    gltf.scene.position.y = 90;
    scene.add(gltf.scene);
    renderer.render(scene, camera);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// const meshT = {
//   triangles: 1,
// };

// for (let i = 0; i < meshT.triangles; i++) {
//   const meshScale = 1;
//   const mesh = new THREE.Mesh(geometry, material);

//   mesh.position.x = Math.random();
//   mesh.position.y = Math.random();
//   mesh.position.z = Math.random();
//   mesh.scale.set(meshScale, meshScale, meshScale);

//   scene.add(mesh);

//   spheres.push(mesh);
// }

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setViewport(1280, 0, 500, 900);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 25;
scene.add(camera);

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 100;
  mouseY = (event.clientY - windowHalfY) / 100;
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const timer = 0.0001 * Date.now();

  // camera.position.x += (mouseX - camera.position.x) * 0.1;
  // camera.position.y += (-mouseY - camera.position.y) * 0.1;

  camera.lookAt(scene.position);

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
