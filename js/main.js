/**
 * Donate to Nothing - Main JavaScript
 * Handles navigation, interactions, and form logic
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDonationForm();
    initAmountButtons();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle hamburger animation
            mobileMenuBtn.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 31, 60, 0.98)';
        } else {
            navbar.style.background = 'var(--navy-dark)';
        }
    });
}

/**
 * Donation Amount Button Handling
 */
function initAmountButtons() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customAmountWrapper = document.getElementById('customAmountWrapper');
    const customAmountInput = document.getElementById('customAmount');
    const selectedTierName = document.getElementById('selectedTierName');
    const shippingFields = document.getElementById('shippingFields');

    let selectedAmount = 0;

    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            amountBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const amount = this.dataset.amount;

            if (amount === 'custom') {
                customAmountWrapper.style.display = 'block';
                customAmountInput.focus();
                selectedAmount = parseInt(customAmountInput.value) || 0;
                updateTierDisplay(selectedAmount);
            } else {
                customAmountWrapper.style.display = 'none';
                selectedAmount = parseInt(amount);
                const tier = this.dataset.tier;
                selectedTierName.textContent = `${tier} ($${amount})`;
                updateShippingVisibility(selectedAmount);
            }
        });
    });

    // Custom amount input handling
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            selectedAmount = parseInt(this.value) || 0;
            updateTierDisplay(selectedAmount);
        });
    }

    function updateTierDisplay(amount) {
        let tier = 'Select an amount';

        if (amount >= 250) {
            tier = `Legend ($${amount})`;
        } else if (amount >= 100) {
            tier = `Benefactor ($${amount})`;
        } else if (amount >= 50) {
            tier = `Patron ($${amount})`;
        } else if (amount >= 25) {
            tier = `Supporter ($${amount})`;
        } else if (amount >= 1) {
            tier = `Participant ($${amount})`;
        }

        selectedTierName.textContent = tier;
        updateShippingVisibility(amount);
    }

    function updateShippingVisibility(amount) {
        if (amount >= 25) {
            shippingFields.style.display = 'block';
        } else {
            shippingFields.style.display = 'none';
        }
    }
}

/**
 * Donation Form Handling
 */
function initDonationForm() {
    const showOnLeaderboard = document.getElementById('showOnLeaderboard');
    const anonymousOption = document.getElementById('anonymousOption');

    // Toggle anonymous option visibility based on leaderboard checkbox
    if (showOnLeaderboard && anonymousOption) {
        showOnLeaderboard.addEventListener('change', function() {
            anonymousOption.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Preview certificate button
    const previewCertBtn = document.getElementById('previewCertBtn');
    if (previewCertBtn) {
        previewCertBtn.addEventListener('click', function() {
            const donorName = document.getElementById('donorName').value || 'Your Name Here';
            const selectedTier = document.getElementById('selectedTierName').textContent;

            // Extract amount from tier display
            const amountMatch = selectedTier.match(/\$(\d+)/);
            const amount = amountMatch ? parseInt(amountMatch[1]) : 5;

            // Generate certificate (calls function from certificate.js)
            if (typeof generateCertificate === 'function') {
                generateCertificate(donorName, amount);
            } else {
                alert('Certificate generator is loading. Please try again.');
            }
        });
    }
}

/**
 * Get Tier from Amount
 */
function getTierFromAmount(amount) {
    if (amount >= 250) return 'Legend';
    if (amount >= 100) return 'Benefactor';
    if (amount >= 50) return 'Patron';
    if (amount >= 25) return 'Supporter';
    return 'Participant';
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Export for use in other modules
window.getTierFromAmount = getTierFromAmount;
