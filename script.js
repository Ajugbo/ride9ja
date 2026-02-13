// ===== RIDE9JA - JAVASCRIPT (Direct Supabase Connection) =====
console.log('🚗 Ride9ja - Direct Supabase Connection');

// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
            console.log('✅ Website loaded');
        }
    } catch (err) {
        console.error('Error during load handler:', err);
        if (loadingScreen) loadingScreen.style.display = 'none';
    }
});

// ===== MOBILE NAVIGATION =====
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
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
                            <label for="cityName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="cityName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cityPhone"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="cityPhone" placeholder="08012345678" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="cityRoute"><i class="fas fa-route"></i> Select Route</label>
                            <select id="cityRoute" required>
                                <option value="">Choose your route</option>
                                <option value="Nyanya ↔ Abuja CBD">Nyanya ↔ Abuja CBD</option>
                                <option value="Kubwa ↔ Abuja CBD">Kubwa ↔ Abuja CBD</option>
                                <option value="Mararaba ↔ Abuja CBD">Mararaba ↔ Abuja CBD</option>
                                <option value="Gwarimpa ↔ Abuja CBD">Gwarimpa ↔ Abuja CBD</option>
                                <option value="Lekki ↔ Ikeja">Lekki ↔ Ikeja (Lagos)</option>
                            </select>
                        </div>
                        
                        <div class="form-info">
                            <p><i class="fas fa-info-circle"></i> Platform fee: <strong>₦100</strong> per ride</p>
                        </div>
                        
                        <button type="submit" class="btn btn-blue btn-block">
                            <i class="fas fa-search"></i> Find City Ride
                        </button>
                    </form>
                    
                    <!-- Interstate Form -->
                    <form id="interstateRiderForm" class="rider-form">
                        <div class="form-group">
                            <label for="interstateName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="interstateName" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstatePhone"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="interstatePhone" placeholder="08012345678" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="fromLocation"><i class="fas fa-map-marker-alt"></i> From</label>
                            <select id="fromLocation" required>
                                <option value="">Departure City</option>
                                <option value="Abuja">Abuja (FCT)</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Port Harcourt">Port Harcourt</option>
                                <option value="Kano">Kano</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="toLocation"><i class="fas fa-flag"></i> To</label>
                            <select id="toLocation" required>
                                <option value="">Destination City</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja (FCT)</option>
                                <option value="Port Harcourt">Port Harcourt</option>
                                <option value="Kano">Kano</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="travelDate"><i class="fas fa-calendar"></i> Travel Date</label>
                            <input type="date" id="travelDate" required>
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
                            <label for="driverFullName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="driverFullName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="driverPhone"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="driverPhone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="driverLicense"><i class="fas fa-id-card"></i> Driver's License</label>
                            <input type="text" id="driverLicense" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="carModel"><i class="fas fa-car"></i> Car Model</label>
                            <input type="text" id="carModel" placeholder="e.g., Toyota Camry 2018" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="plateNumber"><i class="fas fa-hashtag"></i> Plate Number</label>
                            <input type="text" id="plateNumber" required>
                        </div>
                        
                        <button type="submit" class="btn btn-blue btn-block">
                            <i class="fas fa-check-circle"></i> Apply as City Driver
                        </button>
                    </form>
                    
                    <!-- Interstate Driver Form -->
                    <form id="interstateDriverForm" class="driver-form">
                        <div class="form-group">
                            <label for="interstateDriverName"><i class="fas fa-user"></i> Full Name</label>
                            <input type="text" id="interstateDriverName" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateDriverPhone"><i class="fas fa-phone"></i> Phone Number</label>
                            <input type="tel" id="interstateDriverPhone" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateLicense"><i class="fas fa-id-card"></i> Driver's License</label>
                            <input type="text" id="interstateLicense" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="interstateCarModel"><i class="fas fa-car"></i> Car Model</label>
                            <input type="text" id="interstateCarModel" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="primaryRoute"><i class="fas fa-route"></i> Primary Route</label>
                            <select id="primaryRoute" required>
                                <option value="Abuja-Lagos">Abuja ↔ Lagos</option>
                                <option value="PH-Abuja">Port Harcourt ↔ Abuja</option>
                                <option value="Kano-Kaduna">Kano ↔ Kaduna</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-purple btn-block">
                            <i class="fas fa-check-circle"></i> Apply as Interstate Driver
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div class="modal-overlay" id="successModalOverlay">
            <div class="modal-container success-modal-container">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Success!</h2>
                <p id="successMessage">Your request has been submitted.</p>
                <button class="btn btn-gold" onclick="closeModal()">Continue</button>
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
    document.querySelectorAll('.modal-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeTab = document.querySelector(`.modal-tabs .tab-btn:nth-child(${service === 'city' ? 1 : 2})`);
    if (activeTab) activeTab.classList.add('active');
    
    document.querySelectorAll('.rider-form').forEach(form => form.classList.remove('active'));
    const activeForm = document.getElementById(`${service}RiderForm`);
    if (activeForm) activeForm.classList.add('active');
}

