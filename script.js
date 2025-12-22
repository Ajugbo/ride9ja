// ===== RIDE9JA - JAVASCRIPT =====
// Complete functionality for City & Interstate services

console.log('🚗 Ride9ja - Safe Travels Across Nigeria');
// ===== MOBILE MENU =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        console.log('Mobile menu initialized');
    }
});
// ===== MOBILE MENU FIX =====
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        console.log('Mobile menu initialized');
    }
});
// ===== GLOBAL VARIABLES =====
let currentService = 'city'; // 'city' or 'interstate'

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const counters = document.querySelectorAll('.counter');
const heroStats = document.querySelector('.hero-stats');

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            initAnimations();
            console.log('✅ Website loaded successfully');
        }, 500);
    }, 1500);
});

// ===== MOBILE NAVIGATION =====
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.innerHTML = navMenu.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// ===== ANIMATE COUNTERS =====
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

// ===== MODAL SYSTEM =====
// Create modal elements dynamically
function createModals() {
    const modalHTML = `
        <!-- Rider Modal -->
        <div class="modal-overlay" id="riderModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Find a Ride</h2>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-tabs">
                    <button class="tab-btn active" onclick="switchService('city')">
                        <i class="fas fa-city"></i> City Ride
                    </button>
                    <button class="tab-btn" onclick="switchService('interstate')">
                        <i class="fas fa-route"></i> Interstate
                    </button>
                </div>
                
                <div class="modal-body">
                    <!-- City Ride Form -->
                    <form id="cityRiderForm" class="rider-form active">
                        <div class="form-group">
                            <label for="cityName">
                                <i class="fas fa-user"></i> Full Name
                            </label>
                            <input type="text" id="cityName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cityPhone">
                                <i class="fas fa-phone"></i> Phone Number
                            </label>
                            <input type="tel" id="cityPhone" placeholder="08012345678" pattern="[0-9]{11}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cityRoute">
                                <i class="fas fa-route"></i> Select Route
                            </label>
                            <select id="cityRoute" required>
                                <option value="">Choose your route</option>
                                <option value="nyanya-cbd">Nyanya ↔ Abuja CBD</option>
                                <option value="kubwa-cbd">Kubwa ↔ Abuja CBD</option>
                                <option value="mararaba-cbd">Mararaba ↔ Abuja CBD</option>
                                <option value="gwarimpa-cbd">Gwarimpa ↔ Abuja CBD</option>
                                <option value="lekki-ikeja">Lekki ↔ Ikeja (Lagos)</option>
                                <option value="other">Other City Route</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="cityTime">
                                <i class="fas fa-clock"></i> Preferred Time
                            </label>
                            <input type="time" id="cityTime" required>
                        </div>
                        
                        <div class="form-info">
                            <p><i class="fas fa-info-circle"></i> Platform fee: <strong>₦100</strong> per ride</p>
                            <p><i class="fas fa-car"></i> Maximum: <strong>4 passengers</strong> per car</p>
                        </div>
                        
                        <button type="submit" class="btn btn-blue btn-block">
                            <i class="fas fa-search"></i> Find City Ride
                        </button>
                    </form>
                    
                    <!-- Interstate Form -->
                    <form id="interstateRiderForm" class="rider-form">
                        <div class="form-group">
                            <label for="interstateName">
                                <i class="fas fa-user"></i> Full Name
                            </label>
                            <input type="text" id="interstateName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstatePhone">
                                <i class="fas fa-phone"></i> Phone Number
                            </label>
                            <input type="tel" id="interstatePhone" placeholder="08012345678" pattern="[0-9]{11}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="fromLocation">
                                <i class="fas fa-map-marker-alt"></i> From
                            </label>
                            <select id="fromLocation" required>
                                <option value="">Departure City</option>
                                <option value="abuja">Abuja (FCT)</option>
                                <option value="lagos">Lagos</option>
                                <option value="portharcourt">Port Harcourt</option>
                                <option value="kano">Kano</option>
                                <option value="ibadan">Ibadan</option>
                                <option value="enugu">Enugu</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="toLocation">
                                <i class="fas fa-flag"></i> To
                            </label>
                            <select id="toLocation" required>
                                <option value="">Destination City</option>
                                <option value="lagos">Lagos</option>
                                <option value="abuja">Abuja (FCT)</option>
                                <option value="portharcourt">Port Harcourt</option>
                                <option value="kano">Kano</option>
                                <option value="ibadan">Ibadan</option>
                                <option value="enugu">Enugu</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="travelDate">
                                <i class="fas fa-calendar"></i> Travel Date
                            </label>
                            <input type="date" id="travelDate" required>
                        </div>
                        
                        <div class="form-info">
                            <p><i class="fas fa-percentage"></i> Rider fee: <strong>10%</strong> of fare</p>
                            <p><i class="fas fa-users"></i> Driver fee: <strong>5%</strong> of total fares</p>
                            <p><i class="fas fa-car"></i> Verified interstate drivers only</p>
                        </div>
                        
                        <div class="fare-estimate">
                            <h4><i class="fas fa-calculator"></i> Estimated Fare</h4>
                            <div class="fare-breakdown">
                                <div class="fare-item">
                                    <span>Base Fare</span>
                                    <strong>₦15,000</strong>
                                </div>
                                <div class="fare-item">
                                    <span>Platform Fee (10%)</span>
                                    <strong class="text-blue">+₦1,500</strong>
                                </div>
                                <div class="fare-item total">
                                    <span>You Pay</span>
                                    <strong class="text-gold">₦16,500</strong>
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-purple btn-block">
                            <i class="fas fa-road"></i> Book Interstate Ride
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Driver Modal -->
        <div class="modal-overlay" id="driverModalOverlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fas fa-steering-wheel"></i> Drive with Ride9ja</h2>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-tabs">
                    <button class="tab-btn active" onclick="switchDriverService('city')">
                        <i class="fas fa-city"></i> City Driver
                    </button>
                    <button class="tab-btn" onclick="switchDriverService('interstate')">
                        <i class="fas fa-route"></i> Interstate Driver
                    </button>
                </div>
                
                <div class="modal-body">
                    <!-- City Driver Form -->
                    <form id="cityDriverForm" class="driver-form active">
                        <div class="form-group">
                            <label for="driverFullName">
                                <i class="fas fa-user"></i> Full Name
                            </label>
                            <input type="text" id="driverFullName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="driverPhone">
                                <i class="fas fa-phone"></i> Phone Number
                            </label>
                            <input type="tel" id="driverPhone" placeholder="08012345678" pattern="[0-9]{11}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="driverLicense">
                                <i class="fas fa-id-card"></i> Driver's License
                            </label>
                            <input type="text" id="driverLicense" placeholder="DL-12345678" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="carModel">
                                <i class="fas fa-car"></i> Car Model & Year
                            </label>
                            <input type="text" id="carModel" placeholder="e.g., Toyota Camry 2018" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="plateNumber">
                                <i class="fas fa-hashtag"></i> Plate Number
                            </label>
                            <input type="text" id="plateNumber" placeholder="ABC123XYZ" required>
                        </div>
                        
                        <div class="form-info">
                            <h4><i class="fas fa-money-bill-wave"></i> Earnings Potential</h4>
                            <div class="earnings-breakdown">
                                <div class="earning-item">
                                    <span>Per Rider Fare</span>
                                    <strong>₦800</strong>
                                </div>
                                <div class="earning-item">
                                    <span>Full Car (4 riders)</span>
                                    <strong>₦3,200</strong>
                                </div>
                                <div class="earning-item">
                                    <span>Platform Fee</span>
                                    <strong class="text-blue">-₦200</strong>
                                </div>
                                <div class="earning-item total">
                                    <span>You Earn Net</span>
                                    <strong class="text-gold">₦3,000</strong>
                                </div>
                            </div>
                            <p><i class="fas fa-info-circle"></i> Platform fee: <strong>₦200</strong> per trip</p>
                        </div>
                        
                        <button type="submit" class="btn btn-blue btn-block">
                            <i class="fas fa-check-circle"></i> Apply as City Driver
                        </button>
                    </form>
                    
                    <!-- Interstate Driver Form -->
                    <form id="interstateDriverForm" class="driver-form">
                        <div class="form-group">
                            <label for="interstateDriverName">
                                <i class="fas fa-user"></i> Full Name
                            </label>
                            <input type="text" id="interstateDriverName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateDriverPhone">
                                <i class="fas fa-phone"></i> Phone Number
                            </label>
                            <input type="tel" id="interstateDriverPhone" placeholder="08012345678" pattern="[0-9]{11}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateLicense">
                                <i class="fas fa-id-card"></i> Driver's License
                            </label>
                            <input type="text" id="interstateLicense" placeholder="DL-12345678" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateCarModel">
                                <i class="fas fa-car"></i> Car Model & Year
                            </label>
                            <input type="text" id="interstateCarModel" placeholder="e.g., Toyota Sienna 2020" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="primaryRoute">
                                <i class="fas fa-route"></i> Primary Route
                            </label>
                            <select id="primaryRoute" required>
                                <option value="">Select your main route</option>
                                <option value="abuja-lagos">Abuja ↔ Lagos</option>
                                <option value="ph-abuja">Port Harcourt ↔ Abuja</option>
                                <option value="kano-kaduna">Kano ↔ Kaduna</option>
                                <option value="ibadan-lagos">Ibadan ↔ Lagos</option>
                                <option value="enugu-lagos">Enugu ↔ Lagos</option>
                            </select>
                        </div>
                        
                        <div class="form-info">
                            <h4><i class="fas fa-money-bill-wave"></i> Interstate Earnings</h4>
                            <div class="earnings-breakdown">
                                <div class="earning-item">
                                    <span>Abuja-Lagos Fare/Rider</span>
                                    <strong>₦15,000</strong>
                                </div>
                                <div class="earning-item">
                                    <span>Full Car (4 riders)</span>
                                    <strong>₦60,000</strong>
                                </div>
                                <div class="earning-item">
                                    <span>Platform Fee (5%)</span>
                                    <strong class="text-purple">-₦3,000</strong>
                                </div>
                                <div class="earning-item total">
                                    <span>You Earn Net</span>
                                    <strong class="text-gold">₦57,000</strong>
                                </div>
                            </div>
                            <p><i class="fas fa-info-circle"></i> Platform fee: <strong>5%</strong> of total fares</p>
                            <p><i class="fas fa-shield-alt"></i> Additional verification required for interstate</p>
                        </div>
                        
                        <button type="submit" class="btn btn-purple btn-block">
                            <i class="fas fa-check-circle"></i> Apply as Interstate Driver
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div class="modal-overlay success-modal-overlay" id="successModalOverlay">
            <div class="modal-container success-modal-container">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Registration Successful!</h2>
                <p id="successMessage">Thank you for joining Ride9ja. We'll contact you within 24 hours to complete verification.</p>
                <button class="btn btn-gold" onclick="closeModal()">
                    <i class="fas fa-thumbs-up"></i> Continue Browsing
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupFormHandlers();
}

// ===== MODAL FUNCTIONS =====
function showRiderModal(service = 'city') {
    currentService = service;
    const modal = document.getElementById('riderModal');
    if (!modal) {
        createModals();
        setTimeout(() => showRiderModal(service), 100);
        return;
    }
    
    switchService(service);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log(`Opening rider modal for ${service} service`);
}

function showDriverModal(service = 'city') {
    currentService = service;
    const modal = document.getElementById('driverModalOverlay');
    if (!modal) {
        createModals();
        setTimeout(() => showDriverModal(service), 100);
        return;
    }
    
    switchDriverService(service);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    console.log(`Opening driver modal for ${service} service`);
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    console.log('All modals closed');
}

function switchService(service) {
    currentService = service;
    
    // Update tabs
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.modal-tabs .tab-btn:nth-child(${service === 'city' ? 1 : 2})`);
    if (activeTab) activeTab.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.rider-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const activeForm = document.getElementById(`${service}RiderForm`);
    if (activeForm) activeForm.classList.add('active');
    
    console.log(`Switched to ${service} service`);
}

