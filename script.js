// ==========================================
// 1. CONFIGURATION & INIT
// ==========================================

// Supabase Connection
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
const sb = window.supabase.createClient(URL, KEY);

// Loading Screen Logic
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500); // 1.5 seconds delay
    }
});

// ==========================================
// 2. MOBILE NAVIGATION
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ==========================================
// 3. MODAL & BOOKING LOGIC (The Backend)
// ==========================================

// Create Modal Elements dynamically if they don't exist
function createModal() {
    // Check if modal already exists
    if(document.getElementById('bookingModal')) return;

    const modalHTML = `
        <div id="bookingModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚖 Book Your Ride</h3>
                    <span class="close-btn" onclick="closeModal()">&times;</span>
                </div>
                <form id="bookingForm">
                    <label>Full Name</label>
                    <input type="text" id="pName" placeholder="Enter your name" required>
                    
                    <label>Pickup Location</label>
                    <input type="text" id="pPickup" placeholder="e.g. Lekki Phase 1" required>
                    
                    <label>Dropoff Location</label>
                    <input type="text" id="pDropoff" placeholder="e.g. Victoria Island" required>
                    
                    <button type="submit" class="btn btn-blue">Confirm Booking</button>
                </form>
            </div>
        </div>
        <style>
            /* Modal Styles */
            .modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.6); display: none; justify-content: center; align-items: center; z-index: 1000;
            }
            .modal-overlay.active { display: flex; }
            .modal-content {
                background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 400px; position: relative;
            }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .modal-header h3 { color: #008751; margin: 0; }
            .close-btn { font-size: 24px; cursor: pointer; color: #888; }
            .modal-content label { display: block; margin-bottom: 5px; font-weight: 600; }
            .modal-content input { width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
            .modal-content button { width: 100%; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; color: white; }
        </style>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.showRiderModal = function(type) {
    createModal();
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.add('active');
}

window.showDriverModal = function() {
    alert("Driver registration is coming soon! Contact support@ride9ja.com");
}

window.closeModal = function() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

// ==========================================
// 4. HANDLE BOOKING SUBMIT (The Magic)
// ==========================================

document.addEventListener('submit', async (e) => {
    if (e.target.id === 'bookingForm') {
        e.preventDefault(); // Stop page reload

        const name = document.getElementById('pName').value;
        const pickup = document.getElementById('pPickup').value;
        const dropoff = document.getElementById('pDropoff').value;

        // UI Feedback
        const submitBtn = e.target.querySelector('button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Processing...";
        submitBtn.disabled = true;

        try {
            // 1. Add Passenger
            const { data: passenger } = await sb.from('passengers').insert([{ full_name: name }]).select().single();

            if (passenger) {
                // 2. Add Booking
                const { error } = await sb.from('bookings').insert([{
                    passenger_id: passenger.id,
                    pickup_location: pickup,
                    dropoff_location: dropoff,
                    price: 2500, // Fixed price
                    status: 'pending'
                }]);

                if (!error) {
                    alert("✅ Success! Your ride request has been sent to a driver.");
                    closeModal();
                    e.target.reset(); // Clear form
                } else {
                    alert("❌ Error saving booking: " + error.message);
                }
            }
        } catch (err) {
            alert("❌ System Error: " + err.message);
        } finally {
            // Reset Button
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    }
});
