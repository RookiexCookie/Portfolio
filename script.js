// ==========================================
// GLOBAL STATE MANAGERS
// ==========================================
const APP_STATE = {
    lenis: null,
    threeMaterials: { stars: null, shapes: [] },
    // Theme Config: More popular themes
    themes: ['default', 'rose-pine', 'gruvbox', 'dracula', 'nord', 'one-dark', 'catppuccin', 'tokyo-night'],
    currentThemeIndex: 0
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lock scrolling for Splash Screen
    document.body.style.overflow = 'hidden';
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // 2. Initialize Sub-systems
    initThreeBackground(); 
    loadContent();      
    initHeroText();     // Explicitly loads Name/Role cleanly
    initThemeToggle();  // New Cycling Logic
    initDock();         
    initDockProgress(); 
    initContactCard();  
    initClickSpark();   
    
    // 3. Start Loading Sequence
    simulateLoading();
});

// ==========================================
// 1. SPLASH SCREEN & LOADING
// ==========================================
function simulateLoading() {
    const bar = document.getElementById('splash-bar');
    const percent = document.getElementById('splash-percent');
    const screen = document.getElementById('splash-screen');

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 4; 
        if (width > 100) width = 100;
        
        if(bar) bar.style.width = width + '%';
        if(percent) percent.innerText = Math.floor(width) + '%';

        if (width === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if(screen) {
                    screen.classList.add('fade-out'); 
                    
                    initLenis(); // Start Smooth Scroll

                    setTimeout(() => {
                        screen.style.display = 'none'; 
                        document.body.style.overflow = ''; 
                        
                        initTypewriterSequence(); 
                        triggerInitialAnimations(); 
                    }, 1000);
                }
            }, 500);
        }
    }, 40);
}

// ==========================================
// 2. SMOOTH SCROLL (LENIS)
// ==========================================
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    APP_STATE.lenis = lenis;

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                lenis.scrollTo(targetElem);
            }
        });
    });
}

// ==========================================
// 3. HERO TEXT HANDLING (FIXED)
// ==========================================
function initHeroText() {
    // Don't set text immediately - let typewriter handle it
    // Just prepare the elements
    const nameEl = document.getElementById('hero-name');
    const roleEl = document.getElementById('hero-role');
    
    // Mark elements for typewriter (they won't get Anime.js animations)
    if (nameEl) nameEl.classList.add('no-animate');
    if (roleEl) roleEl.classList.add('no-animate');
    
    // Now split text for Anime.js (for other elements)
    initTextAnimations();
}

function initTypewriterSequence() {
    // Calculate delays for sequential typing
    const greetingDelay = 0;
    const greetingDuration = CONFIG.hero.greeting.length * 50; // Approximate typing time
    const nameDelay = greetingDelay + greetingDuration + 300; // Small pause after greeting
    const nameDuration = CONFIG.hero.name.length * 50;
    const roleDelay = nameDelay + nameDuration + 300;
    const roleDuration = CONFIG.hero.role.length * 50;
    const descDelay = roleDelay + roleDuration + 500; // Longer pause before description
    
    // Type sequentially
    typeWriter('hero-greeting', CONFIG.hero.greeting, greetingDelay, 50);
    typeWriter('hero-name', CONFIG.hero.name, nameDelay, 50);
    typeWriter('hero-role', CONFIG.hero.role, roleDelay, 50);
    typeWriter('hero-desc', CONFIG.hero.description, descDelay, 10);
}

