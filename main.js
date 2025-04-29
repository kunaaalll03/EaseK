gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing Enhanced Tailwind/DaisyUI site...');

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    const setupNavbarToggle = () => {
        const drawerCheckbox = select('#mobile-drawer');
        const drawerLinks = selectAll('.drawer-side a');

        // Close drawer when a link is clicked
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (drawerCheckbox) {
                    drawerCheckbox.checked = false; // Uncheck to close drawer
                }
            });
        });
    };

    const setupNavbarScroll = () => {
        const navbar = select('#main-navbar');
        if (!navbar) return;

        ScrollTrigger.create({
            start: 'top -60', // Trigger slightly after scrolling past top
            end: 99999,
            toggleClass: { className: 'navbar-scrolled', targets: navbar }
        });
        // We'll use CSS to style the .navbar-scrolled state if needed (e.g., adding bg)
        // For now, DaisyUI handles the background/blur via navbar classes
    };


    const setupSmoothScroll = () => {
        selectAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || !href.startsWith('#')) return;

                e.preventDefault();
                const targetElement = select(href);
                 // Get height from the header container, not the sticky wrapper
                const navbarHeight = select('#main-navbar > .navbar')?.offsetHeight || 64;

                if (targetElement) {
                    const drawerCheckbox = select('#mobile-drawer');
                    if(drawerCheckbox && drawerCheckbox.checked) {
                        drawerCheckbox.checked = false; // Close drawer if open
                    }

                    let targetPosition = targetElement.offsetTop - navbarHeight - 20; // Increased offset
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

        const openModal = (city) => {
            if (!modal || !modalCityDisplay) return;
            modalCityDisplay.textContent = `Selected City: ${city}`;
            modal.showModal();
        };

        openModalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const city = button.dataset.city;
                if (city) {
                    openModal(city);
                } else {
                    console.error("Button is missing data-city attribute");
                }
            });
        });

         const validateDates = () => {
             if (!checkinDateInput || !checkoutDateInput || !dateError) return true;
             const checkin = new Date(checkinDateInput.value);
             const checkout = new Date(checkoutDateInput.value);

             if (checkinDateInput.value && checkoutDateInput.value && checkout <= checkin) {
                 dateError.style.display = 'block';
                 return false;
             } else {
                 dateError.style.display = 'none';
                 return true;
             }
         };

         checkinDateInput?.addEventListener('change', validateDates);
         checkoutDateInput?.addEventListener('change', validateDates);

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!validateDates()) return;

                const formData = new FormData(bookingForm);
                const city = modalCityDisplay.textContent.replace('Selected City: ', '');
                const checkin = formData.get('checkin');
                const checkout = formData.get('checkout');
                const rooms = formData.get('rooms');
                const guests = formData.get('guests');

                console.log('Searching for stays:', { city, checkin, checkout, rooms, guests });
                alert(`Searching stays in ${city} from ${checkin} to ${checkout} for ${guests} guest(s) in ${rooms} room(s).\n(Backend integration needed!)`);
                 if(modal) modal.close();
            });
        }
    };

    const initAnimations = () => {
        const defaultEase = "power3.out";
        const defaultDuration = 0.9;

        gsap.utils.toArray('.hero-content .anim-reveal').forEach((el, index) => {
             gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 0.3 + index * 0.15 });
        });

         gsap.utils.toArray('.hero-bg-el').forEach((el, index) => {
             gsap.fromTo(el, { y: gsap.utils.random(-30, 30), x: gsap.utils.random(-30, 30), scale: 0.8 }, { y: `random(-50, 50)`, x: `random(-50, 50)`, scale: 1.1, duration: gsap.utils.random(10, 15), ease: "sine.inOut", repeat: -1, yoyo: true, delay: index * 1.5 });
         });

        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 60 }, staggerVal = 0.1) => {
            const elements = gsap.utils.toArray(selector);
            if (elements.length === 0) return;
            gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, duration: defaultDuration, ease: defaultEase, stagger: staggerVal,
                scrollTrigger: { trigger: triggerEl || elements[0].parentNode, start: "top 88%", end: "bottom top", toggleActions: "play none none none" }
            });
        };

        animateOnScroll('.section-title.anim-fade-up', null, { opacity: 0, y: 40 }, 0);
        animateOnScroll('.features-section .feature-item.anim-fade-up', '.features-section .feature-list', { opacity: 0, y: 40, scale: 0.95 }, 0.1);
        animateOnScroll('.destinations-section .destination-card.anim-fade-up', '.destinations-section .destination-list', { opacity: 0, y: 40, scale: 0.98 }, 0.1);
        animateOnScroll('.contact-info.anim-fade-left', '#contact .grid', { opacity: 0, x: -50 }, 0);
        gsap.delayedCall(0.15, () => { animateOnScroll('.contact-form.anim-fade-right', '#contact .grid', { opacity: 0, x: 50 }, 0); });
    };

     const setupButtonClickFeedback = () => {
        selectAll('.btn:not(.contact-button)').forEach(button => {
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
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-success');
                        gsap.to(button, { scale: 1, duration: 0.2 });
                         setTimeout(() => {
                            button.disabled = false;
                            button.innerHTML = 'Send Message';
                             button.classList.remove('btn-success');
                             button.classList.add('btn-primary');
                         }, 3000);
                    }, 800);
                }});
            });
        }
     };

    setupNavbarToggle();
    // setupNavbarScroll(); // Re-enable if needed and styled
    setupSmoothScroll();
    setupBookingModal();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website Enhanced Tailwind/DaisyUI initialized!');
});