gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing site structure ONLY (Animations Disabled).');

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

    // const initAnimations = () => {
    //     // All animation code commented out or removed
    // };

     const setupButtonClickFeedback = () => {
         // Basic feedback can remain if desired, but advanced GSAP effects removed
        selectAll('.btn').forEach(button => {
             if(button.closest('#ease-contact-form') && button.type === 'submit') return;
             // Simple hover/active states handled by Tailwind/DaisyUI
        });

        const contactForm = select('#ease-contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const button = contactForm.querySelector('.contact-button');
                button.disabled = true;
                button.innerHTML = `<span class="loading loading-spinner loading-sm"></span> Sending...`;
                 setTimeout(() => {
                    button.innerHTML = 'Message Sent!';
                    button.classList.remove('btn-primary'); button.classList.add('btn-success');
                     setTimeout(() => {
                        button.disabled = false; button.innerHTML = 'Send Message';
                         button.classList.remove('btn-success'); button.classList.add('btn-primary');
                     }, 3000);
                }, 800);
            });
        }
     };

    setupNavbarToggle();
    setupSmoothScroll();
    setupBookingModal();
    // initAnimations(); // Animation function call REMOVED
    setupButtonClickFeedback();

    console.log('Ease website NO ANIMATION version initialized!');
});