import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const modelPath = join(__dirname, 'public', 'models', 'pumpsquare-pump.glb');

const loader = new GLTFLoader();

const buffer = readFileSync(modelPath);
const blob = new Blob([buffer], { type: 'model/gltf-binary' });
const url = URL.createObjectURL(blob);

loader.load(url, (gltf) => {
  const scene = gltf.scene;
  
  console.log('=== MODEL STRUCTURE ===');
  scene.traverse((child) => {
    if (child.isMesh) {
      console.log(`\nMesh: ${child.name || 'unnamed'}`);
      console.log(`  Geometry: ${child.geometry.type}`);
      console.log(`  Vertices: ${child.geometry.attributes.position?.count || 0}`);
      console.log(`  Material: ${child.material.type}`);
      if (child.material.map) console.log(`  Map: ${child.material.map.image?.width}x${child.material.map.image?.height}`);
      if (child.material.color) console.log(`  Color: #${child.material.color.getHexString()}`);
      if (child.material.metalness !== undefined) console.log(`  Metalness: ${child.material.metalness}`);
      if (child.material.roughness !== undefined) console.log(`  Roughness: ${child.material.roughness}`);
    }
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  console.log('\n=== BOUNDING BOX ===');
  console.log(`Min: (${box.min.x.toFixed(3)}, ${box.min.y.toFixed(3)}, ${box.min.z.toFixed(3)})`);
  console.log(`Max: (${box.max.x.toFixed(3)}, ${box.max.y.toFixed(3)}, ${box.max.z.toFixed(3)})`);
  console.log(`Size: (${size.x.toFixed(3)}, ${size.y.toFixed(3)}, ${size.z.toFixed(3)})`);
  console.log(`Center: (${center.x.toFixed(3)}, ${center.y.toFixed(3)}, ${center.z.toFixed(3)})`);
  
  const maxDim = Math.max(size.x, size.y, size.z);
  console.log(`\nMax dimension: ${maxDim.toFixed(3)}`);
  console.log(`Suggested scale for 2 unit size: ${(2 / maxDim).toFixed(3)}`);
  
  URL.revokeObjectURL(url);
  process.exit(0);
}, undefined, (error) => {
  console.error('Error loading model:', error);
  URL.revokeObjectURL(url);
  process.exit(1);
});