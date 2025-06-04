import numpy as np 
from sklearn import metrics

def classification_metrics(y_true, y_pred, lables=None, average='binary'):
    """calculates common classifiation metrics."""

    accuracy = metrics.accuracy_score(y_true, y_pred)
    precision = metrics.precision_score(y_true, y_pred, average=average, lables=lables, zero_division=0)
    recall = metrics.recall_score(y_true, y_pred, average=average, labels=lables, zero_division=0)
    f1 = metrics.f1_score(y_true, y_pred, average=average, labels=lables, zero_division=0)
    report = metrics.classification_report(y_true, y_pred, labels=lables, zero_division=0)

    print(f"Accuracy: {accuracy}")
    print(f"Precision: {precision}")
    print(f"Recall: {recall}")
    print(f"f1 Score: {f1}")
    print(f"Classification Report:/n{report}")

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "report": report,
    }

def regression_metrics(y_true, y_pred):
    """calculates common regression metrics"""
    mae = metrics.mean_absolute_error(y_true, y_pred)
    mse = metrics.mean_suared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    r2 = metrics.r2_score(y_true, y_pred)
    explained_variance = metrics.explained_variance_score(y_true, y_pred)

    print(f"MAE: {mae}")
    print(f"MSE: {mse}")
    print(f"RMSE: {rmse}")
    print(f"R2 Score: {r2}")
    print(f"Explained Variance: {explained_variance}")

    return {
        "mae": mae,
        "mse": mse,
        "rmse": rmse,
        "r2": r2,
        "explained variance": explained_variance,
    }   

# example usage classification
y_true_classification = [1, 0, 1, 1, 0]
y_pred_classification = [1, 0, 0, 1, 0]

classification_metrics(y_true_classification, y_pred_classification)

# example usage multiclass
y_true_multiclass = [2, 0, 1, 2, 1, 0]
y_pred_multiclass = [2, 1, 1, 0, 1, 0]

classification_metrics(y_true_multiclass, y_pred_multiclass, average='weighted')

# example usage regression
y_true_regression = [3.0, -0.5, 2.0, 7.8]
y_pred_regression = [2.5, 0.0, 2.1, 7.8]

classification_metrics(y_true_regression, y_pred_regression)




