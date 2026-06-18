document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       TERMINAL BUILD PRELOADER SIMULATOR
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    const consoleOutput = document.getElementById('consoleOutput');
    const progressBarFill = document.getElementById('progressBarFill');
    const loaderStatus = document.getElementById('loaderStatus');
    const loaderPercent = document.getElementById('loaderPercent');

    const logMessages = [
        { text: "$ ./build_portfolio.sh --env=production", class: "cmd", delay: 50 },
        { text: "Initializing Srinivasan's Portfolio Engine...", class: "", delay: 80 },
        { text: "Loading Python 3.10 virtual environment...", class: "", delay: 50 },
        { text: "django.core.management - Mounting urlconf configurations...", class: "", delay: 80 },
        { text: "django.db.backends - Connecting to database 'portfolio_db'...", class: "", delay: 60 },
        { text: "MySQL - Connected successfully to localhost:3306", class: "success", delay: 40 },
        { text: "django.contrib.staticfiles - Gathering CSS, JS, and Assets...", class: "", delay: 80 },
        { text: "Staticfiles - 12 items copied to production buckets.", class: "success", delay: 50 },
        { text: "AWS SDK - Initializing connection to cloud storage...", class: "", delay: 60 },
        { text: "Docker - Packaging application container (srini/fullstack-app:latest)...", class: "", delay: 100 },
        { text: "Docker - Container image compiled successfully.", class: "success", delay: 50 },
        { text: "Server - Listening on http://localhost:8000 (Ctrl+C to quit)", class: "success", delay: 80 }
    ];

    if (preloader && consoleOutput) {
        let msgIndex = 0;
        let currentPercent = 0;

        function addConsoleLine() {
            if (msgIndex < logMessages.length) {
                const msg = logMessages[msgIndex];
                
                const line = document.createElement('div');
                line.className = `console-line ${msg.class}`;
                line.textContent = msg.text;
                consoleOutput.appendChild(line);
                
                consoleOutput.scrollTop = consoleOutput.scrollHeight;

                if (msgIndex === 1) loaderStatus.textContent = "Loading modules...";
                if (msgIndex === 3) loaderStatus.textContent = "Setting up Django backend...";
                if (msgIndex === 5) loaderStatus.textContent = "Database linked.";
                if (msgIndex === 7) loaderStatus.textContent = "Compiling visual assets...";
                if (msgIndex === 9) loaderStatus.textContent = "Dockerizing application...";
                if (msgIndex === 11) loaderStatus.textContent = "Build complete! Server ready.";

                const targetPercent = Math.min(Math.round(((msgIndex + 1) / logMessages.length) * 100), 100);
                
                animateProgress(targetPercent, () => {
                    msgIndex++;
                    setTimeout(addConsoleLine, msg.delay);
                });
            } else {
                // Show and enable the Get Started button when loading is complete
                const getStartedBtn = document.getElementById('getStartedBtn');
                if (getStartedBtn) {
                    getStartedBtn.disabled = false;
                    getStartedBtn.style.opacity = '1';
                    getStartedBtn.style.pointerEvents = 'auto';
                    getStartedBtn.style.transform = 'scale(1)';
                    getStartedBtn.classList.add('btn-pulse-glow');
                    
                    getStartedBtn.addEventListener('click', () => {
                        preloader.style.opacity = '0';
                        preloader.style.visibility = 'hidden';
                        document.body.classList.remove('loading-active');
                        document.body.classList.add('hero-animate');
                    });
                } else {
                    // Fallback in case the button is missing from HTML
                    setTimeout(() => {
                        preloader.style.opacity = '0';
                        preloader.style.visibility = 'hidden';
                        document.body.classList.remove('loading-active');
                        document.body.classList.add('hero-animate');
                    }, 300);
                }
            }
        }

        function animateProgress(target, callback) {
            const step = () => {
                if (currentPercent < target) {
                    currentPercent = Math.min(currentPercent + 4, target);
                    progressBarFill.style.width = `${currentPercent}%`;
                    loaderPercent.textContent = `${currentPercent}%`;
                    requestAnimationFrame(step);
                } else {
                    callback();
                }
            };
            requestAnimationFrame(step);
        }

        setTimeout(addConsoleLine, 200);
    }

    /* ==========================================================================
       NAVBAR SCROLL EFFECT
       ========================================================================== */
    const navbar = document.querySelector('.container-2');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.9)';
                navbar.style.paddingTop = '0.5rem';
                navbar.style.paddingBottom = '0.5rem';
                navbar.style.marginTop = '0.75rem';
                navbar.style.width = '95%';
                navbar.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.5)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.45)';
                navbar.style.paddingTop = '';
                navbar.style.paddingBottom = '';
                navbar.style.marginTop = '1.5rem';
                navbar.style.width = '90%';
                navbar.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
            }
        });
    }

    /* ==========================================================================
       CUSTOM TRAILING CURSOR
       ========================================================================== */
    const cursor = document.querySelector('.cursor-jm');
    
    if (cursor && !('ontouchstart' in window)) {
        cursor.style.display = 'flex';
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function animateCursor() {
            let distX = mouseX - cursorX;
            let distY = mouseY - cursorY;
            
            cursorX += distX * 0.15;
            cursorY += distY * 0.15;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        const hoverables = document.querySelectorAll('a, button, .filter-btn, .project-card, .glass-card');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                if (item.classList.contains('project-card') || item.tagName === 'A') {
                    cursor.querySelector('.text-jm-cursor').textContent = 'view';
                } else {
                    cursor.querySelector('.text-jm-cursor').textContent = 'click';
                }
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });

        const textInputs = document.querySelectorAll('input, textarea, select');
        textInputs.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('typing-mode');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('typing-mode');
            });
        });
    }

    /* ==========================================================================
       TYPING EFFECT (HERO TAGLINE)
       ========================================================================== */
    const typedTextSpan = document.querySelector(".typed-text");
    const roles = ["Python Full Stack Developer", "Django Backend Developer", "Database Specialist", "Aspiring DevOps Engineer"];
    const typingDelay = 100;
    const erasingDelay = 60;
    const newRoleDelay = 2000; 
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newRoleDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            roleIndex++;
            if (roleIndex >= roles.length) roleIndex = 0;
            setTimeout(type, typingDelay + 500);
        }
    }

    if (typedTextSpan) {
        typedTextSpan.textContent = ""; // Clear fallback text before typing starts
        setTimeout(type, newRoleDelay);
    }

    /* ==========================================================================
       SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                
                // If it's a skills section, animate the progress bars
                if (entry.target.classList.contains('skills-category') || entry.target.id === 'skills') {
                    animateSkillBars(entry.target);
                }
                
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    function animateSkillBars(parent) {
        const skillBars = parent.querySelectorAll('.skill-bar-fill');
        skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = `${percent}%`;
        });
    }

    /* ==========================================================================
       DYNAMIC PROJECT FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-wrapper');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active state from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add fade out class
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       ACTIVE NAVBAR LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & HANDLING
       ========================================================================== */
    const contactForm = document.getElementById('portfolioContactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Fetch inputs
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');
            const submitBtn = contactForm.querySelector('.form-btn');

            // Validate
            if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                showFeedback('Please fill out all required fields.', 'error');
                return;
            }

            if (!isValidEmail(emailInput.value.trim())) {
                showFeedback('Please provide a valid email address.', 'error');
                return;
            }

            // Simulating loading state and WhatsApp redirection
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Redirecting...';
            formFeedback.style.display = 'none';

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim() || 'General Inquiry';
            const message = messageInput.value.trim();

            // Format message for WhatsApp click-to-chat
            const formattedMsg = `💼 *NEW SERVICE REQUEST*\n` +
                                 `━━━━━━━━━━━━━━━━━━━━\n` +
                                 `👤 *Name:* ${name}\n` +
                                 `📧 *Email:* ${email}\n` +
                                 `🎯 *Subject:* ${subject}\n` +
                                 `📝 *Message:* ${message}`;

            const encodedMsg = encodeURIComponent(formattedMsg);
            const whatsappUrl = `https://wa.me/918870798720?text=${encodedMsg}`;

            // Redirect with a slight user feedback delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;

                // Open WhatsApp message link in a new tab
                window.open(whatsappUrl, '_blank');

                // Show success feedback
                showFeedback('Redirecting to WhatsApp to send your request. Thank you!', 'success');
                contactForm.reset();
            }, 800);
        });
    }

    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function showFeedback(message, type) {
        formFeedback.textContent = message;
        formFeedback.className = 'form-feedback ' + type;
        
        // Auto scroll feedback to viewport
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
