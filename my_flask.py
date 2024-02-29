from flask import Flask, render_template, jsonify
#from flask_pymongo import PyMongo
from pymongo import MongoClient
from pprint import pprint

app = Flask(__name__)

# Set your MongoDB URI here directly or retrieve it from environment variables
# Replace 'your_username', 'your_password', and 'your_database' with your actual credentials
mongo_uri = 'mongodb+srv://project3:Di3PDviNJJQZih11@cluster0.fvoyrq0.mongodb.net/'

app.config["MONGO_URI"] = mongo_uri
mongo = MongoClient(mongo_uri)
print(mongo.list_database_names())
# Define endpoint to render the HTML template
@app.route('/')
def index():
    return render_template('top_ten_index.html')

# Define endpoint to fetch data from MongoDB and return as JSON
@app.route('/Europe')
def get_data():
    db = mongo["EU"]
    common_cancers_male = db['common_cancer_male']
    print("before the list")
    data = list(common_cancers_male.find())  # Fetch data from the collection
    return jsonify(data)
   
if __name__ == '__main__':
    app.run(debug=True)