from app import app, db
from models import User, Friend, Message
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

# Create the application context
with app.app_context():
    # Create the database tables (if they don't exist)
    db.create_all()

    # Insert test users
    print("Inserting users...")
    user1 = User(username='john_doe', password_hash=generate_password_hash('john123'), First_name='john', Last_name='Smith')
    user2 = User(username='jane_smith', password_hash=generate_password_hash('jane123'), First_name='Bob', Last_name='Johnson')
    user3 = User(username='alex_wong', password_hash=generate_password_hash('alex123'), First_name='Charlie', Last_name='Brown')

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()
    print("Users inserted successfully!")

    # Insert test friend relationships
    print("Inserting friends...")
    friend1 = Friend(user_id=user1.id, friend_id=user2.id, status='accepted')  
    friend2 = Friend(user_id=user1.id, friend_id=user3.id, status='pending')   
    friend3 = Friend(user_id=user2.id, friend_id=user3.id, status='accepted')
    friend4 = Friend(user_id=user1.id, friend_id=1, status='accepted') 
    friend5 = Friend(user_id=user1.id, friend_id=2, status='accepted') 
    friend6 = Friend(user_id=user1.id, friend_id=3, status='accepted') 

    db.session.add(friend1)
    db.session.add(friend2)
    db.session.add(friend3)
    db.session.add(friend4)
    db.session.add(friend5)
    db.session.add(friend6)
    db.session.commit()
    print("Friends inserted successfully!")

    # Insert test messages
    print("Inserting messages...")
    message1 = Message(sender_id=user1.id, receiver_id=user2.id, message='Hello Bob!',timestamp=datetime.now() - timedelta(days=2))
    message2 = Message(sender_id=user2.id, receiver_id=user1.id, message='Hi Alice!',timestamp=datetime.now())
    message3 = Message(sender_id=user1.id, receiver_id=user3.id, message='Hey Charlie, how are you?',timestamp=datetime.now() - timedelta(days=1))

    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)
    db.session.commit()
    print("Messages inserted successfully!")

    print("Test data inserted successfully!")