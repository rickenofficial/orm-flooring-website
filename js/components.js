// ─────────────────────────────────────
//   ORM Flooring — Shared Components
//   Nav, Footer injected automatically
// ─────────────────────────────────────

(function() {

  // ─── DETECT CURRENT PAGE ───
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const NAV_LINKS = [
    { href: 'index.html',    label: 'Home' },
    { href: 'gallery.html',  label: 'Gallery' },
    { href: 'estimate.html', label: 'Free Estimate' },
    { href: 'contact.html',  label: 'Contact' },
  ];

  const LOGO_SRC = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgMjAwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImczIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNjOWE4NGMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZThkNWEzIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPCEtLSBCYWNrZ3JvdW5kIC0tPgogIDxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMGEwYTBhIi8+CgogIDwhLS0gR29sZCBib3gg4oCUIHNpemVkIHRvIGZpdCBPUk0gcGVyZmVjdGx5IC0tPgogIDxyZWN0IHg9IjQwIiB5PSI0NSIgd2lkdGg9IjE2OCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2M5YTg0YyIvPgoKICA8IS0tIE9STSBpbnNpZGUgYm94IGluIGJsYWNrIOKAlCBjZW50ZXJlZCBpbiBib3ggLS0+CiAgPHRleHQgeD0iNTQiIHk9IjEwMCIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsIHNlcmlmIiBmb250LXNpemU9IjUwIiBmb250LXdlaWdodD0iNzAwIiBsZXR0ZXItc3BhY2luZz0iMiIgZmlsbD0iIzBhMGEwYSI+T1JNPC90ZXh0PgoKICA8IS0tIFZlcnRpY2FsIGdvbGQgZGl2aWRlciBsaW5lIC0tPgogIDxyZWN0IHg9IjIyMCIgeT0iNDUiIHdpZHRoPSIyIiBoZWlnaHQ9IjcwIiBmaWxsPSIjYzlhODRjIiBvcGFjaXR5PSIwLjM1Ii8+CgogIDwhLS0gRkxPT1JJTkcgLS0+CiAgPHRleHQgeD0iMjM4IiB5PSI4NCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iNzAwIiBsZXR0ZXItc3BhY2luZz0iMyIgZmlsbD0iI2ZmZmZmZiI+RkxPT1JJTkc8L3RleHQ+CgogIDwhLS0gJiBTRVJWSUNFUyBMTEMgLS0+CiAgPHRleHQgeD0iMjM4IiB5PSIxMDYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMSIgZm9udC13ZWlnaHQ9IjMwMCIgbGV0dGVyLXNwYWNpbmc9IjYiIGZpbGw9InVybCgjZzMpIj4mYW1wOyBTRVJWSUNFUyBMTEM8L3RleHQ+CgogIDwhLS0gVW5kZXJsaW5lIGRldGFpbCAtLT4KICA8cmVjdCB4PSIyMzgiIHk9IjExMyIgd2lkdGg9IjIyNSIgaGVpZ2h0PSIxIiBmaWxsPSIjYzlhODRjIiBvcGFjaXR5PSIwLjMiLz4KCiAgPCEtLSBVdGFoIHRhZyAtLT4KICA8dGV4dCB4PSIyMzgiIHk9IjEzMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjkiIGxldHRlci1zcGFjaW5nPSI0IiBmaWxsPSIjOGE4ODgwIj5MSUNFTlNFRCAmYW1wOyBJTlNVUkVEIMK3IFVUQUg8L3RleHQ+CgogIDwhLS0gRmxvb3IgcGxhbmsgcGF0dGVybiByaWdodCAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MDAsIDcyKSIgb3BhY2l0eT0iMC4zNSI+CiAgICA8cmVjdCB4PSIwIiB5PSIwIiAgd2lkdGg9IjY4IiBoZWlnaHQ9IjgiIHJ4PSIxIiBmaWxsPSIjYzlhODRjIi8+CiAgICA8cmVjdCB4PSIwIiB5PSIxMyIgd2lkdGg9IjQzIiBoZWlnaHQ9IjgiIHJ4PSIxIiBmaWxsPSIjYzlhODRjIi8+CiAgICA8cmVjdCB4PSI0OCIgeT0iMTMiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMSIgZmlsbD0iI2M5YTg0YyIvPgogICAgPHJlY3QgeD0iMCIgeT0iMjYiIHdpZHRoPSIyMCIgaGVpZ2h0PSI4IiByeD0iMSIgZmlsbD0iI2M5YTg0YyIvPgogICAgPHJlY3QgeD0iMjUiIHk9IjI2IiB3aWR0aD0iNDMiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiNjOWE4NGMiLz4KICAgIDxyZWN0IHg9IjAiIHk9IjM5IiB3aWR0aD0iNjgiIGhlaWdodD0iOCIgcng9IjEiIGZpbGw9IiNjOWE4NGMiLz4KICA8L2c+Cjwvc3ZnPgo=';

  // ─── BUILD NAV ───
  function buildNav() {
    const links = NAV_LINKS.map(l =>
      `<li><a href="${l.href}"${path === l.href ? ' class="active"' : ''}>${l.label}</a></li>`
    ).join('');

    return `
      <nav>
        <a href="index.html" style="text-decoration:none">
         <img src="${LOGO_SRC}" class="nav-logo-img" width="190" height="38" alt="ORM Flooring &amp; Services LLC - Home" width="190" height="38">
        </a>
        <ul class="nav-links">${links}</ul>
        <div class="nav-right">
          <a href="estimate.html" class="nav-cta">Free Estimate</a>
          <button class="hamburger" id="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <div class="mobile-menu" id="mobileMenu">
        <a href="index.html">Home</a>
        <a href="gallery.html">Gallery</a>
        <a href="estimate.html">Free Estimate</a>
        <a href="contact.html">Contact</a>
        <a href="payments.html">Payments</a>
        <a href="estimate.html" class="mobile-cta">Get Free Estimate</a>
      </div>
    `;
  }

  // ─── BUILD FOOTER ───
  function buildFooter(type = 'mini') {
    const adminLinks = `
      <div class="footer-admin-links">
        <a href="admin.html" aria-label="Gallery Admin Panel">⚙ Admin</a>
        <a href="referrals.html" aria-label="Referrals Manager">👥 Referrals</a>
      </div>
    `;

    if (type === 'full') {
      return `
        <footer>
          <div class="footer-brand">
            <a href="index.html" style="text-decoration:none">
              <img src="${LOGO_SRC}" class="nav-logo-img" width="190" height="38" alt="ORM Flooring">
            </a>
            <p>Licensed &amp; insured flooring contractor serving all of Utah. Residential &amp; commercial.</p>
          </div>
          <div class="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="estimate.html">Hardwood Installation</a></li>
              <li><a href="estimate.html">LVP / LVT Installation</a></li>
              <li><a href="estimate.html">Laminate Installation</a></li>
              <li><a href="estimate.html">Carpet Installation</a></li>
              <li><a href="estimate.html">Free Estimates</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <address>
              Utah, United States<br>Serving Statewide<br><br>
              <a href="tel:+13859557472">(385) 955-7472</a><br>
              <a href="mailto:info@ormflooring.com">info@ormflooring.com</a>
            </address>
          </div>
          <div class="footer-bottom">
            <p>© 2026 ORM Flooring &amp; Services LLC — All rights reserved</p>
            ${adminLinks}
          </div>
        </footer>
      `;
    }

    return `
      <footer class="footer-mini">
        <a href="index.html" style="text-decoration:none">
          <img src="${LOGO_SRC}" class="nav-logo-img" width="190" height="38" alt="ORM Flooring">
        </a>
        <p>© 2026 ORM Flooring &amp; Services LLC — Licensed &amp; Insured — Utah</p>
        ${adminLinks}
      </footer>
    `;
  }

  // ─── BUILD WHATSAPP BUTTON ───
  function buildWA() {
    return `
      <a href="https://wa.me/13859557472" class="wa-btn" target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    `;
  }

  // ─── HAMBURGER LOGIC ───
  function initHamburger() {
    const hb = document.getElementById('hamburger');
    const mm = document.getElementById('mobileMenu');
    if (!hb || !mm) return;
    hb.addEventListener('click', function() {
      this.classList.toggle('open');
      mm.classList.toggle('open');
      document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
    });
    mm.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      hb.classList.remove('open');
      mm.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // ─── INJECT COMPONENTS ───
  function inject() {
    // Nav
    const navEl = document.getElementById('nav-placeholder');
    if (navEl) navEl.outerHTML = buildNav();

    // Footer
    const footerEl = document.getElementById('footer-placeholder');
    if (footerEl) {
      const type = footerEl.dataset.type || 'mini';
      footerEl.outerHTML = buildFooter(type);
    }

    // WhatsApp
    const waEl = document.getElementById('wa-placeholder');
    if (waEl) waEl.outerHTML = buildWA();

    // Init hamburger after injection
    initHamburger();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
