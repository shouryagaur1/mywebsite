// Placeholder for future JS functionality 

// Starfield with zooming effect
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let stars = [];
const numStars = 200;
let width = window.innerWidth;
let height = window.innerHeight;
let starAnimationId = null;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function createStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * width,
      o: 0.5 + Math.random() * 0.5
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  for (let star of stars) {
    // Perspective projection
    let k = 128.0 / star.z;
    let sx = (star.x - width / 2) * k + width / 2;
    let sy = (star.y - height / 2) * k + height / 2;
    if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;
    let size = (1 - star.z / width) * 2 + 1;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255,255,255,${star.o})`;
    ctx.fill();
  }
}

function animateStars() {
  for (let star of stars) {
    star.z -= 2; // Speed of zoom
    if (star.z < 1) {
      // Reset star to far distance, scattered
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      star.z = width;
      star.o = 0.5 + Math.random() * 0.5;
    }
  }
  drawStars();
  starAnimationId = requestAnimationFrame(animateStars);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  createStars();
  drawStars();
});

resizeCanvas();
createStars();
animateStars();

// Animated typing and deleting for the .highlight span (Shourya Gaur)
// const highlightSpan = document.querySelector('.highlight');
// const fullText = 'Shourya Gaur';
// let charIndex = 0;
// let isHighlightDeleting = false;

// function animateHighlight() {
//   if (!highlightSpan) return;
//   if (!isHighlightDeleting) {
//     highlightSpan.textContent = fullText.slice(0, charIndex + 1);
//     charIndex++;
//     if (charIndex === fullText.length) {
//       setTimeout(() => {
//         isHighlightDeleting = true;
//         animateHighlight();
//       }, 1000); // Pause before deleting
//       return;
//     }
//   } else {
//     highlightSpan.textContent = fullText.slice(0, charIndex - 1);
//     charIndex--;
//     if (charIndex === 0) {
//       setTimeout(() => {
//         isHighlightDeleting = false;
//         animateHighlight();
//       }, 400); // Pause before typing again
//       return;
//     }
//   }
//   setTimeout(animateHighlight, 200);
// }

// animateHighlight();

// Set highlight span to static text
const highlightSpan = document.querySelector('.highlight');
if (highlightSpan) highlightSpan.textContent = 'Shourya Gaur';

// --- Starfield Pause/Resume on Overview Section ---
const overviewSection = document.querySelector('.overview-section');
let starPaused = false;

function stopStarfield() {
  if (!starPaused) {
    cancelAnimationFrame(starAnimationId);
    starPaused = true;
  }
  canvas.style.display = 'none'; // Hide the starfield
}

function resumeStarfield() {
  if (starPaused) {
    starPaused = false;
    animateStars();
  }
  canvas.style.display = 'block'; // Show the starfield
}

if (overviewSection) {
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stopStarfield();
        } else {
          resumeStarfield();
        }
      });
    },
    {
      threshold: 0.3 // Adjust as needed for sensitivity
    }
  );
  observer.observe(overviewSection);
}

// Mouse movement effect for overview cards
const cards = document.querySelectorAll('.overview-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position relative to center
    const rotateX = (y - centerY) / 10; // Reduced divisor for more noticeable effect
    const rotateY = (centerX - x) / 10; // Reduced divisor for more noticeable effect
    
    // Apply the rotation
    card.style.setProperty('--rotate-x', `${rotateX}deg`);
    card.style.setProperty('--rotate-y', `${rotateY}deg`);
  });
  
  card.addEventListener('mouseleave', () => {
    // Reset rotation when mouse leaves
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  });
});

// Log social icon clicks
const socialLinks = [
  { selector: 'a[title="GitHub"]', name: 'GitHub' },
  { selector: 'a[title="LinkedIn"]', name: 'LinkedIn' },
  { selector: 'a[title="Facebook"]', name: 'Facebook' },
  { selector: 'a[title="LeetCode"]', name: 'LeetCode' },
  { selector: 'a[title="Twitter"]', name: 'Twitter' },
];
socialLinks.forEach(link => {
  const el = document.querySelector(link.selector);
  if (el) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(link.name);
    });
  }
});

const orbits = document.querySelectorAll('.poly-orbit');
const orbitRadius = 100; // px, adjust as needed
const orbitDuration = 16; // seconds for a full circle

orbits.forEach((orbit, i) => {
  const card = orbit.querySelector('.poly-card');
  let angle = (360 / orbits.length) * i;
  card.style.transform = `rotate(${angle}deg) translateX(${orbitRadius}px) rotate(-${angle}deg)`;
  card.style.transition = 'transform 0.2s';
});

let start = null;
function animateOrbit(ts) {
  if (!start) start = ts;
  const elapsed = (ts - start) / 1000; // seconds
  orbits.forEach((orbit, i) => {
    const card = orbit.querySelector('.poly-card');
    const baseAngle = (360 / orbits.length) * i;
    const angle = (baseAngle + (elapsed * 360 / orbitDuration)) % 360;
    card.style.transform = `rotate(${angle}deg) translateX(${orbitRadius}px) rotate(-${angle}deg)`;
  });
  requestAnimationFrame(animateOrbit);
}
requestAnimationFrame(animateOrbit);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101020);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(500, 500);
document.getElementById('earth-container').appendChild(renderer.domElement);

// Earth sphere
const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.MeshStandardMaterial({color: 0x2266ff, roughness: 0.7});
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Swirling bands (using Torus geometry for simplicity)
for (let i = 0; i < 8; i++) {
  const bandGeometry = new THREE.TorusGeometry(2.2 + 0.05*i, 0.08, 16, 100, Math.PI * 1.5);
  const bandMaterial = new THREE.MeshStandardMaterial({color: i % 2 === 0 ? 0xffc0cb : 0xadd8e6, transparent: true, opacity: 0.7});
  const band = new THREE.Mesh(bandGeometry, bandMaterial);
  band.rotation.x = Math.PI / 2 * Math.random();
  band.rotation.y = Math.PI / 4 * i;
  scene.add(band);
}

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

camera.position.z = 6;

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.003;
  scene.children.forEach((child, idx) => {
    if (idx > 1) child.rotation.z += 0.002 * (idx % 2 === 0 ? 1 : -1);
  });
  renderer.render(scene, camera);
}
animate();

// Resume download functionality
document.querySelector('a[href="../assets/full-satck resume (2).pdf"]').addEventListener('click', function(e) {
    e.preventDefault();
    const resumePath = '../assets/full-satck resume (2).pdf';
    const link = document.createElement('a');
    link.href = resumePath;
    link.download = 'Shourya_Gaur_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}); 