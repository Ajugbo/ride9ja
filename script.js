// ==========================================
// 1. CONFIGURATION (With Force Cleaner)
// ==========================================
const URL_RAW = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';

// Clean the URL (removes invisible spaces/newlines)
const URL = URL_RAW.trim();
const KEY = KEY.trim();

let sb;

// ==========================================
// 2. BOOTLOADER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SPY ALERT: Show us what the URL looks like
    alert("SPY CHECK:\n" + URL + "\n\nDoes this look clean?");

    // 2. Check Prefix
    if (!URL.startsWith('http')) {
        alert("CRITICAL: URL does NOT start with http/https.\nRaw value: " + URL);
        return; // Stop loading
    }

    // 3. Check Library
    if (window.supabase) {
        alert("Step 2: Supabase Library Found. Attempting connection...");
        
        try {
            sb = window.supabase.createClient(URL, KEY);
            alert("Step 3: Connected! Database is open.");
        } catch (crash) {
            alert("CRASH DETECTED: " + crash.message);
            alert("This URL is causing the crash.");
        }
    } else {
        alert("ERROR: Supabase Library not found. Check index.html script tag.");
    }
});

// ==========================================
// 3. MOBILE MENU (Kept simple)
// ==========================================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// ==========================================
// 4. DATA LOADER (Only if Connected)
// ==========================================
async function loadData() {
    if(!sb) {
        alert("Cannot load data. 'sb' is null. Check previous alerts.");
        return;
    }

    const { data: bookings } = await sb.from('bookings').select('*, passengers(full_name)');
    const { data: drivers } = await sb.from('drivers').select('*');

    // Render
    const bTable = document.getElementById('bookings-table');
    bTable.innerHTML = '';
    bookings.forEach(b => {
        const name = b.passengers ? b.passengers.full_name : 'Guest';
        bTable.innerHTML += `<tr><td>#${b.id}</td><td>${name}</td><td>${b.status}</td></tr>`;
    });

    const dTable = document.getElementById('drivers-table');
    dTable.innerHTML = '';
    drivers.forEach(d => {
        dTable.innerHTML += `<tr><td>${d.full_name}</td><td>${d.status}</td></tr>`;
    });
}
