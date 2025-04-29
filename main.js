gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

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

                    let targetPosition = targetElement.offsetTop - navbarHeight - 10;
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
        const closeModalElements = selectAll('.modal-background, .modal-close');
        const checkinDateInput = select('#checkin-date');
        const checkoutDateInput = select('#checkout-date');
        const dateError = select('#date-error');
        const bookingForm = select('#modal-booking-form');
        const htmlElement = document.documentElement;

        const openModal = (city) => {
            if (!modal || !modalCityDisplay) return;
            modalCityDisplay.textContent = `Selected City: ${city}`;
            modal.classList.add('is-active');
            htmlElement.classList.add('is-clipped');
        };

        const closeModal = () => {
            if (!modal) return;
            modal.classList.remove('is-active');
            htmlElement.classList.remove('is-clipped');
            if(dateError) dateError.style.display = 'none';
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

        closeModalElements.forEach(el => {
            el.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
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
                if (!validateDates()) {
                    console.log("Date validation failed");
                    return;
                }

                const formData = new FormData(bookingForm);
                const city = modalCityDisplay.textContent.replace('Selected City: ', '');
                const checkin = formData.get('checkin');
                const checkout = formData.get('checkout');
                const rooms = formData.get('rooms');
                const guests = formData.get('guests');

                console.log('Searching for stays:', { city, checkin, checkout, rooms, guests });
                alert(`Searching stays in ${city} from ${checkin} to ${checkout} for ${guests} guest(s) in ${rooms} room(s).\n(Backend integration needed!)`);

            });
        }
    };


    const initAnimations = () => {
        const defaultEase = "power3.out";
        const defaultDuration = 0.8;

        gsap.utils.toArray('.hero-content .anim-reveal').forEach((el, index) => {
            gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 0.2 + index * 0.15 });
        });

         gsap.utils.toArray('.hero-bg-el').forEach((el, index) => {
             gsap.fromTo(el, { y: gsap.utils.random(-20, 20), x: gsap.utils.random(-20, 20) }, { y: `random(-40, 40)`, x: `random(-40, 40)`, duration: gsap.utils.random(8, 12), ease: "sine.inOut", repeat: -1, yoyo: true, delay: index * 1.5 });
         });

        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 50 }, staggerVal = 0.1) => {
            const elements = gsap.utils.toArray(selector);
            if (elements.length === 0) return;
            gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, duration: defaultDuration, ease: defaultEase, stagger: staggerVal,
                scrollTrigger: { trigger: triggerEl || elements[0].parentNode, start: "top 85%", end: "bottom top", toggleActions: "play none none none" }
            });
        };

        animateOnScroll('.section-title.anim-fade-up', null, { opacity: 0, y: 40 }, 0);
        animateOnScroll('#features .feature-item.anim-fade-up', '#features .feature-list', { opacity: 0, y: 40 }, 0.1);
        animateOnScroll('#destinations .destination-card.anim-fade-up', '#destinations .destination-list', { opacity: 0, y: 40 }, 0.1);
        animateOnScroll('.contact-info.anim-fade-left', '#contact .columns', { opacity: 0, x: -40 }, 0);
        gsap.delayedCall(0.1, () => { animateOnScroll('.contact-form.anim-fade-right', '#contact .columns', { opacity: 0, x: 40 }, 0); });
    };

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

    setupNavbarToggle();
    setupNavbarScroll();
    setupSmoothScroll();
    setupBookingModal();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website initialized with booking modal!');
});