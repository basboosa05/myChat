# app.py
from flask import Flask, render_template, request, redirect,session, url_for
from models import db, User, Friend, Message 
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.secret_key="your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db.init_app(app)  # Initialize db with the app

@app.route("/")
def home():
    if "username" in session:
        return redirect(url_for('index2'))
    return render_template("Login.html")

# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)