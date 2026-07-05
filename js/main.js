/**
 * Pratham Vasani - Cybersecurity Portfolio
 * Main JavaScript file for animations and interactions
 */

// Shared flag: honor the user's reduced-motion preference in every animation
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize network background
    initNetworkBackground();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize typewriter effect
    initTypewriter();
    
    // Initialize security dashboard
    initSecurityDashboard();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize form submission
    initContactForm();

    // Initialize skills filter tabs
    initSkillsFilter();

    // Initialize easter eggs & fun interactions
    initTerminal();
    initTextScramble();
    initKonamiCode();
    initCopyEmail();
    initCertVerify();
});

/**
 * Small toast helper (used by copy-to-clipboard)
 */
function showToast(text) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    // Force reflow so re-triggering the animation works
    void toast.offsetWidth;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/**
 * Click-to-copy email — a quick win for hiring managers
 */
function initCopyEmail() {
    const btn = document.querySelector('.copy-email');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const email = btn.dataset.copy;
        let copied = false;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
                copied = true;
            }
        } catch (err) {
            copied = false;
        }

        if (!copied) {
            // Fallback for older browsers / insecure contexts
            const temp = document.createElement('textarea');
            temp.value = email;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            try { document.execCommand('copy'); copied = true; } catch (e) { copied = false; }
            document.body.removeChild(temp);
        }

        if (copied) {
            btn.classList.add('copied');
            showToast('✓ email copied to clipboard');
            setTimeout(() => btn.classList.remove('copied'), 1500);
        } else {
            showToast('couldn’t copy — email: ' + email);
        }
    });
}

/**
 * Click a certification badge to "verify" it — a themed, tactile flourish
 */
function initCertVerify() {
    const pills = document.querySelectorAll('.cert-strip .cert-pill');
    if (!pills.length) return;

    pills.forEach(pill => {
        const check = document.createElement('span');
        check.className = 'cert-check';
        check.innerHTML = ' <i class="fas fa-circle-check" aria-hidden="true"></i>';
        pill.appendChild(check);

        pill.addEventListener('click', () => {
            if (pill.classList.contains('verified')) return;

            if (prefersReducedMotion) {
                pill.classList.add('verified');
                return;
            }

            pill.classList.add('verifying');
            setTimeout(() => {
                pill.classList.remove('verifying');
                pill.classList.add('verified');
            }, 700);
        });
    });
}

/**
 * Loading Screen Animation
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const typingTexts = document.querySelectorAll('.loading-screen .typing-text');

    // Reduced motion: skip the animated intro entirely
    if (prefersReducedMotion) {
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';
        return;
    }

    // Simulate terminal typing with delays
    let delay = 0;
    typingTexts.forEach((text, index) => {
        text.style.animation = `typing 2s steps(40, end) ${delay}s forwards, blink-caret 0.75s step-end infinite`;
        delay += 1;
    });
    
    // Hide loading screen after animations complete
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 6000); // Adjust timing based on total animation duration
}

/**
 * Network Background Animation
 */
