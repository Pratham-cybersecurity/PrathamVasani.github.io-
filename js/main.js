/**
 * Pratham Vasani - Cybersecurity Portfolio
 * Main JavaScript file for animations and interactions
 */

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
    
    // Initialize skill bars animation
    initSkillBars();
});

/**
 * Loading Screen Animation
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const typingTexts = document.querySelectorAll('.loading-screen .typing-text');
    
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
    
    // Node class for network visualization
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = '#00ff8c';
        }
        
        update() {
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
        ctx.strokeStyle = 'rgba(0, 255, 140, 0.1)';
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
        
        requestAnimationFrame(animate);
    }
    
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
                    behavior: 'smooth'
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
 * Scroll Animations
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = [
        ...document.querySelectorAll('.stat-card'),
        ...document.querySelectorAll('.timeline-item'),
        ...document.querySelectorAll('.education-item'),
        ...document.querySelectorAll('.cert-card'),
        ...document.querySelectorAll('.skill-item'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.achievement-card')
    ];
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Add animation class when element is in viewport
    function checkVisibility() {
        animatedElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animate')) {
                element.classList.add('animate');
            }
        });
    }
    
    // Add initial animation class
    window.addEventListener('load', () => {
        // Add animation class to elements
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        // Check initial visibility
        checkVisibility();
    });
    
    // Check visibility on scroll
    window.addEventListener('scroll', checkVisibility);
    
    // Animate elements when they come into view
    document.addEventListener('scroll', () => {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Glitch effect animation
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });
}

/**
 * Skill Bars Animation
 */
function initSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    // Animate skill bars when they come into view
    function animateSkillBars() {
        skillLevels.forEach(skillLevel => {
            const rect = skillLevel.getBoundingClientRect();
            if (rect.top <= window.innerHeight && !skillLevel.classList.contains('animated')) {
                skillLevel.classList.add('animated');
                skillLevel.style.width = skillLevel.style.width; // Trigger animation
            }
        });
    }
    
    // Initialize skill bars with 0 width
    skillLevels.forEach(skillLevel => {
        const targetWidth = skillLevel.style.width;
        skillLevel.style.width = '0';
        setTimeout(() => {
            skillLevel.style.transition = 'width 1s ease-in-out';
        }, 100);
    });
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
    
    // Initial check
    setTimeout(animateSkillBars, 1000);
}

/**
 * Contact Form Functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Validate form (simple validation)
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate API call
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Show success message
            alert('Thank you for your message! This is a demo form, so no actual message was sent.');
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);
    });
}

/**
 * Counter Animation for About Section
 */
document.addEventListener('DOMContentLoaded', function() {
    // Animate counters when they come into view
    const counters = document.querySelectorAll('[id^="counter-"]');
    
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
