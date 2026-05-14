const fs = require('fs');
const files = ['gallery.html', 'contact.html', 'estimate.html', 'payments.html'];

files.forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // Replace nav + mobile menu
    html = html.replace(/<nav[\s\S]*?<\/div>\s*\n/m, '<div id="nav-placeholder"></div>\n');

    // Replace footer
    html = html.replace(/<footer[\s\S]*?<\/footer>/, '<div id="footer-placeholder"></div>');

    // Replace WhatsApp button
    html = html.replace(/<a href="https:\/\/wa\.me[\s\S]*?<\/a>/, '<div id="wa-placeholder"></div>');

    // Remove hamburger script
    html = html.replace(/<script>\s*const hb=[\s\S]*?<\/script>/, '');

    // Add components.js before </body>
    if (!html.includes('components.js')) {
        html = html.replace('</body>', '<script src="js/components.js"></script>\n</body>');
    }

    fs.writeFileSync(file, html);
    console.log(file + ' ✅ updated');
});