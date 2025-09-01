AI Phishing Detection System
This project detects phishing emails using AI and machine learning. It classifies emails as Phishing or Legitimate to help improve cybersecurity awareness.
Features: Detect phishing emails automatically, supports CSV datasets for training and testing, shows accuracy metrics and predictions, easy-to-use for experimentation and demonstration.

Technologies Used: Python, Pandas, NumPy, Scikit-learn, TensorFlow/Keras (if using deep learning), Git & GitHub.

Dataset: Contains emails labeled as phishing or legitimate. File used: compressed_data.csv.gz. Source: Kaggle / collected email samples.

Installation: Clone the repository git clone https://github.com/reetikasinghh/ai_phishing_detection.git. Navigate to the project directory cd ai_phishing_detection. Create and activate a virtual environment python3 -m venv venv and source venv/bin/activate (Mac/Linux) or venv\Scripts\activate (Windows). Install required packages with pip install -r requirements.txt.

Usage: Train the AI model using python train_model.py. Test new emails using python predict_email.py. The system will classify emails as Phishing or Legitimate.

Project Structure: compressed_data.csv.gz (Dataset), train_model.py (Training script), predict_email.py (Prediction script), README.md (Documentation), requirements.txt (Dependencies), utils/ (Helper functions).

Results: Accuracy: XX% (replace with your model’s result). Confusion matrix and metrics like precision, recall, and F1-score are included.

Future Work: Implement deep learning models (LSTM, CNN, BERT) for better accuracy, deploy as a web application for real-time detection, integrate with email clients for automatic phishing detection.

References: Kaggle datasets for phishing emails, Scikit-learn documentation, TensorFlow/Keras documentation.
Author: Reetika Singh – GitHub: reetikasinghh, College Project: AI & Cybersecurity.


