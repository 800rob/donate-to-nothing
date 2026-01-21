# Donate to Nothing

A satirical website where people donate to "nothing" and receive tiered certificates/plaques based on donation amount.

## Quick Start

1. Open `index.html` in your browser
2. That's it! The site works locally without a server.

## Project Structure

```
donate-to-nothing/
├── index.html          # Main single-page site
├── css/
│   └── styles.css      # All styling
├── js/
│   ├── main.js         # Navigation, interactions
│   ├── certificate.js  # PDF certificate generation
│   └── leaderboard.js  # Fetch and display leaderboard
├── images/             # Placeholder for images
│   └── .gitkeep
└── README.md           # This file
```

## Features

- **5 Donation Tiers**: Participant ($1-9), Supporter ($10-24), Patron ($25-49), Benefactor ($50-99), Legend ($100+)
- **PDF Certificate Generation**: Client-side PDF generation using jsPDF
- **Wall of Fame**: Leaderboard displaying donors (supports Google Sheets as data source)
- **Responsive Design**: Works on desktop and mobile
- **Satirical Content**: FAQ, tier descriptions, and overall tongue-in-cheek tone

## Setup Guide

### 1. Basic Setup (Demo Mode)

The site works out of the box with demo data. Just open `index.html` in a browser.

### 2. PayPal Integration

To accept real donations, you'll need a PayPal Business account:

1. Sign up at [PayPal Business](https://www.paypal.com/business)
2. Go to [PayPal Donate Button](https://www.paypal.com/donate/buttons)
3. Create a donation button
4. Copy the button code
5. Replace the placeholder button in `index.html` (search for `paypal-button-container`)

Example PayPal button code:
```html
<form action="https://www.paypal.com/donate" method="post" target="_blank">
  <input type="hidden" name="hosted_button_id" value="YOUR_BUTTON_ID" />
  <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" />
</form>
```

### 3. Google Sheets Leaderboard Setup

To use a real leaderboard instead of demo data:

1. Create a new Google Sheet with these columns:
   - Column A: Name
   - Column B: Tier
   - Column C: Amount
   - Column D: Date (YYYY-MM-DD format)
   - Column E: ShowOnLeaderboard (TRUE/FALSE)
   - Column F: Anonymous (TRUE/FALSE)

2. Publish the sheet:
   - File > Share > Publish to web
   - Select your sheet
   - Choose "Web page" format
   - Click Publish

3. Get the JSON URL:
   - Copy your sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Create URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json`

4. Update `js/leaderboard.js`:
   ```javascript
   const LEADERBOARD_CONFIG = {
       googleSheetsUrl: 'YOUR_URL_HERE',
       useDemoData: false,  // Set to false
       // ...
   };
   ```

### 4. Hosting

This is a static site and can be hosted anywhere:

- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **Netlify**: Drag and drop the folder
- **Vercel**: Import from GitHub
- **Any web server**: Just upload the files

## Customization

### Colors

Edit CSS variables in `css/styles.css`:
```css
:root {
    --navy-dark: #1a1f3c;
    --navy: #2c3e6c;
    --gold: #d4af37;
    /* ... */
}
```

### Certificate Design

Edit `js/certificate.js` to customize:
- Colors
- Text content
- Layout
- Font sizes

### Tier Structure

Update tiers in:
1. `index.html` - Tier cards in the tiers section
2. `js/main.js` - `getTierFromAmount()` function
3. `js/certificate.js` - `getCertificateTier()` function

## Manual Operations

Since this is a simple static site, some operations are manual:

1. **Adding Leaderboard Entries**: After receiving a PayPal notification, manually add a row to your Google Sheet

2. **Printing/Shipping Certificates**: For $10+ tiers, you'll need to:
   - Generate/design physical certificates
   - Print and mail them manually
   - Consider using a print fulfillment service for scale

## Testing

1. Open `index.html` in a browser
2. Click through different donation amounts
3. Click "Preview & Download Sample Certificate" to test PDF generation
4. Check the Wall of Fame displays demo data
5. Test responsive design by resizing browser

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Note: jsPDF requires a modern browser with good JavaScript support.

## Credits

- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- Satirical concept inspired by the absurdity of modern charity culture

## Disclaimer

This is a satirical art project. Donations are non-refundable and not tax-deductible. This site does not represent an actual charity organization.

## License

MIT License - Feel free to use, modify, and distribute.
