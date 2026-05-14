// ─────────────────────────────────────
//   ORM Flooring — Lighthouse Fixes
//   Run: node update-fixes.js
// ─────────────────────────────────────

const fs = require('fs');

const HTML_FILES = [
  'index.html',
  'gallery.html',
  'contact.html',
  'estimate.html',
  'payments.html'
];

// 1. Add preconnect for Google Fonts (fixes render-blocking)
const PRECONNECT = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`;

// 2. Replace Google Fonts link with display=swap if not already present
const FONTS_OLD = `href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap"`;
const FONTS_NEW = `href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" media="print" onload="this.media='all'"`;

HTML_FILES.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`⚠ ${file} not found, skipping`);
    return;
  }

  let html = fs.readFileSync(file, 'utf8');

  // Add preconnect before fonts link
  if (!html.includes('preconnect')) {
    html = html.replace(
      /(\s*<link[^>]*fonts\.googleapis\.com[^>]*>)/,
      `\n${PRECONNECT}$1`
    );
  }

  // Add display=swap and non-blocking font load
  if (!html.includes('media="print"')) {
    html = html.replace(FONTS_OLD, FONTS_NEW);
    // Add noscript fallback
    if (!html.includes('noscript')) {
      html = html.replace(
        /(<link[^>]*fonts\.googleapis[^>]*media="print"[^>]*>)/,
        `$1\n  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap"></noscript>`
      );
    }
  }

  // Wrap main content in <main> tag for accessibility
  if (!html.includes('<main')) {
    html = html.replace(
      /(<\/nav>\s*\n)/,
      '$1<main>\n'
    );
    // Close main before footer
    html = html.replace(
      /(<div id="footer-placeholder")/,
      '</main>\n$1'
    );
  }

  fs.writeFileSync(file, html);
  console.log(`✅ ${file} updated`);
});

console.log('\nDone! Now update styles.css and netlify.toml manually.');
