from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests

app = Flask(__name__)
app.secret_key = 'la-cascada-admin-2024'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///reservations.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


# ── Models ────────────────────────────────────────────────────────────────────

class Reservation(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    name      = db.Column(db.String(200), nullable=False)
    email     = db.Column(db.String(200), nullable=False)
    phone     = db.Column(db.String(20),  nullable=False)
    date      = db.Column(db.String(20),  nullable=False)
    time      = db.Column(db.String(20),  nullable=False)
    message   = db.Column(db.Text,        nullable=True)
    timestamp = db.Column(db.DateTime,    default=datetime.utcnow)
    def __repr__(self): return f"<Reservation {self.name}>"


class MenuItem(db.Model):
    id         = db.Column(db.Integer,     primary_key=True)
    section    = db.Column(db.String(50),  nullable=False)
    category   = db.Column(db.String(50),  nullable=False)
    name_en    = db.Column(db.String(200), nullable=False)
    name_ar    = db.Column(db.String(200), nullable=True,  default='')
    desc_en    = db.Column(db.Text,        nullable=True,  default='')
    desc_ar    = db.Column(db.Text,        nullable=True,  default='')
    price      = db.Column(db.Float,       nullable=False, default=0)
    image      = db.Column(db.String(500), nullable=True,  default='')
    is_active  = db.Column(db.Boolean,     nullable=False, default=True)
    sort_order = db.Column(db.Integer,     nullable=False, default=0)
    def __repr__(self): return f"<MenuItem {self.name_en}>"


SECTIONS   = ['iftar', 'suhoor']
CATEGORIES = ['main-dishes', 'soup', 'ramadan-drinks', 'foul', 'egg', 'yogurt']


# ── Seed (additive — safe to re-run) ─────────────────────────────────────────

def _seed_menu():
    existing = {i.name_en for i in MenuItem.query.all()}

    catalog = [
        # ── IFTAR · Main Dishes ───────────────────────────────────────────────
        dict(section='iftar', category='main-dishes', sort_order=1,
             name_en='Mixed Grill', name_ar='مشاوي مشكلة',
             desc_en='A generous platter of 2 kofta skewers, shish tawook, and grilled chicken breast, all marinated in house spices.',
             desc_ar='طبق مشاوي سخي يضم ٢ أسياخ كفتة متبلة، وشيش طاووق طري، وصدر دجاج مشوي — متبلة بالتوابل المنزلية.',
             price=500, image='images/file_00000000ef40720a9f85f6d7844a9627.png'),
        dict(section='iftar', category='main-dishes', sort_order=2,
             name_en='Half Grilled Chicken', name_ar='نص فرخة مشوية',
             desc_en='A half chicken slow-grilled over charcoal, rubbed with garlic, lemon, and aromatic herbs — crisp outside, juicy within.',
             desc_ar='نصف دجاجة مشوية على الفحم، متبلة بالثوم والليمون والأعشاب — مقرمشة من الخارج وطرية من الداخل.',
             price=400, image='images/file_00000000a1a8720a8c110a51990507f2.png'),
        dict(section='iftar', category='main-dishes', sort_order=3,
             name_en='Meat Taaine with Onions', name_ar='تاجن لحم بالبصل',
             desc_en='Slow-braised tender beef with caramelised onions and warming Middle Eastern spices, rich and deeply comforting.',
             desc_ar='لحم بقري طري مطهو ببطء مع البصل المكرمل والتوابل الشرقية — غني ومريح.',
             price=450, image='images/meatWithOnions.png'),
        dict(section='iftar', category='main-dishes', sort_order=4,
             name_en='Grilled Kofta Plate', name_ar='طبق كفتة مشوية',
             desc_en='Hand-rolled minced beef skewers seasoned with onion, parsley, cumin, and chilli — charcoal-grilled to perfection.',
             desc_ar='أسياخ لحم مفروم مصنوعة يدوياً متبلة بالبصل والبقدونس والكمون ولمسة من الفلفل — مشوية على الفحم.',
             price=400, image='images/grillesKofta.png'),
        dict(section='iftar', category='main-dishes', sort_order=5,
             name_en='Shish Tawook Plate', name_ar='طبق شيش طاووق',
             desc_en='Chicken breast marinated in yogurt, garlic, and seven spices, grilled on open flame and served with garlic sauce.',
             desc_ar='صدر الدجاج المتبل بالزبادي والثوم والسبع بهارات، مشوي على النار المكشوفة ويُقدم مع صلصة الثوم.',
             price=400, image='images/shish.png'),
        dict(section='iftar', category='main-dishes', sort_order=6,
             name_en='Chicken Liver & Hearts', name_ar='كبدة ودوانات الدجاج',
             desc_en='Pan-seared chicken liver and hearts sautéed with bell peppers, vinegar, and bold spices — a flavourful Egyptian classic.',
             desc_ar='كبدة ودوانات الدجاج مقلية مع الفلفل والخل والتوابل القوية — كلاسيكي مصري بنكهة لا تُقاوم.',
             price=350, image='images/ch liver.png'),
        dict(section='iftar', category='main-dishes', sort_order=7,
             name_en='Beef Liver Plate', name_ar='طبق كبدة البقر',
             desc_en='Sliced beef liver quickly sautéed with onions, green peppers, and fragrant spices — robust and tender.',
             desc_ar='شرائح كبدة البقر مقلية سريعاً مع البصل والفلفل الأخضر والتوابل العطرية — قوية النكهة وطرية القوام.',
             price=350, image='images/beef liver (1).png'),
        # ── IFTAR · Soup ──────────────────────────────────────────────────────
        dict(section='iftar', category='soup', sort_order=1,
             name_en='Orzo Soup', name_ar='شوربة شعيرية',
             desc_en='Golden chicken broth simmered with orzo pasta, fresh herbs, and a hint of lemon — delicate, warming, nourishing.',
             desc_ar='مرق دجاج ذهبي مطهو مع شعيرية وأعشاب طازجة ولمسة ليمون — رقيق ودافئ ومغذٍّ.',
             price=55, image='images/orzo.png'),
        dict(section='iftar', category='soup', sort_order=2,
             name_en='Vegetable Soup', name_ar='شوربة خضار',
             desc_en='Light, wholesome broth brimming with seasonal vegetables, tomatoes, and aromatic herbs — naturally vegan.',
             desc_ar='مرق خفيف صحي غني بالخضار الموسمية والطماطم والأعشاب — نباتي طبيعي.',
             price=50, image='images/vegetavble.png'),
        dict(section='iftar', category='soup', sort_order=3,
             name_en='Chicken Noodle Soup', name_ar='شوربة الدجاج بالنودلز',
             desc_en='Tender shredded chicken in a rich clear broth with soft egg noodles and fragrant celery — comforting from the first spoon.',
             desc_ar='دجاج مفتت طري في مرق صافٍ مع شعيرية ناعمة وكرفس عطر — وعاء مريح من أول ملعقة.',
             price=70, image='images/ch no soup.png'),
        dict(section='iftar', category='soup', sort_order=4,
             name_en='Mushroom Soup', name_ar='شوربة مشروم',
             desc_en='Velvety cream of mushroom blended with sautéed wild mushrooms, thyme, and fresh cream — rich and indulgent.',
             desc_ar='كريم مشروم مخملي ممزوج مع مشروم برّي مقلي وزعتر وقشطة طازجة — غني ومكثف النكهة.',
             price=70, image='images/mashr.png'),
        dict(section='iftar', category='soup', sort_order=5,
             name_en='Seafood Soup', name_ar='شوربة مأكولات بحرية',
             desc_en='Fragrant bisque of shrimp, fish, and calamari in a tomato-saffron base — an ocean of flavour in every bowl.',
             desc_ar='بسك عطر من الجمبري والسمك والكلاماري في قاعدة طماطم وزعفران — محيط من النكهة في كل وعاء.',
             price=100, image='images/seafoud.png'),
        dict(section='iftar', category='soup', sort_order=6,
             name_en='Lentil Soup', name_ar='شوربة عدس',
             desc_en='Classic Egyptian red lentil soup blended silky smooth with cumin, coriander, and a drizzle of lemon — simple and soulful.',
             desc_ar='شوربة العدس المصرية الكلاسيكية مطحونة ناعمة مع الكمون والكزبرة والليمون — بسيطة وصادقة.',
             price=50, image='images/lentil.png'),
        # ── IFTAR · Ramadan Drinks ────────────────────────────────────────────
        dict(section='iftar', category='ramadan-drinks', sort_order=1,
             name_en='Tamr Hindi', name_ar='تمر هندي',
             desc_en='Tangy tamarind concentrate steeped with sugar and a hint of rose water, served chilled — sweet, sharp, and refreshing.',
             desc_ar='تمر هندي حامض منقوع مع السكر ولمسة من ماء الورد، يُقدم بارداً — حلو وحاد ومنعش.',
             price=40, image='images/tamr.png'),
        dict(section='iftar', category='ramadan-drinks', sort_order=2,
             name_en='Amar El-din', name_ar='قمر الدين',
             desc_en='Dried apricot sheets dissolved into a luscious golden drink, gently sweetened and served cold — a Ramadan ritual.',
             desc_ar='صفائح المشمش المجفف ذابت في مشروب ذهبي ناعم، محلى بلطف ويُقدم بارداً — طقس رمضاني.',
             price=45, image='images/amrEldin.png'),
        dict(section='iftar', category='ramadan-drinks', sort_order=3,
             name_en='Qamar El-din Smoothie', name_ar='سموذي قمر الدين',
             desc_en='Thick apricot smoothie blended with ice and fresh cream.',
             desc_ar='سموذي مشمش كثيف ممزوج مع الثلج والقشطة الطازجة.',
             price=70, image='images/somt.png'),
        dict(section='iftar', category='ramadan-drinks', sort_order=4,
             name_en='Date Shake', name_ar='شيك التمر',
             desc_en='A nourishing blend of milk, dates, cardamom, and sometimes yogurt.',
             desc_ar='مزيج مغذٍّ من الحليب والتمر والهيل وأحياناً الزبادي.',
             price=65, image='images/dateShake.png'),
        dict(section='iftar', category='ramadan-drinks', sort_order=5,
             name_en='Sobia', name_ar='سوبيا',
             desc_en='Traditional coconut milk drink with a sweet creamy taste.',
             desc_ar='مشروب جوز الهند التقليدي بطعم حلو كريمي.',
             price=45, image='images/sobia (1).png'),
        dict(section='iftar', category='ramadan-drinks', sort_order=6,
             name_en='Karkade', name_ar='كركديه',
             desc_en='Refreshing hibiscus drink served cold or hot, rich in flavour.',
             desc_ar='مشروب الكركديه المنعش يُقدم بارداً أو ساخناً، غني بالنكهة.',
             price=40, image='images/kar.png'),
        # ── SUHOOR · Foul ─────────────────────────────────────────────────────
        dict(section='suhoor', category='foul', sort_order=1,
             name_en='Spicy Foul with Oil', name_ar='فول حار بالزيت',
             desc_en='Slow-cooked fava beans dressed in golden oil with a bold kick of chilli, cumin, and fresh garlic.',
             desc_ar='فول مطهو ببطء متبل بالزيت الذهبي مع الفلفل الحار والكمون والثوم الطازج — دافئ وشهي.',
             price=50, image='images/spicyFoul.png'),
        dict(section='suhoor', category='foul', sort_order=2,
             name_en='Foul with Butter', name_ar='فول بالزبدة',
             desc_en='Tender fava beans finished with a generous knob of melted butter and a pinch of salt — simple, rich, and deeply satisfying.',
             desc_ar='فول طري مكتمل بكتلة سخية من الزبدة المذابة ورشة ملح — بسيط وغني ومُشبع.',
             price=50, image='images/butterFoul.png'),
        dict(section='suhoor', category='foul', sort_order=3,
             name_en='Foul with Olive Oil', name_ar='فول بزيت الزيتون',
             desc_en='Classic Egyptian fava beans drizzled with cold-pressed extra virgin olive oil, lemon juice, and cumin — clean and timeless.',
             desc_ar='فول مصري كلاسيكي مرشوش بزيت الزيتون البكر والليمون والكمون — نظيف وصحي وخالد.',
             price=50, image='images/oliveOil.png'),
        dict(section='suhoor', category='foul', sort_order=4,
             name_en='Alexandrian Foul', name_ar='فول إسكندراني',
             desc_en='The iconic Alexandria-style foul simmered with tomato, chilli, cumin, and oil, finished with fresh parsley — bold and unforgettable.',
             desc_ar='الفول الإسكندراني مطهو مع الطماطم والفلفل الحار والكمون والزيت، ومزيّن بالبقدونس — جريء ولا يُنسى.',
             price=60, image='images/alex.png'),
        # ── SUHOOR · Eggs ─────────────────────────────────────────────────────
        dict(section='suhoor', category='egg', sort_order=1,
             name_en='Egg with Pastrami', name_ar='بيض بالبسطرمة',
             desc_en='Pan-fried eggs cooked alongside thinly sliced spiced pastrami until the edges crisp and the yolk stays golden.',
             desc_ar='بيض مقلي مطهو مع شرائح البسطرمة المتبلة حتى تتقرمش الحواف ويبقى الصفار ذهبياً طرياً.',
             price=100, image='images/eggPastrma.png'),
        dict(section='suhoor', category='egg', sort_order=2,
             name_en='Spanish Omelette', name_ar='أومليت إسباني',
             desc_en='Thick, golden omelette layered with soft potato and sweet onion in the authentic tortilla style — filling and flavourful.',
             desc_ar='أومليت ثخين ذهبي مطبق بالبطاطس الطرية والبصل الحلو على طراز التورتيا الأصيل — مُشبع وشهي.',
             price=80, image='images/spanishOmlette.png'),
        dict(section='suhoor', category='egg', sort_order=3,
             name_en='Boiled Egg', name_ar='بيض مسلوق',
             desc_en='Fresh eggs soft or hard boiled to order, served with sea salt and a wedge of lemon — pure and clean.',
             desc_ar='بيض طازج مسلوق خفيفاً أو جيداً حسب الطلب، يُقدم مع ملح البحر وشريحة ليمون.',
             price=70, image='images/boiledegg.png'),
        dict(section='suhoor', category='egg', sort_order=4,
             name_en='Omelette', name_ar='أومليت',
             desc_en='A classic folded omelette with a silky interior and lightly golden exterior, prepared to order with fresh herbs.',
             desc_ar='أومليت مطوي كلاسيكي بداخل حريري وخارج ذهبي خفيف، يُحضر عند الطلب ويُتبل بأعشاب طازجة.',
             price=70, image='images/omlette.png'),
        # ── SUHOOR · Yogurt ───────────────────────────────────────────────────
        dict(section='suhoor', category='yogurt', sort_order=1,
             name_en='Peach Yogurt', name_ar='زبادي بالخوخ',
             desc_en='Smooth, creamy yogurt layered with sweet peach compote and a hint of vanilla — light on the stomach and beautifully balanced.',
             desc_ar='زبادي ناعم كريمي مع كومبوت الخوخ الحلو ولمسة فانيليا — خفيف على المعدة ومتوازن.',
             price=90, image='images/peachYogurt.png'),
        dict(section='suhoor', category='yogurt', sort_order=2,
             name_en='Strawberry Yogurt', name_ar='زبادي بالفراولة',
             desc_en='Chilled yogurt swirled with a vibrant strawberry coulis — bright, refreshing, and naturally sweet.',
             desc_ar='زبادي مبرد مع صلصة الفراولة الزاهية — مشرق ومنعش وحلو بشكل طبيعي.',
             price=90, image='images/strYogurt.png'),
        dict(section='suhoor', category='yogurt', sort_order=3,
             name_en='Plain Yogurt', name_ar='زبادي سادة',
             desc_en='Full-fat natural yogurt, cool and tangy — unsweetened and pure, a clean probiotic-rich accompaniment.',
             desc_ar='زبادي طبيعي كامل الدسم، بارد وخفيف الحموضة — غير محلى ونقي.',
             price=70, image='images/plainYogurt.png'),
        dict(section='suhoor', category='yogurt', sort_order=4,
             name_en='Fruit Yogurt', name_ar='زبادي بالفواكه',
             desc_en='Creamy yogurt generously topped with a medley of seasonal fruits — colourful and vitamin-rich.',
             desc_ar='زبادي كريمي مغطى بمزيج سخي من الفواكه الموسمية — ملون وغني بالفيتامينات.',
             price=95, image='images/fruitYogurt.png'),
    ]

    added = 0
    for d in catalog:
        if d['name_en'] not in existing:
            db.session.add(MenuItem(**d))
            added += 1
    if added:
        db.session.commit()
        print(f"✅  Seeded {added} new menu item(s).")


# ── Public Routes ─────────────────────────────────────────────────────────────

@app.route("/")
def home():
    return render_template("Home.html")

@app.route("/menu")
def menu():
    def q(s, c):
        return MenuItem.query.filter_by(section=s, category=c, is_active=True).order_by(MenuItem.sort_order).all()
    return render_template("menu.html",
        iftar_main    = q('iftar', 'main-dishes'),
        iftar_soup    = q('iftar', 'soup'),
        iftar_drinks  = q('iftar', 'ramadan-drinks'),
        suhoor_foul   = q('suhoor', 'foul'),
        suhoor_eggs   = q('suhoor', 'egg'),
        suhoor_yogurt = q('suhoor', 'yogurt'),
    )

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/reservation")
def reservation_page():
    return render_template("reservation.html")

@app.route("/reserve", methods=["POST"])
def handle_reserve():
    res_data = {k: request.form.get(k) for k in ("name","email","phone","date","time","message")}
    new_res = Reservation(**res_data)
    try:
        db.session.add(new_res)
        db.session.commit()
        pa_url = (
            "https://defaultd6dccdf42d0e4688a8a88c9dae615c.83.environment.api.powerplatform.com:443"
            "/powerautomate/automations/direct/workflows/b586997ea7624ae9987b68ecd0f3a76e"
            "/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun"
            "&sv=1.0&sig=CWiOivUVsy-5pVyodBvNw6EUAvy_4zYiUtChoZLDi_U"
        )
        requests.post(pa_url, json=res_data, timeout=5)
    except Exception as e:
        print(f"❌  {e}"); db.session.rollback()
    return redirect(url_for("reservation_page"))


# ── Admin Routes ──────────────────────────────────────────────────────────────

@app.route("/admin/reservations")
def view_reservations():
    return render_template("AdminRes.html",
        reservations=Reservation.query.order_by(Reservation.timestamp.asc()).all())

@app.route("/admin/menu")
def admin_menu_page():
    return render_template("AdminMenu.html",
        items=MenuItem.query.order_by(MenuItem.section, MenuItem.category, MenuItem.sort_order).all(),
        sections=SECTIONS, categories=CATEGORIES)

@app.route("/admin/menu/add", methods=["POST"])
def admin_menu_add():
    try:
        db.session.add(MenuItem(
            section=request.form.get("section"), category=request.form.get("category"),
            name_en=request.form.get("name_en","").strip(), name_ar=request.form.get("name_ar","").strip(),
            desc_en=request.form.get("desc_en","").strip(), desc_ar=request.form.get("desc_ar","").strip(),
            price=float(request.form.get("price") or 0), image=request.form.get("image","").strip(),
            is_active=(request.form.get("is_active")=="on"), sort_order=int(request.form.get("sort_order") or 0),
        )); db.session.commit(); flash("✅  Item added!", "success")
    except Exception as e:
        db.session.rollback(); flash(f"❌  {e}", "error")
    return redirect(url_for("admin_menu_page"))

@app.route("/admin/menu/edit/<int:item_id>", methods=["POST"])
def admin_menu_edit(item_id):
    item = MenuItem.query.get_or_404(item_id)
    try:
        item.section=request.form.get("section"); item.category=request.form.get("category")
        item.name_en=request.form.get("name_en","").strip(); item.name_ar=request.form.get("name_ar","").strip()
        item.desc_en=request.form.get("desc_en","").strip(); item.desc_ar=request.form.get("desc_ar","").strip()
        item.price=float(request.form.get("price") or 0); item.image=request.form.get("image","").strip()
        item.is_active=(request.form.get("is_active")=="on"); item.sort_order=int(request.form.get("sort_order") or 0)
        db.session.commit(); flash("✅  Updated!", "success")
    except Exception as e:
        db.session.rollback(); flash(f"❌  {e}", "error")
    return redirect(url_for("admin_menu_page"))

@app.route("/admin/menu/delete/<int:item_id>", methods=["POST"])
def admin_menu_delete(item_id):
    item = MenuItem.query.get_or_404(item_id)
    try:
        db.session.delete(item); db.session.commit(); flash("🗑️  Deleted.", "success")
    except Exception as e:
        db.session.rollback(); flash(f"❌  {e}", "error")
    return redirect(url_for("admin_menu_page"))


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        _seed_menu()
    app.run(debug=True)
