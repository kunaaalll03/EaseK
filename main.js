gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing ADVANCED Tailwind/DaisyUI site...');

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);
    const lerp = (start, end, amount) => (1 - amount) * start + amount * end; // Linear interpolation

    // --- Custom Cursor ---
    const cursor = select('.custom-cursor');
    const cursorDot = select('.custom-cursor-dot');
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    const speed = 0.15; // Smoothing factor

    const updateCursor = () => {
        cursorX = lerp(cursorX, targetX, speed);
        cursorY = lerp(cursorY, targetY, speed);
        if (cursor && cursorDot) {
            cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
            cursorDot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`; // Dot follows directly
        }
        requestAnimationFrame(updateCursor);
    };
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    requestAnimationFrame(updateCursor); // Start the animation loop

    // Cursor Hover Effects
    selectAll('a, button, label[for], .magnetic-link').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor?.classList.add('hover-effect');
            cursorDot?.classList.add('hover-effect');
        });
        el.addEventListener('mouseleave', () => {
            cursor?.classList.remove('hover-effect');
            cursorDot?.classList.remove('hover-effect');
        });
    });


    // --- Magnetic Effect on Links/Buttons ---
    const magneticElements = selectAll('.magnetic-link');
    magneticElements.forEach(el => {
        let rect = null;
        let x = 0, y = 0;
        let isHovering = false;

        el.addEventListener('mouseenter', () => {
            rect = el.getBoundingClientRect();
            isHovering = true;
            gsap.to(el, { duration: 0.3, scale: 1.05, ease: 'power2.out' }); // Slight scale on hover
        });

        el.addEventListener('mousemove', (e) => {
            if (!isHovering || !rect) return;
            const proximity = 0.5; // How close mouse needs to be (0-1)
            const strength = 0.3; // How strong the pull is (0-1)

            x = lerp(x, (e.clientX - (rect.left + rect.width / 2)) * strength, proximity);
            y = lerp(y, (e.clientY - (rect.top + rect.height / 2)) * strength, proximity);

            gsap.to(el, { duration: 0.3, x: x, y: y, ease: 'power2.out' });
        });

        el.addEventListener('mouseleave', () => {
            isHovering = false;
            x = 0; y = 0;
            gsap.to(el, { duration: 0.5, x: 0, y: 0, scale: 1, ease: 'elastic.out(1, 0.5)' }); // Elastic return
        });
    });

    // --- Navbar Logic ---
    const setupNavbarToggle = () => {
        const drawerCheckbox = select('#mobile-drawer');
        const drawerLinks = selectAll('.drawer-side a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => { if (drawerCheckbox) drawerCheckbox.checked = false; });
        });
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

    // --- Booking Modal Logic ---
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
                e.preventDefault(); const city = button.dataset.city;
                if (city) openModal(city);
                else console.error("Button is missing data-city attribute");
            });
        });
        const validateDates = () => {
            if (!checkinDateInput || !checkoutDateInput || !dateError) return true;
            const checkin = new Date(checkinDateInput.value); const checkout = new Date(checkoutDateInput.value);
            const valid = !(checkinDateInput.value && checkoutDateInput.value && checkout <= checkin);
            dateError.style.display = valid ? 'none' : 'block';
            return valid;
        };
        checkinDateInput?.addEventListener('change', validateDates);
        checkoutDateInput?.addEventListener('change', validateDates);
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault(); if (!validateDates()) return;
                const formData = new FormData(bookingForm);
                const city = modalCityDisplay.textContent.replace('Selected City: ', '');
                const checkin = formData.get('checkin'); const checkout = formData.get('checkout');
                const rooms = formData.get('rooms'); const guests = formData.get('guests');
                console.log('Searching for stays:', { city, checkin, checkout, rooms, guests });
                alert(`Searching stays in ${city} from ${checkin} to ${checkout}.\n(Backend integration needed!)`);
                if(modal) modal.close();
            });
        }
    };

    // --- GSAP Advanced Animations ---
    const initAnimations = () => {
        const defaultEase = "expo.out"; // Smoother ease
        const defaultDuration = 1.2;

        // Hero Text Reveal (Characters)
        const heroTitle = select('.hero-title[data-split-chars]');
        if (heroTitle) {
            const splitChars = new SplitText(heroTitle, { type: "chars, words" });
            gsap.set(heroTitle, { perspective: 500 });
            gsap.from(splitChars.chars, {
                duration: 0.7, delay: 0.4, scale: 1.8, opacity: 0, rotationX: -100,
                transformOrigin: "50% 50% -60", ease: "back.out(2)", stagger: 0.03,
            });
        }
        gsap.fromTo('.hero-subtitle.anim-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 1.0 });
        gsap.fromTo('.hero-button.anim-reveal', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: defaultDuration, ease: "elastic.out(1, 0.6)", delay: 1.2 });

        // Section Title Reveal (Words)
        selectAll('.section-title[data-split-words]').forEach(title => {
            const splitWords = new SplitText(title, { type: "words" });
            gsap.from(splitWords.words, {
                opacity: 0, y: 30, duration: 0.8, ease: defaultEase, stagger: 0.08,
                scrollTrigger: { trigger: title, start: "top 90%", toggleActions: "play none none none" }
            });
        });
        // Section Title Reveal (Lines for Contact)
         selectAll('.section-title[data-split-lines]').forEach(title => {
            const splitLines = new SplitText(title, { type: "lines" });
            gsap.from(splitLines.lines, {
                opacity: 0, y: 50, rotationX:-30, duration: 0.8, ease: defaultEase, stagger: 0.1,
                scrollTrigger: { trigger: title, start: "top 90%", toggleActions: "play none none none" }
            });
        });


        // General Scroll Animation Function
        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 60 }, staggerVal = 0.1, scrub = false) => {
            const elements = gsap.utils.toArray(selector);
            if (elements.length === 0) return;
            gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, scale: 1, rotationX: 0, duration: defaultDuration, ease: defaultEase, stagger: staggerVal, scrollTrigger: {
                trigger: triggerEl || elements[0].parentNode,
                start: "top 88%", end: "bottom center",
                toggleActions: scrub ? "play none none none" : "play none none reset", // Reset if not scrubbing
                scrub: scrub ? 1.5 : false
            }});
        };

        // Feature Items (Stagger from center out?)
        const featureItems = gsap.utils.toArray('.feature-item.anim-fade-up');
        gsap.fromTo(featureItems, { opacity: 0, y: 50, scale: 0.9 }, {
            opacity: 1, y: 0, scale: 1, duration: defaultDuration * 0.8, ease: defaultEase,
            stagger: { amount: 0.4, from: "center" }, // Stagger from center
            scrollTrigger: { trigger: '.feature-list', start: "top 85%", toggleActions: "play none none reset" }
        });

        // Destination Cards - Image Reveal Mask
        selectAll('.img-reveal').forEach(img => {
            gsap.fromTo(img,
                { opacity: 0, scale: 1.1, clipPath: 'inset(0% 50% 0% 50%)' }, // Start clipped horizontally
                { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.out', delay: 0.2, // Slight delay after card reveals
                scrollTrigger: { trigger: img.closest('.destination-card'), start: "top 85%", toggleActions: "play none none reset" }
            });
        });
         // Animate card itself slightly before image reveal
         animateOnScroll('.destinations-section .destination-card', '.destinations-section .destination-list', { opacity: 0, y: 40 }, 0.1);

        // Contact Section
        animateOnScroll('.contact-info .anim-fade-up', '.contact-info', { opacity: 0, y: 30 }, 0.15); // Stagger contact details
        animateOnScroll('.contact-form .anim-form-field', '.contact-form', { opacity: 0, y: 30 }, 0.1); // Stagger form fields

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
    // setupNavbarScroll(); // Optional: Refine later if needed
    setupSmoothScroll();
    setupBookingModal();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website ADVANCED edition initialized!');
});