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
        INSERT OR IGNORE INTO interests (interestid, interestname)
        VALUES (?, ?)
    """, (i + 1, interests[i]))

cursor.execute("""
CREATE TABLE IF NOT EXISTS relationships (
    goalid INTEGER PRIMARY KEY,
    goalname TEXT NOT NULL UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS user_relationships(
    goalid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    PRIMARY KEY (userid, goalid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (goalid) REFERENCES relationships(goalid)
)
""")
relationships = [
        "Friend", "Sports Partner", "Music Partner",
        "Activity Partner", "Study Partner", "Gaming Partner",
        "Networking", "Language Exchange Partner"
    ]
for i in range(len(relationships)):
    cursor.execute("""
        INSERT OR IGNORE INTO relationships (goalid, goalname)
        VALUES (?, ?)
    """, (i + 1, relationships[i]))

cursor.execute("""
CREATE TABLE IF NOT EXISTS languages (
    languageid INTEGER PRIMARY KEY,
    languagename TEXT NOT NULL UNIQUE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS user_languages(
    languageid INTEGER NOT NULL,
    userid INTEGER NOT NULL,
    PRIMARY KEY (userid, languageid),
    FOREIGN KEY (userid) REFERENCES users(userid),
    FOREIGN KEY (languageid) REFERENCES languages(languageid)
)
""")
languages = [
        "English", "Chinese", "Hindi",
        "Spanish", "Arabic", "Persian", "French",
        "Bengali", "Portuguese", "Urdu", "Vietnamese", 
        "Japanese", "Russian", "German", "Italian"
    ]
for i in range(len(languages)):
    cursor.execute("""
        INSERT OR IGNORE INTO languages (languageid, languagename)
        VALUES (?, ?)
    """, (i + 1, languages[i]))  

connection.commit()
connection.close()