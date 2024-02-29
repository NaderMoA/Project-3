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

# Define endpoint to render the HTML template
@app.route('/')
def index():
    return render_template('top_ten_index.html')

# Define endpoint to fetch data from MongoDB and return as JSON
@app.route('/Male')
def get_MaleEuMp():
    db = mongo["EU"]
    common_cancers_male_collection = db["common_cancers_male"]
    
    male_documents = list(common_cancers_male_collection.find({}, {'_id': 0}))  # Excludes the _id field
    
    
    return jsonify(male_documents)
        
@app.route('/Female')   
def get_FemaleEuMap():
    db = mongo["EU"]
    common_cancers_female_collection = db["common_cancers_female"]
    female_documents = list(common_cancers_female_collection.find({}, {'_id': 0}))
    return jsonify(female_documents)

@app.route('/Europe2')
def get_EuDeath():
    db = mongo["EU"]
    Eu_death = db["new_vs_deaths"]
    Eu_death_case_data = list(Eu_death.find({}, {'_id': 0}))  # Excludes the _id field
    
    
    return jsonify(Eu_death_case_data)
@app.route('/Europe3')
def get_case():
    db = mongo["EU"]
    Eu_case= db["new_vs_deaths"]
    Eu_case_data = list(Eu_case.find({}, {'_id': 0}))  # Excludes the _id field
    
    
    return jsonify(Eu_case_data)
   
if __name__ == '__main__':
    app.run(debug=True)