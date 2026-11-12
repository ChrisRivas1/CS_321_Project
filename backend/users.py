import sqlite3
from pathlib import Path

db_path = Path(__file__).with_name("matching.db")

def get_connection():
    connection = sqlite3.connect(db_path)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection

def create_user(username, email, name, age, selectedInterests):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
    INSERT INTO users (username, email, name, age)
        VALUES(?, ?, ?, ?)
    """, (username, email, name, age))
    connection.commit()
    userid = cursor.lastrowid
    connection.close()
    select_interests(userid, selectedInterests)
    return userid

def select_interests(userid, selectedInterests):
    connection = get_connection()
    cursor = connection.cursor()
    for interest in selectedInterests:
        cursor.execute("""
            INSERT INTO user_interests (userid, interestid)
            SELECT ?, interestid
            FROM interests
            WHERE interestname = ?
        """, (userid, interest))
    connection.commit()
    connection.close()

def get_user_info(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT userid, username, email, name, age
        FROM users
        WHERE userid = ?
    """, (userid,))
    user = cursor.fetchone()
    if user is None:
        connection.close()
        return None
    cursor.execute("""
            SELECT i.interestname
            FROM user_interests ui
            JOIN interests i
                ON ui.interestid = i.interestid
            WHERE ui.userid = ?
        """, (userid,))
    interests = [row[0] for row in cursor.fetchall()]
    connection.close()
    info = {
        "userid": user[0],
        "username": user[1],
        "email": user[2],
        "name": user[3],
        "age": user[4],
        "interests": interests
    }
    return info

def get_user_id_sign_in(input: str):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT userid
        FROM users
        WHERE username = ?
        OR email = ?
    """, (input, input))
    user = cursor.fetchone()
    if user is None:
        connection.close()
        return None
    userid = user[0]
    connection.close()
    return userid

if __name__ == "__main__":
    # userid = create_user("chris123", "chris123@email.com", "chris", 21, ["Soccer", "Fitness", "Music"])
    # userid = create_user("chris456", "chris456@email.com", "chris", 21, ["Basketball", "Hiking", "Film"])
    # userid = create_user("chris789", "chris789@email.com", "chris", 21, ["Film", "Anime", "Art"])
    # connection = get_connection()
    # cursor = connection.cursor()
    # cursor.execute("""
    #     SELECT u.userid, u.username, u.email, u.name, u.age, ui.userid, i.interestid, i.interestname 
    #     FROM users u
    #     LEFT JOIN user_interests ui
    #         ON u.userid = ui.userid
    #     LEFT JOIN interests i
    #         ON ui.interestid = i.interestid
    # """)
    # print("Users: ", cursor.fetchall())
    # connection.close()
    print("")

