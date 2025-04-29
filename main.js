// Ease Website - main.js - V3 (Booking Feature)

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded. Initializing booking feature...');

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- DOM Element References ---
    const bookingSection = select('#booking-details');
    const bookingDestNameEl = select('#booking-destination-name');
    const checkinDateEl = select('#checkin-date');
    const checkoutDateEl = select('#checkout-date');
    const roomsEl = select('#rooms');
    const guestsEl = select('#guests');
    const nightsCountEl = select('#nights-count');
    const estimatedPriceEl = select('#estimated-price');
    const proceedButton = select('#proceed-button');
    const destinationCards = selectAll('.destination-card');

    // --- Pricing Data (Average price per night) ---
    const cityAvgPrices = {
        "New Delhi": 1250, // Avg of 1000-1500
        "Mumbai": 2250,    // Avg of 1500-3000
        "Goa": 1750,       // Avg of 1000-2500
        "Bengaluru": 3000  // Avg of 2000-4000
        // Add other destinations if needed
    };

    let currentSelectedDestination = '';
    let currentAvgPrice = 0;

    // --- Function to Calculate Price ---
    const calculateAndDisplayPrice = () => {
        const checkinDate = checkinDateEl.value;
        const checkoutDate = checkoutDateEl.value;
        const rooms = parseInt(roomsEl.value, 10);
        // Guests value not used in this simple calculation, but available:
        // const guests = parseInt(guestsEl.value, 10);

        if (!checkinDate || !checkoutDate || !currentAvgPrice) {
            nightsCountEl.textContent = '0';
            estimatedPriceEl.textContent = '₹ 0';
            proceedButton.disabled = true;
            return;
        }

        const date1 = new Date(checkinDate);
        const date2 = new Date(checkoutDate);

        // Basic Validation
        if (date2 <= date1) {
            nightsCountEl.textContent = '0';
            estimatedPriceEl.textContent = '₹ 0';
            proceedButton.disabled = false; // Allow user to fix dates
            // Optionally show an error message
            console.warn("Check-out date must be after check-in date.");
             estimatedPriceEl.textContent = 'Invalid Dates';
            return;
        }

        // Calculate difference in time (milliseconds)
        const timeDiff = date2.getTime() - date1.getTime();
        // Calculate difference in days
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Milliseconds per day

        if (nights > 0 && rooms > 0) {
            const totalPrice = currentAvgPrice * nights * rooms;
            nightsCountEl.textContent = nights;
            estimatedPriceEl.textContent = `₹ ${totalPrice.toLocaleString('en-IN')}`; // Format currency
            proceedButton.disabled = false;
        } else {
            nightsCountEl.textContent = '0';
            estimatedPriceEl.textContent = '₹ 0';
            proceedButton.disabled = true;
        }
    };

     // --- Function to Handle Destination Card Click ---
     const handleDestinationClick = (event) => {
         const card = event.currentTarget; // The clicked article element
         currentSelectedDestination = card.dataset.destination;
         const priceRange = card.dataset.priceRange; // e.g., "1000-1500"

         // Calculate average price from range
         if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            currentAvgPrice = (min + max) / 2;
         } else {
             // Fallback if data attribute is missing (or use predefined map)
             currentAvgPrice = cityAvgPrices[currentSelectedDestination] || 1500; // Default avg price
         }


         // Update booking section title
         if (bookingDestNameEl) {
            bookingDestNameEl.textContent = currentSelectedDestination;
         }

         // Show booking section
         if (bookingSection) {
            // Remove hidden class first
            bookingSection.classList.remove('is-hidden');
            // Animate appearance using GSAP
             gsap.fromTo(bookingSection,
                { height: 0, opacity: 0, marginTop: 0 },
                {
                    height: "auto",
                    opacity: 1,
                    marginTop: 'var(--spacing-xxl)', // Add margin top for spacing
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                         // Scroll to the booking section after animation
                         bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                         // Set minimum dates for inputs
                         const today = new Date().toISOString().split('T')[0];
                         checkinDateEl.min = today;
                         checkoutDateEl.min = today; // Initial min, JS will update based on check-in
                         // Recalculate price based on defaults
                         calculateAndDisplayPrice();
                    }
                });
         }
     };


    // --- Event Listeners ---

    // Navbar Burger Toggle
    const setupNavbarToggle = () => { /* ... (same as before) ... */ };
    // Navbar Scroll Effect
    const setupNavbarScroll = () => { /* ... (same as before) ... */ };
    // Smooth Scrolling
    const setupSmoothScroll = () => { /* ... (same as before) ... */ };

     // Destination Card Clicks
    destinationCards.forEach(card => {
        card.addEventListener('click', handleDestinationClick);
    });

     // Booking Input Changes
    checkinDateEl?.addEventListener('change', () => {
        // Set minimum check-out date
        if (checkinDateEl.value) {
             const nextDay = new Date(checkinDateEl.value);
             nextDay.setDate(nextDay.getDate() + 1);
             checkoutDateEl.min = nextDay.toISOString().split('T')[0];
             // If checkout is earlier than new min checkout, potentially clear it
             if (checkoutDateEl.value && new Date(checkoutDateEl.value) <= new Date(checkinDateEl.value)) {
                 checkoutDateEl.value = '';
             }
        }
        calculateAndDisplayPrice();
    });
    checkoutDateEl?.addEventListener('change', calculateAndDisplayPrice);
    roomsEl?.addEventListener('change', calculateAndDisplayPrice);
    guestsEl?.addEventListener('change', calculateAndDisplayPrice); // Recalc even if guests change (future use)

    // Proceed Button Click
    proceedButton?.addEventListener('click', () => {
        if (!proceedButton.disabled) {
            const details = {
                destination: currentSelectedDestination,
                checkin: checkinDateEl.value,
                checkout: checkoutDateEl.value,
                nights: nightsCountEl.textContent,
                rooms: roomsEl.value,
                guests: guestsEl.value,
                price: estimatedPriceEl.textContent
            };
            alert(`Proceeding with booking (Simulation):\nDestination: ${details.destination}\nCheck-in: ${details.checkin}\nCheck-out: ${details.checkout}\nNights: ${details.nights}\nRooms: ${details.rooms}\nGuests: ${details.guests}\nPrice: ${details.price}`);
            // In a real app, you'd navigate to a confirmation page or send data to a backend
        }
    });


    // --- GSAP Scroll Animations ---
    const initAnimations = () => { /* ... (same as before) ... */ };
    // --- Button Click Feedback ---
    const setupButtonClickFeedback = () => { /* ... (same as before, excluding proceedButton) ... */ };


    // --- Initialization ---
    setupNavbarToggle();
    setupNavbarScroll();
    setupSmoothScroll();
    initAnimations(); // Init scroll animations
    setupButtonClickFeedback(); // Init general button feedback

    console.log('Ease website V3 initialized with booking feature!');
});

