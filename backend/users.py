
import sqlite3
import hashlib
import hmac
import secrets
from pathlib import Path

db_path = Path(__file__).with_name("matching.db")

# Password hashing configuration
PASSWORD_ITERATIONS = 600000
PASSWORD_ALGORITHM = "sha256"


def hash_password(password):
    """
    Hash a password using PBKDF2-SHA256 with a unique random salt.
    Passwords are never stored in plaintext.
    """
    if not isinstance(password, str) or len(password) < 8:
        raise ValueError("Password must contain at least 8 characters")

    salt = secrets.token_bytes(16)

    password_hash = hashlib.pbkdf2_hmac(
        PASSWORD_ALGORITHM,
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS
    )

    return (
        f"pbkdf2_sha256${PASSWORD_ITERATIONS}$"
        f"{salt.hex()}${password_hash.hex()}"
    )


def verify_password(password, stored_hash):
    """
    Verify a password against its stored hash.
    Also returns False for legacy accounts without a password.
    """
    if not isinstance(password, str) or not stored_hash:
        return False

    try:
        algorithm, iterations, salt_hex, hash_hex = stored_hash.split("$")

        if algorithm != "pbkdf2_sha256":
            return False

        iterations = int(iterations)

        if iterations < 100000 or iterations > 2000000:
            return False

        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)

        calculated_hash = hashlib.pbkdf2_hmac(
            PASSWORD_ALGORITHM,
            password.encode("utf-8"),
            salt,
            iterations
        )

        return hmac.compare_digest(calculated_hash, expected_hash)

    except (ValueError, TypeError, AttributeError):
        return False


def get_connection():
    connection = sqlite3.connect(db_path)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def create_user(username, email, name, age, selectedInterests, password):
    password_hash = hash_password(password)

    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("""
        INSERT INTO users (username, email, name, age, password_hash)
            VALUES(?, ?, ?, ?, ?)
        """, (username, email, name, age, password_hash))
        connection.commit()
        userid = cursor.lastrowid
    finally:
        connection.close()

    select_interests(userid, selectedInterests)
    return userid


def select_interests(userid, selectedInterests):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM user_interests WHERE userid = ?", (userid,))
    for interest in selectedInterests:
        cursor.execute("""
            INSERT OR IGNORE INTO user_interests (userid, interestid)
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
        SELECT userid, username, email, name, age, bio
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
        "bio": user[5],
        "interests": interests
    }
    return info


def get_user_id_sign_in(input: str, password: str):
    """
    Authenticate using username/email and password.
    Never allow login based on username alone.
    """
    connection = get_connection()
    try:
        cursor = connection.cursor()
        cursor.execute("""
            SELECT userid, password_hash
            FROM users
            WHERE username = ?
            OR email = ?
        """, (input, input))
        user = cursor.fetchone()
    finally:
        connection.close()

    if user is None:
        return None

    userid, stored_hash = user

    if not verify_password(password, stored_hash):
        return None

    return userid


def get_user_relationship_preferences(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
            SELECT r.goalname
            FROM user_relationships ur
            JOIN relationships r
                ON ur.goalid = r.goalid
            WHERE ur.userid = ?
        """, (userid,))
    preferences = [row[0] for row in cursor.fetchall()]
    connection.close()
    return preferences


def get_user_language_preferences(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
            SELECT l.languagename
            FROM user_languages ul
            JOIN languages l
                ON ul.languageid = l.languageid
            WHERE ul.userid = ?
        """, (userid,))
    preferences = [row[0] for row in cursor.fetchall()]
    connection.close()
    return preferences


def select_relationship_preferences(userid, preferences):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM user_relationships WHERE userid = ?", (userid,))
    for preference in preferences:
        cursor.execute("""
            INSERT OR IGNORE INTO user_relationships (userid, goalid)
            SELECT ?, goalid
            FROM relationships
            WHERE goalname = ?
        """, (userid, preference))
    connection.commit()
    connection.close()


def select_language_preferences(userid, preferences):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM user_languages WHERE userid = ?", (userid,))
    for preference in preferences:
        cursor.execute("""
            INSERT OR IGNORE INTO user_languages (userid, languageid)
            SELECT ?, languageid
            FROM languages
            WHERE languagename = ?
        """, (userid, preference))
    connection.commit()
    connection.close()


def select_availability(userid, slots):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM user_availability WHERE userid = ?", (userid,))
    for day, period in slots:
        cursor.execute("""
            INSERT OR IGNORE INTO user_availability (userid, slotid)
            SELECT ?, slotid
            FROM time_slots
            WHERE day = ?
            AND period = ?
        """, (userid, day, period))
    connection.commit()
    connection.close()


def get_user_availability(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT ts.day, ts.period
        FROM user_availability ua
        JOIN time_slots ts
            ON ua.slotid = ts.slotid
        WHERE ua.userid = ?
        ORDER BY ts.slotid
    """, (userid,))
    availability = [{"day": row[0], "period": row[1]} for row in cursor.fetchall()]
    connection.close()
    return availability


def update_bio(userid, bio):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        UPDATE users
        SET bio = ?
        WHERE userid = ?
    """, (bio, userid))
    connection.commit()
    connection.close()


''' User Matching Methods '''


def fetch_interests(cursor, userid):
    cursor.execute("""
        SELECT i.interestname
        FROM user_interests ui
        JOIN interests i
            ON ui.interestid = i.interestid
        WHERE ui.userid = ?
    """, (userid,))
    return [row[0] for row in cursor.fetchall()]


def get_candidates(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT userid, name, age, bio
        FROM users
        WHERE userid != ?
        AND userid NOT IN (
            SELECT swipeeid FROM swipes WHERE swiperid = ?
        )
        ORDER BY userid
    """, (userid, userid))
    rows = cursor.fetchall()
    candidates = [
        {
            "userid": row[0],
            "name": row[1],
            "age": row[2],
            "bio": row[3],
            "interests": fetch_interests(cursor, row[0])
        }
        for row in rows
    ]
    connection.close()
    return candidates


def record_swipe(swiperid, swipeeid, liked):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        INSERT OR IGNORE INTO swipes (swiperid, swipeeid, liked)
        VALUES (?, ?, ?)
    """, (swiperid, swipeeid, 1 if liked else 0))
    matched = False
    if liked:
        cursor.execute("""
            SELECT 1 FROM swipes
            WHERE swiperid = ? AND swipeeid = ? AND liked = 1
        """, (swipeeid, swiperid))
        if cursor.fetchone():
            user1id, user2id = sorted((swiperid, swipeeid))
            cursor.execute("""
                SELECT 1 FROM matches WHERE user1id = ? AND user2id = ?
            """, (user1id, user2id))
            if cursor.fetchone() is None:
                cursor.execute("""
                    INSERT INTO matches (user1id, user2id)
                    VALUES (?, ?)
                """, (user1id, user2id))
            matched = True
    connection.commit()
    connection.close()
    return matched


def get_matches(userid):
    connection = get_connection()
    cursor = connection.cursor()
    cursor.execute("""
        SELECT u.userid, u.name, u.age, u.bio
        FROM matches m
        JOIN users u
            ON u.userid = CASE
                WHEN m.user1id = ? THEN m.user2id
                ELSE m.user1id
            END
        WHERE m.user1id = ? OR m.user2id = ?
        ORDER BY m.matchid DESC
    """, (userid, userid, userid))
    rows = cursor.fetchall()
    matches = [
        {
            "userid": row[0],
            "name": row[1],
            "age": row[2],
            "bio": row[3],
            "interests": fetch_interests(cursor, row[0])
        }
        for row in rows
    ]
    connection.close()
    return matches
