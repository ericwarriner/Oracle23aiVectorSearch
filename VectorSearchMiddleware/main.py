import os
import io
import numpy as np
import face_recognition
from datasets import load_dataset, load_from_disk
import oracledb
from flask import Flask, request, jsonify
import base64
from PIL import Image
import logging
from dotenv import load_dotenv

load_dotenv()  # load .env file


app = Flask(__name__)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
dsn = os.environ.get("DB_DSN")

    
@app.route('/hello', methods=['GET'])
def hello():
    num_rows = request.args.get('num_rows', default=10, type=int)  # Get num_rows from query parameters, default to 10
    connection = None
    cursor = None
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        sql = f"SELECT id, image_blob FROM images2 FETCH FIRST {num_rows} ROWS ONLY"
        cursor.execute(sql)
        results = cursor.fetchall()
        print(results.count)
        data = []
        for row in results:
            id, image_blob = row
            if image_blob:
                image_base64 = base64.b64encode(image_blob.read()).decode('utf-8')
                data.append({"id": id, "image_base64": image_base64})
            else:
                data.append({"id": id, "image_base64": None})

        return jsonify(data)

    except oracledb.DatabaseError as e:
        print(f"Oracle Database error: {e}")
        return jsonify({"error": f"Database error: {e}"}), 500
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": f"An error occurred: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



@app.route('/encode_face', methods=['POST'])
def encode_face():
    num_rows = request.args.get('num_rows', default=10, type=int)  # Get num_rows from query parameters, default to 10
    tolerance_var = request.args.get('tolerance_var', default=0.1, type=float)  # Get tolerance from query parameters
    min_age_var = request.args.get('min_age', default=20, type=int)  # Get min_age from query parameters
    max_age_var = request.args.get('max_age', default=70, type=int)  # Get max_age from query parameters
    
    connection = None
    cursor = None
    try:
        data = request.get_json()
        image_base64 = data['image_base64']

        # Decode the Base64 image
        image_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(image_data)).convert('RGB')  # convert to RGB
        img_array = np.array(img)

        # Perform face encoding
        encodings = face_recognition.face_encodings(img_array)
        if not encodings:
            #logging.info("No face detected.")
            return jsonify({"message": "No face detected"}), 400

        else:
            encoding = encodings[0]
            query_embedding = encoding.astype(np.float64)  # Convert query_embedding to FLOAT32
            #print(f"Face detected. Embedding vector: {query_embedding[:5]}...")
            #logging.info(f"Face detected. Embedding vector: {query_embedding[:5]}...")

            connection = oracledb.connect(user=username, password=password, dsn=dsn)
            cursor = connection.cursor()

            sql = """
                SELECT
                    id,
                    name,
                    image_blob,
                    VECTOR_DISTANCE(embedding_vector, :query_vector) AS distance
                FROM images3
                WHERE
                    ADD_MONTHS(TO_DATE(birthday, 'DD-MON-RR'), 12 * :min_age) <= SYSDATE   -- at least min_age years old
                    AND ADD_MONTHS(TO_DATE(birthday, 'DD-MON-RR'), 12 * :max_age) >= SYSDATE  -- at most max_age years old
                    AND VECTOR_DISTANCE(embedding_vector, :query_vector) < :tolerance
                ORDER BY VECTOR_DISTANCE(embedding_vector, :query_vector) ASC
            """

            vector_var = cursor.var(oracledb.DB_TYPE_VECTOR)
            vector_var.setvalue(0, query_embedding.tolist())

         
            cursor.execute(sql, query_vector=vector_var, tolerance=tolerance_var, min_age=min_age_var, max_age=max_age_var)  # Pass vector_var as bind variable
            results = cursor.fetchmany(num_rows)
            #logging.info(f"RESULT OF QUERY: {results[:5]}...")
            #logging.info(f"min_age: {min_age_var}...")

            data = []
            for result in results:  # Iterate through the results
                id, name, image_blob, distance = result  # Unpack each result
                if image_blob:
                    image_base64 = base64.b64encode(image_blob.read()).decode('utf-8')  # Encode blob to base64
                    data.append({"id": id, "name": name, "image_base64": image_base64, "distance": distance})
                else:
                    data.append({"id": id, "name": name, "image_base64": None, "distance": distance})

            return jsonify(data)

    except oracledb.DatabaseError as e:
        logging.info(f"In encodeface. Database error: {str(e)}")
        return jsonify({"error": f"Database error: {e}"}), 500
    except Exception as e:
        logging.info(f"In encodeface. Middleware Encoding error: {str(e)}")
        return jsonify({"error": f"Middleware Encoding error: {e}"}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))