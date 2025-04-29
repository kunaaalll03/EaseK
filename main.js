gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing ADVANCED Tailwind/DaisyUI site V2...');

    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);
    const lerp = (start, end, amount) => (1 - amount) * start + amount * end;

    const cursor = select('.custom-cursor');
    const cursorDot = select('.custom-cursor-dot');
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    const speed = 0.15;

    const updateCursor = () => {
        cursorX = lerp(cursorX, targetX, speed);
        cursorY = lerp(cursorY, targetY, speed);
        if (cursor && cursorDot) {
            cursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
            cursorDot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`;
        }
        requestAnimationFrame(updateCursor);
    };
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });
    if (window.matchMedia("(pointer: fine)").matches) { // Only run cursor logic for mouse devices
        requestAnimationFrame(updateCursor);
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
    } else {
        // Hide custom cursor on touch devices
        if(cursor) cursor.style.display = 'none';
        if(cursorDot) cursorDot.style.display = 'none';
        document.body.style.cursor = 'auto'; // Show default cursor
    }

    const magneticElements = selectAll('.magnetic-link');
    if (window.matchMedia("(pointer: fine)").matches) {
        magneticElements.forEach(el => {
            let rect = null;
            let x = 0, y = 0;
            let isHovering = false;
            el.addEventListener('mouseenter', () => {
                rect = el.getBoundingClientRect(); isHovering = true;
                gsap.to(el, { duration: 0.3, scale: 1.05, ease: 'power2.out' });
            });
            el.addEventListener('mousemove', (e) => {
                if (!isHovering || !rect) return;
                const proximity = 0.5; const strength = 0.3;
                x = lerp(x, (e.clientX - (rect.left + rect.width / 2)) * strength, proximity);
                y = lerp(y, (e.clientY - (rect.top + rect.height / 2)) * strength, proximity);
                gsap.to(el, { duration: 0.3, x: x, y: y, ease: 'power2.out' });
            });
            el.addEventListener('mouseleave', () => {
                isHovering = false; x = 0; y = 0;
                gsap.to(el, { duration: 0.5, x: 0, y: 0, scale: 1, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

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

    const initAnimations = () => {
        const defaultEase = "expo.out";
        const defaultDuration = 1.0; // Slightly faster duration

        const heroTitle = select('.hero-title[data-split-chars]');
        if (heroTitle) {
            const splitChars = new SplitText(heroTitle, { type: "chars, words" });
            gsap.set(heroTitle, { perspective: 500 });
            gsap.from(splitChars.chars, { duration: 0.6, delay: 0.3, scale: 1.5, opacity: 0, rotationX: -90, transformOrigin: "50% 50% -60", ease: "back.out(1.8)", stagger: 0.025, });
        }
        gsap.fromTo('.hero-subtitle.anim-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 0.8 });
        gsap.fromTo('.hero-button.anim-reveal', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: defaultDuration, ease: "elastic.out(1, 0.6)", delay: 1.0 });

        gsap.utils.toArray('.hero-bg-el').forEach((el, index) => { gsap.fromTo(el, { y: gsap.utils.random(-30, 30), x: gsap.utils.random(-30, 30), scale: 0.8 }, { y: `random(-50, 50)`, x: `random(-50, 50)`, scale: 1.1, duration: gsap.utils.random(10, 15), ease: "sine.inOut", repeat: -1, yoyo: true, delay: index * 1.5 }); });

        selectAll('.section-title[data-split-words]').forEach(title => {
            const splitWords = new SplitText(title, { type: "words" });
            gsap.from(splitWords.words, { opacity: 0, y: 30, duration: 0.6, ease: defaultEase, stagger: 0.06, scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none reset" } });
        });
         selectAll('.section-title[data-split-lines]').forEach(title => {
            const splitLines = new SplitText(title, { type: "lines" });
            gsap.from(splitLines.lines, { opacity: 0, y: 40, rotationX:-20, duration: 0.7, ease: defaultEase, stagger: 0.1, scrollTrigger: { trigger: title, start: "top 88%", toggleActions: "play none none reset" } });
        });

        const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 50 }, staggerVal = 0.08, scrub = false) => {
            const elements = gsap.utils.toArray(selector); if (elements.length === 0) return;
            gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, scale: 1, rotationX: 0, duration: defaultDuration * 0.9, ease: defaultEase, stagger: staggerVal, scrollTrigger: { trigger: triggerEl || elements[0].parentNode, start: "top 88%", end: "bottom center", toggleActions: scrub ? "play none none none" : "play none none reset", scrub: scrub ? 1.5 : false }});
        };

        animateOnScroll('.features-section .feature-item', '.features-section .feature-list', { opacity: 0, y: 40, scale: 0.95 }, 0.08);

        selectAll('.img-reveal').forEach(img => {
            gsap.fromTo(img, { opacity: 0, scale: 1.1, clipPath: 'inset(0% 50% 0% 50%)' }, { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out', delay: 0.1, scrollTrigger: { trigger: img.closest('.destination-card'), start: "top 85%", toggleActions: "play none none reset" } });
        });
        animateOnScroll('.destinations-section .destination-card', '.destinations-section .destination-list', { opacity: 0, y: 40 }, 0.08);

        animateOnScroll('.contact-info .anim-fade-up', '.contact-info', { opacity: 0, y: 30 }, 0.1);
        gsap.delayedCall(0.1, () => { animateOnScroll('.contact-form .anim-form-field', '.contact-form', { opacity: 0, y: 30 }, 0.08); });

        // Floating background elements (can be added outside sections too)
        selectAll('.anim-float').forEach(el => {
            gsap.to(el, {
                y: "random(-20, 20)",
                x: "random(-15, 15)",
                rotation: "random(-10, 10)",
                duration: "random(5, 8)",
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });
    };

     const setupButtonClickFeedback = () => {
        selectAll('.btn').forEach(button => {
            // Exclude drawer button from complex animation
             if(button.classList.contains('drawer-button')) return;

            const btnText = button.innerHTML; // Store original text/HTML
            const contactForm = button.closest('#ease-contact-form');

            button.addEventListener('mousedown', () => {
                 if(button.disabled) return;
                 gsap.to(button, { scale: 0.95, duration: 0.1 });
             });
             button.addEventListener('mouseup', () => {
                  if(button.disabled) return;
                 gsap.to(button, { scale: 1, duration: 0.1 });
             });
            button.addEventListener('mouseleave', () => {
                 if(button.disabled) return;
                 gsap.to(button, { scale: 1, duration: 0.1 });
             });

            // Specific handling for contact form submission
            if (contactForm && button.type === 'submit') {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    button.disabled = true;
                    button.innerHTML = `<span class="loading loading-spinner loading-sm"></span> Sending...`;
                    gsap.to(button, { scale: 0.96, duration: 0.1, onComplete: () => {
                        setTimeout(() => {
                            button.innerHTML = 'Message Sent!';
                            button.classList.remove('btn-primary'); button.classList.add('btn-success');
                            gsap.to(button, { scale: 1, duration: 0.2 });
                            setTimeout(() => {
                                button.disabled = false; button.innerHTML = btnText;
                                button.classList.remove('btn-success'); button.classList.add('btn-primary');
                            }, 3000);
                        }, 800);
                    }});
                });
            }
        });
     };

    setupNavbarToggle();
    setupSmoothScroll();
    setupBookingModal();
    initAnimations();
    setupButtonClickFeedback();

    console.log('Ease website ADVANCED V2 initialized!');
});