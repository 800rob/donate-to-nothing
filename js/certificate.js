/**
 * Donate to Nothing - Certificate Generator
 * Uses jsPDF library for client-side PDF generation
 */

/**
 * Generate a unique certificate number
 */
function generateCertificateNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DTN-${timestamp}-${random}`;
}

/**
 * Get tier name from donation amount
 */
function getCertificateTier(amount) {
    if (amount >= 250) return 'LEGEND';
    if (amount >= 100) return 'BENEFACTOR';
    if (amount >= 50) return 'PATRON';
    if (amount >= 25) return 'SUPPORTER';
    return 'PARTICIPANT';
}

/**
 * Format date for certificate
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Generate and download certificate PDF
 * @param {string} donorName - Name of the donor
 * @param {number} amount - Donation amount
 */
function generateCertificate(donorName, amount) {
    // Wait for jsPDF to be available
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library is still loading. Please try again in a moment.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const tier = getCertificateTier(amount);
    const certNumber = generateCertificateNumber();
    const today = formatDate(new Date());

    // Colors
    const navyDark = [26, 31, 60];
    const gold = [212, 175, 55];
    const goldDark = [184, 150, 12];
    const gray = [108, 117, 125];

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer decorative border
    doc.setDrawColor(...gold);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner border
    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Corner decorations
    drawCornerDecoration(doc, 12, 12, gold);
    drawCornerDecoration(doc, pageWidth - 12, 12, gold, true);
    drawCornerDecoration(doc, 12, pageHeight - 12, gold, false, true);
    drawCornerDecoration(doc, pageWidth - 12, pageHeight - 12, gold, true, true);

    // Seal/Logo circle
    const sealX = pageWidth / 2;
    const sealY = 45;
    doc.setFillColor(...navyDark);
    doc.setDrawColor(...gold);
    doc.setLineWidth(2);
    doc.circle(sealX, sealY, 18, 'FD');

    // Seal symbol (∅)
    doc.setTextColor(...gold);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('O', sealX, sealY + 3, { align: 'center' });
    doc.setLineWidth(0.8);
    doc.setDrawColor(...gold);
    doc.line(sealX - 8, sealY + 8, sealX + 8, sealY - 8);

    // Title
    doc.setTextColor(...navyDark);
    doc.setFontSize(28);
    doc.setFont('times', 'bold');
    doc.text('CERTIFICATE OF DONATION', pageWidth / 2, 75, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.setTextColor(...gray);
    doc.text('to Absolutely Nothing', pageWidth / 2, 83, { align: 'center' });

    // Decorative line
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 60, 88, pageWidth / 2 + 60, 88);

    // "This certifies that"
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(...gray);
    doc.text('This certifies that', pageWidth / 2, 100, { align: 'center' });

    // Donor Name
    doc.setFontSize(24);
    doc.setFont('times', 'bolditalic');
    doc.setTextColor(...navyDark);
    doc.text(donorName, pageWidth / 2, 115, { align: 'center' });

    // Name underline
    const nameWidth = doc.getTextWidth(donorName);
    doc.setDrawColor(...gold);
    doc.setLineWidth(0.8);
    doc.line(pageWidth / 2 - nameWidth / 2 - 10, 118, pageWidth / 2 + nameWidth / 2 + 10, 118);

    // "has generously donated"
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(...gray);
    doc.text('has generously donated', pageWidth / 2, 128, { align: 'center' });

    // Amount
    doc.setFontSize(32);
    doc.setFont('times', 'bold');
    doc.setTextColor(...goldDark);
    doc.text(`$${amount.toFixed(2)}`, pageWidth / 2, 145, { align: 'center' });

    // "to absolutely nothing whatsoever"
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.setTextColor(...gray);
    doc.text('to absolutely nothing whatsoever', pageWidth / 2, 155, { align: 'center' });

    // Tier badge
    doc.setFillColor(...navyDark);
    const tierWidth = 60;
    const tierHeight = 10;
    const tierX = pageWidth / 2 - tierWidth / 2;
    const tierY = 162;
    doc.roundedRect(tierX, tierY, tierWidth, tierHeight, 3, 3, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`TIER: ${tier}`, pageWidth / 2, tierY + 7, { align: 'center' });

    // Footer section
    doc.setDrawColor(...gray);
    doc.setLineWidth(0.3);
    doc.line(40, 180, pageWidth - 40, 180);

    // Date and Certificate Number
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(`Date: ${today}`, 50, 188);
    doc.text(`Certificate #: ${certNumber}`, pageWidth - 50, 188, { align: 'right' });

    // Disclaimer
    doc.setFontSize(7);
    doc.setFont('times', 'italic');
    doc.setTextColor(150, 150, 150);
    const disclaimer = 'This certificate has no monetary value, represents no tax deduction, and accomplishes nothing of consequence.';
    doc.text(disclaimer, pageWidth / 2, 197, { align: 'center' });

    // Organization name
    doc.setFontSize(8);
    doc.text('Donate to Nothing | The Most Honest Non-Charity', pageWidth / 2, 203, { align: 'center' });

    // Download the PDF
    const filename = `donation-certificate-${donorName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(filename);
}

/**
 * Draw corner decoration
 */
function drawCornerDecoration(doc, x, y, color, flipX = false, flipY = false) {
    const size = 8;
    const dirX = flipX ? -1 : 1;
    const dirY = flipY ? -1 : 1;

    doc.setDrawColor(...color);
    doc.setLineWidth(1.5);

    // L-shaped corner
    doc.line(x, y, x + (size * dirX), y);
    doc.line(x, y, x, y + (size * dirY));

    // Inner decorative dot
    doc.setFillColor(...color);
    doc.circle(x + (3 * dirX), y + (3 * dirY), 1, 'F');
}

// Make function globally available
window.generateCertificate = generateCertificate;
