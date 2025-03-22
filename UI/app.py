# app.py
from flask import Flask,jsonify, render_template, request, redirect,session, url_for, flash
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


#get friends
def get_friends_list(user_id):
    # Fetch all accepted friends for the logged-in user
    friends = Friend.query.filter(
        ((Friend.user_id == user_id) | (Friend.friend_id == user_id)) &
        (Friend.status == 'accepted')
    ).all()

    # Get friend details
    friend_list = []
    for friend in friends:
        if friend.user_id == user_id:
            friend_user = User.query.get(friend.friend_id)
        else:
            friend_user = User.query.get(friend.user_id)
        print("Friend user:", friend_user)
        friend_list.append({
            'id': friend_user.id,
            'username': friend_user.username,
            'profile_pic': url_for('static', filename='Icons/profile.jpg')  # Default profile picture
        })
    
    return friend_list
    
# retrives friends
@app.route('/get_friends')
def get_friends():
    if "username" in session:
        current_user = User.query.filter_by(username=session['username']).first()
        friends_list = get_friends_list(current_user.id)
        return jsonify(friends_list)
    else:
        return jsonify({"error": "User not logged in"}), 401

# goes to home page 
@app.route('/dashboard')
def dashboard():
    if "username" in session:
        return render_template('index2.html')  # Render the index2.html file




@app.route("/logout")
def logout():
    session.pop('username',None)
    return redirect(url_for('GoToLogin'))




# Routes and other logic go here
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)




 