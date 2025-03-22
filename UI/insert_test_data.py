from app import app, db
from models import User, Friend, Message
from werkzeug.security import generate_password_hash
from datetime import datetime

# Create the application context
with app.app_context():
    # Create the database tables (if they don't exist)
    db.create_all()

    # Insert test users
    print("Inserting users...")
    user1 = User(username='alice', password_hash=generate_password_hash('alice123'), First_name='Alice', Last_name='Smith')
    user2 = User(username='bob', password_hash=generate_password_hash('bob123'), First_name='Bob', Last_name='Johnson')
    user3 = User(username='charlie', password_hash=generate_password_hash('charlie123'), First_name='Charlie', Last_name='Brown')

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(user3)
    db.session.commit()
    print("Users inserted successfully!")

    # Insert test friend relationships
    print("Inserting friends...")
    friend1 = Friend(user_id=user1.id, friend_id=user2.id, status='accepted')  # Alice and Bob are friends
    friend2 = Friend(user_id=user1.id, friend_id=user3.id, status='pending')   # Alice sent a request to Charlie
    friend3 = Friend(user_id=user2.id, friend_id=user3.id, status='accepted') # Bob and Charlie are friends

    db.session.add(friend1)
    db.session.add(friend2)
    db.session.add(friend3)
    db.session.commit()
    print("Friends inserted successfully!")

    # Insert test messages
    print("Inserting messages...")
    message1 = Message(sender_id=user1.id, receiver_id=user2.id, message='Hello Bob!')
    message2 = Message(sender_id=user2.id, receiver_id=user1.id, message='Hi Alice!')
    message3 = Message(sender_id=user1.id, receiver_id=user3.id, message='Hey Charlie, how are you?')

    db.session.add(message1)
    db.session.add(message2)
    db.session.add(message3)
    db.session.commit()
    print("Messages inserted successfully!")

    print("Test data inserted successfully!")