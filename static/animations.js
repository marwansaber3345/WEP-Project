/* ═══════════════════════════════════════════════════════════
   La Cascada — animations.js  (v2 — Full Feature Set)
   Place in: static/animations.js
   ═══════════════════════════════════════════════════════════

   ANNOUNCEMENT CONFIG — edit here to update the banner:
   Set active: false to hide it entirely.
   Change id when you want dismissed users to see it again.
   ═══════════════════════════════════════════════════════════ */
const LC_ANNOUNCEMENT = {
    active:   true,
    id:       'ramadan-2025-v1',          // Change to re-show for users who dismissed
    text_en:  '🌙  Ramadan Special Menu Available — Iftar & Suhoor',
    text_ar:  '🌙  قائمة رمضان الخاصة متاحة الآن — إفطار وسحور',
    link:     '/menu',
    link_en:  'View Menu',
    link_ar:  'عرض القائمة'
};

/* ───────────────────────────────────────────────────────────
   ADMIN PORTAL SECRET — logo click easter egg
   This must match the route in App.py
   ─────────────────────────────────────────────────────────── */
const LC_ADMIN_PATH = '/lc-portal-hrg';

/* ───────────────────────────────────────────────────────────
   WHATSAPP CONFIG
   ─────────────────────────────────────────────────────────── */
const LC_WHATSAPP = {
    number:  '201554089639',
    text_en: 'Hello, I would like to enquire about La Cascada.',
    text_ar: 'مرحباً، أود الاستفسار عن لا كاسكادا.'
};

/* ───────────────────────────────────────────────────────────
   OPENING HOURS (24-h minutes from midnight)
   ─────────────────────────────────────────────────────────── */
const LC_HOURS = {
    lunch:  { open: 12 * 60,       close: 14 * 60 + 30 },  // 12:00–14:30
    dinner: { open: 19 * 60,       close: 23 * 60      }   // 19:00–23:00
};

