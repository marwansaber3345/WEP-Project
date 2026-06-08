// ═══════════════════════════════════════════════════════════════════════════
//  La Cascada — Bilingual Engine  (EN / AR)
//  Attach data-i18n="key" to any element for static translation.
//  Attach data-en="…" data-ar="…" to DB-driven items (menu cards).
//  Attach data-i18n-ph="key" to inputs/textareas for placeholder translation.
// ═══════════════════════════════════════════════════════════════════════════

const TRANSLATIONS = {
  en: {
    // ── Navigation ────────────────────────────────────────────────
    'nav.home':           'Home',
    'nav.menu':           'Menu',
    'nav.reservation':    'Reservation',
    'nav.about':          'About',

    // ── Home ──────────────────────────────────────────────────────
    'home.hero':          'A fine taste of elegance',
    'home.tag':           'Give It a Try',
    'home.headline':      "You've Made Questionable Decisions Before",
    'home.btn.reserve':   'Reserve a Table',
    'home.btn.menu':      'View Menu',

    // ── Menu ──────────────────────────────────────────────────────
    'menu.title':         'Our Menu',
    'menu.iftar':         'IFTAR MENU',
    'menu.suhoor':        'SUHOOR MENU',
    'menu.link.iftar':    'IFTAR MENU',
    'menu.link.suhoor':   'SUHOOR MENU',
    'menu.link.main':     'Main Dishes',
    'menu.link.soup':     'Soup',
    'menu.link.drinks':   'Ramadan Drinks',
    'menu.link.foul':     'Foul',
    'menu.link.egg':      'Eggs',
    'menu.link.yogurt':   'Yogurt',
    'menu.cat.main':      'Main Dishes',
    'menu.cat.soup':      'Soup',
    'menu.cat.drinks':    'Ramadan Drinks',
    'menu.cat.foul':      'Foul',
    'menu.cat.egg':       'Eggs',
    'menu.cat.yogurt':    'Yogurt',
    'menu.served.note':   'All main dishes are served with: Rice + Green Salad',

    // ── Reservation ───────────────────────────────────────────────
    'res.title':          'Reserve Your Table',
    'res.subtitle':       "Join us for an evening you won't forget",
    'res.lbl.name':       'Full Name',
    'res.lbl.email':      'Email Address',
    'res.lbl.phone':      'Phone Number',
    'res.lbl.date':       'Date',
    'res.lbl.time':       'Time',
    'res.lbl.message':    'Special Requests',
    'res.btn.submit':     'Confirm Reservation →',
    'res.info.title':     'Visit Us',
    'res.info.address':   'Hurghada, Red Sea Governorate, Egypt',
    'res.info.street':    'Mohamed Saeid St - Hurghada, 84511',
    'res.info.call':      'Call Now',
    'res.info.ig':        'Our Instagram',
    'res.info.lunch':     'Lunch: 12:00 – 14:30',
    'res.info.dinner':    'Dinner: 19:00 – 23:00',
    'res.talabat.title':  'Order Online',
    'res.talabat.sub':    "Can't make it in? Order your favourites online",
    'res.talabat.btn':    '🛵  Order on Talabat',

    // ── Reservation placeholders ───────────────────────────────────
    'ph.name':            'Marwan Saber Mohamed',
    'ph.email':           'you@example.com',
    'ph.phone':           '01234567891',
    'ph.message':         'Any specific requirements?',

    // ── About ─────────────────────────────────────────────────────
    'about.title':        'Our Story',
    'about.subtitle':     'A journey of flavor and elegance in the heart of Hurghada',
    'about.essence.h':    'The Essence of La Cascada',
    'about.p1':           'Located in the vibrant city of Hurghada, La Cascada Restaurant is more than just a dining destination — it is a celebration of culinary artistry and refined hospitality. Our mission has always been to provide a "fine taste of elegance" to every guest who walks through our doors.',
    'about.p2':           'From our humble beginnings as a local favourite to becoming a cornerstone of the Red Sea dining scene, we have stayed true to our roots: using only the freshest, high-quality ingredients to create dishes that resonate with both local tradition and international sophistication.',
    'about.defines.h':    'What Defines Us',
    'about.bakery.h':     'Gourmet Bakery',
    'about.bakery.p':     'Known for our exquisite pastries and freshly baked breads, our bakery side brings the comforting aroma of a classic patisserie to the shores of Egypt.',
    'about.cuisine.h':    'International Cuisine',
    'about.cuisine.p':    "Whether it's our signature Italian pastas, stone-baked pizzas, or premium beef fillets, our menu is designed to satisfy the most diverse palates.",
    'about.atm.h':        'Perfect Atmosphere',
    'about.atm.p':        'Designed with a blend of modern luxury and warm comfort, La Cascada offers the ideal setting for romantic dinners, family gatherings, or business meetings.',
    'about.cta.h':        'Experience Excellence Firsthand',
    'about.cta.menu':     'View Our Menu',
    'about.cta.reserve':  'Book a Table',
  },

  ar: {
    // ── Navigation ────────────────────────────────────────────────
    'nav.home':           'الرئيسية',
    'nav.menu':           'القائمة',
    'nav.reservation':    'الحجز',
    'nav.about':          'عنا',

    // ── Home ──────────────────────────────────────────────────────
    'home.hero':          'ذوق راقٍ من الأناقة',
    'home.tag':           'جرب ميضرش',
    'home.headline':      'مش أول مرة تاخد قرار غلط يعني',
    'home.btn.reserve':   'حجز طاولة',
    'home.btn.menu':      'عرض القائمة',

    // ── Menu ──────────────────────────────────────────────────────
    'menu.title':         'قائمتنا',
    'menu.iftar':         'قائمة الإفطار',
    'menu.suhoor':        'قائمة السحور',
    'menu.link.iftar':    'قائمة الإفطار',
    'menu.link.suhoor':   'قائمة السحور',
    'menu.link.main':     'الأطباق الرئيسية',
    'menu.link.soup':     'الحساء',
    'menu.link.drinks':   'مشروبات رمضانية',
    'menu.link.foul':     'الفول',
    'menu.link.egg':      'البيض',
    'menu.link.yogurt':   'الزبادي',
    'menu.cat.main':      'الأطباق الرئيسية',
    'menu.cat.soup':      'الحساء',
    'menu.cat.drinks':    'مشروبات رمضانية',
    'menu.cat.foul':      'الفول',
    'menu.cat.egg':       'البيض',
    'menu.cat.yogurt':    'الزبادي',
    'menu.served.note':   'جميع الأطباق الرئيسية تُقدم مع: أرز + سلطة خضراء',

    // ── Reservation ───────────────────────────────────────────────
    'res.title':          'احجز طاولتك',
    'res.subtitle':       'انضم إلينا لسهرة لن تنساها',
    'res.lbl.name':       'الاسم الكامل',
    'res.lbl.email':      'البريد الإلكتروني',
    'res.lbl.phone':      'رقم الهاتف',
    'res.lbl.date':       'التاريخ',
    'res.lbl.time':       'الوقت',
    'res.lbl.message':    'طلبات خاصة',
    'res.btn.submit':     '← تأكيد الحجز',
    'res.info.title':     'زورونا',
    'res.info.address':   'الغردقة، محافظة البحر الأحمر، مصر',
    'res.info.street':    'شارع محمد سعيد - الغردقة، 84511',
    'res.info.call':      'اتصل الآن',
    'res.info.ig':        'إنستجرامنا',
    'res.info.lunch':     'الغداء: 12:00 – 14:30',
    'res.info.dinner':    'العشاء: 19:00 – 23:00',
    'res.talabat.title':  'اطلب أونلاين',
    'res.talabat.sub':    'مش قادر تيجي؟ اطلب أكلك المفضل أونلاين',
    'res.talabat.btn':    '🛵  اطلب عبر طلبات',

    // ── Reservation placeholders ───────────────────────────────────
    'ph.name':            'مروان صابر محمد',
    'ph.email':           'you@example.com',
    'ph.phone':           '01234567891',
    'ph.message':         'أي متطلبات خاصة؟',

    // ── About ─────────────────────────────────────────────────────
    'about.title':        'قصتنا',
    'about.subtitle':     'رحلة من النكهة والأناقة في قلب الغردقة',
    'about.essence.h':    'جوهر لا كاسكادا',
    'about.p1':           'يقع مطعم لا كاسكادا في مدينة الغردقة النابضة بالحياة، وهو أكثر من مجرد وجهة للتناول — إنه احتفال بفن الطهي والضيافة الراقية. كان هدفنا دائمًا تقديم "ذوق راقٍ من الأناقة" لكل ضيف يدخل أبوابنا.',
    'about.p2':           'من بداياتنا المتواضعة كمفضلة محلية إلى أن أصبحنا ركيزة أساسية في مشهد المطاعم على البحر الأحمر، ظللنا أوفياء لجذورنا: نستخدم فقط أطيب المكونات الطازجة لنصنع أطباقًا تجمع بين الأصالة المحلية والرقي العالمي.',
    'about.defines.h':    'ما يميزنا',
    'about.bakery.h':     'مخبز فاخر',
    'about.bakery.p':     'نشتهر بمعجناتنا الرفيعة وخبزنا المخبوز طازجًا يوميًا، يجلب مخبزنا عبق الباتيسيري الكلاسيكي إلى شواطئ مصر.',
    'about.cuisine.h':    'مطبخ عالمي',
    'about.cuisine.p':    'سواء كانت معكرونتنا الإيطالية المميزة، أو البيتزا المخبوزة على الحجر، أو شرائح اللحم الفاخرة — قائمتنا صُممت لتُرضي أرقى الأذواق.',
    'about.atm.h':        'أجواء مثالية',
    'about.atm.p':        'صُمم بمزيج من الفخامة الحديثة والدفء المريح، يقدم لا كاسكادا البيئة المثالية للعشاء الرومانسي، أو التجمعات العائلية، أو اجتماعات العمل.',
    'about.cta.h':        'اختبر التميز بنفسك',
    'about.cta.menu':     'اعرض قائمتنا',
    'about.cta.reserve':  'احجز طاولة',
  }
};

// ── Core engine ───────────────────────────────────────────────────────────────

let currentLang = localStorage.getItem('lc_lang') || 'en';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lc_lang', lang);

  const isAr = lang === 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr';

  // Static text via data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = TRANSLATIONS[lang]?.[key];
    if (val !== undefined) el.textContent = val;
  });

  // Placeholder text via data-i18n-ph
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const val = TRANSLATIONS[lang]?.[key];
    if (val !== undefined) el.placeholder = val;
  });

  // Dynamic items (menu cards from DB) — data-en / data-ar
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute(isAr ? 'data-ar' : 'data-en');
    if (val) el.textContent = val;
  });

  // Toggle button label
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = isAr ? 'English' : 'العربية';
}

function toggleLanguage() {
  applyLanguage(currentLang === 'en' ? 'ar' : 'en');
}

// Auto-apply on every page load
document.addEventListener('DOMContentLoaded', () => applyLanguage(currentLang));
