import os
import io
import numpy as np
import face_recognition
from datasets import load_dataset, load_from_disk
import oracledb
from datetime import datetime
from dotenv import load_dotenv


load_dotenv()  # load .env file

# Set a path for the cached dataset
dataset_path = "cached_tmdb_people_image"
username = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
dsn = os.environ.get("DB_DSN")




# Check if the dataset is already saved locally
if os.path.exists(dataset_path):
    people = load_from_disk(dataset_path)
else:
    people = load_dataset("ashraq/tmdb-people-image", split='train')
    people.save_to_disk(dataset_path)



def create_table_if_not_exists():
    """Creates the images3 table if it does not exist."""
    connection = None
    cursor = None
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        cursor.execute("""
            BEGIN
                EXECUTE IMMEDIATE '
                    CREATE TABLE images3 (
                        id NUMBER,
                        image_blob BLOB,
                        embedding_vector VECTOR(128),
                        name VARCHAR2(255),
                        place_of_birth VARCHAR2(255),
                        popularity NUMBER,
                        gender NUMBER,
                        biography CLOB,
                        birthday DATE
                    )
                ';
                EXCEPTION
                    WHEN OTHERS THEN
                        IF SQLCODE != -955 THEN
                            RAISE;
                        END IF;
            END;
        """)
        connection.commit()
        print("Table images3 created (if it didn't exist).")

    except oracledb.DatabaseError as e:
        print(f"Oracle Database error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def insert_image_and_vector(image_id, person):
    """Inserts an image and its vector (either from image or text) into the database."""
    connection = None
    cursor = None
    try:
        connection = oracledb.connect(user=username, password=password, dsn=dsn)
        cursor = connection.cursor()

        if person is not None:
            # --- Image Processing and Embedding ---
            try:
                img_array = np.array(person['image'])
                encodings = face_recognition.face_encodings(img_array)
                name = person['name']
                place_of_birth = person['place_of_birth']
                popularity = person['popularity']
                gender = person['gender']
                birthday = person['birthday']
                biography = person['biography']

                if not encodings:
                    print(f"No face detected. Storing image without vector.")
                    embedding_vector = None
                else:
                    encoding = encodings[0]
                    embedding_vector = encoding.tolist()
                    print("Face detected.")

                # Convert image to BLOB
                with io.BytesIO() as output:
                    person['image'].save(output, format="PNG")
                    blob_data = output.getvalue()

            except Exception as e:
                print(f"Error processing image {person}: {e}")
                return

        else:
            print("Error: Either image_path or text_content must be provided.")
            return

        # --- Database Insertion ---
        vector_var = cursor.var(oracledb.DB_TYPE_VECTOR)
        if embedding_vector:
            vector_var.setvalue(0, embedding_vector)
        else:
            vector_var.setvalue(0, None)

        blob_var = cursor.var(oracledb.BLOB)
        if blob_data:
            blob_var.setvalue(0, blob_data)
        else:
            blob_var.setvalue(0, None)

        # Convert birthday to a datetime object if it's not None
        if birthday:
            try:
                birthday = datetime.strptime(birthday, '%Y-%m-%d')  # Adjust format as needed
            except ValueError:
                print(f"Invalid date format: {birthday}. Setting to None.")
                birthday = None

        cursor.execute("""
            INSERT INTO images3 (id, image_blob, embedding_vector, name, place_of_birth, popularity, gender, biography, birthday)
            VALUES (:id, :image_blob, :embedding_vector, :name, :place_of_birth, :popularity, :gender, :biography, :birthday)
        """, {'id': image_id, 'image_blob': blob_var, 'embedding_vector': vector_var, 'name': name, 'place_of_birth': place_of_birth, 'popularity': popularity, 'gender': gender, 'biography': biography, 'birthday': birthday})

        connection.commit()
        print("Data inserted successfully.")

    except oracledb.DatabaseError as e:
        print(f"Oracle Database error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# Create the table if it doesn't exist
create_table_if_not_exists()


# Iterate through each person in the dataset
for idx, person in enumerate(people):
    insert_image_and_vector(idx, person)

print("Image and embedding vector inserted successfully.")




