import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ThreeDAnimation = () => {
    const mountRef = useRef(null);

  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true,alpha: true });
    renderer.setSize(window.innerWidth/2, window.innerHeight);

    // Set background color
    renderer.setClearColor(0x000000, 0); // Tailwind's bg-gray-100 color

    mountRef.current.appendChild(renderer.domElement);

    // Create particle system
    const numParticles = 500;
    const radius = 2.3; // Radius of the circle
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const blue600 = new THREE.Color('#2563EB');

    for (let i = 0; i < numParticles; i++) {
      // Angle for circular placement
      const angle = Math.random() * Math.PI * 2;  // Half circle
      const r = Math.sqrt(Math.random()) * radius
      // Calculate position
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = radius * Math.sin(angle);
      positions[i * 3 + 2] = Math.random() * 2 - 1; // Depth randomness

      // Random color
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = blue600.g;
      colors[i * 3 + 2] = blue600.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true // Use vertex colors
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the particle system for some animation
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth/2, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return( <div className="relative w-full h-screen bg-black">
  <div ref={mountRef} className="absolute inset-0" />
</div>
  );
}
export default ThreeDAnimation;
