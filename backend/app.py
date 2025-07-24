from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
from sqlalchemy import func

app = Flask(__name__)
CORS(app)

# Database config
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    service = db.Column(db.String(100), nullable=False)
    details = db.Column(db.String(500))
    status = db.Column(db.String(50), default='pending')
    amount = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'date': self.date,
            'time': self.time,
            'service': self.service,
            'details': self.details,
            'status': self.status,
            'amount': self.amount
        }

class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    type = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    status = db.Column(db.String(50), default='pending')
    date = db.Column(db.String(20), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'type': self.type,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'date': self.date
        }

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409
    password_hash = generate_password_hash(password)
    user = User(name=name, email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully', 'user': user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Login successful', 'user': user.to_dict()})
    return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    # Improved duplicate check: case-insensitive, trimmed
    existing = Booking.query.filter(
        func.lower(func.trim(Booking.name)) == data.get('name', '').strip().lower(),
        Booking.date == data.get('date'),
        Booking.time == data.get('time'),
        func.lower(func.trim(Booking.service)) == data.get('service', '').strip().lower()
    ).first()
    if existing:
        return jsonify({'error': 'Duplicate booking detected'}), 409
    booking = Booking(
        name=data.get('name'),
        address=data.get('address'),
        date=data.get('date'),
        time=data.get('time'),
        service=data.get('service'),
        details=data.get('details'),
        status=data.get('status', 'pending'),
        amount=float(data.get('amount', 0.0))
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify({'message': 'Booking created', 'booking': booking.to_dict()}), 201

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    bookings = Booking.query.all()
    return jsonify([b.to_dict() for b in bookings])

@app.route('/api/bookings/<int:booking_id>', methods=['PATCH'])
def update_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    data = request.get_json()
    if 'status' in data:
        booking.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Booking updated', 'booking': booking.to_dict()})

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()
    return jsonify({'message': 'Booking deleted'})

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    complaint = Complaint(
        name=data.get('name'),
        email=data.get('email'),
        type=data.get('type'),
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'pending'),
        date=data.get('date')
    )
    db.session.add(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint created', 'complaint': complaint.to_dict()}), 201

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    complaints = Complaint.query.all()
    return jsonify([c.to_dict() for c in complaints])

@app.route('/api/complaints/<int:complaint_id>', methods=['PATCH'])
def update_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    data = request.get_json()
    if 'status' in data:
        complaint.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Complaint updated', 'complaint': complaint.to_dict()})

@app.route('/api/complaints/<int:complaint_id>', methods=['DELETE'])
def delete_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)
    db.session.delete(complaint)
    db.session.commit()
    return jsonify({'message': 'Complaint deleted'})

if __name__ == '__main__':
    import sys
    with app.app_context():
        db.create_all()
        if '--cleanup-duplicates' in sys.argv:
            # Remove duplicate bookings
            from sqlalchemy import and_
            seen = set()
            duplicates = []
            for b in Booking.query.order_by(Booking.id).all():
                key = (b.name.strip().lower(), b.date, b.time, b.service.strip().lower())
                if key in seen:
                    duplicates.append(b)
                else:
                    seen.add(key)
            for dup in duplicates:
                db.session.delete(dup)
            db.session.commit()
            print(f"Removed {len(duplicates)} duplicate bookings.")
        else:
            app.run(debug=True)