function initNetworkBackground() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Cursor interaction state
    const mouse = { x: null, y: null, active: false };
    const CURSOR_RADIUS = 180;
    const pulses = [];

    // Node class for network visualization
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = 'rgba(0, 255, 140, 0.55)';
        }

        update() {
            // Gently drawn toward the cursor when it's nearby
            if (mouse.active) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CURSOR_RADIUS && dist > 0.001) {
                    const pull = (1 - dist / CURSOR_RADIUS) * 0.9;
                    if (dist > 46) {
                        this.x += (dx / dist) * pull;
                        this.y += (dy / dist) * pull;
                    } else {
                        // Keep a little personal space so nodes orbit instead of stacking
                        this.x -= (dx / dist) * pull * 0.8;
                        this.y -= (dy / dist) * pull * 0.8;
                    }
                }
            }

            // Move node
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create nodes
    const nodeCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 10000));
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node());
    }
    
    // Draw connections between nodes
    function drawConnections() {
        ctx.strokeStyle = 'rgba(0, 255, 140, 0.055)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Bright links from nearby nodes to the cursor, plus a soft glow around it —
    // the visitor becomes a node in the network
    function drawCursorEffects() {
        if (!mouse.active) return;

        for (const node of nodes) {
            const dx = node.x - mouse.x;
            const dy = node.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CURSOR_RADIUS) {
                ctx.strokeStyle = 'rgba(0, 255, 140, ' + (0.45 * (1 - distance / CURSOR_RADIUS)).toFixed(3) + ')';
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 70);
        glow.addColorStop(0, 'rgba(0, 255, 140, 0.22)');
        glow.addColorStop(1, 'rgba(0, 255, 140, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 70, 0, Math.PI * 2);
        ctx.fill();
    }

    // Expanding radar rings spawned on click/tap
    function drawPulses() {
        for (let i = pulses.length - 1; i >= 0; i--) {
            const pulse = pulses[i];
            pulse.radius += 3.5;
            pulse.alpha *= 0.94;

            if (pulse.alpha < 0.02) {
                pulses.splice(i, 1);
                continue;
            }

            ctx.strokeStyle = 'rgba(0, 255, 140, ' + pulse.alpha.toFixed(3) + ')';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw connections
        drawConnections();
        drawCursorEffects();
        drawPulses();

        requestAnimationFrame(animate);
    }

    // Reduced motion: render a single static frame, no cursor effects
    if (prefersReducedMotion) {
        nodes.forEach(node => node.draw());
        drawConnections();
        return;
    }

    // Cursor tracking + click/tap pulses (canvas sits behind the page,
    // so we listen on window and never interfere with real clicks)
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    window.addEventListener('click', (e) => {
        if (pulses.length < 6) pulses.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 0.5 });
    });

    window.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        if (touch && pulses.length < 6) pulses.push({ x: touch.clientX, y: touch.clientY, radius: 0, alpha: 0.5 });
    }, { passive: true });

    // Start animation
    animate();
}

/**
 * Navigation Functionality
 */
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('nav ul');
    
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            
            // Scroll to target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Typewriter Effect
 */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;
    
    const roles = [
        'SOC Analyst',
        'Cybersecurity Professional',
        'Penetration Tester',
        'Security Researcher',
        'Threat Hunter'
    ];
    
    // Reduced motion: show a static role instead of the typing loop
    if (prefersReducedMotion) {
        typewriterElement.textContent = roles[0];
        return;
    }

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Deleting text
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Typing text
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // If word is complete
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

/**
 * Security Dashboard Animations
 */
function initSecurityDashboard() {
    // Threat counter animation
    const threatCounter = document.getElementById('threats-counter');
    if (threatCounter) {
        let count = 0;
        const targetCount = 157;
        const duration = 3000; // ms
        const interval = 30; // ms
        const increment = Math.ceil(targetCount / (duration / interval));
        
        const counterInterval = setInterval(() => {
            count += increment;
            if (count >= targetCount) {
                count = targetCount;
                clearInterval(counterInterval);
            }
            threatCounter.textContent = count;
        }, interval);
    }
    
    // Security logs animation
    const securityLogs = document.getElementById('security-logs');
    if (securityLogs) {
        const logMessages = [
            { time: '08:42:15', message: 'System scan completed. No threats detected.', type: 'success' },
            { time: '08:45:23', message: 'Unusual login attempt blocked from IP 192.168.1.45', type: 'warning' },
            { time: '08:47:56', message: 'Firewall rules updated successfully', type: 'success' },
            { time: '08:51:12', message: 'Potential phishing attempt detected and quarantined', type: 'error' },
            { time: '08:53:37', message: 'User authentication successful', type: 'success' },
            { time: '08:55:49', message: 'Network traffic analysis running...', type: 'normal' },
            { time: '08:58:02', message: 'Suspicious file detected in uploads directory', type: 'warning' },
            { time: '09:01:18', message: 'Database backup completed successfully', type: 'success' },
            { time: '09:03:45', message: 'Brute force attack attempt blocked', type: 'error' },
            { time: '09:05:22', message: 'System resources optimized', type: 'success' }
        ];
        
        // Add initial logs
        addSecurityLog(securityLogs, logMessages[0]);
        
        // Add logs with delay
        let logIndex = 1;
        const logInterval = setInterval(() => {
            if (logIndex < logMessages.length) {
                addSecurityLog(securityLogs, logMessages[logIndex]);
                logIndex++;
            } else {
                // Start over with randomized logs
                logIndex = 0;
                shuffleArray(logMessages);
            }
        }, 2000);
    }
    
    // Add log entry to security logs
    function addSecurityLog(container, log) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        const logTime = document.createElement('span');
        logTime.className = 'log-time';
        logTime.textContent = log.time;
        
        const logMessage = document.createElement('span');
        logMessage.className = `log-message ${log.type}`;
        logMessage.textContent = log.message;
        
        logEntry.appendChild(logTime);
        logEntry.appendChild(logMessage);
        
        container.prepend(logEntry);
        
        // Remove oldest log if too many
        if (container.children.length > 5) {
            container.removeChild(container.lastChild);
        }
    }
    
    // Shuffle array helper function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

