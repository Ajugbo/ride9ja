// ==========================================
// 1. CONFIGURATION (Keys)
// ==========================================
const URL = 'https://ryaaqozgpmuysjayomdd.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5YWFxb3pncG11eXNqYXlvbWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTk5ODMsImV4cCI6MjA4NDU5NTk4M30.MOtDemq56FMUizveP1WC2KJ-2YGIwknduVsxcn8DTBc';
let sb; // We will NOT export this to window

// ==========================================
// 2. INITIALIZATION (The "Source of Truth")
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    
    // Check if Loading Screen exists and remove it (To fix endless loading)
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
        console.log('✅ Loading screen removed');
    }

    // Check Library
    if (window.supabase) {
        console.log("Supabase Library Found. Connecting...");
        
        try {
            // Create the connection
            sb = window.supabase.createClient(URL, KEY);
            
            // SAVE TO SHARED STORAGE (This is the Magic Key!)
            try {
                localStorage.setItem('r9_client_string', JSON.stringify(sb));
                localStorage.setItem('r9_status', 'connected');
                alert("Step 3: Connected to Database!");
            } catch(e) {
                console.warn("Could not save to localStorage (incognito mode?)");
            }

        } else {
            alert("Error: Supabase Library not loaded.");
        }
});

// ... (Keep your rest of the code below: Modal logic, Mobile Menu, etc) ...
