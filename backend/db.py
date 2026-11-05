import sqlite3

connection = sqlite3.connect("matching.db")

cursor = connection.cursor()

cursor.execute("PRAGMA foreign_keys = ON")

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    userid INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS interests (
    userid INTEGER,
    interest TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(userid)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS availability (
    availabilityid INTEGER PRIMARY KEY,
    userid INTEGER,
    day TEXT NOT NULL,
    starttime TEXT NOT NULL,
    endtime TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(userid)
)
""")


cursor.execute("""
CREATE TABLE IF NOT EXISTS matches (
    matchid INTEGER PRIMARY KEY,
    user1id INTEGER,
    user2id INTEGER,
    FOREIGN KEY (user1id) REFERENCES users(userid),
    FOREIGN KEY (user2id) REFERENCES users(userid)
)
""")

connection.commit()
connection.close()