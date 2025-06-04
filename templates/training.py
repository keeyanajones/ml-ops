import tensorflow as tf
import numpy as np
import time
import logging
import os
import schedule

# configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Training Script Boilerplate (TensorFlow/Keras) ---
def train_model(model, train_data, val_data, epochs=10, batch_size=32):
    """Train a tensorflow model""" 
    try: 
        logging.info(f"Starting Model Training...")
        history = model.fit(
            train_data, 
            validation_data=val_data,
            epochs=epochs,
            batch_size=batch_size,
        )
        logging.info(f"Model Training Completed.")
        return history

    except Exception as e:
        logging.ERROR(f"Model Training Failed: {e}")
        return None
    
    # Example Usage 
    def example_training():
        (x_train, y_train), (x_val, y_val) = tf.keras.datasets.mnist.load_data()
        x_train = np.expand_dims(x_train, -1).astype("float32")/255.0
        x_val = np.expand_dims(x_val, -1).astype("float32")/255.0
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, 3, activation='relu', input_shape=(28, 28, 1)),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(10, activation='softmax')
        ])

        model.compile(optimizer="adam", loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        train_model(model, (x_train, y_train), (x_val, y_val))

# --- Looping Boilerplate ---
def process_data_in_chunks(data, chunk_size=1000):
    """ Processes data in chunks to handle large datasets. """
    try: 
        logging.INFO(f"Processing data in chunks of size {chunk_size}...")
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i + chunk_size]
            # add chunk processing logic
            logging.info(f"Processed chunk {i // chunk_size + 1}")
        logging.info(f"Data Processing Completed")
    except Exception as e:
        logging.error(f"Data Processing Failed: {e}")

# example usage
def example_loop():
    data = list(range(10000))
    process_data_in_chunks(data)

# --- Scheduled Job Boilerplate ---    
def scheduled_job():
    """Example scheduled job."""
    logging.info("Running Scheduled Job...")
    try:
        # add job logic
        logging.info("Scheduled Job Completed")
    except Exception as e:
        logging.error(f"Scheduled Job Failed: {e}") 

def run_scheduled_jobs():
    """Example runs scheduled jobs."""
    schedule.every(10).seconds.do(scheduled_job)
    logging.info("Scheduled Job Runner Started.")

    while True: 
        schedule.run_pending()
        time.sleep(1)

# example usage
def example_scheduled():
    import threading
    import schedule 
    thread = threading.Thread(target=run_scheduled_jobs)
    thread.start()
    time.sleep(15)
    logging.info("Scheduled Job Thread Exiting")


# --- Main ---
if __name__ == "__main__":
    example_training()
    example_loop()
    example_scheduled()
