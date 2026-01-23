// ==========================================
// 1. CONFIGURATION
// ==========================================
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
let sb;

// ==========================================
// 2. INITIALIZATION (Force Remove Loading)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Force remove any lingering loading screen
    const loader = document.getElementById('loadingScreen');
    if (loader) loader.remove();

    // Connect to Supabase safely
    if (window.supabase) {
        sb = window.supabase.createClient(URL, KEY);
        console.log('✅ Ride9ja Connected to Database');
    } else {
        console.error('❌ Supabase Library Missing');
    }
});

// ==========================================
// 3. MOBILE MENU
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        navToggle.innerHTML = icon;
    });
}

// ==========================================
// 4. MODAL SYSTEM
// ==========================================
function createModals() {
    if (document.getElementById('riderModal')) return;

    const html = `
        <!-- Rider Modal -->
        <div class="modal-overlay" id="riderModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="fas fa-user"></i> Find a Ride</h2>
                    <button class="close-btn" onclick="window.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-tabs">
                        <button class="tab-btn active" onclick="window.switchTab('city')">City</button>
                        <button class="tab-btn" onclick="window.switchTab('interstate')">Interstate</button>
                    </div>

                    <!-- City Form -->
                    <form id="cityForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="cName" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <label>Route</label>
                            <select id="cRoute" required>
                                <option value="Nyanya-CBD">Nyanya - CBD</option>
                                <option value="Kubwa-CBD">Kubwa - CBD</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-blue btn-block">Find City Ride</button>
                    </form>

                    <!-- Interstate Form -->
                    <form id="interstateForm" style="display:none;">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="iName" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <label>From</label>
                            <input type="text" id="iFrom" placeholder="Abuja" required>
                        </div>
                        <div class="form-group">
                            <label>To</label>
                            <input type="text" id="iTo" placeholder="Lagos" required>
                        </div>
                        <button type="submit" class="btn btn-purple btn-block">Book Interstate</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    
    // Attach Listeners
    document.getElementById('cityForm').addEventListener('submit', handleCitySubmit);
    document.getElementById('interstateForm').addEventListener('submit', handleInterstateSubmit);
}

window.showRiderModal = function(type) {
    createModals();
    window.switchTab(type);
    document.getElementById('riderModal').classList.add('active');
}

window.closeModal = function() {
    document.getElementById('riderModal').classList.remove('active');
}

window.switchTab = function(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`button[onclick="window.switchTab('${type}')"]`).classList.add('active');
    
    if(type === 'city') {
        document.getElementById('cityForm').style.display = 'block';
        document.getElementById('interstateForm').style.display = 'none';
    } else {
        document.getElementById('cityForm').style.display = 'none';
        document.getElementById('interstateForm').style.display = 'block';
    }
}

window.showDriverModal = function() {
    alert("Driver registration coming soon.");
}

// ==========================================
// 5. REAL BACKEND HANDLERS
// ==========================================

async function handleCitySubmit(e) {
    e.preventDefault();
    if(!sb) return alert("Backend not connected");
    
    const name = document.getElementById('cName').value;
    const route = document.getElementById('cRoute').value;
    const btn = e.target.querySelector('button');
    
    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
        if(passenger) {
            await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: route,
                dropoff_location: 'City CBD',
                price: 2500,
                status: 'pending'
            }]);
            alert("✅ City Ride Booked! Check Admin Panel.");
            window.closeModal();
            e.target.reset();
        }
    } catch(err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Find City Ride";
        btn.disabled = false;
    }
}

async function handleInterstateSubmit(e) {
    e.preventDefault();
    if(!sb) return alert("Backend not connected");
    
    const name = document.getElementById('iName').value;
    const from = document.getElementById('iFrom').value;
    const to = document.getElementById('iTo').value;
    const btn = e.target.querySelector('button');
    
    btn.innerText = "Booking...";
    btn.disabled = true;

    try {
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
        if(passenger) {
            await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: from,
                dropoff_location: to,
                price: 15000,
                status: 'pending'
            }]);
            alert("✅ Interstate Ride Booked! Check Admin Panel.");
            window.closeModal();
            e.target.reset();
        }
    } catch(err) {
        alert("Error: " + err.message);
    } finally {
        btn.innerText = "Book Interstate";
        btn.disabled = false;
    }
}
