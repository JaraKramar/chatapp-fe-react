import pandas as pd
import streamlit as st
from sqlalchemy.exc import OperationalError

from src.backend.database.connection import direct_connection
from src.backend.types.config import settings


# Warning: this page (and code) should only use user with admin permissions in app
def execute_sql(curs, default=None):
    query = st.text_area("Enter your SQL query:", value=default)
    execute_query = st.button("Execute")

    if execute_query:
        curs.execute(query)
        if "select" in query.lower():
            cols = [column[0] for column in curs.description]
            results_df = pd.DataFrame.from_records(data=curs.fetchall(), columns=cols)

            st.dataframe(results_df)


st.set_page_config(page_title="SQL console", layout="wide")

st.write("# SQL Query Tool")

# Sidebar section
with st.sidebar:
    st.title("Sidebar Settings")
    database_name = st.sidebar.selectbox(
        "Select database:", list(settings.database.keys())
    )

# this is psycopg2 not SQL Alchemy
# "SELECT * FROM information_schema.columns WHERE table_name = '<table_name>'"
db_connect = direct_connection(database_name=database_name)
curs = db_connect.cursor()

execute_sql(curs)
db_connect.close()
curs.close()
