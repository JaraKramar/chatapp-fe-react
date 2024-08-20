# from typing import List
# from typing import List

from pgvector.sqlalchemy import Vector

# from sqlalchemy import (  # DateTime,; String,; create_engine,
from sqlalchemy import (  # DateTime,; String,; create_engine,
    ARRAY,
    TIMESTAMP,
    Column,
    Float,
    ForeignKey,
    Integer,
    MetaData,
    Text,
    func,
)

# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Mapped, declarative_base, relationship

from src.backend.types.config import settings

Base = declarative_base()
metadata = MetaData()


def create_dynamic_model(table_name, table_schema):
    attrs = {
        "__tablename__": table_name,
        "__table_args__": {"extend_existing": True},
    }

    for column_name, column_def in table_schema.items():
        column_args = column_def.split(", ")
        column_type = eval(column_args[0])
        column_params = {
            arg.split("=")[0]: eval(arg.split("=")[1]) for arg in column_args[1:]
        }
        attrs[column_name] = Column(column_type, **column_params)

    return type(table_name, (Base,), attrs)


class Chunk(Base):
    __tablename__ = "chunks"

    chunk_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    content = Column(Text, nullable=False)
    embedding = Column(Vector, nullable=False)
    chunk_order = Column(Integer, nullable=False)
    document_id = Column(Integer, ForeignKey("documents.document_id"), nullable=False)
    page = Column(Integer, nullable=False)
    embedding_model_id = Column(Text, nullable=False)
    token_count = Column(Integer, nullable=False)
    last_updated = Column(TIMESTAMP, default=func.now(), nullable=False)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)

    document = relationship("Document", back_populates="chunks")


class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(Text, nullable=False)
    summary = Column(Text, nullable=False)
    keywords = Column(ARRAY(Text), nullable=False)
    summary_embedding = Column(Vector, nullable=False)
    keyword_embedding = Column(Vector, nullable=False)
    llm_model_id = Column(Text, nullable=False)
    embedding_model_id = Column(Text, nullable=False)
    user_role = Column(ARRAY(Text), nullable=False)
    document_type = Column(Text, nullable=False)
    storage_path = Column(Text, nullable=False)
    origin_path = Column(Text, nullable=False)
    last_update = Column(TIMESTAMP, default=func.now(), nullable=False)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)

    chunks = relationship("Chunk", back_populates="document")


class Log(Base):
    __tablename__ = "logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    timestamp_received = Column(TIMESTAMP, default=func.now(), nullable=False)
    timestamp_responded = Column(TIMESTAMP, default=func.now(), nullable=False)
    duration_ms_retrieval = Column(Float, nullable=False)
    duration_ms_generation = Column(Float, nullable=False)
    session_id = Column(Text, nullable=False)
    user_id = Column(Text, nullable=False)
    llm_model_id = Column(Text, nullable=False)
    embedding_model_id = Column(Text, nullable=False)
    query = Column(Text, nullable=False)
    generated_answer = Column(Text, nullable=False)
    chunk_ids = Column(ARRAY(Integer), nullable=False)
    chunk_scores_similarity = Column(ARRAY(Float), nullable=False)
    search_method = Column(Text, nullable=False)
    num_messages = Column(Integer, nullable=False)
    tokens_in = Column(Integer, nullable=False)
    tokens_out = Column(Integer, nullable=False)
    system_prompt_version = Column(Integer, nullable=False)
    error_message = Column(Text, nullable=False)

    feedbacks = relationship("Feedback", back_populates="logs")


class Model(Base):
    __tablename__ = "models"

    model_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    name = Column(Text, nullable=False)
    type = Column(Text, nullable=False)


class Feedback(Base):
    __tablename__ = "feedbacks"

    feedback_id = Column(Integer, primary_key=True, autoincrement=True, unique=True)
    log_id = Column(Integer, ForeignKey("logs.log_id"), nullable=False)
    feedback = Column(Text, nullable=True)
    comment = Column(Text, nullable=True)
    last_update = Column(TIMESTAMP, default=func.now(), nullable=False)
    created_at = Column(TIMESTAMP, default=func.now(), nullable=False)

    logs = relationship("Log", back_populates="feedbacks")