/**
 * Scroll Reveal Animations — IntersectionObserver, respects prefers-reduced-motion
 */
function initScrollAnimations() {
    // Glitch effect needs its data-text attribute regardless of motion preference
    document.querySelectorAll('.glitch').forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });

    // Cards and sections that reveal individually
    const singles = document.querySelectorAll(
        '.stat-card, .timeline-item, .education-item, .skill-item, ' +
        '.project-card, .achievement-card, .section-title, .contact-info, .contact-form'
    );

    // Badge/tag groups whose children reveal with a small stagger
    const groups = document.querySelectorAll('.cert-strip, .cert-grid, .skills-cloud');

    const revealElements = [...singles];
    groups.forEach(group => {
        Array.from(group.children).forEach((child, index) => {
            child.style.transitionDelay = Math.min(index * 40, 600) + 'ms';
            revealElements.push(child);
        });
    });

    revealElements.forEach(el => el.classList.add('reveal'));

    // Reduced motion or no IO support: show everything immediately
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => {
            el.style.transitionDelay = '';
            el.classList.add('visible');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Drop the stagger delay once revealed so hover/filter transitions stay snappy
                entry.target.addEventListener('transitionend', function clearDelay() {
                    entry.target.style.transitionDelay = '';
                }, { once: true });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Skills & Arsenal Filter Tabs
 */
function initSkillsFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const groups = document.querySelectorAll('.arsenal-group');
    if (!tabs.length || !groups.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            tabs.forEach(t => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
            });

            const filter = tab.dataset.filter;

            groups.forEach(group => {
                const show = filter === 'all' || group.dataset.category === filter;

                if (!show) {
                    group.classList.add('collapsed');
                    return;
                }

                group.classList.remove('collapsed');

                const pills = group.querySelectorAll('.skill-tag');
                if (prefersReducedMotion) return;

                // Cascade the pills back in: start scaled-down/transparent,
                // then release with a staggered delay
                pills.forEach((pill, index) => {
                    pill.classList.add('pill-enter');
                    pill.style.transitionDelay = (index * 35) + 'ms';
                });

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        pills.forEach(pill => pill.classList.remove('pill-enter'));
                    });
                });

                setTimeout(() => {
                    pills.forEach(pill => pill.style.transitionDelay = '');
                }, pills.length * 35 + 450);
            });
        });
    });
}

