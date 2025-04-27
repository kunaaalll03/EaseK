// Ease Website - main.js with Bulma, GSAP Animations & Refinements

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing improved animations...');

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- Bulma Navbar Burger Toggle ---
    const setupNavbarToggle = () => {
        const navbarBurgers = Array.prototype.slice.call(selectAll('.navbar-burger'), 0);
        if (navbarBurgers.length > 0) {
            navbarBurgers.forEach( el => {
                el.addEventListener('click', () => {
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);
                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');
                });
            });
        }
    };

    // --- Smooth Scrolling ---
    const setupSmoothScroll = () => {
        selectAll('.navbar-menu a[href^="#"], .navbar-brand a[href^="#"], .hero-button[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = select(targetId);
                const navbarHeight = select('#main-navbar')?.offsetHeight || 52;

                if(targetElement) {
                    const navbarMenu = select('#navbarEaseMenu');
                    const navbarBurger = select('.navbar-burger[data-target="navbarEaseMenu"]');
                    if (navbarMenu?.classList.contains('is-active')) {
                        navbarMenu.classList.remove('is-active');
                        navbarBurger?.classList.remove('is-active');
                    }

                    let targetPosition = targetElement.offsetTop - navbarHeight;
                    if (targetId === '#hero') {
                        targetPosition = 0;
                    }

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // --- GSAP Animations ---
    const initAnimations = () => {
        // General Animation Defaults
        const defaultEase = "power3.out";
        const defaultDuration = 0.9;

        // Hero Section Entrance Animation
        const heroTl = gsap.timeline({ delay: 0.3, defaults: { ease: defaultEase } });
        heroTl.fromTo(".hero-title.anim-fade-up",
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2 }
            )
            .fromTo(".hero-subtitle.anim-fade-up",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=0.9" // Overlap timing
            )
            .fromTo(".hero-button.anim-fade-up",
                { y: 40, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
                "-=0.7"
            );

        // Hero Background Shape Parallax on Scroll
        gsap.utils.toArray('.hero-background-shapes .shape').forEach((shape, i) => {
            let depth = 1 + i * 0.2; // Adjust depth factor for different shapes
            gsap.to(shape, {
                y: (index, target) => ScrollTrigger.maxScroll(window) * 0.1 * depth, // Move slower based on depth
                // x: (index, target) => ScrollTrigger.maxScroll(window) * 0.05 * depth * (i % 2 === 0 ? -1 : 1), // Optional horizontal movement
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.5 + depth // Slower scrub for deeper elements
                }
            });
        });


        // Reusable Scroll-Triggered Fade-Up Animation Function
        const animateOnScroll = (selector, triggerEl, staggerVal = 0.1, fromState = { y: 50, opacity: 0 }) => {
            const elements = gsap.utils.toArray(selector);
            if (elements.length === 0) return;

            gsap.fromTo(elements,
                fromState,
                {
                    y: 0,
                    x: 0,
                    opacity: 1,
                    duration: defaultDuration,
                    ease: defaultEase,
                    stagger: staggerVal,
                    scrollTrigger: {
                        trigger: triggerEl || elements[0].parentNode, // Use parent if no trigger defined
                        start: "top 85%", // When element top hits 85% from viewport top
                        toggleActions: "play none none none", // Play once on enter
                        // markers: true, // Uncomment for debugging
                    }
                }
            );
        };

        // Animate Section Titles
        animateOnScroll('.section-title.anim-fade-up', null, 0);

        // Animate Feature Items
        animateOnScroll('#features .feature-item.anim-fade-up', '#features .feature-list');

        // Animate Destination Cards
        animateOnScroll('#destinations .destination-card.anim-fade-up', '#destinations .destination-list');

        // Animate Contact Section Elements
        animateOnScroll('.contact-info.anim-fade-left', '#contact .columns', 0, { x: -50, opacity: 0 });
        // Add slight delay to the form animation start
        gsap.delayedCall(0.15, () => {
             animateOnScroll('.contact-form.anim-fade-right', '#contact .columns', 0, { x: 50, opacity: 0 });
        });

    };

     // --- Button Click Feedback ---
     const setupButtonClickFeedback = () => {
        selectAll('.hero-button, .contact-button').forEach(button => {
            button.addEventListener('click', (e) => {
                // Only animate if it's not a form submission prevented elsewhere
                 if (button.type !== 'submit' || !button.closest('form')) {
                    gsap.to(button, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
                 }
                 // Note: Form submission feedback is handled in its own listener
            });
        });

        const contactForm = select('#ease-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevent actual submission
                const button = contactForm.querySelector('.contact-button');
                gsap.to(button, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
                console.log('Contact form submitted! (Simulation)');
                // Add a small delay before alert for effect
                setTimeout(() => {
                    alert('Message sent! (Simulation - No backend configured)');
                    // contactForm.reset(); // Optionally clear the form
                }, 200);
            });
        }
     };


    // --- Initialization ---
    setupNavbarToggle();
    setupSmoothScroll();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website initialized!');
});