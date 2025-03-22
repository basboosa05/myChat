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
        return render_template("Login.html")
   
 #register 
@app.route('/register',methods=['POST'])
def register():  
    username = request.form.get('uname')
    password = request.form.get('password')
    Fname=request.form.get('fname')
    Lname=request.form.get('lname')
    user=User.query.filter_by(username=username).first()
    if user:    #ana mesh 3yza yekoon this username found 
        return render_template("SignUp.html",error="Username already found")
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
    return render_template('index2.html')  # Render the index2.html file

# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)