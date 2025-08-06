# SmartRAG Preprocessor Backend

FastAPI backend for document processing and RAG preprocessing.

## Features

- Multi-format document processing (PDF, Word, Excel, PowerPoint, etc.)
- Intelligent chunking with configurable rules
- Async task queue processing
- RESTful API with automatic documentation

## Development

```bash
# Install dependencies
poetry install

# Run server
poetry run uvicorn app.main:app --reload --port 8090

# Run tests
poetry run pytest
```