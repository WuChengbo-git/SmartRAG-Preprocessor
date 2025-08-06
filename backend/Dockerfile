FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy poetry files
COPY pyproject.toml ./
COPY poetry.lock* ./

# Configure poetry
RUN poetry config virtualenvs.create false

# Install Python dependencies
RUN poetry install --no-dev

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads logs

# Expose port
EXPOSE 8090

# Start command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8090"]