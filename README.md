
## 🖼️ Application Preview

Below is a preview of the application user interface.

![Application Preview](https://storage.googleapis.com/www.ericwarriner.com/VectorSearch1.JPG)


---

## 🚀 Live Demo

Check it out here:  [Oracle 23ai Vector Search](https://23ai.org).

---

## 📦 Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation)
- Docker (optional, for containerization)
- Oracle OCI or Google Cloud SDK (optional, for pushing Docker images)
- Oracle 23ai instance

---

## ⚙️ Environment Variables

This project relies on a VectorSearchMiddleware service and a Oracle Autonomous 23ai Database service that performs vector-based operations. Before running the app, please note that environment variables such as this API_URL will need to be set:

```bash
API_URL=http://<VECTOR_MIDDLEWARE_HOST>:<PORT>/encode_face
```

For example:

```bash
API_URL=http://129.80.96.10:8080/encode_face
```

You can export this in your terminal session or place it in a local `.env` file.

---

## 🐳 Docker Support

### Build the Docker Image

```bash
docker build -t <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPOSITORY>/<IMAGE_NAME>:latest .
```

For example:

```bash
docker build -t us-region-docker.pkg.dev/project-id/deno-app/deno-app:latest .
```

### Push to Google Artifact Registry

Authenticate with Google Cloud:

```bash
gcloud auth configure-docker <REGION>-docker.pkg.dev
```

Push your Docker image:

```bash
docker push <REGION>-docker.pkg.dev/<PROJECT_ID>/<REPOSITORY>/<IMAGE_NAME>:latest
```

---



## 📂 Project Structure

```
.
├── VectorSearchDatabase PopulationTool     # Tool to populate Oracle 23ai database with images.
├── VectorSearchMiddleware                  # Middleware proxy to connect and interact with Oracle 23ai DB
├── VectorSearchUserInterface               # Default UI and Application entry point

```

---


## ⚖️ Legal Disclaimer

This application demonstrates **Vector Search** powered by an [**Oracle 23ai Converged Database**](https://www.oracle.com/database/23ai/).  
Oracle, the Oracle logo, and Oracle 23ai are trademarks or registered trademarks of Oracle and/or its affiliates.  

This project is an independent application that utilizes Oracle technology. It is **not affiliated with**, **endorsed by**, or **sponsored by Oracle Corporation**.  
Any Oracle trademarks used in this project are solely for the purpose of identifying the underlying technology and are the property of Oracle.

If you are an Oracle representative and have concerns about this usage, please contact me to resolve the matter.

---

## 🙌 Contributing

Contributions are welcome!  
If you'd like to contribute, please fork the repo and submit a pull request. For major changes, open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

