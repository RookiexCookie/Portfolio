// ==========================================
// 1. SYSTEM INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Lock scrolling immediately
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // 2. Start Systems
    initThreeBackground(); 
    loadContent();
    simulateLoading();
});

function simulateLoading() {
    const bar = document.getElementById('splash-bar');
    const percent = document.getElementById('splash-percent');
    const screen = document.getElementById('splash-screen');

    let width = 0;
    // Loading speed
    const interval = setInterval(() => {
        width += Math.random() * 4; // Random increments
        if (width > 100) width = 100;
        
        if(bar) bar.style.width = width + '%';
        if(percent) percent.innerText = Math.floor(width) + '%';

        if (width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if(screen) {
                    screen.classList.add('fade-out'); // CSS Fade out
                    
                    setTimeout(() => {
                        screen.style.display = 'none'; 
                        
                        // 3. Unlock scrolling & Reset to Top
                        document.body.style.overflow = ''; 
                        window.scrollTo(0, 0);
                        
                        // 4. Start Hero Text
                        initTypewriterSequence(); 
                    }, 1000);
                }
            }, 500);
        }
    }, 40);
}

function initTypewriterSequence() {
    typeWriter('hero-greeting', CONFIG.hero.greeting, 0);
    typeWriter('hero-name', CONFIG.hero.name, 1000);
    typeWriter('hero-role', CONFIG.hero.role, 2000);
    typeWriter('hero-desc', CONFIG.hero.description, 3500, 10);
    
    setTimeout(() => {
        const cta = document.getElementById('hero-cta-container');
        if(cta) {
            cta.classList.remove('opacity-0');
            cta.classList.add('active'); 
        }
    }, 5500);
}

// ==========================================
// 2. DATA LOADING & DOM LOGIC
// ==========================================
function loadContent() {
    // Brand
    const brand = document.getElementById('brand');
    if(brand) brand.innerText = CONFIG.brand;

    // About
    const aboutDiv = document.getElementById('about-content');
    if(aboutDiv) CONFIG.about.text.forEach(p => aboutDiv.innerHTML += `<p>${p}</p>`);

    const skillsDiv = document.getElementById('skills-list');
    if(skillsDiv) CONFIG.about.skills.forEach(skill => {
        skillsDiv.innerHTML += `<span class="px-4 py-2 border border-white/10 rounded text-xs text-slate-300 hover:border-accent hover:text-accent transition-colors cursor-default">${skill}</span>`;
    });

    const statsDiv = document.getElementById('stats-container');
    if(statsDiv) CONFIG.about.stats.forEach(stat => {
        statsDiv.innerHTML += `
            <div class="glass p-6 rounded-lg border-l-4 border-transparent hover:border-accent transition-all group">
                <h3 class="text-2xl font-bold text-white group-hover:text-accent">${stat.value}</h3>
                <p class="text-xs uppercase tracking-widest text-slate-500">${stat.label}</p>
            </div>
        `;
    });

    // Projects
    const projectGrid = document.getElementById('projects-grid');
    const viewMoreBtn = document.getElementById('view-more-btn');
    const viewMoreContainer = document.getElementById('view-more-container');

    if(projectGrid) {
        CONFIG.projects.forEach((proj, index) => {
            const isHidden = index >= 3 ? 'hidden' : ''; 
            const tags = proj.tags.map(t => `<span class="text-[10px] text-accent border border-accent/20 px-2 py-1 rounded-full">${t}</span>`).join('');
            
            const html = `
                <div class="glass rounded-2xl project-card overflow-hidden group flex flex-col h-full ${isHidden} project-item">
                    <div class="project-image-wrapper h-48 md:h-64 w-full bg-slate-900">
                        <img src="${proj.image}" alt="${proj.title}" class="project-img w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <a href="${proj.github}" class="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"><i class="fab fa-github"></i></a>
                            <a href="${proj.link}" class="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"><i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">${proj.title}</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">${proj.description}</p>
                        <div class="flex gap-2 flex-wrap pt-4 border-t border-white/5">
                            ${tags}
                        </div>
                    </div>
                </div>
            `;
            projectGrid.innerHTML += html;
        });
    }

    if (viewMoreContainer && CONFIG.projects.length > 3) {
        viewMoreContainer.classList.remove('hidden');
        viewMoreBtn.addEventListener('click', () => {
            const hiddenItems = document.querySelectorAll('.project-item.hidden');
            hiddenItems.forEach(item => {
                item.classList.remove('hidden');
                item.classList.add('reveal', 'active');
            });
            viewMoreContainer.classList.add('hidden');
        });
    }

    // Contact
    const emailLink = document.getElementById('email-link');
    if(emailLink) {
        emailLink.innerText = CONFIG.contact.email;
        emailLink.href = `mailto:${CONFIG.contact.email}`;
    }
    const socialDiv = document.getElementById('social-links');
    if(socialDiv) CONFIG.contact.socials.forEach(s => {
        socialDiv.innerHTML += `<a href="${s.url}" class="text-2xl text-slate-500 hover:text-white hover:-translate-y-2 transition-transform"><i class="${s.icon}"></i></a>`;
    });

    initScrollObserver();
}

// Helper: Typewriter
function typeWriter(elementId, text, startDelay = 0, speed = 50) {
    const element = document.getElementById(elementId);
    if(!element) return;
    
    element.innerHTML = ""; 
    element.classList.add('typing-cursor'); 

    setTimeout(() => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if(elementId !== 'hero-desc') {
                    element.classList.remove('typing-cursor');
                }
            }
        }
        type();
    }, startDelay);
}

// Helper: Observer
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    const progressBar = document.getElementById('progress-bar');
    if(progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// ==========================================
// 3. THREE.JS BACKGROUND (Infinite + No Popping)
// ==========================================
function initThreeBackground() {
    const container = document.getElementById('canvas-container');
    while(container.firstChild) container.removeChild(container.firstChild);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002); 

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; 

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- STARS ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 7000;
    const starPos = new Float32Array(starCount * 3);
    const area = 800; 
    const depth = 100; 

    for(let i=0; i<starCount*3; i+=3) {
        starPos[i] = (Math.random() - 0.5) * area;   
        starPos[i+1] = (Math.random() - 0.5) * area; 
        starPos[i+2] = (Math.random() - 0.5) * depth;     
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0xffffff, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // --- SHAPES ---
    const shapesGroup = new THREE.Group();
    const geometry = new THREE.IcosahedronGeometry(2, 0); 
    
    // Use individual objects so we can fade them individually
    const shapeObjects = [];
    const shapeCount = 15; // Sparse

    for (let i = 0; i < shapeCount; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF, 
            wireframe: true, 
            transparent: true, 
            opacity: 0 // Start INVISIBLE
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 200, // Wider X spread (200)
            (Math.random() - 0.5) * 120, // Wider Y spread (120)
            camera.position.z - (20 + Math.random() * 150)
        );
        mesh.scale.setScalar(Math.random() * 2 + 1);
        
        mesh.userData = {
            rotX: (Math.random() - 0.5) * 0.01,
            rotY: (Math.random() - 0.5) * 0.01,
        };
        
        shapesGroup.add(mesh);
        shapeObjects.push(mesh);
    }
    scene.add(shapesGroup);

    // Input Logic
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
    });

    const clock = new THREE.Clock();
    const autoSpeed = 0.02;     
    const scrollFactor = 0.03; 

    // Smooth Materialization Logic
    const spawnDistance = 120; // Distance where object respawns (invisible)
    const fadeStart = 100;     // Distance where it STARTS becoming visible
    const fadeEnd = 70;        // Distance where it is fully visible
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        const scrollY = window.scrollY;
        // Camera moves deeper into negative Z
        const zoomOffset = (clock.getElapsedTime() * autoSpeed) + (scrollY * scrollFactor);
        camera.position.z = 5 - zoomOffset;

        // Parallax
        camera.rotation.y += 0.05 * ((mouseX * 2) - camera.rotation.y);
        camera.rotation.x += 0.05 * ((mouseY * 2) - camera.rotation.x);
        
        // Star Loop
        const sPos = starGeo.attributes.position.array;
        const recycleZStars = camera.position.z - depth; 
        for(let i=2; i<starCount*3; i+=3) {
            if(sPos[i] > camera.position.z) {
                sPos[i] = recycleZStars - (Math.random() * 50); 
                sPos[i-2] = (Math.random() - 0.5) * area;
                sPos[i-1] = (Math.random() - 0.5) * area;
            }
        }
        starGeo.attributes.position.needsUpdate = true;

        // Shape Loop (Fade In logic)
        shapeObjects.forEach(mesh => {
            mesh.rotation.x += mesh.userData.rotX;
            mesh.rotation.y += mesh.userData.rotY;

            // Distance from camera (Absolute value)
            const dist = Math.abs(mesh.position.z - camera.position.z);

            // 1. Respawn if behind camera
            if(mesh.position.z > camera.position.z + 5) {
                mesh.position.z = camera.position.z - spawnDistance; 
                mesh.position.x = (Math.random() - 0.5) * 200; // MATCH INITIAL X SPREAD
                mesh.position.y = (Math.random() - 0.5) * 120; // MATCH INITIAL Y SPREAD
                mesh.material.opacity = 0; 
            }
            // 2. Fade Logic
            // If very far (dist > 100) -> Opacity 0
            // If approaching (100 > dist > 60) -> Fade 0 to 0.4
            // If close (60 > dist > 10) -> Opacity 0.4
            // If hitting camera (dist < 10) -> Fade out
            
            if (dist > fadeStart) {
                mesh.material.opacity = 0;
            } 
            else if (dist <= fadeStart && dist > fadeEnd) {
                // Map range [100, 60] to opacity [0, 0.4]
                const n = (fadeStart - dist) / (fadeStart - fadeEnd);
                mesh.material.opacity = n * 0.1;
            } 
            else if (dist <= fadeEnd && dist > 10) {
                mesh.material.opacity = 0.1;
            }
            else if (dist <= 10) {
                mesh.material.opacity = (dist / 10) * 0.2;
            }
        });

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}