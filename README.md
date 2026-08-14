# Mental Health Score Predictor

An end-to-end Machine Learning web application that predicts a **mental health score** from user-provided features. The project compares Linear Regression, Random Forest Regression, and a hyperparameter-tuned Random Forest model, with a production-style preprocessing and inference workflow using Scikit-learn Pipelines, ColumnTransformer, FastAPI, and a web frontend.

> **Note:** This project is intended for educational and predictive modeling purposes only. The predicted score should not be treated as a medical diagnosis or professional mental-health assessment.

## 🚀 Project Overview

The goal of this project is to build a reliable regression-based prediction system while following good machine-learning practices.

The project includes:

- Linear Regression as a baseline model
- Random Forest Regression
- Hyperparameter-tuned Random Forest using `RandomizedSearchCV`
- `Pipeline` for combining preprocessing and model training
- `ColumnTransformer` for handling different feature types
- Train/test separation to keep evaluation data unseen during model fitting
- Cross-validation for hyperparameter search
- Evaluation using R², MAE, and RMSE
- FastAPI REST API for model inference
- HTML, CSS, and JavaScript frontend

## 🧠 Machine Learning Workflow

```text
User Input
    ↓
Frontend (HTML / CSS / JavaScript)
    ↓
FastAPI
    ↓
Preprocessing Pipeline
    ↓
ColumnTransformer
    ↓
Trained ML Model
    ↓
Predicted Mental Health Score
    ↓
Frontend Response
```

### Data Leakage Prevention

A key part of the project is the use of a Scikit-learn `Pipeline` together with `ColumnTransformer`.

Instead of preprocessing the complete dataset before splitting it, preprocessing steps are included in the training pipeline. During model fitting, transformations are learned from the training data and subsequently applied to unseen test data.

This helps prevent information from the test set from influencing the preprocessing or model training process and makes the evaluation more representative of how the model performs on unseen data.

The same fitted preprocessing workflow is also reused during inference, helping ensure that data is transformed consistently.

## 🔬 Models Used

### 1. Linear Regression

Used as a baseline regression model to establish a simple reference point for model performance.

### 2. Random Forest Regression

A tree-based ensemble model used to capture nonlinear relationships between input features and the target mental health score.

### 3. Tuned Random Forest

`RandomizedSearchCV` with cross-validation was used to search through different Random Forest hyperparameter combinations and identify a suitable configuration.

An important result from the experiment is that the tuned model did not outperform the default Random Forest on the held-out test set. This demonstrates why model selection should be based on validation/test performance rather than assuming that hyperparameter tuning will always improve results.

## 📊 Model Performance

| Model | Test R² | Training R² | MAE | RMSE |
|---|---:|---:|---:|---:|
| Linear Regression | 0.740 | 0.724 | 0.537 | 0.677 |
| Random Forest | **0.877** | 0.981 | **0.349** | **0.467** |
| Random Forest (Tuned) | 0.865 | 0.955 | 0.367 | 0.487 |

### Evaluation Metrics

- **R²:** Measures how much of the variance in the target is explained by the model. Higher is generally better.
- **MAE:** Mean Absolute Error. Lower values indicate smaller average prediction errors.
- **RMSE:** Root Mean Squared Error. Lower values indicate better prediction performance and give greater weight to larger errors.

Based on the current results, the **default Random Forest** achieved the strongest held-out test performance among the evaluated models, with a test R² of approximately **0.877**.

## 🛠️ Tech Stack

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Linear Regression
- Random Forest Regression
- RandomizedSearchCV
- Cross-Validation
- Pipeline
- ColumnTransformer

### Backend
- FastAPI
- Uvicorn
- REST API

### Frontend
- HTML
- CSS
- JavaScript

## 📁 Project Structure

```text
mental-health-score-predictor/
│
├── data/
│   └── dataset.csv
│
├── models/
│   └── trained_model.pkl
│
├── notebooks/
│   └── model_training.ipynb
│
├── app/
│   ├── main.py
│   └── ...
│
├── static/
│   ├── css/
│   └── js/
│
├── templates/
│   └── index.html
│
├── requirements.txt
├── README.md
└── ...
```

> Update the folder names above to match the exact structure of your repository.

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mental-health-score-predictor.git
cd mental-health-score-predictor
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## ▶️ Running the Application

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Then open the local application in your browser.

The FastAPI interactive API documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

> Adjust the command if your FastAPI entry-point file or application variable has a different name.

## 🔌 API

The backend exposes an endpoint that accepts the required user features and returns a predicted mental health score.

Example response:

```json
{
  "predicted_score": 0.00
}
```

Update the endpoint and response format in this section to match your implementation.

## 🔐 ML Best Practices Used

- Separate training and testing data
- Pipeline-based preprocessing
- ColumnTransformer for column-specific transformations
- Cross-validation during hyperparameter search
- Randomized hyperparameter search
- Evaluation on held-out test data
- Consistent preprocessing during inference
- Comparison of baseline and ensemble models

## 📌 Key Learning Outcomes

Through this project, I worked with:

1. End-to-end regression model development
2. Data preprocessing and feature transformation
3. Scikit-learn Pipelines
4. ColumnTransformer
5. Data leakage prevention
6. Random Forest regression
7. Hyperparameter tuning with RandomizedSearchCV
8. Cross-validation
9. Regression evaluation metrics
10. FastAPI model deployment
11. Frontend-to-ML API integration

## 🔮 Future Improvements

- Add more diverse and validated datasets
- Perform additional feature engineering
- Add model explainability using SHAP or similar techniques
- Add input validation and error handling
- Containerize the application using Docker
- Deploy the FastAPI service to a cloud platform
- Add automated testing and CI/CD
- Monitor model performance after deployment

## ⚠️ Disclaimer

This application is a machine-learning project for educational and demonstration purposes. It does not provide medical advice, diagnosis, or treatment recommendations. Mental health assessment should be performed by qualified professionals using appropriate clinical methods.

## 👨‍💻 Author

**Devansh Sharma**

If you found this project useful, consider giving the repository a ⭐.
