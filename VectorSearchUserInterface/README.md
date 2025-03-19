
## 🖼️ Application Preview

Below is a preview of the application user interface.

![Application Preview](https://storage.googleapis.com/www.ericwarriner.com/VectorSearch.JPG)

---


# Fresh Vector Search App

Welcome to a Deno JS **Fresh** project! This is a web application built using the [Fresh](https://fresh.deno.dev/) framework, powered by [Deno](https://deno.land/).

This application demonstrates **Vector Search** capabilities powered by an **Oracle 23ai Converged Database**, delivering fast and efficient similarity search capabilities.

> ⚡️ Fresh delivers zero-runtime overhead, server-side rendering, and instant page load speeds!


---

## 🚀 Live Demo

Check it out here:  [Oracle 23ai Vector Search](https://23ai.org).

---

## 🚀 Getting Started

For a deeper dive into Fresh, check out the [Fresh "Getting Started" guide](https://fresh.deno.dev/docs/getting-started).

---

## 📦 Prerequisites

- [Deno](https://deno.land/manual/getting_started/installation)
- Docker (optional, for containerization)
- Google Cloud SDK (optional, for pushing Docker images)
- A running instance of the **VectorSearchMiddleware** component  
  → GitHub repo: [VectorSearchMiddleware](https://github.com/ericwarriner/VectorSearchMiddleware)

---

## ⚙️ Environment Variables

This project relies on a middleware service that performs vector-based operations. Before running the app, set the following environment variable:

```bash
API_URL=http://<VECTOR_MIDDLEWARE_HOST>:<PORT>/encode_face
```

For example:

```bash
API_URL=http://129.80.96.10:8080/encode_face
```

You can export this in your terminal session or place it in a local `.env` file.

---

## 🔨 Development

### Run Locally

Build the project:

```bash
deno task build
```

Start the development server (with hot reload):

```bash
deno task start
```

Visit `http://localhost:8000` in your browser.

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


## ⚖️ Legal Disclaimer

This application demonstrates **Vector Search** powered by an [**Oracle 23ai Converged Database**](https://www.oracle.com/database/23ai/).  
Oracle, the Oracle logo, and Oracle 23ai are trademarks or registered trademarks of Oracle and/or its affiliates.  

This project is an independent application that utilizes Oracle technology. It is **not affiliated with**, **endorsed by**, or **sponsored by Oracle Corporation**.  
Any Oracle trademarks used in this project are solely for the purpose of identifying the underlying technology and are the property of Oracle.

If you are an Oracle representative and have concerns about this usage, please contact me to resolve the matter.

---

## 📂 Project Structure

```
.
├── README.md        # Project documentation
├── deno.json        # Deno configuration
├── main.ts          # Application entry point
├── routes/          # Fresh routes (pages)
└── components/      # Reusable UI components
```

---

## 🙌 Contributing

Contributions are welcome!  
If you'd like to contribute, please fork the repo and submit a pull request. For major changes, open an issue first to discuss your ideas.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

