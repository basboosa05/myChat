# models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()  # Initialize db here (without app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(150), nullable=False)
    First_name= db.Column(db.String(80), nullable=False)
    Last_name= db.Column(db.String(80), nullable=False)
    # image should be there but later because I don't get how it should be stored
    def set_password(self,password):
        self.password_hash =generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Friend(db.Model): # eltable dey kolha is not used for now friends will be pre-defined 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False)  #will be three cases el mafrood fo later use 

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())