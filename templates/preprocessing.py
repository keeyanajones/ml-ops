import pandas as pd
import numpy as np
from sklearn .model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline


def preprocess_data(df, numerical_features, categorical_features, target_column):
    """
    Preprocessing data for machine learning
    Args: 
        de : pandas datafrmae containing the data
        numerical_features : list of numerical column names
        categorical_features : list of categorical column names
        target_column: name of the target column
    Returns:
        Tuple of (X_train, X_test, y_train, y_test)
    """

    y = df[target_column]
    x = df.drop(target_column, axis=1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')), 
        ('scaler', StandardScaler())         
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')), 
        ('onehot', OneHotEncoder(handle_unknown='ignore'))         
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numerical_transformer(numerical_features)), 
        ('cat', categorical_transformer(categorical_features))         
    ])

    X_train_processed = preprocessor.fit_transform(X_train) 
    X_test_processed = preprocessor.transform(X_test) 

    # Handle cases where the output of the columnTransformer is a sparse matrix
    if hasattr(X_train_processed, 'toarray'):
        X_train_processed = X_train_processed.toarray()

    if hasattr(X_test_processed, 'toarray'):
        X_test_processed = X_test_processed.toarray()

    return X_train_processed, X_test_processed, y_train, y_test, preprocessor

def preprocess_dataframe(df, numerical_features, categorical_features):
    """
    Preprocesses the whole dataframe without splitting into train/test.

    Args:
        df: pandas dataframe containing the data
        numerical_features: list of numerical column names
        categorical_features: list of categorical column names

    Returns: 
        The preprocessed pandas dataframe.

    """  
    y = df[target_column]
    x = df.drop(target_column, axis=1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    numerical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')), 
        ('scaler', StandardScaler())         
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')), 
        ('onehot', OneHotEncoder(handle_unknown='ignore'))         
    ])

    preprocessor = ColumnTransformer(transformers=[
        ('num', numerical_transformer(numerical_features)), 
        ('cat', categorical_transformer(categorical_features))         
    ])

    processed_data = preprocessor.fit_transform(df) 

    if hasattr(processed_data, 'toarray'):
        processed_data = processed_data.toarray()

    # create new dataframe with processed data.
feature_names = preprocessor.get_feature_names_out() 
processed_df = pd.DataFrame(preprocess_data, columns=feature_names)

return processed_df, preprocessor

# exmaple usage
data = {
    'numerical1': [1, 2, np.nan, 4, 5],
    'numerical2': [10, 20, 30, 40, 50],
    'categorical1': ['A','B','A', 'C', 'B'],
    'categorical2': ['X', 'Y', 'Z', 'X', np.nan],
    'target': [0, 1, 0, 1, 5]
}

df = pd.DataFrame(data) 

numerical_features = ['numerical1', 'numerical2']
categorical_features = ['categorical1', 'categorical2']
target_column = 'target'

X_train_processed, X_test_processed, y_train, y_test, preprocessor = preprocess_data(df, numerical_features, categorical_features, target_column)

print("X_train_processed shape:" , X_train_processed.shape)
print("X_test_processed shape:" , X_test_processed.shape)

# Example usage preprocess_dataframe
processed_df, preprocessor2 = preprocess_dataframe(df.drop('target', axis=1), numerical_features, categorical_features)
print(processed_df.head())

