from flask import Flask, render_template, jsonify
#from flask_pymongo import PyMongo
from pymongo import MongoClient

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Set your MongoDB URI here directly or retrieve it from environment variables
# Replace 'your_username', 'your_password', and 'your_database' with your actual credentials
mongo_uri = 'mongodb+srv://2012ca:2012ca@cluster0.6ajjgta.mongodb.net/'

# app.config["MONGO_URI"] = mongo_uri
mongo = MongoClient(mongo_uri)
print(mongo.list_database_names())
#db = mongo["Cancerproject3"]
#print(db.list_collection_names())
#postgress configuration:

@app.route('/prediction')
def pred():
  return render_template('prediction_index.html') 

@app.route('/predictionargentina_forecast')
def argentina_forecast():
    db = mongo["Predictions"]
    argentina_forecast = db["argentina_forecast"]
    argentina_forecast_results = list(argentina_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(argentina_forecast_results)

@app.route('/prediction/f_argentina_forecast')
def f_argentina_forecast():
    db = mongo["Predictions"]
    f_argentina_forecast = db["f_argentina_forecast"]
    f_argentina_forecast_results = list(f_argentina_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(f_argentina_forecast_results)  

@app.route('/prediction/spain_forecast')
def spain_forecast():
    db = mongo["Predictions"]
    spain_forecast = db["spain_forecast"]
    spain_forecast_results = list(spain_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(spain_forecast_results) 

@app.route('/prediction/f_spain_forecast')
def f_spain_forecast():
    db = mongo["Predictions"]
    f_spain_forecast = db["f_spain_forecast"]
    f_spain_forecast_results = list(f_spain_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(f_spain_forecast_results)  
@app.route('/prediction/uk_forecast')
def uk_forecast():
    db = mongo["Predictions"]
    uk_forecast = db["uk_forecast"]
    uk_forecast_results = list(uk_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(uk_forecast_results) 

@app.route('/prediction/f_uk_forecast')
def f_uk_forecast():
    db = mongo["Predictions"]
    f_uk_forecast = db["f_uk_forecast"]
    f_uk_forecast_results = list(f_uk_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(f_uk_forecast_results) 
@app.route('/prediction/us_forecast')
def us_forecast():
    db = mongo["Predictions"]
    us_forecast = db["us_forecast"]
    us_forecast_results = list(us_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(us_forecast_results) 

@app.route('/prediction/f_us_forecast')
def f_us_forecast():
    db = mongo["Predictions"]
    f_us_forecast = db["f_us_forecast"]
    f_us_forecast_results = list(f_us_forecast.find({}, {'_id': 0}))  # Excludes the _id field
    return jsonify(f_us_forecast_results)          
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

 

# @app.route('/prediction/<country>')
# def prediction(country):
#     with open(f'./static/data/{country}_forecast.pkl', 'rb') as f:
            
#         model= pickle.load(f)
#     future_dates = pd.date_range(start='2021-01-01', periods=15, freq='YS')
#     future_df = pd.DataFrame({'ds': future_dates})

#     # Make predictions
#     forecast = model.predict(future_df)

#     # Convert forecast DataFrame to dictionary
#     forecast_dict = forecast[['ds', 'yhat']].to_dict(orient='list')

#     return jsonify(forecast_dict)
      



if __name__ == '__main__':
    app.run(debug=True)