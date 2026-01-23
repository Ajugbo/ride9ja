// ==========================================
// 1. CONFIGURATION
// ==========================================

// Supabase Connection
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
const sb = window.supabase.createClient(URL, KEY);

// ==========================================
// 2. FORCE REMOVE LOADING SCREEN (Fixes "Endless Loading")
// ==========================================
const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
    loadingScreen.remove(); // Delete it immediately so site is visible
}

// ==========================================
// 3. MOBILE NAVIGATION
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==========================================
// 4. MODAL & BOOKING LOGIC
// ==========================================

// Add Styles for Modal
const modalStyles = `
<style>
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 2000; }
    .modal-overlay.active { display: flex; }
    .modal-content { background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; position: relative; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .modal-header h3 { color: #008751; margin: 0; font-size: 20px; }
    .close-btn { font-size: 28px; cursor: pointer; color: #888; line-height: 1; }
    .close-btn:hover { color: #333; }
    .modal-content label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
    .modal-content input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 6px; box-sizing: border-box; font-size: 14px; }
    .modal-content input:focus { border-color: #008751; outline: none; }
    .modal-content button { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; font-size: 16px; background: #0066FF; transition: background 0.2s; }
    .modal-content button:hover { background: #0055cc; }
</style>
`;
document.head.insertAdjacentHTML('beforeend', modalStyles);

// Create Modal
function createModal() {
    if (document.getElementById('bookingModal')) return;
    const modalHTML = `
        <div id="bookingModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚖 Book Your Ride</h3>
                    <span class="close-btn" onclick="window.closeModal()">&times;</span>
                </div>
                <form id="bookingForm">
                    <label>Full Name</label>
                    <input type="text" id="pName" placeholder="Enter your name" required>
                    <label>Pickup Location</label>
                    <input type="text" id="pPickup" placeholder="e.g. Lekki Phase 1" required>
                    <label>Dropoff Location</label>
                    <input type="text" id="pDropoff" placeholder="e.g. Victoria Island" required>
                    <button type="submit">Confirm Booking</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Open Modal
window.showRiderModal = function(type) {
    createModal();
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

// Close Modal
window.closeModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

window.showDriverModal = function() {
    alert("Driver registration coming soon! Email support@ride9ja.com");
}

// ==========================================
// 5. HANDLE BOOKING SUBMIT
// ==========================================
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'bookingForm') {
        e.preventDefault();
        const name = document.getElementById('pName').value;
        const pickup = document.getElementById('pPickup').value;
        const dropoff = document.getElementById('pDropoff').value;
        
        if(!name || !pickup || !dropoff) {
            alert("Please fill in all details");
            return;
        }

        const btn = e.target.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;

        try {
            const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();
            if (passenger) {
                const { error } = await sb.from('bookings').insert([{
                    passenger_id: passenger.id,
                    pickup_location: pickup,
                    dropoff_location: dropoff,
                    price: 2500,
                    status: 'pending'
                }]);
                if (!error) {
                    alert("✅ Ride Request Sent! Check your Admin Panel.");
                    closeModal();
                    e.target.reset();
                } else {
                    alert("Error: " + error.message);
                }
            }
        } catch (err) {
            alert("System Error: " + err.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }
});