function switchDriverService(service) {
    currentService = service;
    document.querySelectorAll('#driverModalOverlay .tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeTab = document.querySelector(`#driverModalOverlay .tab-btn:nth-child(${service === 'city' ? 1 : 2})`);
    if (activeTab) activeTab.classList.add('active');
    
    document.querySelectorAll('.driver-form').forEach(form => form.classList.remove('active'));
    const activeForm = document.getElementById(`${service}DriverForm`);
    if (activeForm) activeForm.classList.add('active');
}

function showSuccess(message) {
    const successModal = document.getElementById('successModalOverlay');
    const successMessage = document.getElementById('successMessage');
    if (successMessage) successMessage.textContent = message;
    if (successModal) {
        successModal.style.display = 'flex';
        setTimeout(closeModal, 3000);
    }
}

// ===== SUPABASE DIRECT SAVE FUNCTIONS =====
async function saveRiderToSupabase(formData, serviceType) {
    try {
        console.log('Saving rider to Supabase:', formData);
        
        // First, check if user exists or create new user
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('id')
            .eq('phone', formData.phone)
            .single();
        
        let userId;
        
        if (existingUser) {
            userId = existingUser.id;
        } else {
            // Create new user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    email: `${formData.phone}@ride9ja.com`,
                    role: 'RIDER'
                }])
                .select()
                .single();
            
            if (createError) throw createError;
            userId = newUser.id;
        }
        
        // Create trip
        const { data: trip, error: tripError } = await supabase
            .from('trips')
            .insert([{
                rider_id: userId,
                origin: formData.origin || formData.fromLocation || 'Unknown',
                destination: formData.destination || formData.toLocation || 'Unknown',
                fare: serviceType === 'city' ? 800 : 15000,
                status: 'REQUESTED'
            }])
            .select()
            .single();
        
        if (tripError) throw tripError;
        
        return { success: true, data: trip };
        
    } catch (error) {
        console.error('Supabase save error:', error);
        return { success: false, error: error.message };
    }
}

async function saveDriverToSupabase(formData, serviceType) {
    try {
        console.log('Saving driver to Supabase:', formData);
        
        // Check if user exists
        const { data: existingUser, error: searchError } = await supabase
            .from('users')
            .select('id')
            .eq('phone', formData.phone)
            .single();
        
        let userId;
        
        if (existingUser) {
            userId = existingUser.id;
            // Update role to DRIVER
            await supabase
                .from('users')
                .update({ role: 'DRIVER' })
                .eq('id', userId);
        } else {
            // Create new user as DRIVER
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    email: `${formData.phone}@ride9ja.com`,
                    role: 'DRIVER'
                }])
                .select()
                .single();
            
            if (createError) throw createError;
            userId = newUser.id;
        }
        
        // Create vehicle
        const { data: vehicle, error: vehicleError } = await supabase
            .from('vehicles')
            .insert([{
                driver_id: userId,
                make: formData.carModel?.split(' ')[0] || 'Unknown',
                model: formData.carModel || 'Unknown',
                plate_number: formData.plateNumber || 'Unknown'
            }])
            .select()
            .single();
        
        if (vehicleError) throw vehicleError;
        
        return { success: true, data: vehicle };
        
    } catch (error) {
        console.error('Supabase save error:', error);
        return { success: false, error: error.message };
    }
}

// ===== FORM HANDLERS =====
function setupFormHandlers() {
    // City Rider
    document.getElementById('cityRiderForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('cityName').value,
            phone: document.getElementById('cityPhone').value,
            origin: document.getElementById('cityRoute').value.split('↔')[0].trim(),
            destination: document.getElementById('cityRoute').value.split('↔')[1]?.trim() || 'Unknown'
        };
        
        const result = await saveRiderToSupabase(formData, 'city');
        if (result.success) {
            showSuccess('✅ City ride booked successfully!');
            closeModal();
            e.target.reset();
        } else {
            alert('❌ Error: ' + result.error);
        }
    });
    
    // Interstate Rider
    document.getElementById('interstateRiderForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('interstateName').value,
            phone: document.getElementById('interstatePhone').value,
            fromLocation: document.getElementById('fromLocation').value,
            toLocation: document.getElementById('toLocation').value,
            travelDate: document.getElementById('travelDate').value
        };
        
        const result = await saveRiderToSupabase(formData, 'interstate');
        if (result.success) {
            showSuccess('✅ Interstate ride booked successfully!');
            closeModal();
            e.target.reset();
        } else {
            alert('❌ Error: ' + result.error);
        }
    });
    
    // City Driver
    document.getElementById('cityDriverForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('driverFullName').value,
            phone: document.getElementById('driverPhone').value,
            license: document.getElementById('driverLicense').value,
            carModel: document.getElementById('carModel').value,
            plateNumber: document.getElementById('plateNumber').value
        };
        
        const result = await saveDriverToSupabase(formData, 'city');
        if (result.success) {
            showSuccess('✅ Driver application submitted!');
            closeModal();
            e.target.reset();
        } else {
            alert('❌ Error: ' + result.error);
        }
    });
    
    // Interstate Driver
    document.getElementById('interstateDriverForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('interstateDriverName').value,
            phone: document.getElementById('interstateDriverPhone').value,
            license: document.getElementById('interstateLicense').value,
            carModel: document.getElementById('interstateCarModel').value,
            route: document.getElementById('primaryRoute').value
        };
        
        const result = await saveDriverToSupabase(formData, 'interstate');
        if (result.success) {
            showSuccess('✅ Interstate driver application submitted!');
            closeModal();
            e.target.reset();
        } else {
            alert('❌ Error: ' + result.error);
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ride9ja - Direct Supabase Connection');
    
    // Set min date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.min = today;
    });
    
    createModals();
    setupFormHandlers();
});

// ===== GLOBAL EXPORTS =====
window.showRiderModal = showRiderModal;
window.showDriverModal = showDriverModal;
window.closeModal = closeModal;
window.switchService = switchService;
window.switchDriverService = switchDriverService;

console.log('Ride9ja ready with Supabase direct connection');
