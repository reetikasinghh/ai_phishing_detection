from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import joblib
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

# Load models (pipelines)
email_model = joblib.load("email_model.pkl")          # Full pipeline
url_model = joblib.load("phishing_model_lr.pkl")      # Full pipeline

# ✅ Safe URL cleaner
def clean_url(url):
    try:
        parsed = urlparse(url.strip())
        return parsed.netloc + parsed.path
    except Exception:
        return ""  # Return empty string for invalid URLs

# ✅ Heuristic override logic
def is_auto_generated_email(text):
    text = text.lower()
    keywords = [
        "do not reply", "automated message", "this is an auto-generated email",
        "dear customer", "thank you for using", "your transaction id is",
        "upi debit alert", "download now", "payment received",
        "anaconda distribution", "login from new device"
    ]
    matches = [kw for kw in keywords if kw in text]
    return len(matches) >= 2

def combined_detector_verbose(email_text, email_thresh=0.90, url_thresh=0.20):
    suspicious_words = []
    detected_urls = []
    highlighted_email = email_text

    # Highlight suspicious words
    for word in ['urgent', 'account', 'verify', 'login', 'password', 'click here']:
        pattern = re.compile(rf"\b{re.escape(word)}\b", re.IGNORECASE)
        if re.search(pattern, email_text):
            suspicious_words.append(word)
            highlighted_email = pattern.sub(r"<mark>\g<0></mark>", highlighted_email)

    # Email phishing score
    email_prob = email_model.predict_proba([email_text])[0][1]
    email_percent = round(email_prob * 100, 2)
    is_email_phish = email_prob > email_thresh

    # URL analysis
    urls = re.findall(r'(https?://[^\s]+)', email_text)
    url_scores = []

    for url in urls:
        cleaned = clean_url(url)
        score = url_model.predict_proba([cleaned])[0][1]
        percent = round(score * 100, 2)

        # Highlight suspicious words inside URL itself
        for word in suspicious_words:
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            if re.search(pattern, url):
                highlighted = pattern.sub(r"<mark>\g<0></mark>", url)
                highlighted_email = highlighted_email.replace(url, highlighted)

        url_scores.append({'url': url.strip(), 'score': percent})
        if score > url_thresh:
            detected_urls.append(url.strip())

    # ✅ Heuristic override logic
    heuristic_flag = is_auto_generated_email(email_text)

    # ✅ Override phishing result
    if heuristic_flag:
        phishing = False
    else:
        phishing = (is_email_phish or len(detected_urls) > 0)

    # ✅ Generate summary
    summary = (
        f"🧠 Email Phishing Possibility: {email_percent:.1f}% (Threshold: {email_thresh*100:.0f}%) {'🚩' if is_email_phish else '✅'}\n" +
        "\n".join([
            f"🌐 URL: {u['url']} → Phishing Possibility: {u['score']}% (Threshold: {url_thresh*100:.0f}%) {'🚩' if u['score'] > url_thresh*100 else '✅'}"
            for u in url_scores
        ]) + f"\n🔍 FINAL RESULT: {'SAFE ✅ (Heuristic Override)' if heuristic_flag else 'PHISHING 🚫' if phishing else 'SAFE ✅'}"
    )

    return {
        'phishing': bool(phishing),
        'email_score': float(email_percent),
        'suspicious_words': suspicious_words,
        'highlighted_email': highlighted_email,
        'url_scores': url_scores,
        'flagged_urls': detected_urls,
        'summary': summary
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    email_text = data.get("email", "")
    result = combined_detector_verbose(email_text)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

