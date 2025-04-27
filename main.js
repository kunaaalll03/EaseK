// Ease Website - main.js with Bulma Integration & GSAP Animations

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing Bulma integration and animations...');

    // --- Bulma Navbar Burger Toggle ---
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if (navbarBurgers.length > 0) {
        navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                // Toggle the 'is-active' class on both the 'navbar-burger' and the 'navbar-menu'
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // --- General Animation Settings ---
    const defaultEase = "power2.out";
    const defaultDuration = 0.8;

    // --- Hero Section Animations ---
    const heroTl = gsap.timeline({ delay: 0.4 });
    heroTl.fromTo(".hero-title.anim-fade-up", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" })
          .fromTo(".hero-subtitle.anim-fade-up", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8")
          .fromTo(".hero-button.anim-fade-up", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.7")
          .from(".hero-background-shapes .shape", { // Shapes animation remains the same
              scale: 0,
              opacity: 0,
              duration: 1.8,
              stagger: 0.25,
              ease: "elastic.out(1, 0.6)"
          }, 0.6);

    // --- Reusable Scroll Animation Function (Using GSAP fromTo) ---
    function applyScrollAnimation(selector, triggerElement, stagger = 0.15, fromState = { y: 50, opacity: 0 }) {
        gsap.utils.toArray(selector).forEach((item, index) => {
             gsap.fromTo(item,
                fromState, // From state
                { // To state
                    y: 0,
                    x: 0, // Ensure x is reset if using horizontal fades
                    opacity: 1,
                    duration: defaultDuration,
                    ease: defaultEase,
                    scrollTrigger: {
                        trigger: triggerElement || item,
                        start: "top 85%", // Adjust trigger point if needed
                        toggleActions: "play none none none",
                        // markers: true, // Debugging
                    },
                    delay: index * stagger // Apply stagger
                }
            );
        });
    }

    // Apply scroll animation to Section Titles
    applyScrollAnimation('.section-title.anim-fade-up', null, 0); // No stagger needed for single titles

    // Apply stagger animation to Features (Targeting columns directly)
    applyScrollAnimation('#features .feature-item.anim-fade-up', '#features .feature-list', 0.15, { y: 50, opacity: 0 });

    // Apply stagger animation to Destinations (Targeting columns directly)
    applyScrollAnimation('#destinations .destination-card.anim-fade-up', '#destinations .destination-list', 0.15, { y: 50, opacity: 0 });

    // Apply scroll animation to Contact Info (Left)
    applyScrollAnimation('.contact-info.anim-fade-left', '#contact .columns', 0, { x: -50, opacity: 0 });

    // Apply scroll animation to Contact Form (Right)
    applyScrollAnimation('.contact-form.anim-fade-right', '#contact .columns', 0.2, { x: 50, opacity: 0 }); // Add slight delay


    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('.navbar-menu a[href^="#"], .navbar-brand a[href^="#"]').forEach(anchor => { // Updated selector to include logo link
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.getElementById('main-navbar')?.offsetHeight || 52; // Get navbar height

            if(targetElement) {
                 // Close mobile menu if open before scrolling
                const navbarMenu = document.getElementById('navbarEaseMenu');
                const navbarBurger = document.querySelector('.navbar-burger[data-target="navbarEaseMenu"]');
                if (navbarMenu && navbarMenu.classList.contains('is-active')) {
                    navbarMenu.classList.remove('is-active');
                    navbarBurger?.classList.remove('is-active');
                }

                let targetPosition = targetElement.offsetTop - navbarHeight;
                 if (targetId === '#hero') {
                     targetPosition = 0; // Scroll to top for hero
                 }

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- Button Click Feedback ---
    const exploreButton = document.querySelector('.hero-button');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            gsap.to(exploreButton, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
            console.log('Explore Stays Clicked! (Functionality pending)');
        });
    }
     const contactButton = document.querySelector('.contact-button');
     if (contactButton) {
        contactButton.closest('form').addEventListener('submit', (e) => {
             e.preventDefault();
             gsap.to(contactButton, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
             console.log('Contact form submitted! (Data not sent - frontend only)');
             alert('Message sent! (Simulation - No backend yet)');
             // e.target.reset();
        });
     }

    console.log('Ease Bulma integration animations initialized!');
});