function switchDriverService(service) {
    currentService = service;
    
    // Update tabs
    const tabs = document.querySelectorAll('#driverModalOverlay .tab-btn');
    tabs.forEach(btn => btn.classList.remove('active'));
    
    const activeTab = document.querySelector(`#driverModalOverlay .tab-btn:nth-child(${service === 'city' ? 1 : 2})`);
    if (activeTab) activeTab.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.driver-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const activeForm = document.getElementById(`${service}DriverForm`);
    if (activeForm) activeForm.classList.add('active');
}

// ===== FORM HANDLING =====
function setupFormHandlers() {
    // Rider forms
    document.getElementById('cityRiderForm')?.addEventListener('submit', handleCityRiderSubmit);
    document.getElementById('interstateRiderForm')?.addEventListener('submit', handleInterstateRiderSubmit);
    
    // Driver forms
    document.getElementById('cityDriverForm')?.addEventListener('submit', handleCityDriverSubmit);
    document.getElementById('interstateDriverForm')?.addEventListener('submit', handleInterstateDriverSubmit);
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function handleCityRiderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Finding Rides...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showSuccess('City ride request submitted! We\'ll match you with a driver shortly.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleInterstateRiderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Interstate...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showSuccess('Interstate booking received! Our team will contact you to confirm details.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleCityDriverSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showSuccess('City driver application submitted! We\'ll contact you within 24 hours for verification.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleInterstateDriverSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        closeModal();
        showSuccess('Interstate driver application received! Our verification team will contact you soon.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showSuccess(message) {
    const successModal = document.getElementById('successModalOverlay');
    const successMessage = document.getElementById('successMessage');
    
    if (successMessage) {
        successMessage.textContent = message;
    }
    
    if (successModal) {
        successModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// ===== SERVICE SELECTION =====
function selectCityService() {
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[onclick="selectCityService()"]').classList.add('active');
    
    document.querySelectorAll('.service-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('cityContent').classList.add('active');
}

function selectInterstateService() {
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[onclick="selectInterstateService()"]').classList.add('active');
    
    document.querySelectorAll('.service-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById('interstateContent').classList.add('active');
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return '₦' + amount.toLocaleString('en-NG');
}

function calculateInterstateFare(baseFare, passengers = 1) {
    const riderFee = baseFare * 0.10; // 10%
    const driverFee = (baseFare * passengers) * 0.05; // 5%
    const riderTotal = baseFare + riderFee;
    const driverTotal = (baseFare * passengers) - driverFee;
    
    return {
        riderTotal: formatCurrency(riderTotal),
        driverTotal: formatCurrency(driverTotal),
        riderFee: formatCurrency(riderFee),
        driverFee: formatCurrency(driverFee)
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ride9ja initialized');
    
    // Set today's date as min for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Auto-create modals on page load
    createModals();
});

// ===== GLOBAL EXPORTS =====
window.showRiderModal = showRiderModal;
window.showDriverModal = showDriverModal;
window.closeModal = closeModal;
window.switchService = switchService;
window.switchDriverService = switchDriverService;
window.selectCityService = selectCityService;
window.selectInterstateService = selectInterstateService;
window.formatCurrency = formatCurrency;
window.calculateInterstateFare = calculateInterstateFare;

console.log('Ride9ja JavaScript loaded successfully');
// ===== FORM SUBMISSION FIX =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up form handlers...');
    
    // Setup form submissions when modals are shown
    document.addEventListener('click', function(e) {
        if (e.target.closest('[onclick*="showRiderModal"]') || 
            e.target.closest('[onclick*="showDriverModal"]')) {
            setTimeout(setupFormHandlers, 100);
        }
    });
    
    // Initial setup
    setupFormHandlers();
});

function setupFormHandlers() {
    // Get all forms in modals
    const forms = document.querySelectorAll('.rider-form, .driver-form');
    
    forms.forEach(form => {
        // Remove existing listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Add new listener
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
    
    console.log('Form handlers setup complete');
}

function handleFormSubmit(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success
        const successModal = document.getElementById('successModalOverlay');
        if (successModal) {
            closeModal();
            successModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        console.log('Form submitted successfully');
    }, 1500);
}

// ===== GOOGLE SHEETS BACKEND - ADD THIS AT THE END =====
https://script.google.com/macros/s/AKfycbYFZjr9Is-ntYe_ILWl2nt1NrhwQCoaMjtRRu-PSIAf2v3kmpEk9IX4ufe0M94jj_Bo...

async function saveToRide9jaDatabase(data, userType) {
    try {
        // Determine which sheet to use
        const sheetName = userType === 'rider' 
            ? (data.service === 'interstate' ? 'Riders_Interstate' : 'Riders_City')
            : 'Drivers';
        
        // Prepare data for Google Sheets
        const payload = {
            ...data,
            sheet: sheetName,
            timestamp: new Date().toISOString()
        };
        
        console.log('Saving to database:', payload);
        
        // Send to Google Sheets
        const response = await fetch(RIDE9JA_BACKEND_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for cross-origin
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        return { success: true, sheet: sheetName };
        
    } catch (error) {
        console.log('Database save failed, using fallback:', error);
        return { success: false, error: error.message };
    }
}

// Enhanced form handler - REPLACES OLD FORM HANDLERS
async function handleRide9jaForm(form, userType) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving to Ride9ja...';
    submitBtn.disabled = true;
    
    // Collect all form data
    const formElements = form.elements;
    const data = {
        service: currentService, // 'city' or 'interstate'
        timestamp: new Date().toLocaleString('en-NG')
    };
    
    // Extract all form fields
    for (let element of formElements) {
        if (element.name && element.value) {
            data[element.name] = element.value;
        }
        if (element.id && element.value) {
            data[element.id] = element.value;
        }
    }
    
    // Add name and phone if available
    if (!data.name && form.querySelector('[name="name"]')) {
        data.name = form.querySelector('[name="name"]').value;
    }
    if (!data.phone && form.querySelector('[name="phone"]')) {
        data.phone = form.querySelector('[name="phone"]').value;
    }
    
    console.log('Form data collected:', data);
    
    // Save to database
    setTimeout(async () => {
        const result = await saveToRide9jaDatabase(data, userType);
        
        if (result.success) {
            showSuccess(
                `✅ Registration saved successfully!<br><br>` +
                `<strong>Sheet:</strong> ${result.sheet}<br>` +
                `<strong>Name:</strong> ${data.name || 'Not provided'}<br>` +
                `<strong>Phone:</strong> ${data.phone || 'Not provided'}<br><br>` +
                `We'll contact you within 24 hours.`
            );
        } else {
            // Fallback: Show data and prompt for manual save
            showSuccess(
                `📧 Registration ready!<br><br>` +
                `<strong>Please save this info:</strong><br>` +
                `Name: ${data.name || ''}<br>` +
                `Phone: ${data.phone || ''}<br>` +
                `Service: ${currentService === 'city' ? 'City Ride' : 'Interstate'}<br><br>` +
                `Contact us at: hello@ride9ja.com`
            );
        }
        
        closeModal();
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

// Update existing form listeners - REPLACE OLD setupFormHandlers
function setupRide9jaFormHandlers() {
    console.log('Setting up Ride9ja form handlers...');
    
    // City Rider Form
    const cityRiderForm = document.getElementById('cityRiderForm');
    if (cityRiderForm) {
        cityRiderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRide9jaForm(this, 'rider');
        });
    }
    
    // Interstate Rider Form
    const interstateRiderForm = document.getElementById('interstateRiderForm');
    if (interstateRiderForm) {
        interstateRiderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRide9jaForm(this, 'rider');
        });
    }
    
    // City Driver Form
    const cityDriverForm = document.getElementById('cityDriverForm');
    if (cityDriverForm) {
        cityDriverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRide9jaForm(this, 'driver');
        });
    }
    
    // Interstate Driver Form
    const interstateDriverForm = document.getElementById('interstateDriverForm');
    if (interstateDriverForm) {
        interstateDriverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRide9jaForm(this, 'driver');
        });
    }
}

// Initialize on page load - ADD THIS TO EXISTING DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Your existing initialization code...
    
    // ADD THIS LINE:
    setupRide9jaFormHandlers();
    
    console.log('Ride9ja with Google Sheets backend ready!');
});
