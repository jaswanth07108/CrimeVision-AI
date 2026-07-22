from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# Allow frontend connection
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
class Crime(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    crime_type = db.Column(db.String(100), nullable=False)

    location = db.Column(db.String(100), nullable=False)

    status = db.Column(db.String(30), nullable=False)



# =====================================
# SAMPLE CRIME DATA
# =====================================


DASHBOARD_METRICS = {

    "totalCrimes": 1240,
    "activeCases": 350,
    "solvedCases": 890,
    "crimeRate": "24%"

}



DASHBOARD_ANALYTICS = {

    "mostCommonCrime": "Theft",
    "highestRiskArea": "Hyderabad",
    "crimeGrowth": "+12%"

}



CRIME_TRENDS = {

    "labels":[
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug"
    ],

    "data":[
        120,
        135,
        150,
        160,
        175,
        190,
        210,
        200
    ]

}




CRIME_CATEGORIES = {

    "labels":[
        "Theft",
        "Cyber Crime",
        "Fraud",
        "Assault"
    ],

    "data":[
        480,
        260,
        210,
        290
    ]

}







# Crime map locations

CRIME_LOCATIONS = [

    {
        "place":"Hyderabad",
        "crime":"Theft",
        "lat":17.3850,
        "lng":78.4867
    },


    {
        "place":"Mumbai",
        "crime":"Fraud",
        "lat":19.0760,
        "lng":72.8777
    },


    {
        "place":"Delhi",
        "crime":"Assault",
        "lat":28.6139,
        "lng":77.2090
    },


    {
        "place":"Bengaluru",
        "crime":"Cyber Crime",
        "lat":12.9716,
        "lng":77.5946
    }

]






# Crime reports

CRIME_REPORTS = [

    {
        "id":1001,
        "type":"Theft",
        "location":"Hyderabad",
        "status":"Solved"
    },


    {
        "id":1002,
        "type":"Cyber Crime",
        "location":"Bengaluru",
        "status":"Pending"
    },


    {
        "id":1003,
        "type":"Fraud",
        "location":"Mumbai",
        "status":"Solved"
    },


    {
        "id":1004,
        "type":"Assault",
        "location":"Delhi",
        "status":"Pending"
    },


    {
        "id":1005,
        "type":"Theft",
        "location":"Hyderabad",
        "status":"Pending"
    }

]
@app.route("/api/add-crime", methods=["POST"])

def add_crime():

    data = request.get_json()

    crime = Crime(
        crime_type=data["crime_type"],
        location=data["location"],
        status=data["status"]
    )

    db.session.add(crime)
    db.session.commit()

    return jsonify({
        "message": "Crime Added Successfully"
    })
@app.route("/api/all-crimes")
def all_crimes():

    crimes = Crime.query.all()

    result = []

    for c in crimes:

        result.append({

            "id": c.id,
            "crime_type": c.crime_type,
            "location": c.location,
            "status": c.status

        })

    return jsonify(result)








# =====================================
# HOME API
# =====================================


@app.route("/")
def home():

    return jsonify({

        "message":
        "CrimeAI Backend Running Successfully"

    })








# =====================================
# DASHBOARD API
# =====================================


@app.route("/api/dashboard-summary")

def dashboard_summary():

    return jsonify({

        "metrics":DASHBOARD_METRICS,

        "analytics":DASHBOARD_ANALYTICS

    })









# =====================================
# CHART API
# =====================================


@app.route("/api/chart-trends")

def chart_trends():

    return jsonify({

        "trends":CRIME_TRENDS,

        "categories":CRIME_CATEGORIES

    })









# =====================================
# MAP API
# =====================================


@app.route("/api/locations")

def locations():

    return jsonify(CRIME_LOCATIONS)









# =====================================
# REPORT API
# =====================================


@app.route("/api/reports")

def reports():

    return jsonify(CRIME_REPORTS)









# =====================================
# AI PREDICTION API
# =====================================


@app.route("/api/predict", methods=["POST"])

def predict():


    data = request.get_json()



    if not data:

        return jsonify({

            "error":"Invalid request"

        }),400





    location = data.get(
        "location",
        ""
    ).strip()



    crime_type = data.get(
        "crimeType",
        ""
    ).strip()





    if location=="" or crime_type=="":

        return jsonify({

            "error":
            "Location and Crime Type required"

        }),400







    location = location.lower()

    crime_type = crime_type.lower()






    # AI prediction logic

    if location=="hyderabad" and crime_type in [

        "theft",
        "cyber crime"

    ]:

        risk="High"



    elif location in [

        "mumbai",
        "delhi",
        "bengaluru",
        "chennai"

    ]:

        risk="Medium"



    else:

        risk="Low"







    return jsonify({

        "location":location.title(),

        "crimeType":crime_type.title(),

        "riskLevel":risk

    })









# =====================================
# HEALTH CHECK
# =====================================

@app.route("/api/health")
def health():
    return jsonify({
        "status": "success",
        "message": "Server is running"
    })








# =====================================
# START SERVER
# =====================================
# =====================================
# UPDATE CRIME
# =====================================

@app.route("/api/update-crime/<int:id>", methods=["PUT"])
def update_crime(id):

    crime = Crime.query.get(id)

    if crime is None:
        return jsonify({"message": "Crime not found"}), 404

    data = request.get_json()

    crime.crime_type = data["crime_type"]
    crime.location = data["location"]
    crime.status = data["status"]

    db.session.commit()

    return jsonify({"message": "Crime Updated Successfully"})


# =====================================
# DELETE CRIME
# =====================================

@app.route("/api/delete-crime/<int:id>", methods=["DELETE"])
def delete_crime(id):

    crime = Crime.query.get(id)

    if crime is None:
        return jsonify({"message": "Crime not found"}), 404

    db.session.delete(crime)
    db.session.commit()

    return jsonify({"message": "Crime Deleted Successfully"})

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )




