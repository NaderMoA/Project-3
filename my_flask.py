from flask import Flask, render_template, jsonify
#from flask_pymongo import PyMongo
from pymongo import MongoClient
from pprint import pprint

app = Flask(__name__)

# Set your MongoDB URI here directly or retrieve it from environment variables
# Replace 'your_username', 'your_password', and 'your_database' with your actual credentials
mongo_uri = 'mongodb+srv://2012ca:2012ca@cluster0.6ajjgta.mongodb.net/'

# app.config["MONGO_URI"] = mongo_uri
mongo = MongoClient(mongo_uri)
print(mongo.list_database_names())
#db = mongo["Cancerproject3"]
#print(db.list_collection_names())

# Define endpoint to render the HTML template
@app.route('/')
def welcome():
    return render_template('welcome_page_index.html')

@app.route('/Europe')
def index():
    return render_template('Eu_index.html')

# Define endpoint to fetch data from MongoDB and return as JSON
@app.route('/EuropeMale')
def get_MaleEuMp():
    db = mongo["Cancerproject3"]
    common_cancers_male_collection = db["EU_male_map"]
    
    male_documents = list(common_cancers_male_collection.find({}, {'_id': 0}))  # Excludes the _id field
    
    
    return jsonify(male_documents)
        
@app.route('/EuropeFemale')   
def get_FemaleEuMap():
    db = mongo["Cancerproject3"]
    common_cancers_female_collection = db["EU_female_map"]
    female_documents = list(common_cancers_female_collection.find({}, {'_id': 0}))
    return jsonify(female_documents)

@app.route('/Europe2')
def get_EuDeath():
    db = mongo["Cancerproject3"]
    Eu_death = db["case_death"]
    Eu_death_case_data = list(Eu_death.find({}, {'_id': 0}))  # Excludes the _id field
    
    
    return jsonify(Eu_death_case_data)
@app.route('/Europe3')
def get_Eucase():
    db = mongo["Cancerproject3"]
    Eu_case= db["case_death"]
    Eu_case_data = list(Eu_case.find({}, {'_id': 0}))  # Excludes the _id field

    return jsonify(Eu_case_data)

@app.route('/Europerisk')
def get_Eurisk():
    db = mongo["Cancerproject3"]
    Eu_risk= db["new_eu_lifetime"]
    Eu_risk_data = list(Eu_risk.find({}, {'_id': 0}))  # Excludes the _id field

    return jsonify(Eu_risk_data)


@app.route('/Northamerica')
def Naindex():
    return render_template('North_America_index.html')

@app.route('/Northamericacase')
def Nacase():
    db = mongo["Northamerica"]
    na_vase_death_data = db["case_death"]
    Na_case_death = list(na_vase_death_data.find({}, {'_id': 0}))
    return jsonify(Na_case_death) 
 
@app.route('/Northamericadeath')
def Nadeath():
    db = mongo["Northamerica"]
    na_vase_death_data = db["case_death"]
    Na_case_death = list(na_vase_death_data.find({}, {'_id': 0}))
    return jsonify(Na_case_death)  
@app.route('/Northamericamap')
def Namap():
    db = mongo["Northamerica"]
    na_map_data = db["us_rate"]
    Na_map = list(na_map_data.find({}, {'_id': 0}))
    return jsonify(Na_map)

@app.route('/Northamericalung')
def Nalung():
    db = mongo["Northamerica"]
    na_lung_data = db["full_lung_trend"]
    Na_lung = list(na_lung_data.find({}, {'_id': 0}))
    return jsonify(Na_lung)

@app.route('/Latin')
def indexlatin():
    return render_template('Latin_america_index.html')

@app.route('/Latinmap')
def latmap():
    db = mongo["Latin"]
    lat_map_data = db["latin_map"]
    Na_map = list(lat_map_data.find({}, {'_id': 0}))
    return (Na_map)
@app.route('/Latindeath')
def latdeath():
    db = mongo["Latin"]
    lat_death_data = db["latin_death"]
    lat_death = list(lat_death_data.find({}, {'_id': 0}))
    return jsonify(lat_death)
@app.route('/Latincase')
def latcase():
    db = mongo["Latin"]
    lat_case_data = db["Latin_death_case"]
    lat_case = list(lat_case_data.find({}, {'_id': 0}))
    return jsonify(lat_case)

@app.route('/Latinincidents')
def latincidents():
    db = mongo["Latin"]
    lat_incident_data = db["Latin_incidents"]
    lat_incident = list(lat_incident_data.find({}, {'_id': 0}))
    return jsonify(lat_incident)


@app.route('/Cancer')
def canndex():
    return render_template('top_ten_index.html')
 
@app.route('/Cancertop')
def topten():
    db = mongo["top_ten_database"]
    top_ten = db["test2"]
    top_ten_data = list(top_ten.find({}, {'_id': 0}))
    return jsonify(top_ten_data)


if __name__ == '__main__':
    app.run(debug=True)