from flask import Flask, render_template, jsonify
from flask_pymongo import PyMongo

app = Flask(__name__)

# Set your MongoDB URI here directly or retrieve it from environment variables
# Replace 'your_username', 'your_password', and 'your_database' with your actual credentials
mongo_uri = 'mongodb+srv://project3:Di3PDviNJJQZih11@cluster0.fvoyrq0.mongodb.net/'

app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)

# Define endpoint to render the HTML template
@app.route('/')
def index():
    return render_template('top_ten_index.html')

# Define endpoint to fetch data from MongoDB and return as JSON
@app.route('/data')
def get_data():
    data_from_mongodb = list(mongo.db.collection.find())
    return jsonify(data_from_mongodb)

if __name__ == '__main__':
    app.run(debug=True)