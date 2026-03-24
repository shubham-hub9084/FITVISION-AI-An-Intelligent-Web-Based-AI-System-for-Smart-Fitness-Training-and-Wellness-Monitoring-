"""
database/connection.py
─────────────────────
Single place that manages the Aiven PostgreSQL connection.
Import this anywhere you need a DB connection.

Usage:
    from database.connection import get_connection
    conn = get_connection()
"""

import os
import psycopg2
from dotenv import load_dotenv

# Load .env exactly once
load_dotenv()

_DATABASE_URL = os.getenv("DATABASE_URL")

if not _DATABASE_URL:
    raise EnvironmentError(
        "DATABASE_URL is not set.\n"
        "Add it to backend/.env:\n"
        "  DATABASE_URL=postgres://avnadmin:<password>@<host>:<port>/defaultdb?sslmode=require"
    )


def get_connection():
    """
    Return a new psycopg2 connection to the Aiven PostgreSQL database.
    Always close the connection after use (or use a context manager).
    """
    return psycopg2.connect(_DATABASE_URL)


def test_connection():
    """Quick sanity-check: returns the PostgreSQL server version string."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT VERSION()")
    version = cur.fetchone()[0]
    cur.close()
    conn.close()
    return version


if __name__ == "__main__":
    print("Testing Aiven connection...")
    print(test_connection())
    print("✅ Connection successful!")
