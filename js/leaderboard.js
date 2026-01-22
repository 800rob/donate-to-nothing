/**
 * Donate to Nothing - Leaderboard Component
 * Fetches data from Google Sheets and displays on Wall of Fame
 */

// Configuration - Update these values with your Google Sheets info
const LEADERBOARD_CONFIG = {
    // Replace with your published Google Sheets URL (as JSON)
    // To get this: File > Share > Publish to web > Select sheet > Choose "Web page" > Copy link
    // Then modify URL to: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json
    googleSheetsUrl: '',

    // Set to true to use demo data when no Google Sheets URL is configured
    useDemoData: true,

    // Demo data for testing
    demoData: [
        { rank: 1, name: 'Anonymous', tier: 'Legend', amount: 300, date: '2026-01-18' },
        { rank: 2, name: 'John D.', tier: 'Legend', amount: 250, date: '2026-01-16' },
        { rank: 3, name: 'Sarah M.', tier: 'Benefactor', amount: 175, date: '2026-01-14' },
        { rank: 4, name: 'Anonymous', tier: 'Benefactor', amount: 120, date: '2026-01-12' },
        { rank: 5, name: 'Mike T.', tier: 'Patron', amount: 85, date: '2026-01-10' },
        { rank: 6, name: 'Emily R.', tier: 'Patron', amount: 60, date: '2026-01-08' },
        { rank: 7, name: 'Anonymous', tier: 'Supporter', amount: 45, date: '2026-01-06' },
        { rank: 8, name: 'Chris L.', tier: 'Supporter', amount: 35, date: '2026-01-04' },
        { rank: 9, name: 'Alex K.', tier: 'Supporter', amount: 25, date: '2026-01-02' },
        { rank: 10, name: 'Jordan P.', tier: 'Participant', amount: 10, date: '2026-01-01' }
    ]
};

// State
let leaderboardData = [];
let currentSort = 'date';

/**
 * Initialize leaderboard on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    initLeaderboard();
    initSortButtons();
});

/**
 * Initialize the leaderboard
 */
async function initLeaderboard() {
    const loadingEl = document.getElementById('leaderboardLoading');
    const emptyEl = document.getElementById('leaderboardEmpty');
    const tbody = document.getElementById('leaderboardBody');

    try {
        if (LEADERBOARD_CONFIG.googleSheetsUrl) {
            leaderboardData = await fetchFromGoogleSheets();
        } else if (LEADERBOARD_CONFIG.useDemoData) {
            // Use demo data
            leaderboardData = LEADERBOARD_CONFIG.demoData;
        } else {
            leaderboardData = [];
        }

        loadingEl.style.display = 'none';

        if (leaderboardData.length === 0) {
            emptyEl.style.display = 'block';
        } else {
            renderLeaderboard();
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        loadingEl.textContent = 'Error loading leaderboard. Please try again later.';
    }
}

/**
 * Fetch data from Google Sheets
 */
async function fetchFromGoogleSheets() {
    const response = await fetch(LEADERBOARD_CONFIG.googleSheetsUrl);
    const text = await response.text();

    // Google Sheets returns JSONP-like format, need to extract JSON
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    if (!jsonMatch) {
        throw new Error('Invalid Google Sheets response format');
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    const rows = jsonData.table.rows;

    // Parse rows into leaderboard format
    // Expected columns: Name, Tier, Amount, Date, ShowOnLeaderboard, Anonymous
    return rows
        .filter(row => {
            // Filter out rows where ShowOnLeaderboard is false
            const showOnLeaderboard = row.c[4]?.v;
            return showOnLeaderboard === true || showOnLeaderboard === 'TRUE' || showOnLeaderboard === 'Yes';
        })
        .map((row, index) => {
            const isAnonymous = row.c[5]?.v === true || row.c[5]?.v === 'TRUE' || row.c[5]?.v === 'Yes';
            return {
                rank: index + 1,
                name: isAnonymous ? 'Anonymous' : (row.c[0]?.v || 'Anonymous'),
                tier: row.c[1]?.v || 'Participant',
                amount: parseFloat(row.c[2]?.v) || 0,
                date: row.c[3]?.v || new Date().toISOString().split('T')[0]
            };
        });
}

/**
 * Initialize sort buttons
 */
function initSortButtons() {
    const sortBtns = document.querySelectorAll('.sort-btn');

    sortBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            sortBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            currentSort = this.dataset.sort;
            sortLeaderboard();
            renderLeaderboard();
        });
    });
}

/**
 * Sort leaderboard data
 */
function sortLeaderboard() {
    if (currentSort === 'date') {
        leaderboardData.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (currentSort === 'amount') {
        leaderboardData.sort((a, b) => b.amount - a.amount);
    }

    // Re-assign ranks after sorting
    leaderboardData.forEach((item, index) => {
        item.rank = index + 1;
    });
}

/**
 * Render leaderboard table
 */
function renderLeaderboard() {
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    leaderboardData.forEach(item => {
        const row = document.createElement('tr');

        // Rank badge
        const rankCell = document.createElement('td');
        const rankBadge = document.createElement('span');
        rankBadge.className = 'rank-badge';
        if (item.rank === 1) rankBadge.classList.add('gold');
        else if (item.rank === 2) rankBadge.classList.add('silver');
        else if (item.rank === 3) rankBadge.classList.add('bronze');
        rankBadge.textContent = item.rank;
        rankCell.appendChild(rankBadge);

        // Name
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;

        // Tier badge
        const tierCell = document.createElement('td');
        const tierBadge = document.createElement('span');
        tierBadge.className = `tier-badge-small ${item.tier.toLowerCase()}`;
        tierBadge.textContent = item.tier;
        tierCell.appendChild(tierBadge);

        // Date
        const dateCell = document.createElement('td');
        dateCell.textContent = formatLeaderboardDate(item.date);

        row.appendChild(rankCell);
        row.appendChild(nameCell);
        row.appendChild(tierCell);
        row.appendChild(dateCell);

        tbody.appendChild(row);
    });
}

/**
 * Format date for display
 */
function formatLeaderboardDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Manually add entry (for testing)
 */
function addLeaderboardEntry(name, tier, amount, date, anonymous = false) {
    leaderboardData.push({
        rank: leaderboardData.length + 1,
        name: anonymous ? 'Anonymous' : name,
        tier: tier,
        amount: amount,
        date: date || new Date().toISOString().split('T')[0]
    });

    sortLeaderboard();
    renderLeaderboard();
}

// Expose for testing
window.addLeaderboardEntry = addLeaderboardEntry;