/**
 * Contact Form — delivers via FormSubmit (https://formsubmit.co), no backend needed
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const FORMSUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/vasanipratham5@gmail.com';
    const statusEl = document.getElementById('formStatus');
    const submitButton = document.getElementById('submitBtn');

    function setStatus(message, type) {
        statusEl.textContent = message;
        statusEl.className = 'form-status' + (type ? ' ' + type : '');
    }

    function markInvalid(field, invalid) {
        field.classList.toggle('invalid', invalid);
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        const honeypotField = document.getElementById('company');

        // Honeypot: bots fill hidden fields — silently pretend success
        if (honeypotField && honeypotField.value) {
            contactForm.reset();
            setStatus("Thanks — I'll get back to you soon.", 'success');
            return;
        }

        // Client-side validation
        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const subject = subjectField.value.trim();
        const message = messageField.value.trim();
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        markInvalid(nameField, !name);
        markInvalid(emailField, !emailValid);
        markInvalid(subjectField, !subject);
        markInvalid(messageField, !message);

        if (!name || !subject || !message) {
            setStatus('Please fill in all fields.', 'error');
            return;
        }
        if (!emailValid) {
            setStatus('Please enter a valid email address.', 'error');
            return;
        }

        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        setStatus('', '');

        try {
            const response = await fetch(FORMSUBMIT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _captcha: 'false',
                    _template: 'table',
                    _subject: 'Portfolio Contact: ' + subject
                })
            });

            if (!response.ok) {
                throw new Error('FormSubmit responded with status ' + response.status);
            }

            contactForm.reset();
            setStatus("Thanks — I'll get back to you soon.", 'success');
        } catch (err) {
            setStatus('Something went wrong sending your message. Please email me directly at vasanipratham5@gmail.com.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

/**
 * Matrix Rain Overlay — the "ACCESS GRANTED" moment
 * Triggered by the terminal `hack` command and the Konami code.
 */
function runMatrixRain(duration = 4500) {
    if (prefersReducedMotion || document.getElementById('matrix-overlay')) return;

    const overlay = document.createElement('canvas');
    overlay.id = 'matrix-overlay';
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;

    const message = document.createElement('div');
    message.className = 'access-granted';
    message.textContent = 'ACCESS GRANTED';

    document.body.append(overlay, message);

    const ctx = overlay.getContext('2d');
    const fontSize = 16;
    const columns = Math.floor(overlay.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -30));
    const glyphs = '01アイウエオカキクケコサシスセソタチツテト<>/\\{}[]$#@!?=+*';

    ctx.fillStyle = 'rgba(10, 14, 23, 0.92)';
    ctx.fillRect(0, 0, overlay.width, overlay.height);

    const timer = setInterval(() => {
        ctx.fillStyle = 'rgba(10, 14, 23, 0.1)';
        ctx.fillRect(0, 0, overlay.width, overlay.height);
        ctx.fillStyle = '#00ff8c';
        ctx.font = fontSize + 'px "Fira Code", monospace';

        for (let i = 0; i < columns; i++) {
            const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
            ctx.fillText(glyph, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > overlay.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }, 50);

    setTimeout(() => {
        overlay.style.opacity = '0';
        message.style.opacity = '0';
        setTimeout(() => {
            clearInterval(timer);
            overlay.remove();
            message.remove();
        }, 600);
    }, duration);
}

/**
 * Interactive Terminal — visitors can type real commands in the About terminal
 */
function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    if (!input || !output) return;

    const terminalWindow = input.closest('.terminal-window');
    if (terminalWindow) {
        terminalWindow.addEventListener('click', () => input.focus());
    }

    function print(text, cls) {
        const line = document.createElement('div');
        line.className = 'terminal-line ' + (cls || 'output');
        line.textContent = text;
        output.appendChild(line);
        while (output.children.length > 60) output.removeChild(output.firstChild);
    }

    function echo(cmd) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = '$ ';
        const span = document.createElement('span');
        span.className = 'command';
        span.textContent = cmd;
        line.appendChild(span);
        output.appendChild(line);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, prefersReducedMotion ? 0 : ms));
    }

    async function hack() {
        input.disabled = true;
        print('booting exploit framework v2.6.1 ...');
        await sleep(600);
        print('scanning target: portfolio.local ...');
        await sleep(700);
        print('0day found: CVE-2026-1337 (unpatched charm)', 'warning');
        await sleep(700);
        print('deploying payload ████████████ 100%');
        await sleep(500);
        print('ACCESS GRANTED — welcome to the mainframe.', 'success');
        print("(psst — the Konami code works anywhere on this site: ↑ ↑ ↓ ↓ ← → ← → B A)");
        input.disabled = false;
        input.focus();
        runMatrixRain();
    }

    const commands = {
        help: () => print("available commands: whoami · skills · certs · contact · security · ls · cat secrets.txt · hack · sudo · clear"),
        whoami: () => print('pratham_vasani — security analyst. attacker mindset, defender instincts.'),
        skills: () => print('threat hunting · penetration testing · detection engineering · cloud security · active directory. full arsenal above ↑'),
        certs: () => print('CARTP · CEH · CRTA · eJPT · CPTE · C3SA · BTF · ISO 27001 LA'),
        contact: () => print('vasanipratham5@gmail.com · linkedin.com/in/prathamvasani'),
        security: () => {
            print('running self-assessment on this site ...');
            print('[✓] Content-Security-Policy — scoped allowlist, object-src none', 'success');
            print('[✓] Referrer-Policy — strict-origin-when-cross-origin', 'success');
            print('[✓] security.txt — published at /.well-known/security.txt', 'success');
            print('[✓] external links — rel="noopener", no third-party trackers', 'success');
            print('[✓] contact form — honeypot + client-side validation', 'success');
            print('posture: hardened. yes, the portfolio practices what it preaches.');
        },
        ls: () => print('certs/  projects/  loot/  secrets.txt'),
        'cat secrets.txt': () => print("flag{th3_qu13t3st_l0gs_t3ll_th3_l0ud3st_st0r13s} — mention this flag when you reach out and coffee's on me."),
        hack: hack,
        clear: () => { output.innerHTML = ''; }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const raw = input.value.trim();
        if (!raw) return;
        input.value = '';
        echo(raw);

        const cmd = raw.toLowerCase();
        if (commands[cmd]) {
            commands[cmd]();
        } else if (cmd.startsWith('sudo')) {
            print('[sudo] password for guest: ');
            print("access denied. this incident will be reported (to no one — you're good).", 'error');
        } else if (cmd.startsWith('cat')) {
            print('cat: permission denied (try secrets.txt)', 'error');
        } else {
            print("command not found: " + raw + " — try 'help'", 'error');
        }
    });
}

