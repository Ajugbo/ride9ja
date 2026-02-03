// ==========================================
// 1. DEBUG MODE
// ==========================================
alert("Step 1: JavaScript is Running");

// ==========================================
// 2. CONFIGURATION
// ==========================================
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
let sb; // Initialize as undefined

// ==========================================
// 3. CONNECT TO DATABASE (Safe Mode)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Remove Loading Screen
    const loader = document.getElementById('loadingScreen');
    if (loader) loader.remove();

    // Check Library
    if (window.supabase) {
        alert("Step 2: Supabase Library Found!");
        
        // Wrap connection in Try/Catch to catch the crash
        try {
            sb = window.supabase.createClient(URL, KEY);
            alert("Step 3: Connected to Database!");
        } catch (crashError) {
            alert("CRASH DETECTED: " + crashError.message);
            alert("Check URL or KEY for typos.");
        }
    } else {
        alert("Step 2 FAILED: Supabase library missing.");
    }
});

// ==========================================
// 4. MOBILE MENU
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==========================================
// 5. MODAL SYSTEM
// ==========================================
function createModals() {
    if (document.getElementById('riderModal')) return;

    const html = `
        <div class="modal-overlay" id="riderModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Find a Ride</h2>
                    <button class="close-btn" onclick="window.closeModal()">×</button>
                </div>
                <div class="modal-body">
                    <form id="cityForm">
                        <div class="form-group"><label>Name</label><input type="text" id="cName" required></div>
                        <div class="form-group"><label>Route</label><input type="text" id="cRoute" required></div>
                        <button type="submit" class="btn-blue">Book City Ride</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('cityForm').addEventListener('submit', handleCitySubmit);
}

window.showRiderModal = function() {
    createModals();
    document.getElementById('riderModal').classList.add('active');
}

window.closeModal = function() {
    document.getElementById('riderModal').classList.remove('active');
}

window.showDriverModal = function() {
    alert("Driver coming soon");
}

// ==========================================
// 6. BACKEND ACTION
// ==========================================
async function handleCitySubmit(e) {
    e.preventDefault();
    
    // Check if 'sb' was actually created
    if(!sb) {
        alert("CRITICAL: 'sb' is null. The connection crashed at Step 3.");
        return;
    }

    const name = document.getElementById('cName').value;
    const route = document.getElementById('cRoute').value;
    const btn = e.target.querySelector('button');

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
        if (passenger) {
            await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: route,
                dropoff_location: 'CBD',
                price: 2500,
                status: 'pending'
            }]);
            alert("✅ Ride Booked!");
            window.closeModal();
            e.target.reset();
        }
    } catch (err) {
        alert("Database Error: " + err.message);
    } finally {
        btn.innerText = "Book City Ride";
        btn.disabled = false;
    }
}
