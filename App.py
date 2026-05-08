from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests  # This is needed for Power Automate
import os

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///reservations.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(12), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    message = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Reservation {self.name}>"


# --- Routes ---


@app.route("/")
def home():
    return render_template("Home.html")


@app.route("/menu")
def menu():
    return render_template("menu.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/reservation")
def reservation_page():
    return render_template("reservation.html")


@app.route("/reserve", methods=["POST"])
def handle_reserve():
    # 1. Collect data from the reservation.html form
    res_data = {
        "name": request.form.get("name"),
        "email": request.form.get("email"),
        "phone": request.form.get("phone"),
        "date": request.form.get("date"),
        "time": request.form.get("time"),
        "message": request.form.get("message"),
    }

    try:
        # 2. ONLY Trigger Power Automate (Do NOT save to DB yet)
        # PASTE YOUR COPIED URL BELOW BETWEEN THE QUOTES
        pa_url = "https://defaultd6dccdf42d0e4688a8a88c9dae615c.83.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b586997ea7624ae9987b68ecd0f3a76e/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CWiOivUVsy-5pVyodBvNw6EUAvy_4zYiUtChoZLDi_U"

        # Send the JSON data to the flow
        requests.post(pa_url, json=res_data)
        print("Power Automate triggered successfully! Waiting for Admin approval.")

    except Exception as e:
        print(f" Error: {e}")

    # Redirect back to the reservation page
    return redirect(url_for("reservation_page"))


# --- NEW ROUTE: Webhook for Power Automate to call upon Approval ---
@app.route("/webhook/approve", methods=["POST"])
def approve_reservation():
    # Power Automate will send the data back here as JSON
    data = request.get_json()

    if not data:
        return {"status": "error", "message": "No data received"}, 400

    # Create the database record from the approved data
    new_res = Reservation(
        name=data.get("name"),
        email=data.get("email"),
        phone=data.get("phone"),
        date=data.get("date"),
        time=data.get("time"),
        message=data.get("message"),
    )

    try:
        db.session.add(new_res)
        db.session.commit()
        print(f"Approved & Saved to DB: {new_res.name} for {new_res.date}")
        return {"status": "success", "message": "Reservation added to DB"}, 200
    except Exception as e:
        print(f"Database Error: {e}")
        db.session.rollback()
        return {"status": "error", "message": "Failed to save to DB"}, 500


@app.route("/admin/reservations")
def view_reservations():
    all_res = Reservation.query.order_by(Reservation.timestamp.asc()).all()
    return render_template("AdminRes.html", reservations=all_res)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # This change allows the server to tell Flask which port to use
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
