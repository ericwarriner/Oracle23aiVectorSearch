# VectorSearchMiddleware

The **VectorSearchMiddleware** is a Flask-based middleware proxy that provides a REST API to bridge communications between the [Oracle 23ai Database](https://www.oracle.com/database/technologies/23ai/) and the [VectorSearchUserInterface](https://github.com/ericwarriner/Oracle23aiVectorSearch/VectorSearchUserInterface). It exposes endpoints for operations such as image retrieval and face encoding, enabling the UI to perform vector-based search and similarity analysis.

## 🚀 Features

- **REST Endpoints:**  
  - **`/hello` (GET):** Retrieves a specified number of image blobs from the database.
  - **`/encode_face` (POST):** Accepts a base64-encoded image, performs face recognition to extract an embedding vector, and queries the Oracle 23ai database for matching entries based on vector distance, age and tolerance filters.

- **Oracle 23ai Integration:**  
  Connects to the Oracle 23ai database using credentials provided via environment variables.

- **Face Recognition:**  
  Uses the `face_recognition` library to generate embedding vectors from images.

## 🐍 Installation


## 📦 Prerequisites
- Docker (optional, for containerization)
- Oracle OCI or Google Cloud SDK (optional, for pushing Docker images)
- Oracle 23ai instance


### Clone the Repository
```bash
git clone https://github.com/ericwarriner/Oracle23aiVectorSearch.git
cd VectorSearchMiddleware
```

## ⚙️ Environment Variables

Before running this middleware, ensure the following environment variables are set:

```bash
DB_USERNAME="your_db_username"
DB_PASSWORD="your_db_password"
DB_DSN="your_db_dsn"
PORT=8080
```

For example:

```bash
DB_USERNAME=oracle23ai_db_user
DB_PASSWORD=password
DB_DSN=129.153.38.218/freepdb1
PORT=8080
```

These can be exported in your terminal or specified in a local .env file.

## 📦 Dependencies

The following Python packages are required:

- `Flask`
- `gunicorn`
- `face_recognition` 
- `numpy`
- `datasets`
- `oracledb`
- `Pillow`
- `python-dotenv`

These can be installed from the `requirements.txt` file.
```bash
pip install -r requirements.txt
```

## 🚢 Deployment

The middleware is containerized using Docker. The provided Dockerfile installs the required dependencies and starts the app using Gunicorn.

To build and run the Docker container:

```bash
docker build -t vectorsearch-middleware .
docker run -p 8080:8080 vectorsearch-middleware
```


🔌 Integration with VectorSearchUserInterface
The VectorSearchUserInterface communicates with this middleware by making HTTP requests to the exposed endpoints. For example, the /encode_face endpoint is used for processing images and retrieving similar faces from the database.

This middleware ensures secure and efficient communication between the UI and the Oracle 23ai backend, abstracting the complexity of database interactions.

💡 Usage
Set up the required environment variables.
Deploy the middleware (either locally or via Docker).
Configure the user interface to point to the middleware's URL (e.g., http://localhost:8080/encode_face).
🛠️ Development
To run the middleware locally:
```bash
python [main.py]
```


Make sure your environment variables are configured correctly before starting the server.




## ⚖️ Legal Disclaimer

This project demonstrates vector search powered by an **Oracle 23ai Converged Database**.  
Oracle, the Oracle logo, and Oracle 23ai are trademarks or registered trademarks of Oracle and/or its affiliates.

This project is an independent demonstration and is **not affiliated with**, **endorsed by**, or **sponsored by Oracle Corporation**.  
Any Oracle trademarks used in this project are solely for the purpose of identifying the underlying technology and are the property of Oracle.

If you are an Oracle representative and have concerns about this usage, please contact me to resolve the matter.

---

## 🙌 Contributing

Contributions are welcome!  
Feel free to fork the repository, make changes, and submit a pull request.  
For major changes, please open an issue first to discuss what you’d like to change.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