function initTextAnimations() {
    const splitText = (selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Skip elements explicitly marked as 'no-animate' (e.g., typewriter targets)
            if (el.classList && el.classList.contains('no-animate')) return;
            // Only split if content exists and hasn't been split yet
            if(!el.querySelector('.letter') && el.innerText.trim() !== "") {
                el.innerHTML = el.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
            }
        });
    };

    splitText('.stagger-text');
    splitText('.stagger-header');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                if(entry.target.classList.contains('stagger-header') || entry.target.classList.contains('stagger-text')) {
                    anime({
                        targets: entry.target.querySelectorAll('.letter'),
                        translateY: [50, 0],
                        opacity: [0, 1],
                        easing: 'easeOutExpo',
                        duration: 1200,
                        delay: anime.stagger(30)
                    });
                }
                if(entry.target.classList.contains('animate-up')) {
                    anime({
                        targets: entry.target,
                        translateY: [50, 0],
                        opacity: [0, 1],
                        easing: 'easeOutQuad',
                        duration: 800
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.stagger-header, .animate-up').forEach(el => observer.observe(el));
}

function triggerInitialAnimations() {
    // Name and role are now handled by typewriter, so we skip their animations
    // This function can be used for other initial animations if needed
}

function typeWriter(elementId, text, startDelay = 0, speed = 50, linePause = 500) {
    const element = document.getElementById(elementId);
    if(!element) return;

    // Mark this element so other text-splitting/animations skip it
    element.classList.add('no-animate');

    // Prepare container
    element.innerHTML = "";
    element.classList.add('typing-cursor');

    // Split into lines (preserve empty lines)
    const lines = String(text).split(/\r?\n/);

    // Create a span for each line so we can type line-by-line
    const lineSpans = lines.map((line, idx) => {
        const span = document.createElement('span');
        span.className = 'type-line';
        // Use textContent to avoid HTML injection
        span.textContent = '';
        element.appendChild(span);
        if (idx < lines.length - 1) element.appendChild(document.createElement('br'));
        return span;
    });

    let lineIndex = 0;
    let charIndex = 0;

    setTimeout(() => {
        function type() {
            const currentLine = lines[lineIndex] || '';
            const currentSpan = lineSpans[lineIndex];

            if (charIndex < currentLine.length) {
                currentSpan.textContent += currentLine.charAt(charIndex);
                charIndex++;
                setTimeout(type, speed);
            } else {
                // Finish current line
                lineIndex++;
                charIndex = 0;
                if (lineIndex < lines.length) {
                    // Small pause between lines
                    setTimeout(type, linePause);
                } else {
                    // Done typing all lines
                    element.classList.remove('typing-cursor');
                    // Keep 'no-animate' to avoid accidental fade-in from other scripts
                }
            }
        }
        type();
    }, startDelay);
} 

// ==========================================
// 4. DOCK & PROGRESS BORDER
// ==========================================
function initDock() {
    const dock = document.getElementById('dock');
    const items = document.querySelectorAll('.dock-item');
    if (!dock || items.length === 0) return;

    const maxScale = 1.5;
    const range = 100;
    let rafId = null;
    let mouseX = 0;

    // Throttle mousemove with requestAnimationFrame for better performance
    dock.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                items.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const dist = Math.abs(mouseX - centerX);
                    let scale = 1;
                    if (dist < range) {
                        scale = 1 + (maxScale - 1) * Math.cos((dist / range) * (Math.PI / 2));
                    }
                    item.style.transform = `scale(${scale}) translateY(${ (scale - 1) * -10 }px)`;
                    item.style.zIndex = Math.round(scale * 100);
                });
                rafId = null;
            });
        }
    });

    dock.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        items.forEach(item => {
            item.style.transform = 'scale(1) translateY(0)';
            item.style.zIndex = 1;
        });
    });
}

function initDockProgress() {
    const dock = document.getElementById('dock');
    if(!dock) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "dock-progress-svg");
    svg.style.position = "absolute";
    svg.style.inset = "-1px"; 
    svg.style.width = "calc(100% + 2px)";
    svg.style.height = "calc(100% + 2px)";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "0"; 
    svg.style.borderRadius = "16px"; 

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", "1");
    rect.setAttribute("y", "1");
    // We'll set width/height explicitly based on dock size
    rect.setAttribute("rx", "16"); 
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "var(--accent)"); 
    rect.setAttribute("stroke-width", "2");
    rect.setAttribute("id", "dock-progress-rect");
    
    svg.appendChild(rect);
    dock.appendChild(svg);
    dock.style.position = "relative"; 

    // Recalculate rect size to ensure getBBox/perimeter calculations are accurate
    function sizeRect() {
        const rectEl = document.getElementById('dock-progress-rect');
        if(!rectEl) return;
        const width = Math.max(0, dock.clientWidth - 2);
        const height = Math.max(0, dock.clientHeight - 2);
        rectEl.setAttribute('width', String(width));
        rectEl.setAttribute('height', String(height));
    }

    // Throttle updates via requestAnimationFrame
    let ticking = false;
    function requestDockUpdate() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => { updateDockProgress(); ticking = false; });
        }
    }

    window.addEventListener('scroll', requestDockUpdate, { passive: true });
    window.addEventListener('resize', () => { sizeRect(); requestDockUpdate(); });

    sizeRect();
    requestDockUpdate();
} 

