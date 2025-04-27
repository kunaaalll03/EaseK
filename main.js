// Ease Website - main.js - Modern Refined Edition

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing modern refined animations...');

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- Navbar Burger Toggle ---
    const setupNavbarToggle = () => {
        const navbarBurgers = Array.from(selectAll('.navbar-burger'));
        navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    };

    // --- Navbar Scroll Effect ---
    const setupNavbarScroll = () => {
        const navbar = select('#main-navbar');
        if (!navbar) return;
        ScrollTrigger.create({
            start: 50,
            end: 99999,
            onUpdate: self => {
                if (self.isActive && !navbar.classList.contains('is-scrolled')) {
                    navbar.classList.add('is-scrolled');
                    navbar.classList.remove('is-transparent-navbar');
                } else if (!self.isActive && navbar.classList.contains('is-scrolled')) {
                    navbar.classList.remove('is-scrolled');
                    navbar.classList.add('is-transparent-navbar');
                }
            },
        });
    };


    // --- Smooth Scrolling ---
    const setupSmoothScroll = () => {
        selectAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || !href.startsWith('#')) return;

                e.preventDefault();
                const targetElement = select(href);
                const navbarHeight = select('#main-navbar')?.offsetHeight || 52;

                if (targetElement) {
                    const navbarMenu = select('#navbarEaseMenu');
                    const navbarBurger = select('.navbar-burger[data-target="navbarEaseMenu"]');
                    if (navbarMenu?.classList.contains('is-active')) {
                        navbarMenu.classList.remove('is-active');
                        navbarBurger?.classList.remove('is-active');
                    }

                    let targetPosition = targetElement.offsetTop - navbarHeight - 10; // Add small offset
                    if (href === '#hero') targetPosition = 0;

                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    };

    // --- GSAP Animations ---
    const initAnimations = () => {
        const defaultEase = "power3.out";
        const defaultDuration = 0.8;

        // Hero Entrance Animation (Staggered lines/elements)
        gsap.utils.toArray('.hero-content .anim-reveal').forEach((el, index) => {
            gsap.fromTo(el,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: defaultDuration,
                    ease: defaultEase,
                    delay: 0.2 + index * 0.15
                }
            );
        });

         // Hero Background Elements Subtle Animation
         gsap.utils.toArray('.hero-bg-el').forEach((el, index) => {
             gsap.fromTo(el,
                { y: gsap.utils.random(-20, 20), x: gsap.utils.random(-20, 20) },
                {
                    y: `random(-40, 40)`,
                    x: `random(-40, 40)`,
                    duration: gsap.utils.random(8, 12),
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 1.5
                });
         });

        // General Scroll Animation Function
        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 50 }, staggerVal = 0.1) => {
            const elements = gsap.utils.toArray(selector);
            if (elements.length === 0) return;

            gsap.fromTo(elements, fromState, {
                opacity: 1, y: 0, x: 0,
                duration: defaultDuration,
                ease: defaultEase,
                stagger: staggerVal,
                scrollTrigger: {
                    trigger: triggerEl || elements[0].parentNode,
                    start: "top 85%",
                    end: "bottom top",
                    toggleActions: "play none none none",
                    // markers: true,
                }
            });
        };

        // Animate Section Titles
        animateOnScroll('.section-title.anim-fade-up', null, { opacity: 0, y: 40 }, 0);

        // Animate Feature Items
        animateOnScroll('#features .feature-item.anim-fade-up', '#features .feature-list', { opacity: 0, y: 40 }, 0.1);

        // Animate Destination Cards
        animateOnScroll('#destinations .destination-card.anim-fade-up', '#destinations .destination-list', { opacity: 0, y: 40 }, 0.1);

        // Animate Contact Section Sides
        animateOnScroll('.contact-info.anim-fade-left', '#contact .columns', { opacity: 0, x: -40 }, 0);
        gsap.delayedCall(0.1, () => {
             animateOnScroll('.contact-form.anim-fade-right', '#contact .columns', { opacity: 0, x: 40 }, 0);
        });
    };

     // --- Button Click Feedback ---
     const setupButtonClickFeedback = () => {
        selectAll('.button:not(.contact-button)').forEach(button => {
            button.addEventListener('mousedown', () => gsap.to(button, { scale: 0.96, duration: 0.1 }));
            button.addEventListener('mouseup', () => gsap.to(button, { scale: 1, duration: 0.1 }));
            button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1, duration: 0.1 }));
        });

        const contactForm = select('#ease-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const button = contactForm.querySelector('.contact-button');
                button.disabled = true;
                button.textContent = 'Sending...';

                gsap.to(button, { scale: 0.96, duration: 0.1, onComplete: () => {
                    setTimeout(() => {
                        button.textContent = 'Message Sent!';
                        gsap.to(button, { backgroundColor: 'hsl(141, 71%, 48%)', borderColor: 'hsl(141, 71%, 48%)', color:'white', scale: 1, duration: 0.2 });
                         setTimeout(() => {
                            button.disabled = false;
                            button.textContent = 'Send Message';
                            gsap.to(button, { backgroundColor: '', borderColor: '', color:'', duration: 0.2 });
                         }, 3000);
                    }, 800);
                }});
            });
        }
     };

    // --- Initialization ---
    setupNavbarToggle();
    setupNavbarScroll();
    setupSmoothScroll();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website modern refined edition initialized!');
});