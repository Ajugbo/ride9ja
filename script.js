// ===== RIDE9JA - JAVASCRIPT (Direct Supabase Connection) =====
console.log('🚗 Ride9ja - Direct Supabase Connection');

// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== PAGE DETECTION =====
const isAdminPage = window.location.pathname.includes('admin.html');
const isMainPage = !isAdminPage && (window.location.pathname === '/' || window.location.pathname.includes('index.html'));

console.log(`📄 Page detected: ${isAdminPage ? 'Admin Dashboard' : 'Main Website'}`);

// ===== GLOBAL VARIABLES =====
let currentService = 'city'; // 'city' or 'interstate' (for main site)

// ===== DOM ELEMENTS (Main Site) =====
if (isMainPage) {
    var loadingScreen = document.getElementById('loadingScreen');
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');
    var counters = document.querySelectorAll('.counter');
    var heroStats = document.querySelector('.hero-stats');
}

// ===== LOADING SCREEN (Main Site Only) =====
if (isMainPage) {
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
}

// ===== MOBILE NAVIGATION (Main Site Only) =====
if (isMainPage && navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ===== ANIMATE COUNTERS (Main Site Only) =====
if (isMainPage) {
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
}

// ===== MODAL SYSTEM (Main Site Only) =====
if (isMainPage) {
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
    window.showRiderModal = function(service = 'city') {
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

    window.showDriverModal = function(service = 'city') {
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

    window.closeModal = function() {
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
            setTimeout(window.closeModal, 3000);
        }
    }
}

// ===== SHARED SUPABASE FUNCTIONS (Used by both Main Site and Admin) =====

// Get all users
async function getUsers() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, error: error.message };
    }
}

// Get all trips
async function getTrips() {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching trips:', error);
        return { success: false, error: error.message };
    }
}

// Get all vehicles
async function getVehicles() {
    try {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return { success: false, error: error.message };
    }
}

// Get all payments
async function getPayments() {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching payments:', error);
        return { success: false, error: error.message };
    }
}

// Save rider to database
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

// Save driver to database
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

// ===== MAIN SITE FORM HANDLERS =====
if (isMainPage) {
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
                window.closeModal();
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
                window.closeModal();
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
                window.closeModal();
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
                window.closeModal();
                e.target.reset();
            } else {
                alert('❌ Error: ' + result.error);
            }
        });
    }
}

// ===== ADMIN DASHBOARD FUNCTIONS =====
if (isAdminPage) {
    async function loadAdminDashboard() {
        console.log('Loading admin dashboard...');
        
        // Create admin UI if it doesn't exist
        if (!document.getElementById('adminContent')) {
            createAdminUI();
        }
        
        // Load all data
        const [users, trips, vehicles, payments] = await Promise.all([
            getUsers(),
            getTrips(),
            getVehicles(),
            getPayments()
        ]);
        
        // Update stats
        document.getElementById('totalUsers').textContent = users.data?.length || 0;
        document.getElementById('totalTrips').textContent = trips.data?.length || 0;
        document.getElementById('totalVehicles').textContent = vehicles.data?.length || 0;
        document.getElementById('totalPayments').textContent = payments.data?.length || 0;
        
        // Display data in tables
        displayUsers(users.data || []);
        displayTrips(trips.data || []);
    }
    
    function createAdminUI() {
        const adminHTML = `
            <div class="admin-dashboard" id="adminContent">
                <h1>Ride9ja Admin Dashboard</h1>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <p id="totalUsers">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Trips</h3>
                        <p id="totalTrips">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Vehicles</h3>
                        <p id="totalVehicles">0</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Payments</h3>
                        <p id="totalPayments">0</p>
                    </div>
                </div>
                
                <div class="tabs">
                    <button class="tab-btn active" onclick="showTab('users')">Users</button>
                    <button class="tab-btn" onclick="showTab('trips')">Trips</button>
                    <button class="tab-btn" onclick="showTab('vehicles')">Vehicles</button>
                </div>
                
                <div id="usersTab" class="tab-content active">
                    <h2>Users</h2>
                    <table id="usersTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Created</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                
                <div id="tripsTab" class="tab-content">
                    <h2>Trips</h2>
                    <table id="tripsTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Rider</th>
                                <th>Origin</th>
                                <th>Destination</th>
                                <th>Fare</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                
                <div id="vehiclesTab" class="tab-content">
                    <h2>Vehicles</h2>
                    <table id="vehiclesTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Driver</th>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Plate</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adminHTML);
        
        // Add CSS for admin
        const adminCSS = `
            <style>
                .admin-dashboard { max-width: 1200px; margin: 20px auto; padding: 20px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
                .stat-card { background: #1a1a1a; padding: 20px; border-radius: 8px; text-align: center; }
                .stat-card h3 { color: #888; margin-bottom: 10px; }
                .stat-card p { color: gold; font-size: 2em; font-weight: bold; }
                .tabs { display: flex; gap: 10px; margin: 20px 0; }
                .tab-btn { padding: 10px 20px; background: #333; color: white; border: none; cursor: pointer; }
                .tab-btn.active { background: #0066FF; }
                .tab-content { display: none; }
                .tab-content.active { display: block; }
                table { width: 100%; border-collapse: collapse; background: #1a1a1a; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #333; }
                th { background: #0066FF; color: white; }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', adminCSS);
    }
    
    function displayUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id.substring(0, 8)}...</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${user.role || 'N/A'}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
    
    function displayTrips(trips) {
        const tbody = document.querySelector('#tripsTable tbody');
        tbody.innerHTML = trips.map(trip => `
            <tr>
                <td>${trip.id.substring(0, 8)}...</td>
                <td>${trip.rider_id?.substring(0, 8) || 'N/A'}...</td>
                <td>${trip.origin || 'N/A'}</td>
                <td>${trip.destination || 'N/A'}</td>
                <td>₦${trip.fare}</td>
                <td>${trip.status || 'N/A'}</td>
            </tr>
        `).join('');
    }
    
    function displayVehicles(vehicles) {
        const tbody = document.querySelector('#vehiclesTable tbody');
        tbody.innerHTML = vehicles.map(vehicle => `
            <tr>
                <td>${vehicle.id.substring(0, 8)}...</td>
                <td>${vehicle.driver_id?.substring(0, 8) || 'N/A'}...</td>
                <td>${vehicle.make || 'N/A'}</td>
                <td>${vehicle.model || 'N/A'}</td>
                <td>${vehicle.plate_number || 'N/A'}</td>
            </tr>
        `).join('');
    }
    
    window.showTab = function(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`.tab-btn[onclick="showTab('${tab}')"]`).classList.add('active');
        document.getElementById(`${tab}Tab`).classList.add('active');
    };
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ride9ja initialized');
    
    if (isMainPage) {
        console.log('Setting up main website...');
        
        // Set min date for date inputs
        const today = new Date().toISOString().split('T')[0];
        document.querySelectorAll('input[type="date"]').forEach(input => {
            input.min = today;
        });
        
        createModals();
        setupFormHandlers();
    }
    
    if (isAdminPage) {
        console.log('Setting up admin dashboard...');
        loadAdminDashboard();
    }
});

// Make functions available globally
window.getUsers = getUsers;
window.getTrips = getTrips;
window.getVehicles = getVehicles;
window.getPayments = getPayments;
window.saveRiderToSupabase = saveRiderToSupabase;
window.saveDriverToSupabase = saveDriverToSupabase;

console.log('Ride9ja ready with Supabase direct connection');
