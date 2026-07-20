import { useEffect, useRef } from 'react';

export default function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dynamically load Three.js
    const script = document.createElement('script');
    script.src = 'https://ajax.googleapis.com/ajax/libs/threejs/r125/three.min.js';
    script.onload = () => {
      initScene(container);
    };
    document.head.appendChild(script);

    function initScene(container) {
      const THREE = window.THREE;
      if (!THREE) return;

      const scene = new THREE.Scene();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0x0D9488, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Factory Platform (Base)
      const baseGeo = new THREE.BoxGeometry(4, 0.2, 4);
      const baseMat = new THREE.MeshPhongMaterial({ color: 0x1e293b, transparent: true, opacity: 0.8 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      scene.add(base);

      // Animated Nodes
      const nodes = [];
      const nodeGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
      for (let i = 0; i < 5; i++) {
        const nodeMat = new THREE.MeshPhongMaterial({
          color: 0x3B82F6,
          emissive: 0x3B82F6,
          emissiveIntensity: 0,
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.x = (Math.random() - 0.5) * 3;
        node.position.z = (Math.random() - 0.5) * 3;
        node.position.y = 0.6;
        node.userData = { originalY: 0.6, phase: i };
        scene.add(node);
        nodes.push(node);
      }

      // Data flow lines
      const lineMat = new THREE.LineBasicMaterial({ color: 0x0D9488, transparent: true, opacity: 0.3 });
      const pulses = [];
      const pulseGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0x5EEAD4 });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const points = [nodes[i].position, nodes[j].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geometry, lineMat);
          scene.add(line);

          const pulse = new THREE.Mesh(pulseGeo, pulseMat);
          pulse.userData = {
            t: Math.random(),
            speed: 0.002 + Math.random() * 0.005,
            start: nodes[i],
            end: nodes[j],
          };
          scene.add(pulse);
          pulses.push(pulse);
        }
      }

      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);

      let animationId;
      function animate() {
        animationId = requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        nodes.forEach((node) => {
          const targetY = node.userData.originalY + Math.sin(time * 2 + node.userData.phase) * 0.2;
          node.position.y += (targetY - node.position.y) * 0.1;
          node.rotation.y += 0.01;
        });
        pulses.forEach((pulse) => {
          pulse.userData.t += pulse.userData.speed;
          if (pulse.userData.t > 1) pulse.userData.t = 0;
          pulse.position.lerpVectors(pulse.userData.start.position, pulse.userData.end.position, pulse.userData.t);
          pulse.scale.setScalar(0.8 + Math.sin(time * 10) * 0.2);
        });
        renderer.render(scene, camera);
      }

      const handleResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);
      animate();

      // Cleanup stored on container for unmount
      container._cleanup = () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    return () => {
      if (container._cleanup) container._cleanup();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
