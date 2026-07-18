from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# --------------------------
# Dummy Data (Replace with Database Later)
# --------------------------

# Dashboard Metrics
DASHBOARD_METRICS = {
    "totalCrimes": 1240,
    "activeCases": 350,
    "solvedCases": 890,
    "crimeRate": "24%"
}

# Dashboard Analytics
DASHBOARD_ANALYTICS = {
    "mostCommonCrime": "Theft",
    "highestRiskArea": "Hyderabad",
    "crimeGrowth": "+12%"
}

# Crime Trend Chart
CRIME_TRENDS = {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    "data": [120, 135, 150, 160, 175, 190, 210, 200]
}

# Crime Category Chart
CRIME_CATEGORIES = {
    "labels": ["Theft", "Cyber Crime", "Fraud", "Assault"],
    "data": [480, 260, 210, 290]
}

# Crime Locations
CRIME_LOCATIONS = [
    {
        "place": "Hyderabad",
        "crime": "Theft",
        "lat": 17.3850,
        "lng": 78.4867
    },
    {
        "place": "Mumbai",
        "crime": "Fraud",
        "lat": 19.0760,
        "lng": 72.8777
    },
    {
        "place": "Delhi",
        "crime": "Assault",
        "lat": 28.6139,
        "lng": 77.2090
    },
    {
        "place": "Bengaluru",
        "crime": "Cyber Crime",
        "lat": 12.9716,
        "lng": 77.5946
    }
]

# Crime Reports
CRIME_REPORTS = [
    {
        "id": 1001,
        "type": "Theft",
        "location": "Hyderabad",
        "status": "Solved"
    },
    {
        "id": 1002,
        "type": "Cyber Crime",
        "location": "Bengaluru",
        "status": "Pending"
    },
    {
        "id": 1003,
        "type": "Fraud",
        "location": "Mumbai",
        "status": "Solved"
    },
    {
        "id": 1004,
        "type": "Assault",
        "location": "Delhi",
        "status": "Pending"
    },
    {
        "id": 1005,
        "type": "Theft",
        "location": "Hyderabad",
        "status": "Pending"
    }
]

# --------------------------
# Home Route
# --------------------------

@app.route("/")
def home():
    return jsonify({
        "message": "CrimeAI Backend Running Successfully"
    })

# --------------------------
# Dashboard Summary API
# --------------------------

@app.route("/api/dashboard-summary", methods=["GET"])
def dashboard_summary():
    return jsonify({
        "metrics": DASHBOARD_METRICS,
        "analytics": DASHBOARD_ANALYTICS
    })

# --------------------------
# Chart Data API
# --------------------------

@app.route("/api/chart-trends", methods=["GET"])
def chart_trends():
    return jsonify({
        "trends": CRIME_TRENDS,
        "categories": CRIME_CATEGORIES
    })

# --------------------------
# Crime Locations API
# --------------------------

@app.route("/api/locations", methods=["GET"])
def locations():
    return jsonify(CRIME_LOCATIONS)

# --------------------------
# Reports API
# --------------------------

@app.route("/api/reports", methods=["GET"])
def reports():
    return jsonify(CRIME_REPORTS)

# --------------------------
# AI Prediction API
# --------------------------

@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Invalid JSON"
        }), 400

    location = data.get("location", "").strip()
    crime_type = data.get("crimeType", "").strip()

    if location == "" or crime_type == "":
        return jsonify({
            "error": "Location and Crime Type are required"
        }), 400

    location_lower = location.lower()
    crime_lower = crime_type.lower()

    # Simple prediction logic
    if location_lower == "hyderabad" and crime_lower in ["theft", "cyber crime"]:
        risk = "High"

    elif location_lower in [
        "mumbai",
        "delhi",
        "bengaluru",
        "chennai"
    ]:
        risk = "Medium"

    else:
        risk = "Low"

    return jsonify({
        "location": location,
        "crimeType": crime_type,
        "riskLevel": risk
    })

# --------------------------
# Health Check
# --------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is running"
    })

# --------------------------
# Run Application
# --------------------------

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)