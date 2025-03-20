---

# Vector Search Database Population Tool

This Python project helps populate an Oracle 23ai vector database so that vector search capabilities using face recognition may be achieved. It leverages machine learning datasets and processes facial encodings for advanced search and analysis.

The primary dataset used in this tool is sourced from the Hugging Face project [ashraq/tmdb-people-image](https://huggingface.co/datasets/ashraq/tmdb-people-image), which provides a collection of images for facial recognition tasks.

---

## 🚀 Features

- **Face Recognition**: Detect and compare facial encodings using `face_recognition` and `numpy`.
- **Dataset Handling**: Load and manage datasets with Hugging Face’s `datasets` library.
- **Oracle 23ai Integration**: Connect and interact with an Oracle 23ai Converged Database using `oracledb`.
- **Efficient Search**: Perform fast vector similarity search operations.

---

## 🐍 Installation

### Clone the Repository
```bash
git clone https://github.com/ericwarriner/Oracle23aiVectorSearch.git
cd VectorSearchDatabasePopulationTool
```

## ⚙️ Prerequisites

Before installing the Python packages, ensure the following system dependencies are in place (especially for `face_recognition` which relies on `dlib`):

### Ubuntu / Debian-based Systems
```bash
sudo apt-get update
sudo apt-get install -y build-essential cmake
sudo apt-get install -y libopenblas-dev liblapack-dev
sudo apt-get install -y libx11-dev libgtk-3-dev
```

## 📦 Dependencies

The following Python packages are required:

- `numpy`
- `face_recognition`
- `datasets` (from Hugging Face)
- `oracledb`
- `pandas`

These can be installed from the `requirements.txt` file.
```bash
pip install -r requirements.txt
```
---

### Oracle Client (Optional for `oracledb` Thick Mode)
If you're using **thick mode** with `oracledb`, you'll need Oracle Instant Client libraries. See the [Oracle Installation Guide](https://www.oracle.com/database/technologies/instant-client/downloads.html) for more details.

---

### Add .env file

For **Linux/macOS**, run:
```bash
touch .env
```
For **Windows**, run:
```bash
type nul > .env
```
For **Windows PowerShell**, run:
```bash
New-Item -Path .env -ItemType File
```

---

## 📂 Project Structure

```
.
├── README.md
├── requirements.txt
├── face.py

```

---

## 🏃‍♂️ Usage

1. Ensure that the environment variables is set. This points to the Oracle 23ai database component responsible for vector encoding.


```bash
DB_USERNAME=""
DB_PASSWORD=""
DB_DSN=""

```

For example:

```bash
DB_USERNAME=oracle23ai_db_user
DB_PASSWORD=password
DB_DSN=129.153.38.218/freepdb1

```


2. Run the main script:

```bash
python face.py
```


3. Running the main script will iterate through approx. 100,000 images. You may stop the script short if you do not require that many images for demonstration purposes.

---

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