/**
 * Text Scramble — hovering the hero name decodes it through hacker glyphs
 */
function initTextScramble() {
    const el = document.querySelector('.hero-text h1');
    if (!el || prefersReducedMotion) return;

    const original = el.textContent;
    const glyphs = '!<>-_\\/[]{}=+*^?#01';
    let running = false;

    el.addEventListener('mouseenter', () => {
        if (running) return;
        running = true;

        let frame = 0;
        const totalFrames = 24;
        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const scrambled = original.split('').map((ch, i) => {
                if (ch === ' ') return ' ';
                return (i / original.length < progress) ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
            }).join('');

            el.textContent = scrambled;
            el.setAttribute('data-text', scrambled);

            if (frame >= totalFrames) {
                clearInterval(timer);
                el.textContent = original;
                el.setAttribute('data-text', original);
                running = false;
            }
        }, 35);
    });
}

/**
 * Konami Code — ↑ ↑ ↓ ↓ ← → ← → B A triggers the matrix rain
 */
function initKonamiCode() {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;

    window.addEventListener('keydown', (e) => {
        // Don't hijack typing in the terminal or contact form
        if (e.target && typeof e.target.matches === 'function' && e.target.matches('input, textarea')) {
            position = 0;
            return;
        }

        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        position = (key === sequence[position]) ? position + 1 : (key === sequence[0] ? 1 : 0);

        if (position === sequence.length) {
            position = 0;
            runMatrixRain();
        }
    });
}

/**
 * Counter Animation for About Section
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animate counters when they come into view
    const counters = document.querySelectorAll('[id^="counter-"]');

    // Reduced motion: the HTML already contains the final values
    if (prefersReducedMotion) return;
    
    function animateCounters() {
        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            if (rect.top <= window.innerHeight && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                let targetValue = parseInt(target);
                
                let count = 0;
                const duration = 2000; // ms
                const interval = 30; // ms
                const increment = Math.ceil(targetValue / (duration / interval));
                
                const counterInterval = setInterval(() => {
                    count += increment;
                    if (count >= targetValue) {
                        count = targetValue;
                        clearInterval(counterInterval);
                    }
                    counter.textContent = isPercentage ? count + '%' : count + '+';
                }, interval);
            }
        });
    }
    
    // Check on scroll
    window.addEventListener('scroll', animateCounters);
    
    // Initial check
    setTimeout(animateCounters, 1000);
});
