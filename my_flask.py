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