-- RAG document store for the "Ask my portfolio" chat
-- Run via the Supabase SQL Editor or: supabase db push

CREATE EXTENSION IF NOT EXISTS vector;

-- Embedded content chunks sourced from the portfolio tables.
-- Re-populated wholesale by scripts/ingest.ts (pnpm ingest).
CREATE TABLE documents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  source_type TEXT NOT NULL,
  source_id TEXT,
  content TEXT NOT NULL,
  embedding VECTOR(768) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX documents_embedding_idx ON documents
  USING hnsw (embedding vector_cosine_ops);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON documents FOR SELECT USING (true);
-- No public write policies: ingestion runs with the service/secret key,
-- which bypasses RLS.

-- Cosine similarity search used by /api/chat
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(768),
  match_count INT DEFAULT 5,
  min_similarity FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id BIGINT,
  source_type TEXT,
  source_id TEXT,
  content TEXT,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    d.id,
    d.source_type,
    d.source_id,
    d.content,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM documents d
  WHERE 1 - (d.embedding <=> query_embedding) > min_similarity
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
$$;
