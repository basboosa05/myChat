# app.py
from flask import Flask, render_template, request, redirect,session, url_for
from models import db, User, Friend, Message 



app = Flask(__name__)
app.secret_key="your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
db.init_app(app)  # Initialize db with the app

@app.route("/")
def home():
        
    return render_template("Login.html")

@app.route('/login', methods=['POST'])
def login():
    
    username = request.form.get('uname')
    password = request.form.get('password')
    
    user=User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['username']=username
    else: 
        return render_template("Login.html")
   
    

# goes to home page 
@app.route('/dashboard')
def dashboard():
    return render_template('index2.html')  # Render the index2.html file

# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)