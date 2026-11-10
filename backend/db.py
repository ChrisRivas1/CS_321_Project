import sqlite3

connection = sqlite3.connect("matching.db")

cursor = connection.cursor()

cursor.execute("PRAGMA foreign_keys = ON")

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    userid INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS interests (
    interestid INTEGER PRIMARY KEY,
    interestname TEXT NOT NULL UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS user_interests(
    interestid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    PRIMARY KEY (userid, interestid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (interestid) REFERENCES interests(interestid)
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

interests = [
        "Tennis", "Basketball", "Film", "Music",
        "Soccer", "Dance", "Fitness", "Travel", 
        "Cooking", "Books", "Anime", "Art",
        "Technology", "Hiking", "Traveling",
        "Cycling", "Yoga", "Running", "Fishing",
        "Photography", "Fashion", "Chess", "Gardening",
        "Bowling"
    ]
for i in range(len(interests)):
    cursor.execute("""
        INSERT INTO interests (interestid, interestname)
        VALUES (?, ?)
    """, (i + 1, interests[i]))
    
connection.commit()
connection.close()