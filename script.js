// ==========================================
// 1. CONFIGURATION (Uses "Global Keys")
// ==========================================
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
const sb = window.supabase.createClient(URL, KEY);

// ==========================================
// 2. FETCH DATA (From "Client Side" - The "User Website")
// ==========================================

async function loadData() {
    // 1. Fetch Bookings
    const { data: bookings, error } = await sb
        .from('bookings')
        .select('*, passengers(full_name)'); // We join passengers to get their names automatically

    // 2. Fetch Drivers
    const { data: drivers, error } = await sb
        .from('drivers')
        .select('*');

    // 3. Handle Errors
    if (bError) console.error('Booking Error:', bError);
    if (dError) console.error('Driver Error:', dError);

    // 4. Render UI
    renderBookings(bookings || []);
    renderDrivers(drivers || []);
    updateStats(bookings || [], drivers || []);
}

// ==========================================
// 3. RENDER FUNCTIONS
// ==========================================

function renderBookings(bookings) {
    const tbody = document.getElementById('bookings-table');
    tbody.innerHTML = '';
    
    if (bookings.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4">No bookings found. Add one from the Main Website to see data appear here.</td></tr>`;
        return;
    }

    bookings.forEach(b => {
        const passengerName = b.passengers ? b.passengers.full_name : 'Guest';
        let statusClass = b.status === 'pending' ? 'bg-red' : 'bg-green';
        let actionBtn = '';
        
        if(b.status === 'pending') {
            actionBtn = `<button class="btn btn-sm" onclick="cancelBooking(${b.id})">Cancel</button>`;
        } else {
            actionBtn = `<span class="badge ${b.status === 'completed' ? 'bg-green' : 'bg-red'}">${b.status}</span>`;
        }

        tbody.innerHTML += `
            <tr>
                <td>#${b.id}</td>
                <td>${passengerName}</td>
                <td><span class="badge ${statusClass}">${b.status}</span></td>
                <td>${actionBtn}</td>
            </tr>
    `;
}

function renderDrivers(drivers) {
    const tbody = document.getElementById('drivers-table');
    tbody.innerHTML = '';

    drivers.forEach(d => {
        const verifiedBadge = d.is_verified 
            ? `<span class="badge bg-green">Yes</span>` 
            : `<span class="badge bg-red">No</span>`;
        
        const actionBtn = !d.is_verified 
            ? `<button class="btn btn-sm" onclick="verifyDriver(${d.id})">Verify</button>` 
            : `<span class="badge bg-gray">Pending</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${d.full_name}</td>
                <td>${d.status}</td>
                <td>${verifiedBadge}</td>
                <td>${actionBtn}</td>
            </tr>
    `;
}

function updateStats(bookings, drivers) {
    document.getElementById('stat-active').textContent = bookings.filter(b => b.status === 'pending').length;
    document.getElementById('stat-drivers').textContent = drivers.length;
}

// ==========================================
// 4. ACTIONS (Admin Only)
// ==========================================

async function cancelBooking(id) {
    if(!sb) return alert("Not connected to database. Open your Main Website (`https://ajugbo.github.io/ride9ja/`) first so it connects to database before Admin Panel can read it.");
    
    await sb.from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);
    
    showToast("Booking Cancelled");
    loadData();
}

async function verifyDriver(id) {
    if(!sb) return;

    const { error } = await sb.from('drivers')
        .update({ is_verified: true })
        .eq('id', id);
    
    showToast("Driver Verified!");
    loadData();
}
