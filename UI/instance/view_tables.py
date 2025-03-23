import sqlite3

#this file is only a script to run to be able to view the db

# Connect to the SQLite database
conn = sqlite3.connect('chat.db')
cursor = conn.cursor()

# List all tables in the database
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables in the database:", tables)

# View all rows in a specific table
table_name = 'Message'  # Replace with your table name
cursor.execute(f"SELECT * FROM Message;")
rows = cursor.fetchall()

# Print all rows
print(f"Rows in Message:")
for row in rows:
    print(row)

# Close the connection
conn.close()