from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///reservations.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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

# Routes
@app.route('/')
def home():
    return render_template('Home.html') 

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/reservation')
def reservation_page(): 
    return render_template('reservation.html')

@app.route('/reserve', methods=['POST'])
def handle_reserve():
    new_res = Reservation(
        name=request.form.get('name'),
        email=request.form.get('email'),
        phone=request.form.get('phone'),
        date=request.form.get('date'),
        time=request.form.get('time'),
        message=request.form.get('message')
    )

    try:
        db.session.add(new_res)
        db.session.commit()
        print(f"Saved: {new_res.name} for {new_res.date} at {new_res.time}")
    except Exception as e:
        print(f" Error: {e}")
        db.session.rollback()

    return redirect(url_for('reservation_page'))

@app.route('/admin/reservations')
def view_reservations():
    all_res = Reservation.query.order_by(Reservation.timestamp.asc()).all()
    return render_template('AdminRes.html', reservations=all_res)  


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
