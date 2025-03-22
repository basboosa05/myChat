# app.py
from flask import Flask, render_template, request, redirect,session, url_for, flash
from models import db, User, Friend, Message 
from werkzeug.security import generate_password_hash



app = Flask(__name__)
app.secret_key="your_secret_key"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config['SESSION_COOKIE_SECURE'] = True  # Only send cookies over HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Prevent client-side script access to cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Prevent CSRF attacks
db.init_app(app)  # Initialize db with the app

@app.route("/")
def home():  
    return render_template("SignUp.html")

@app.route('/GoToLogin')
def GoToLogin():
    return render_template('Login.html')

@app.route('/login', methods=['POST'])
def login():
    
    username = request.form.get('uname')
    password = request.form.get('password')
    
    user=User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['username']=username
        return redirect(url_for('dashboard'))
    else: 
        flash("Invalid username or password.", "error")
        return render_template("Login.html")
   
 #register 
@app.route('/register',methods=['POST'])
def register():  
    username = request.form.get('uname')
    password = request.form.get('password')
    Fname=request.form.get('fname')
    Lname=request.form.get('lname')

    if not username or not password or not Fname or not Lname:
        flash("All fields are required.", "error")
        return render_template("SignUp.html")

    if len(password) < 8:
        flash("Password must be at least 8 characters long.", "error")
        return render_template("SignUp.html")

    user=User.query.filter_by(username=username).first()
    if user:    #ana mesh 3yza yekoon this username found 
        flash("Username already found", "error")
        return render_template("SignUp.html")
    else:
        new_user=User(username=username,First_name=Fname, Last_name=Lname)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        session['username']=username
        return redirect(url_for('dashboard'))



    

# goes to home page 
@app.route('/dashboard')
def dashboard():
    if "username" in session:
        return render_template('index2.html')  # Render the index2.html file


@app.route("/Logout")
def Logout():
    session.pop('username',None)
    return redirect(url_for('GoToLogin'))

# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)




 