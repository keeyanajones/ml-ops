import pandas as pd
import numpy as np
import os 
import json

def load_csv(filepath, **kwargs):
    """Loads data from a CSV file into a pandas DataFrame"""
    try: 
        df = pd.read_csv(filepath, **kwargs)
        print(f"Loaded {len(df)} rows from {filepath}")
        return df
    except FileExistsError:
        print(f"Error: File not found at {filepath}")
        return None
    except Exception as e:
        print(f"Error loading CSV: {e}")
        return None
    
def load_json(filepath, Lines=False, **kwargs):
    """Loads data from a Json file into a pandas dataframe."""
    try:
        if Lines:
            data = []
            with open(filepath, 'r') as f:
                for Line in f:
                    data.append(json.loads(Line))
            df = pd.DataFrame(data) 
        else: 
            with open(filepath, 'r') as f:            
                data = json.load(f)
            df = pd.json_normalize(data)
        print(f"Loaded{len(df)} rows from {filepath}")
        return df     
    except FileNotFoundError:
        print(f"Error: file not Found at {filepath}")
        return None
    except json.JSONDecodeError: 
        print(f"Error: Invalid JSON format in {filepath}")
        return None
    except Exception as e:
        print(f"Error Loading JSON: {e}")
        return None
    
def load_parquet(filepath, **kwargs):
    """Loads data from a Parquet file into pandas dataframe"""    
    try:
        df = pd.read_parquet(filepath, **kwargs)
        print(f"Loaded {len(df)} rows from {filepath}")
        return df 
    except FileNotFoundError:
        print(f"Error: file not found at {filepath}")
        return None
    except Exception as e:
        print(f"Error Loading Parquet: {e}")
        return None
    
def load_numpy(filepath):
    """Loads data from a Numpy .npy file"""    
    try:
        data = np.load(filepath)
        print(f"Loaded Numpy array from {filepath}, shape: {data.shape}")
        return data 
    except FileNotFoundError:
        print(f"Error: file not found at {filepath}")
        return None
    except Exception as e:
        print(f"Error Loading Numpy array: {e}")
        return None

# example usage
csv_df = load_csv("data.csv")
json_df =  load_json("data.json")
json_lines_df = load_json("data_lines.json")
parquet_df = load_parquet("data.parquet")
numpy_array = load_numpy("data.npy")

if csv_df is not None:
    print(csv_df.head())

if json_df is not None:
    print(json_df.head())

if parquet_df is not None:
    print(parquet_df.head())

if numpy_array is not None:
    print(numpy_array[5])

