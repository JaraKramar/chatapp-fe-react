# import pandas as pd
import psycopg2
from pgvector.psycopg2 import register_vector

from src.backend.clients_creation import SecretManagerClient
from src.backend.types.config import settings


def direct_connection(database_name):
    dbc = settings.database[database_name]

    if isinstance(dbc["password"], dict):
        password = SecretManagerClient().get_output(dbc["password"]["SECRET"])[
            "password"
        ]
    else:
        password = dbc["password"]

    connection = psycopg2.connect(
        user=dbc["username"],
        password=password,
        port=dbc["port"],
        database=dbc["database"],
        host=dbc["host"],
    )
    connection.autocommit = True
    # Ping the database
    server_info = connection.info.server_version
    print(f"Successfully connected to the database. {server_info=}")

    return connection


def execute_sql(db_connect, query):
    register_vector(db_connect)
    curs = db_connect.cursor()
    # try:
    curs.execute("SELECT * FROM chunk2 ORDER BY embedding <=> %s LIMIT 5", (query,))
    print(11)
    # cols = [column[0] for column in curs.description]
    data = curs.fetchall()
    # except Exception as e:
    #     print(f'Error executing query: {str(e)}')

    curs.close()
    return data
