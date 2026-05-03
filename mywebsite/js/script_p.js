/*3D Model*/
(function initModel() {
  const canvas = document.getElementById('model-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.clientWidth || 800;
  const H = canvas.clientHeight || 420;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 1, 6);
  camera.lookAt(0, 0, 0);

  /* Lights */
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(6, 10, 6);
  scene.add(dirLight);

  const accentLight = new THREE.DirectionalLight(0x7F77DD, 0.6);
  accentLight.position.set(-6, -4, -4);
  scene.add(accentLight);

  const greenLight = new THREE.DirectionalLight(0x1D9E75, 0.5);
  greenLight.position.set(0, -8, 4);
  scene.add(greenLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  /* Materials */
  const matGreen  = new THREE.MeshPhongMaterial({ color: 0x1D9E75, shininess: 90 });
  const matPurple = new THREE.MeshPhongMaterial({ color: 0x7F77DD, shininess: 100 });
  const matBlue   = new THREE.MeshPhongMaterial({ color: 0x378ADD, shininess: 70 });
  const matScreen = new THREE.MeshPhongMaterial({ color: 0xd4eaf7, shininess: 30 });
  const matDark   = new THREE.MeshPhongMaterial({ color: 0x14141a, shininess: 40 });

  const group = new THREE.Group();

  /*Phone*/
  const phone = new THREE.Group();

  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.6, 0.14), matDark);
  phone.add(phoneBody);

  const phoneScreen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.01), matScreen);
  phoneScreen.position.z = 0.075;
  phone.add(phoneScreen);

  /* UI bars_phone */
  const barColors = [matGreen, matPurple, matBlue, matGreen];
  const barWidths = [0.9, 0.6, 0.75, 0.5];
  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(barWidths[i], 0.11, 0.015), barColors[i]);
    bar.position.set((barWidths[i] - 0.9) / 2 - 0.0, 0.65 - i * 0.32, 0.082);
    phone.add(bar);
  }

  /* Home btn */
  const homeBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 32), matPurple);
  homeBtn.rotation.x = Math.PI / 2;
  homeBtn.position.set(0, -0.92, 0.08);
  phone.add(homeBtn);

  phone.position.set(-1.6, 0, 0);
  group.add(phone);

  /*Browser*/
  const laptop = new THREE.Group();

  /* Screen panel */
  const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.9, 0.08), matDark);
  laptop.add(screenFrame);

  const screenDisplay = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.65, 0.01), matScreen);
  screenDisplay.position.z = 0.045;
  laptop.add(screenDisplay);

  /* Browser chrome bar */
  const chromebar = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.18, 0.015), matDark);
  chromebar.position.set(0, 0.755, 0.046);
  laptop.add(chromebar);

  /* URL pill */
  const urlPill = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.012), new THREE.MeshPhongMaterial({ color: 0x2a2a32, shininess: 20 }));
  urlPill.position.set(0, 0.755, 0.053);
  laptop.add(urlPill);

  /* Content rows */
  const rowMats = [matBlue, matGreen, matPurple, matBlue, matGreen];
  const rowW    = [2.0, 1.3, 1.7, 1.0, 1.5];
  for (let i = 0; i < 5; i++) {
    const row = new THREE.Mesh(new THREE.BoxGeometry(rowW[i], 0.095, 0.014), rowMats[i]);
    row.position.set(-(2.55 - rowW[i]) / 2 + 0.1, 0.58 - i * 0.27, 0.055);
    laptop.add(row);
  }

  /* Base */
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 1.8), matDark);
  base.rotation.x = Math.PI / 2;
  base.position.set(0, -1.02, 0.9);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 16), matDark);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, -0.97, 0);
  laptop.add(hinge);

  laptop.rotation.x = -0.15;
  laptop.position.set(1.4, 0.2, -0.3);
  group.add(laptop);

  scene.add(group);

  /*Interaction */
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let rotY = 0.3, rotX = -0.1;
  let scale = 1;
  let autoRotate = true;

  canvas.addEventListener('mousedown', e => {
    isDragging = true; autoRotate = false;
    prevX = e.clientX; prevY = e.clientY;
  });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotY += (e.clientX - prevX) * 0.008;
    rotX += (e.clientY - prevY) * 0.008;
    rotX = Math.max(-0.6, Math.min(0.6, rotX));
    prevX = e.clientX; prevY = e.clientY;
  });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    scale = Math.min(1.8, Math.max(0.4, scale - e.deltaY * 0.001));
  }, { passive: false });

  canvas.addEventListener('touchstart', e => {
    isDragging = true; autoRotate = false;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  });
  canvas.addEventListener('touchend', () => { isDragging = false; });
  canvas.addEventListener('touchmove', e => {
    if (!isDragging) return;
    rotY += (e.touches[0].clientX - prevX) * 0.008;
    rotX += (e.touches[0].clientY - prevY) * 0.008;
    prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  });

  /* Resize*/
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  onResize();

  /* Animate */
  function animate() {
    requestAnimationFrame(animate);
    if (autoRotate) rotY += 0.004;
    group.rotation.y = rotY;
    group.rotation.x = rotX;
    group.scale.setScalar(scale);
    renderer.render(scene, camera);
  }
  animate();
})();


/*Animated Counters*/
(function initCounters() {
  const suffixes = { 300: '$', 88: '%', 200: '%' };

  const counters = document.querySelectorAll('.stat__num');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = suffixes[target] || '';
      const duration = 1800;
      const step     = 16;
      const steps    = Math.round(duration / step);
      let current    = 0;

      el.setAttribute('data-suffix', suffix);

      const timer = setInterval(() => {
        current += Math.ceil(target / steps);
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, step);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();
