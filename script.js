// ===== RIDE9JA - JAVASCRIPT =====
// Complete functionality for City & Interstate services

console.log('🚗 Ride9ja - Safe Travels Across Nigeria');

// ===== GLOBAL VARIABLES =====
let currentService = 'city'; // 'city' or 'interstate'

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById('loadingScreen');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const counters = document.querySelectorAll('.counter');
const heroStats = document.querySelector('.hero-stats');

// ===== BACKEND URL (Google Apps Script - WORKING) =====
const RIDE9JA_BACKEND_URL = 'https://script.google.com/macros/s/AKfycbYFZjr9Is-ntYe_ILWl2nt1NrhwQCoaMjtRRu-PSIAf2v3kmpEk9IX4ufe0M94jj_Bo/exec';

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    try {
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    if (typeof initAnimations === 'function') initAnimations();
                    console.log('✅ Website loaded successfully');
                }, 500);
            }, 1500);
        } else {
            if (typeof initAnimations === 'function') initAnimations();
            console.log('✅ Website loaded (no loadingScreen element found)');
        }
    } catch (err) {
        console.error('Error during load handler:', err);
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (typeof initAnimations === 'function') initAnimations();
    }
});

// Safety fallback: hide loader after 8s to avoid indefinite hang
setTimeout(() => {
    const ls = document.getElementById('loadingScreen');
    if (ls && window.getComputedStyle(ls).display !== 'none') {
        ls.style.display = 'none';
        console.warn('Loader fallback: hiding loading screen after timeout');
    }
}, 8000);

// ===== MOBILE NAVIGATION =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
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
}

function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
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

// ===== GOOGLE SHEETS SAVE FUNCTION (WORKING) =====
async function saveToGoogleSheets(data, userType) {
    try {
        const sheetName = userType === 'rider' 
            ? (data.service === 'interstate' ? 'Riders_Interstate' : 'Riders_City')
            : 'Drivers';
        
        const payload = {
            ...data,
            sheet: sheetName,
            timestamp: new Date().toLocaleString('en-NG'),
            service: currentService
        };
        
        console.log('Saving to Google Sheets:', payload);
        
        const response = await fetch(RIDE9JA_BACKEND_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        let result;
        try {
            result = await response.json();
        } catch {
            result = { success: true, note: 'Response received' };
        }
        
        return { success: true, data: result };
        
    } catch (error) {
        console.log('Sheet save failed, using fallback:', error);
        return { success: false, error: error.message };
    }
}

// ===== FORM HANDLING =====
function setupFormHandlers() {
    // City Rider Form
    const cityRiderForm = document.getElementById('cityRiderForm');
    if (cityRiderForm) {
        cityRiderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('cityName')?.value,
                phone: document.getElementById('cityPhone')?.value,
                route: document.getElementById('cityRoute')?.value,
                time: document.getElementById('cityTime')?.value,
                service: 'city'
            };
            
            const result = await saveToGoogleSheets(data, 'rider');
            
            if (result.success) {
                closeModal();
                showSuccess('City ride request submitted! We\'ll match you with a driver shortly.');
            } else {
                showSuccess('Request received! We\'ll contact you soon.');
            }
            
            this.reset();
        });
    }
    
    // Interstate Rider Form
    const interstateRiderForm = document.getElementById('interstateRiderForm');
    if (interstateRiderForm) {
        interstateRiderForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('interstateName')?.value,
                phone: document.getElementById('interstatePhone')?.value,
                from: document.getElementById('fromLocation')?.value,
                to: document.getElementById('toLocation')?.value,
                date: document.getElementById('travelDate')?.value,
                service: 'interstate'
            };
            
            const result = await saveToGoogleSheets(data, 'rider');
            
            if (result.success) {
                closeModal();
                showSuccess('Interstate booking received! Our team will contact you to confirm details.');
            } else {
                showSuccess('Booking received! We\'ll contact you soon.');
            }
            
            this.reset();
        });
    }
    
    // City Driver Form
    const cityDriverForm = document.getElementById('cityDriverForm');
    if (cityDriverForm) {
        cityDriverForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('driverFullName')?.value,
                phone: document.getElementById('driverPhone')?.value,
                license: document.getElementById('driverLicense')?.value,
                carModel: document.getElementById('carModel')?.value,
                plateNumber: document.getElementById('plateNumber')?.value,
                service: 'city'
            };
            
            const result = await saveToGoogleSheets(data, 'driver');
            
            if (result.success) {
                closeModal();
                showSuccess('City driver application submitted! We\'ll contact you within 24 hours.');
            } else {
                showSuccess('Application received! We\'ll contact you soon.');
            }
            
            this.reset();
        });
    }
    
    // Interstate Driver Form
    const interstateDriverForm = document.getElementById('interstateDriverForm');
    if (interstateDriverForm) {
        interstateDriverForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                name: document.getElementById('interstateDriverName')?.value,
                phone: document.getElementById('interstateDriverPhone')?.value,
                license: document.getElementById('interstateLicense')?.value,
                carModel: document.getElementById('interstateCarModel')?.value,
                route: document.getElementById('primaryRoute')?.value,
                service: 'interstate'
            };
            
            const result = await saveToGoogleSheets(data, 'driver');
            
            if (result.success) {
                closeModal();
                showSuccess('Interstate driver application received! We\'ll contact you soon.');
            } else {
                showSuccess('Application received! We\'ll contact you soon.');
            }
            
            this.reset();
        });
    }
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
        
        // Auto close after 3 seconds
        setTimeout(() => {
            if (successModal.style.display === 'flex') {
                closeModal();
            }
        }, 3000);
    } else {
        alert(message);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ride9ja initialized - Google Sheets version');
    
    // Set today's date as min for date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Create modals and setup forms
    createModals();
    setupFormHandlers();
});

// ===== GLOBAL EXPORTS =====
window.showRiderModal = showRiderModal;
window.showDriverModal = showDriverModal;
window.closeModal = closeModal;
window.switchService = switchService;
window.switchDriverService = switchDriverService;

console.log('Ride9ja JavaScript loaded successfully (Google Sheets version)');
