// ==========================================
// RIDE9JA - REAL BACKEND INTEGRATION
// ==========================================

console.log('🚗 Ride9ja Real Backend Loading...');

// 1. SUPABASE CONFIGURATION
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
const sb = window.supabase.createClient(URL, KEY);

// 2. GLOBAL VARIABLES
let currentService = 'city';

// 3. DOM ELEMENTS
const loadingScreen = document.getElementById('loadingScreen');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const counters = document.querySelectorAll('.counter');
const heroStats = document.querySelector('.hero-stats');

// 4. LOADING SCREEN (Fixed to prevent endless loading)
window.addEventListener('load', () => {
    try {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (typeof initAnimations === 'function') initAnimations();
                }, 500);
            }, 1500);
        } else {
            if (typeof initAnimations === 'function') initAnimations();
        }
    } catch (err) {
        console.error('Load Error:', err);
        if (loadingScreen) loadingScreen.style.display = 'none'; // Force remove on error
    }
});

// Safety Fallback
setTimeout(() => {
    const ls = document.getElementById('loadingScreen');
    if (ls && ls.style.display !== 'none') {
        ls.style.display = 'none';
        console.warn('Forced removal of loading screen');
    }
}, 8000);

// 5. MOBILE NAVIGATION
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// 6. ANIMATIONS
function initAnimations() {
    if (!heroStats) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(heroStats);
}

function animateCounters() {
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 30);
    });
}

// 7. MODAL SYSTEM (Existing Code)
function createModals() {
    if (document.getElementById('riderModal')) return;

    const modalHTML = `
        <!-- Rider Modal -->
        <div class="modal-overlay" id="riderModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Find a Ride</h2>
                    <button class="modal-close" onclick="window.closeModal()"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-tabs">
                    <button class="tab-btn active" onclick="window.switchService('city')"><i class="fas fa-city"></i> City Ride</button>
                    <button class="tab-btn" onclick="window.switchService('interstate')"><i class="fas fa-route"></i> Interstate</button>
                </div>
                <div class="modal-body">
                    <!-- City Form -->
                    <form id="cityRiderForm" class="rider-form active">
                        <div class="form-group"><label for="cityName"><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="cityName" placeholder="Enter your full name" required></div>
                        <div class="form-group"><label for="cityPhone"><i class="fas fa-phone"></i> Phone Number</label>
                        <input type="tel" id="cityPhone" placeholder="08012345678" required></div>
                        <div class="form-group"><label for="cityRoute"><i class="fas fa-route"></i> Select Route</label>
                        <select id="cityRoute" required><option value="">Choose your route</option><option value="Nyanya-CBD">Nyanya ↔ Abuja CBD</option><option value="Kubwa-CBD">Kubwa ↔ Abuja CBD</option><option value="Lekki-Ikeja">Lekki ↔ Ikeja (Lagos)</option><option value="Other">Other City Route</option></select></div>
                        <button type="submit" class="btn btn-blue btn-block"><i class="fas fa-search"></i> Find City Ride</button>
                    </form>
                    <!-- Interstate Form -->
                    <form id="interstateRiderForm" class="rider-form">
                        <div class="form-group"><label for="interstateName"><i class="fas fa-user"></i> Full Name</label>
                        <input type="text" id="interstateName" placeholder="Enter your full name" required></div>
                        <div class="form-group"><label for="interstatePhone"><i class="fas fa-phone"></i> Phone Number</label>
                        <input type="tel" id="interstatePhone" placeholder="08012345678" required></div>
                        <div class="form-group"><label for="fromLocation"><i class="fas fa-map-marker-alt"></i> From</label>
                        <select id="fromLocation" required><option value="">Departure</option><option value="Abuja">Abuja</option><option value="Lagos">Lagos</option><option value="Port Harcourt">Port Harcourt</option><option value="Kano">Kano</option></select></div>
                        <div class="form-group"><label for="toLocation"><i class="fas fa-flag"></i> To</label>
                        <select id="toLocation" required><option value="">Destination</option><option value="Lagos">Lagos</option><option value="Abuja">Abuja</option><option value="Port Harcourt">Port Harcourt</option><option value="Kano">Kano</option></select></div>
                        <button type="submit" class="btn btn-purple btn-block"><i class="fas fa-road"></i> Book Interstate Ride</button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div class="modal-overlay success-modal-overlay" id="successModalOverlay">
            <div class="modal-container success-modal-container">
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h2>Registration Successful!</h2>
                <p id="successMessage">Thank you for joining Ride9ja. We'll contact you within 24 hours.</p>
                <button class="btn btn-gold" onclick="window.closeModal()"><i class="fas fa-thumbs-up"></i> Continue Browsing</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupRide9jaFormHandlers();
}

// 8. MODAL FUNCTIONS
window.showRiderModal = function(service = 'city') {
    createModals();
    const modal = document.getElementById('riderModal');
    if (modal) modal.style.display = 'flex';
    window.switchService(service);
    document.body.style.overflow = 'hidden';
}

window.showDriverModal = function() {
    alert("Driver registration via Admin Panel only.");
}

window.closeModal = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    document.body.style.overflow = 'auto';
}

window.switchService = function(service) {
    currentService = service;
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.modal-tabs .tab-btn:nth-child(${service === 'city' ? 1 : 2})`);
    if(btn) btn.classList.add('active');
    document.querySelectorAll('.rider-form').forEach(f => f.classList.remove('active'));
    const form = document.getElementById(`${service}RiderForm`);
    if(form) form.classList.add('active');
}