(function () {
    'use strict';

    /* ══ 1. CSS INJECTION ══════════════════════════════════ */
    function injectStyles() {
        const css = `
        /* ── Custom Cursor ─────────────────────────────────── */
        .lc-cursor-dot {
            position:fixed; width:8px; height:8px;
            background:#c8a84b; border-radius:50%;
            pointer-events:none; z-index:99999;
            transition:opacity .3s; will-change:transform;
        }
        .lc-cursor-ring {
            position:fixed; width:28px; height:28px;
            border:1px solid rgba(200,168,75,.55); border-radius:50%;
            pointer-events:none; z-index:99998;
            transition:width .3s,height .3s,opacity .3s,border-color .3s;
            will-change:transform;
        }
        .lc-cursor-expand {
            width:44px!important; height:44px!important;
            border-color:rgba(200,168,75,.85)!important;
            margin-left:-8px; margin-top:-8px;
        }

        /* ── Ripple ─────────────────────────────────────────── */
        .ripple { position:relative; overflow:hidden; }
        .lc-ripple-wave {
            position:absolute; border-radius:50%;
            background:rgba(200,168,75,.22);
            transform:scale(0); animation:lcRipple .6s ease-out forwards;
            pointer-events:none;
        }
        @keyframes lcRipple { to { transform:scale(1); opacity:0; } }

        /* ── Scroll Reveal ──────────────────────────────────── */
        .lc-hidden { opacity:0; transform:translateY(28px); }
        .lc-reveal {
            opacity:1!important; transform:translateY(0)!important;
            transition:opacity .7s ease,transform .7s ease;
        }

        /* ── Scroll Progress Bar ────────────────────────────── */
        #lc-progress {
            position:fixed; top:0; left:0; height:2px; width:0%;
            background:linear-gradient(to right,#7a6428,#c8a84b,#deba66);
            z-index:100000; pointer-events:none;
            transition:width .08s linear;
        }

        /* ── Back to Top ────────────────────────────────────── */
        #lc-top {
            position:fixed; bottom:88px; right:28px;
            width:42px; height:42px;
            background:rgba(5,3,8,.85);
            border:1px solid rgba(200,168,75,.38);
            color:#c8a84b; font-size:18px;
            display:flex; align-items:center; justify-content:center;
            cursor:pointer; z-index:8800;
            opacity:0; transform:translateY(16px);
            transition:opacity .4s,transform .4s,background .3s,border-color .3s;
            pointer-events:none; backdrop-filter:blur(8px);
        }
        #lc-top.visible { opacity:1; transform:translateY(0); pointer-events:auto; }
        #lc-top:hover { background:#c8a84b; color:#050308; border-color:#c8a84b; }

        /* ── WhatsApp Button ────────────────────────────────── */
        #lc-wa {
            position:fixed; bottom:28px; right:28px;
            width:52px; height:52px;
            background:#25d366; border:none;
            border-radius:50%; display:flex; align-items:center; justify-content:center;
            cursor:pointer; z-index:8800; text-decoration:none;
            box-shadow:0 4px 24px rgba(37,211,102,.4);
            transition:transform .3s,box-shadow .3s;
            opacity:0; animation:waFadeIn .5s 1.5s ease-out forwards;
        }
        @keyframes waFadeIn { to { opacity:1; } }
        #lc-wa:hover { transform:scale(1.12); box-shadow:0 8px 32px rgba(37,211,102,.55); }
        #lc-wa svg { width:28px; height:28px; fill:white; }
        .lc-wa-pulse {
            position:absolute; inset:-4px; border-radius:50%;
            border:2px solid rgba(37,211,102,.5);
            animation:waPulse 2.5s ease-in-out infinite;
        }
        @keyframes waPulse {
            0%,100% { transform:scale(1); opacity:.6; }
            50% { transform:scale(1.25); opacity:0; }
        }

        /* ── Open / Closed Badge ────────────────────────────── */
        #lc-status {
            display:inline-flex; align-items:center; gap:6px;
            font-family:'Cairo','Segoe UI',sans-serif;
            font-size:10px; font-weight:700; letter-spacing:1px;
            padding:3px 10px; border:1px solid transparent;
            margin-left:14px; flex-shrink:0; line-height:1.6;
        }
        #lc-status.open  { color:#4ade80; border-color:rgba(74,222,128,.3); background:rgba(74,222,128,.07); }
        #lc-status.closed{ color:#c0b0a0; border-color:rgba(200,168,75,.2); background:rgba(200,168,75,.04); }
        .lc-status-dot {
            width:6px; height:6px; border-radius:50%; flex-shrink:0;
        }
        #lc-status.open  .lc-status-dot { background:#4ade80; animation:statusPulse 2s ease-in-out infinite; }
        #lc-status.closed .lc-status-dot { background:#7a6a5a; }
        @keyframes statusPulse {
            0%,100% { box-shadow:0 0 0 0 rgba(74,222,128,.6); }
            50%      { box-shadow:0 0 0 5px rgba(74,222,128,0); }
        }
        .lc-status-sub { opacity:.65; font-weight:400; margin-left:2px; }

        /* ── Announcement Banner ────────────────────────────── */
        .lc-announce-bar {
            position:relative; width:100%;
            background:linear-gradient(90deg,#0c0910,#181318,#0c0910);
            border-bottom:1px solid rgba(200,168,75,.2);
            padding:9px 56px 9px 20px;
            display:flex; align-items:center; justify-content:center;
            gap:16px; z-index:600; flex-wrap:wrap;
            animation:announceIn .5s ease-out;
        }
        @keyframes announceIn { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes announceExit{ to{opacity:0;transform:translateY(-100%)} }
        .lc-announce-bar span {
            font-family:'Cairo','Segoe UI',sans-serif;
            font-size:12px; color:#c0b0a0; letter-spacing:.5px;
        }
        .lc-announce-bar a {
            font-family:'Cairo','Segoe UI',sans-serif;
            font-size:11px; font-weight:700; letter-spacing:2px;
            text-transform:uppercase; color:#c8a84b;
            text-decoration:none; border-bottom:1px solid rgba(200,168,75,.4);
            transition:color .25s,border-color .25s;
        }
        .lc-announce-bar a:hover { color:#deba66; border-color:#deba66; }
        .lc-announce-close {
            position:absolute; right:16px; top:50%; transform:translateY(-50%);
            background:none; border:none; color:#7a6a5a;
            font-size:14px; cursor:pointer; line-height:1;
            transition:color .2s;
        }
        .lc-announce-close:hover { color:#c8a84b; }

        /* ── Lightbox ───────────────────────────────────────── */
        #lc-lightbox {
            display:none; position:fixed; inset:0; z-index:99000;
            background:rgba(5,3,8,.96); backdrop-filter:blur(20px);
            align-items:center; justify-content:center;
        }
        #lc-lightbox.open { display:flex; }
        #lc-lightbox img {
            max-width:90vw; max-height:88vh; object-fit:contain;
            animation:lbIn .35s cubic-bezier(.22,1,.36,1);
            box-shadow:0 32px 100px rgba(0,0,0,.8);
        }
        @keyframes lbIn { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
        .lc-lb-close {
            position:fixed; top:20px; right:24px;
            background:rgba(255,255,255,.06); border:1px solid rgba(200,168,75,.2);
            color:#c0b0a0; font-size:20px; width:36px; height:36px;
            display:flex; align-items:center; justify-content:center;
            cursor:pointer; transition:all .25s; font-family:monospace;
            z-index:99001;
        }
        .lc-lb-close:hover { color:#f8f0e4; border-color:#c8a84b; background:rgba(200,168,75,.1); }
        .lc-lb-hint {
            position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
            font-family:'Cairo',sans-serif; font-size:11px; letter-spacing:2px;
            color:rgba(200,168,75,.45); text-transform:uppercase; z-index:99001;
        }

        /* ── Magnetic wrapper ───────────────────────────────── */
        .magnetic { position:relative; display:inline-block; }
        `;
        const s = document.createElement('style');
        s.textContent = css;
        document.head.appendChild(s);
    }

    /* ══ 2. CUSTOM CURSOR ══════════════════════════════════ */
    function initCursor() {
        if (!window.matchMedia('(pointer:fine)').matches) return;
        const dot  = document.createElement('div');
        const ring = document.createElement('div');
        dot.className  = 'lc-cursor-dot';
        ring.className = 'lc-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);
        document.body.style.cursor = 'none';
        document.querySelectorAll('a,button,[data-cursor]').forEach(el => el.style.cursor = 'none');

        let mx=-100,my=-100,rx=-100,ry=-100;
        document.addEventListener('mousemove', e => {
            mx=e.clientX; my=e.clientY;
            dot.style.left=mx-4+'px'; dot.style.top=my-4+'px';
        });
        (function lerp(){
            rx+=(mx-rx)*.14; ry+=(my-ry)*.14;
            ring.style.left=rx-14+'px'; ring.style.top=ry-14+'px';
            requestAnimationFrame(lerp);
        })();
        document.querySelectorAll('a,button,.item,.mv-card,.feature-card,.testimonial-card').forEach(el=>{
            el.addEventListener('mouseenter',()=>ring.classList.add('lc-cursor-expand'));
            el.addEventListener('mouseleave',()=>ring.classList.remove('lc-cursor-expand'));
        });
        document.addEventListener('mouseleave',()=>{ dot.style.opacity='0'; ring.style.opacity='0'; });
        document.addEventListener('mouseenter',()=>{ dot.style.opacity='1'; ring.style.opacity='1'; });
    }

    /* ══ 3. MAGNETIC BUTTONS ══════════════════════════════ */
    function initMagnetic() {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', e => {
                const r=btn.getBoundingClientRect();
                const x=(e.clientX-r.left-r.width/2)*.28;
                const y=(e.clientY-r.top-r.height/2)*.36;
                btn.style.transform=`translate(${x}px,${y}px)`;
                btn.style.transition='transform .1s ease';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform='';
                btn.style.transition='transform .6s cubic-bezier(.23,1,.32,1)';
            });
        });
    }

    /* ══ 4. SCROLL PROGRESS BAR ════════════════════════════ */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'lc-progress';
        document.body.prepend(bar);
        window.addEventListener('scroll', () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
        }, { passive: true });
    }

    /* ══ 5. BACK TO TOP ════════════════════════════════════ */
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'lc-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = '↑';
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ══ 6. WHATSAPP FLOATING BUTTON ═══════════════════════ */
    function initWhatsApp() {
        const lang   = document.documentElement.lang || 'en';
        const text   = encodeURIComponent(lang === 'ar' ? LC_WHATSAPP.text_ar : LC_WHATSAPP.text_en);
        const href   = `https://wa.me/${LC_WHATSAPP.number}?text=${text}`;
        const btn    = document.createElement('a');
        btn.id       = 'lc-wa';
        btn.href     = href;
        btn.target   = '_blank';
        btn.rel      = 'noopener noreferrer';
        btn.setAttribute('aria-label', 'Contact on WhatsApp');
        btn.innerHTML = `
            <div class="lc-wa-pulse"></div>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>`;
        document.body.appendChild(btn);

        // Update href on language change (lang toggle fires applyLanguage which changes html[lang])
        const observer = new MutationObserver(() => {
            const l = document.documentElement.lang || 'en';
            const t = encodeURIComponent(l === 'ar' ? LC_WHATSAPP.text_ar : LC_WHATSAPP.text_en);
            btn.href = `https://wa.me/${LC_WHATSAPP.number}?text=${t}`;
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }

    /* ══ 7. OPEN / CLOSED STATUS BADGE ════════════════════ */
    function initOpenStatus() {
        const badge = document.createElement('div');
        badge.id = 'lc-status';
        badge.innerHTML = '<span class="lc-status-dot"></span>';

        // Insert after lang-toggle in nav
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn && langBtn.parentNode) {
            langBtn.parentNode.insertBefore(badge, langBtn.nextSibling);
        }

        function pad(n) { return String(n).padStart(2,'0'); }

        function update() {
            const now  = new Date();
            const mins = now.getHours() * 60 + now.getMinutes();
            const lang = document.documentElement.lang || 'en';
            const isAr = lang === 'ar';
            const { lunch, dinner } = LC_HOURS;

            let open = false, sub = '';
            if      (mins >= lunch.open  && mins < lunch.close)  { open=true;  sub = isAr?`يغلق 14:30`:`Closes 14:30`; }
            else if (mins >= dinner.open && mins < dinner.close) { open=true;  sub = isAr?`يغلق 23:00`:`Closes 23:00`; }
            else if (mins < lunch.open)  { sub = isAr?`يفتح 12:00`:`Opens 12:00`; }
            else if (mins < dinner.open) { sub = isAr?`يفتح 19:00`:`Opens 19:00`; }
            else                         { sub = isAr?`يفتح غداً 12:00`:`Opens 12:00 tomorrow`; }

            const label = open ? (isAr?'مفتوح':'Open') : (isAr?'مغلق':'Closed');
            badge.className = open ? 'open' : 'closed';
            badge.innerHTML = `<span class="lc-status-dot"></span>${label}<span class="lc-status-sub">&nbsp;· ${sub}</span>`;
        }

        update();
        setInterval(update, 60000);

        // Re-run on language change
        new MutationObserver(update).observe(document.documentElement, { attributes:true, attributeFilter:['lang'] });
    }

    /* ══ 8. ANNOUNCEMENT BANNER ════════════════════════════ */
    function initAnnouncement() {
        if (!LC_ANNOUNCEMENT.active) return;
        if (localStorage.getItem('lc-ann-' + LC_ANNOUNCEMENT.id)) return;

        const lang  = document.documentElement.lang || 'en';
        const isAr  = lang === 'ar';
        const text  = isAr ? LC_ANNOUNCEMENT.text_ar : LC_ANNOUNCEMENT.text_en;
        const lText = isAr ? LC_ANNOUNCEMENT.link_ar  : LC_ANNOUNCEMENT.link_en;

        const bar = document.createElement('div');
        bar.className = 'lc-announce-bar';
        bar.innerHTML = `
            <span data-en="${LC_ANNOUNCEMENT.text_en}" data-ar="${LC_ANNOUNCEMENT.text_ar}">${text}</span>
            ${LC_ANNOUNCEMENT.link ? `<a href="${LC_ANNOUNCEMENT.link}" data-en="${LC_ANNOUNCEMENT.link_en}" data-ar="${LC_ANNOUNCEMENT.link_ar}">${lText}</a>` : ''}
            <button class="lc-announce-close" aria-label="Dismiss">✕</button>`;

        const header = document.querySelector('header');
        if (header) header.parentNode.insertBefore(bar, header);
        else document.body.prepend(bar);

        bar.querySelector('.lc-announce-close').addEventListener('click', () => {
            bar.style.animation = 'announceExit .3s forwards';
            setTimeout(() => {
                bar.remove();
                localStorage.setItem('lc-ann-' + LC_ANNOUNCEMENT.id, '1');
            }, 320);
        });
    }

    /* ══ 9. LOGO EASTER EGG (admin shortcut) ══════════════ */
    function initAdminEasterEgg() {
        const logo = document.querySelector('.logo, .logo-text');
        if (!logo) return;
        let clicks=0, timer;
        logo.style.userSelect = 'none';
        logo.addEventListener('click', () => {
            clicks++;
            clearTimeout(timer);
            if (clicks >= 5) {
                clicks = 0;
                // Brief flash feedback before redirect
                document.body.style.transition = 'opacity .3s';
                document.body.style.opacity = '0';
                setTimeout(() => window.location.href = LC_ADMIN_PATH, 300);
            }
            timer = setTimeout(() => { clicks = 0; }, 2200);
        });
    }

    /* ══ 10. DISH LIGHTBOX ════════════════════════════════ */
    function initLightbox() {
        const lb = document.createElement('div');
        lb.id = 'lc-lightbox';
        lb.innerHTML = `
            <img id="lc-lb-img" src="" alt="Dish">
            <button class="lc-lb-close" aria-label="Close">✕</button>
            <span class="lc-lb-hint" data-en="Press ESC to close" data-ar="اضغط ESC للإغلاق">Press ESC to close</span>`;
        document.body.appendChild(lb);

        const lbImg = document.getElementById('lc-lb-img');

        function openLb(src) {
            lbImg.src = src;
            lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeLb() {
            lb.classList.remove('open');
            document.body.style.overflow = '';
            lbImg.src = '';
        }

        // Trigger from modal image
        document.addEventListener('click', e => {
            const modalImg = e.target.closest('#modal-img');
            if (modalImg && modalImg.src) { e.stopPropagation(); openLb(modalImg.src); return; }
            if (e.target === lb) closeLb();
        });
        lb.querySelector('.lc-lb-close').addEventListener('click', closeLb);
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });

        // Make modal image feel clickable
        const styleEl = document.createElement('style');
        styleEl.textContent = '#modal-img { cursor:zoom-in; transition:opacity .25s; } #modal-img:hover { opacity:.88; }';
        document.head.appendChild(styleEl);
    }

    /* ══ 11. RIPPLE ════════════════════════════════════════ */
    function initRipple() {
        document.querySelectorAll('.ripple').forEach(btn => {
            btn.addEventListener('click', e => {
                const r=btn.getBoundingClientRect();
                const el=document.createElement('span');
                const size=Math.max(r.width,r.height)*2;
                el.className='lc-ripple-wave';
                el.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-r.left-size/2}px;top:${e.clientY-r.top-size/2}px;`;
                btn.appendChild(el);
                el.addEventListener('animationend',()=>el.remove());
            });
        });
    }

    /* ══ 12. SCROLL REVEAL (universal) ═════════════════════ */
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.lc-hidden').forEach(el => el.classList.add('lc-reveal'));
            return;
        }
        const obs = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) {
                    const el=en.target, delay=el.dataset.delay||0;
                    setTimeout(()=>el.classList.add('lc-reveal'), delay);
                    obs.unobserve(el);
                }
            });
        }, { threshold:.1, rootMargin:'0px 0px -40px 0px' });
        document.querySelectorAll('.lc-hidden').forEach(el => obs.observe(el));
    }

    /* ══ 13. SMOOTH ANCHOR SCROLL ══════════════════════════ */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const t = document.querySelector(a.getAttribute('href'));
                if (!t) return;
                e.preventDefault();
                window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
            });
        });
    }

    /* ══ BOOT ══════════════════════════════════════════════ */
    injectStyles();

    // Some features must run immediately (before DOM ready)
    initScrollProgress();

    document.addEventListener('DOMContentLoaded', () => {
        initCursor();
        initMagnetic();
        initBackToTop();
        initWhatsApp();
        initOpenStatus();
        initAnnouncement();
        initAdminEasterEgg();
        initLightbox();
        initRipple();
        initScrollReveal();
        initSmoothScroll();
    });

})();
