FROM python:3.9-slim

WORKDIR /app

# Install necessary system dependencies, including cmake
RUN apt-get update && apt-get install -y cmake build-essential

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
# Expose port 8080
EXPOSE 8080
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]