// --- Re-include the full initAnimations and setupButtonClickFeedback functions here ---
// (Copied from previous version for completeness, as they are unchanged functionally)

const initAnimations = () => {
    const defaultEase = "power3.out";
    const defaultDuration = 0.8;

    // Hero Entrance Animation (Staggered lines/elements)
    gsap.utils.toArray('.hero-content .anim-reveal').forEach((el, index) => {
        gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: defaultDuration, ease: defaultEase, delay: 0.2 + index * 0.15 });
    });

     // Hero Background Elements Subtle Animation
     gsap.utils.toArray('.hero-bg-el').forEach((el, index) => {
         gsap.fromTo(el, { y: gsap.utils.random(-20, 20), x: gsap.utils.random(-20, 20) }, { y: `random(-40, 40)`, x: `random(-40, 40)`, duration: gsap.utils.random(8, 12), ease: "sine.inOut", repeat: -1, yoyo: true, delay: index * 1.5 });
     });

    // General Scroll Animation Function
    const animateOnScroll = (selector, triggerEl = null, fromState = { opacity: 0, y: 50 }, staggerVal = 0.1) => {
        const elements = gsap.utils.toArray(selector);
        if (elements.length === 0) return;
        gsap.fromTo(elements, fromState, { opacity: 1, y: 0, x: 0, duration: defaultDuration, ease: defaultEase, stagger: staggerVal, scrollTrigger: { trigger: triggerEl || elements[0].parentNode, start: "top 85%", end: "bottom top", toggleActions: "play none none none" } });
    };

    // Animate Section Titles
    animateOnScroll('.section-title.anim-fade-up', null, { opacity: 0, y: 40 }, 0);
    // Animate Feature Items
    animateOnScroll('#features .feature-item.anim-fade-up', '#features .feature-list', { opacity: 0, y: 40 }, 0.1);
    // Animate Destination Cards
    animateOnScroll('#destinations .destination-card.anim-fade-up', '#destinations .destination-list', { opacity: 0, y: 40 }, 0.1);
    // Animate Contact Section Sides
    animateOnScroll('.contact-info.anim-fade-left', '#contact .columns', { opacity: 0, x: -40 }, 0);
    gsap.delayedCall(0.1, () => { animateOnScroll('.contact-form.anim-fade-right', '#contact .columns', { opacity: 0, x: 40 }, 0); });
};

 const setupButtonClickFeedback = () => {
    selectAll('.button:not(.contact-button):not(#proceed-button)').forEach(button => { // Exclude proceed button too
        button.addEventListener('mousedown', () => gsap.to(button, { scale: 0.96, duration: 0.1 }));
        button.addEventListener('mouseup', () => gsap.to(button, { scale: 1, duration: 0.1 }));
        button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1, duration: 0.1 }));
    });

    const contactForm = select('#ease-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => { /* ... (Contact form submission logic - same as before) ... */ });
    }
 };