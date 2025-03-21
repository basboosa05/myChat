# app.py
from flask import Flask, render_template, request, redirect
from models import db, User, Friend, Message 



app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
db.init_app(app)  # Initialize db with the app

@app.route("/")
def index():
    return render_template("index2.html")

# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)