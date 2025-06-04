import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def build_model(input_shape, num_classes=None):
    """
    Builds a tensorflow / keras model

    args:
        input_shape: tuple representing the shape of the input data for mnist.
        num_classes: optional integer, the number of output classes for classification tasks.
    
    Returns:
        A Tensorflow/keras model    

    """

    input = keras.Input(shape=input_shape)

    # example layers (customize)
    x = layers.Conv2D(32, 3, activation="relu")(inputs)
    x = layers.MaxPooling2D(2)(x) 
    x = layers.Conv2D(64, 3, activation="relu")(x)
    x = layers.MaxPooling2D(2)(x)
    x = layers.Flatten()(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.5)(x)  # add dropout for regularization

if num_classes: # classification model
    outputs = layers.Dense(num_classes, activation="softmax")(x) # multiclass
    model = keras.Model(inputs, outputs)
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
else: # regression model
    outputs = layers.Dense(1)(x)
    model = keras.Model(inputs, outputs)
    model.compile(optimizer="adam", loss="mse", metrics=["mae"])

return model

# examples usage classifications
input_shape_classification = (28,28,1)
num_classes = 10
model_classification = build_model(input_shape_classification, num_classes)
model_classification.summary()

# examples usage regression
input_shape_regression = (10,)
model_regression = build_model(input_shape_regression)
model_regression.summary()

# example usage, sequential model
def build_sequential_model(input_shape, num_classes=None):
    if num_classes:
        model = keras.Sequential([
            layers.Input(shape=input_shape),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(num_classes, activation="softmax")
        ])

        model.compile(
            optimizer="adam",
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"]
        )

    else:
        model = keras.Sequential([
            layers.Input(shape=input_shape),
            layers.Dense(128, activation="relu"),
            layers.Dropout(0.2),
            layers.Dense(1)
        ])

        model.compile(
            optimizer="adam",
            loss="mse",
            metrics=["mae"]
        )
return model

model_sequential_classification = build_sequential_model(input_shape_classification, num_classes)
model_sequential_classification.summary() 

model_sequential_regression = build_sequential_model(input_shape_regression)
model_sequential_regression.summary()

