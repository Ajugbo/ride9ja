// ==========================================
// 1. DEBUG MODE (Step-by-Step Status)
// ==========================================
alert("Step 1: JavaScript is Running");

// ==========================================
// 2. CONFIGURATION
// ==========================================
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
let sb;

// ==========================================
// 3. STARTUP (Loads Library & Connects)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if Supabase Library is Loaded
    if (window.supabase) {
        alert("Step 2: Supabase Library Found!");
        
        // Try to connect
        try {
            sb = window.supabase.createClient(URL, KEY);
            alert("Step 3: Connected to Database!");
        } catch (crashError) {
            alert("CRASH DETECTED: " + crashError.message);
            alert("This usually means URL or Key has a typo.");
        }
    } else {
        alert("Step 2 FAILED: Supabase Library NOT Found. Check index.html.");
    }
});

// ==========================================
// 4. MOBILE MENU (Preserved from original)
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = navMenu.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        navToggle.innerHTML = icon;
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ==========================================
// 5. MODAL & BOOKING LOGIC (Simple Version)
// ==========================================

// Inject Styles
const modalStyles = `
<style>
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 2000; }
    .modal-overlay.active { display: flex; }
    .modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; position: relative; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .close-btn { font-size: 24px; cursor: pointer; background: none; border: none; color: #888; }
    .modal-body label { display: block; margin-bottom: 8px; font-weight: 600; }
    .modal-body input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; }
    .modal-body button { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; background: #0066FF; }
</style>
`;
document.head.insertAdjacentHTML('beforeend', modalStyles);

function createModals() {
    if (document.getElementById('bookingModal')) return;

    const modalHTML = `
        <div class="modal-overlay" id="bookingModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Find a Ride</h3>
                    <button class="close-btn" onclick="window.closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <label>Full Name</label>
                    <input type="text" id="pName" placeholder="Your Name" required>
                    <label>Route</label>
                    <input type="text" id="pRoute" placeholder="e.g. Nyanya-CBD" required>
                    <button type="submit">Book Ride</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('bookingForm').addEventListener('submit', handleCitySubmit);
}

window.showRiderModal = function() {
    createModals();
    document.getElementById('bookingModal').classList.add('active');
}

window.closeModal = function() {
    document.getElementById('bookingModal').classList.remove('active');
}

async function handleCitySubmit(e) {
    e.preventDefault();
    
    if(!sb) {
        alert("System Error: Database not connected (sb is null).");
        return;
    }

    const name = document.getElementById('pName').value;
    const route = document.getElementById('pRoute').value;
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "Processing...";
    btn.disabled = true;

    try {
        // 1. Save Passenger
        const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();

        // 2. Save Booking
        if (passenger) {
            const { error } = await sb.from('bookings').insert([{
                passenger_id: passenger.id,
                pickup_location: route,
                dropoff_location: 'CBD',
                price: 2500,
                status: 'pending'
            }]);

            if (!error) {
                alert("✅ Success! Ride Request Sent to Admin.");
                closeModal();
                e.target.reset();
            } else {
                alert("❌ Database Error: " + error.message);
            }
        }
    } catch (err) {
        alert("❌ System Crash: " + err.message);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

window.showDriverModal = function() {
    alert("Driver registration coming soon");
}