function updateDockProgress() {
    const rect = document.getElementById('dock-progress-rect');
    if(!rect) return;

    const scrollTop = window.scrollY;
    const docHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollPercent = Math.min(scrollTop / docHeight, 1);

    // Calculate perimeter based on rect bbox (more consistent across browsers)
    const bbox = rect.getBBox();
    const pathLength = 2 * (bbox.width + bbox.height);

    rect.style.strokeDasharray = pathLength;
    rect.style.strokeDashoffset = pathLength - (pathLength * scrollPercent);
} 

// ==========================================
// 5. DATA LOADING
// ==========================================
function loadContent() {
    const brand = document.getElementById('brand');
    if(brand) brand.innerText = CONFIG.brand;

    const aboutDiv = document.getElementById('about-content');
    if(aboutDiv) CONFIG.about.text.forEach(p => aboutDiv.innerHTML += `<p>${p}</p>`);

    const skillsDiv = document.getElementById('skills-list');
    if(skillsDiv) CONFIG.about.skills.forEach(skill => {
        skillsDiv.innerHTML += `<span class="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-slate-300 transition-colors cursor-default theme-accent theme-accent-border">${skill}</span>`;
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

    const projectGrid = document.getElementById('projects-grid');
    const viewMoreBtn = document.getElementById('view-more-btn');
    const viewMoreContainer = document.getElementById('view-more-container');

    if(projectGrid) {
        CONFIG.projects.forEach((proj, index) => {
            const isHidden = index >= 3 ? 'hidden' : ''; 
            const tags = proj.tags.map(t => `<span class="text-[10px] px-2 py-1 rounded-full theme-accent theme-accent-border">${t}</span>`).join('');
            
            const html = `
                <div class="glass rounded-2xl project-card overflow-hidden group flex flex-col h-full ${isHidden} project-item opacity-0 animate-up">
                    <div class="project-image-wrapper h-48 md:h-64 w-full bg-slate-900 overflow-hidden relative">
                        <img src="${proj.image}" alt="${proj.title}" class="project-img w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-md">
                            <a href="${proj.github}" class="p-3 rounded-full hover:scale-110 transition-transform" style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white;"><i class="fab fa-github"></i></a>
                            <a href="${proj.link}" class="p-3 rounded-full hover:scale-110 transition-transform" style="background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); color: white;"><i class="fas fa-external-link-alt"></i></a>
                        </div>
                    </div>
                    <div class="p-6 flex flex-col flex-grow">
                        <h3 class="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">${proj.title}</h3>
                        <p class="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">${proj.description}</p>
                        <div class="flex gap-2 flex-wrap pt-4 border-t border-white/10">
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
                setTimeout(() => {
                    item.classList.add('active');
                    anime({
                        targets: item,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        easing: 'easeOutQuad',
                        duration: 600
                    });
                }, 50);
            });
            viewMoreContainer.classList.add('hidden');
        });
    }

const cardRole = document.getElementById('card-role');
    const socialDiv = document.getElementById('social-links');
    // Removed mailBtn reference
    const contactBtn = document.getElementById('contact-btn');

    if(cardRole) cardRole.innerText = "Listening to Photograph By Ed"; 
    
    const mailTo = `mailto:${CONFIG.contact.email}`;
    
    // Use the main button for mailing now
    if(contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = mailTo;
        });
    }

    if(socialDiv) {
        socialDiv.innerHTML = "";
        CONFIG.contact.socials.forEach(s => {
            socialDiv.innerHTML += `<a href="${s.url}" target="_blank"><i class="${s.icon}"></i></a>`;
        });
    }
}

// ==========================================
// 6. THEME TOGGLE (CYCLING)
// ==========================================
function initThemeToggle() {
    const toggle = document.getElementById('switch');
    if(!toggle) return;
    
    const themeMap = {
        'default': { hex: 0x2dd4bf, rgb: '45,212,191', css: '#2dd4bf' },
        'rose-pine': { hex: 0xea9a97, rgb: '234,154,151', css: '#ea9a97' },
        'gruvbox': { hex: 0xfe8019, rgb: '254,128,25', css: '#fe8019' },
        'dracula': { hex: 0xbd93f9, rgb: '189,147,249', css: '#bd93f9' },
        'nord': { hex: 0x88c0d0, rgb: '136,192,208', css: '#88c0d0' },
        'one-dark': { hex: 0x61afef, rgb: '97,175,239', css: '#61afef' },
        'catppuccin': { hex: 0xf5a97f, rgb: '245,169,127', css: '#f5a97f' },
        'tokyo-night': { hex: 0x7aa2f7, rgb: '122,162,247', css: '#7aa2f7' }
    };

    function cycleTheme() {
        APP_STATE.currentThemeIndex = (APP_STATE.currentThemeIndex + 1) % APP_STATE.themes.length;
        const newTheme = APP_STATE.themes[APP_STATE.currentThemeIndex];

        if (newTheme === 'default') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', newTheme);
        }

        const info = themeMap[newTheme] || themeMap['default'];
        document.documentElement.style.setProperty('--accent', info.css);
        document.documentElement.style.setProperty('--accent-rgb', info.rgb);
        updateThreeColors(info.hex);
        updateThemeColors(newTheme);
    }

    // Support both checkbox change and label/click interactions
    toggle.addEventListener('change', cycleTheme);
    toggle.addEventListener('click', cycleTheme);
    
    // Initialize with default theme
    updateThemeColors('default');
}

function updateThemeColors(theme) {
    // Update any hardcoded colors that need theme awareness
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    
    // Update selection color
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    const existing = document.getElementById('dynamic-theme-styles');
    if (existing) existing.remove();
    
    style.textContent = `
        ::selection {
            background: ${accentColor};
            color: var(--bg-dark);
        }
    `;
    document.head.appendChild(style);
} 

function updateThreeColors(colorHex) {
    if(APP_STATE.threeMaterials.stars) APP_STATE.threeMaterials.stars.color.setHex(colorHex);
    APP_STATE.threeMaterials.shapes.forEach(mat => mat.color.setHex(colorHex));
}

function initContactCard() {
    const card = document.getElementById('contact-card');
    const emailLink = document.getElementById('email-link');
    const socialLinksContainer = document.getElementById('social-links');
    
    if(emailLink) {
        emailLink.innerText = 'Contact Me';
        emailLink.href = `mailto:${CONFIG.contact.email}`;
    }
    
    // Add hover effect to card
    if(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Add social links
    if(socialLinksContainer && CONFIG.contact.social) {
        socialLinksContainer.innerHTML = '';
        CONFIG.contact.social.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.innerHTML = link.icon;
            a.title = link.name;
            socialLinksContainer.appendChild(a);
        });
    }
}

function initClickSpark() {
    document.addEventListener('click', (e) => {
        // Spark color matches current theme accent
        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

        for(let i=0; i<3; i++) { // Further reduced spark count from 6 to 3 for performance
            const spark = document.createElement('div');
            Object.assign(spark.style, {
                position: 'fixed', left: e.clientX + 'px', top: e.clientY + 'px',
                width: '4px', height: '4px', backgroundColor: accentColor, borderRadius: '50%',
                pointerEvents: 'none', zIndex: '9999'
            });
            document.body.appendChild(spark);
            const angle = Math.random() * Math.PI * 2, velocity = Math.random() * 60 + 20;
            spark.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle)*velocity}px, ${Math.sin(angle)*velocity}px) scale(0)`, opacity: 0 }
            ], { duration: 600, easing: 'cubic-bezier(0,0.9,0.57,1)' }).onfinish = () => spark.remove();
        }
    });
}

// ==========================================
// 7. THREE.JS BACKGROUND
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