// 9. REAL BACKEND HANDLERS (The Injection)

// City Rider
window.handleCityRiderSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const name = document.getElementById('cityName').value;
    const phone = document.getElementById('cityPhone').value;
    const route = document.getElementById('cityRoute').value;
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving to Database...';
    btn.disabled = true;

    try {
        // 1. Add Passenger
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
        
        if (passenger) {
            // 2. Add Booking
            const { error } = await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: route, // Using route as pickup for now
                dropoff_location: 'CBD / Destination',
                price: 2500, // Fixed price for city
                status: 'pending'
            }]);

            if (!error) {
                window.closeModal();
                alert("✅ Success! Ride request sent to Admin Panel.");
                form.reset();
            } else {
                alert("❌ Booking Failed: " + error.message);
            }
        }
    } catch (err) {
        alert("❌ System Error: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Interstate Rider
window.handleInterstateRiderSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const name = document.getElementById('interstateName').value;
    const phone = document.getElementById('interstatePhone').value;
    const from = document.getElementById('fromLocation').value;
    const to = document.getElementById('toLocation').value;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Interstate...';
    btn.disabled = true;

    try {
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
        
        if (passenger) {
            const { error } = await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: from,
                dropoff_location: to,
                price: 15000, // Interstate price
                status: 'pending'
            }]);

            if (!error) {
                window.closeModal();
                alert("✅ Success! Interstate ride booked. Check Admin Panel.");
                form.reset();
            } else {
                alert("❌ Booking Failed: " + error.message);
            }
        }
    } catch (err) {
        alert("❌ System Error: " + err.message);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 10. SETUP HANDLERS
function setupRide9jaFormHandlers() {
    const cityForm = document.getElementById('cityRiderForm');
    if (cityForm) {
        // Clone to remove old listeners
        const newCityForm = cityForm.cloneNode(true);
        cityForm.parentNode.replaceChild(newCityForm, cityForm);
        newCityForm.addEventListener('submit', window.handleCityRiderSubmit);
    }

    const interstateForm = document.getElementById('interstateRiderForm');
    if (interstateForm) {
        const newInterstateForm = interstateForm.cloneNode(true);
        interstateForm.parentNode.replaceChild(newInterstateForm, interstateForm);
        newInterstateForm.addEventListener('submit', window.handleInterstateRiderSubmit);
    }
}

// 11. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ride9ja Hybrid Loaded');
    createModals(); // Pre-create modals so they are ready
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => input.min = new Date().toISOString().split('T')[0]);
});
