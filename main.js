gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing Simplified Animations V4...');

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    const setupNavbarToggle = () => {
        const drawerCheckbox = select('#mobile-drawer');
        const drawerLinks = selectAll('.drawer-side a');
        drawerLinks.forEach(link => { link.addEventListener('click', () => { if (drawerCheckbox) drawerCheckbox.checked = false; }); });
    };

    const setupSmoothScroll = () => {
         selectAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || !href.startsWith('#')) return;
                e.preventDefault();
                const targetElement = select(href);
                const navbarHeight = select('#main-navbar > .navbar')?.offsetHeight || 64;
                if (targetElement) {
                    const drawerCheckbox = select('#mobile-drawer');
                    if(drawerCheckbox && drawerCheckbox.checked) drawerCheckbox.checked = false;
                    let targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    if (href === '#hero') targetPosition = 0;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            });
        });
    };

    const setupBookingModal = () => {
        const modal = select('#booking-modal');
        const modalCityDisplay = select('#modal-city-display');
        const openModalButtons = selectAll('.open-booking-modal');
        const checkinDateInput = select('#checkin-date');
        const checkoutDateInput = select('#checkout-date');
        const dateError = select('#date-error');
        const bookingForm = select('#modal-booking-form');

        const openModal = (city) => { if (!modal || !modalCityDisplay) return; modalCityDisplay.textContent = `Selected City: ${city}`; modal.showModal(); };
        openModalButtons.forEach(button => { button.addEventListener('click', (e) => { e.preventDefault(); const city = button.dataset.city; if (city) openModal(city); }); });
        const validateDates = () => { if (!checkinDateInput || !checkoutDateInput || !dateError) return true; const checkin = new Date(checkinDateInput.value); const checkout = new Date(checkoutDateInput.value); const valid = !(checkinDateInput.value && checkoutDateInput.value && checkout <= checkin); dateError.style.display = valid ? 'none' : 'block'; return valid; };
        checkinDateInput?.addEventListener('change', validateDates); checkoutDateInput?.addEventListener('change', validateDates);
        if (bookingForm) { bookingForm.addEventListener('submit', (e) => { e.preventDefault(); if (!validateDates()) return; const formData = new FormData(bookingForm); const city = modalCityDisplay.textContent.replace('Selected City: ', ''); const checkin = formData.get('checkin'); const checkout = formData.get('checkout'); const rooms = formData.get('rooms'); const guests = formData.get('guests'); console.log('Searching for stays:', { city, checkin, checkout, rooms, guests }); alert(`Searching stays in ${city} from ${checkin} to ${checkout}.\n(Backend integration needed!)`); if(modal) modal.close(); }); }
    };

    // === RE-ENABLED ANIMATIONS ===
    const initAnimations = () => {
        const defaultEase = "power3.out";
        const defaultDuration = 0.8;

        // Simple reveal for hero elements
        gsap.utils.toArray('.hero-content .anim-reveal').forEach((el, index) => {
             gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 0.2 + index * 0.15 });
        });

        // Re-enabled simple hero background element movement
        gsap.utils.toArray('.hero-bg-el').forEach((el, index) => {
            const depth = (index + 1) * 0.2;
            gsap.to(el, {
                yPercent: -15 * depth,
                ease: "none",
                scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: 1.5 + depth }
            });
            gsap.to(el, {
                 x: `random(-15, 15)%`, rotation: `random(-10, 10)`, duration: `random(15, 25)`,
                 ease: "sine.inOut", repeat: -1, yoyo: true
             });
        });

        // Re-enabled General Scroll Animation Function
        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 50 }, staggerVal = 0.1) => {
            const elements = gsap.utils.toArray(selector); if (elements.length === 0) return;
            gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, duration: defaultDuration, ease: defaultEase, stagger: staggerVal, scrollTrigger: { trigger: triggerEl || elements[0].parentNode, start: "top 85%", end: "bottom top", toggleActions: "play none none reset" }});
        };

        // Re-enabled scroll animations
        animateOnScroll('.section-title.anim-fade-up', null, { opacity: 0, y: 40 }, 0);
        animateOnScroll('.features-section .feature-item.anim-fade-up', '.features-section .feature-list', { opacity: 0, y: 40 }, 0.1);
        // Use anim-fade-up for destinations as well (removed anim-scroll-reveal)
        animateOnScroll('.destinations-section .destination-card.anim-fade-up', '.destinations-section .destination-list', { opacity: 0, y: 40 }, 0.1);
        // Re-enabled image reveal (simple fade/scale)
        selectAll('.img-reveal').forEach(img => {
            gsap.fromTo(img, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out', delay: 0.1, scrollTrigger: { trigger: img.closest('.destination-card'), start: "top 85%", toggleActions: "play none none reset" }});
        });
        animateOnScroll('.contact-info .anim-fade-left', '.contact-info', { opacity: 0, x: -40 }, 0); // Adjusted trigger
        animateOnScroll('.contact-form .anim-fade-right', '.contact-form', { opacity: 0, x: 40 }, 0); // Adjusted trigger
        animateOnScroll('.contact-form .anim-form-field', '.contact-form', { opacity: 0, y: 30 }, 0.1); // Re-added form field stagger

    };

     const setupButtonClickFeedback = () => {
        selectAll('.btn').forEach(button => {
             if(button.closest('#ease-contact-form') && button.type === 'submit') return;
             button.addEventListener('mousedown', () => gsap.to(button, { scale: 0.95, duration: 0.1 }));
             button.addEventListener('mouseup', () => gsap.to(button, { scale: 1, duration: 0.1 }));
             button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1, duration: 0.1 }));
        });
        const contactForm = select('#ease-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const button = contactForm.querySelector('.contact-button');
                button.disabled = true;
                button.innerHTML = `<span class="loading loading-spinner loading-sm"></span> Sending...`;
                gsap.to(button, { scale: 0.96, duration: 0.1, onComplete: () => {
                    setTimeout(() => {
                        button.innerHTML = 'Message Sent!';
                        button.classList.remove('btn-primary'); button.classList.add('btn-success');
                        gsap.to(button, { scale: 1, duration: 0.2 });
                         setTimeout(() => {
                            button.disabled = false; button.innerHTML = 'Send Message';
                             button.classList.remove('btn-success'); button.classList.add('btn-primary');
                         }, 3000);
                    }, 800);
                }});
            });
        }
     };

    setupNavbarToggle();
    setupSmoothScroll();
    setupBookingModal();
    initAnimations(); // Re-enabled call
    setupButtonClickFeedback();

    console.log('Ease website Re-enabled Animations V4 initialized!');
});