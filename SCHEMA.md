# Supabase Schema for CodeGraph

Run the following SQL in your Supabase SQL Editor:

```sql
-- Table: graphs
CREATE TABLE graphs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_url TEXT UNIQUE NOT NULL,
  nodes JSONB NOT NULL,
  edges JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: explanations
CREATE TABLE explanations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for explanations search
CREATE INDEX idx_explanations_repo_file ON explanations (repo_url, file_name);
```
