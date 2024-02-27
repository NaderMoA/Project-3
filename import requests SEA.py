import requests
import os
# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/hxqhbil4hj2ougx2nrwp4/cancer_incidence_asr_mf.csv?rlkey=k8sesbdjatnvhl4tvodv8ksv7&dl=1',
    'https://www.dropbox.com/scl/fi/2ckl5leiealbx90reyrly/incidence_mortality_f.csv?rlkey=jxe8yjhx2bues6k26fnz23gxt&dl=1',
    'https://www.dropbox.com/scl/fi/8hnthp73q7cugi9uxmx84/incidence_mortality_m.csv?rlkey=tx787t1z6ckhl9sjcogft61dw&dl=1',
    'https://www.dropbox.com/scl/fi/oyibohrzjbefw2alucswn/lip_oral_cancer_m.csv?rlkey=7p4y33arq3nwqje5f969zxmek&dl=1',
    'https://www.dropbox.com/scl/fi/p604rvse7nttwo8m3jobf/new_vs_death.csv?rlkey=62rxqdk63lutbiugj57ez1fg3&dl=1'
]

def extract_filename(url):
    path = url.split('?')[0]  # Remove query string
    filename = path.split('/')[-1]  # Extract file name
    return filename
    
# Loop through the URLs

for i, url in enumerate(urls):
    response = requests.get(url)
    if response.status_code == 200:
        filename = f'file{i+1}.csv'  # Creates a unique filename for each file
        with open(filename, 'wb') as file:
            file.write(response.content)
        print(f"File {filename} downloaded successfully.")
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")
