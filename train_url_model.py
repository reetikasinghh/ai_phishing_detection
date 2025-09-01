import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib

# Load and preprocess first dataset
df1 = pd.read_csv("phishing_site_urls.csv")
df1 = df1.rename(columns={'URL': 'url', 'Label': 'label'})
df1['label'] = df1['label'].apply(lambda x: 1 if x == 'phishing' or x == 1 else 0)

# Load and preprocess second dataset
df2 = pd.read_csv("malicious_phish.csv")
df2 = df2.rename(columns={'type': 'label'})
df2['label'] = df2['label'].apply(lambda x: 1 if x == 'phishing' else 0)

# Combine datasets
df = pd.concat([df1[['url', 'label']], df2[['url', 'label']]], ignore_index=True)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(df['url'], df['label'], test_size=0.2, random_state=42)

# Build pipeline
pipeline = Pipeline([
    ('vectorizer', CountVectorizer()),
    ('classifier', LogisticRegression(max_iter=1000))
])

# Train model
pipeline.fit(X_train, y_train)

# Save full pipeline
joblib.dump(pipeline, "phishing_model_lr.pkl")

print("✅ Model trained and saved as 'phishing_model_lr.pkl'")
