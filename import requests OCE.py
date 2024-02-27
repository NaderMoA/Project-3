import requests
import os
# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/m2dbmbmmdqn0u9gijrhbd/cervical_cancer_OCE.csv?rlkey=3xz4jajpzpkinbm2x5o1157x1&dl=1',
    'https://www.dropbox.com/scl/fi/09cbxcq7t6s7jm8judwh1/instance_vs_mortality_AUS_NZL.csv?rlkey=svxfiwhavovqzhvnbyhcawgde&dl=1',
    'https://www.dropbox.com/scl/fi/mr1bzzttvserzj1ffgif2/instance_vs_mortality_MEA.csv?rlkey=6kkl97c2yxipg1x0hizsyuvyp&dl=1',
    'https://www.dropbox.com/scl/fi/1gi0nibyxqa4lagc6mddb/instance_vs_mortality_MIA.csv?rlkey=r1l7lgx6r6zdw6m6goyn0bm9p&dl=1',
    'https://www.dropbox.com/scl/fi/990t0t310alzszrtfmepj/instance_vs_mortality_PLY.csv?rlkey=3p5wqqq0n916ul1mfxc5cnuo2&dl=1',
    'https://www.dropbox.com/scl/fi/sbb75jsd73a483k1wfzv9/new_vs_death.csv?rlkey=e8zcjlftodgkx6xagaz6glgtw&dl=1',
    'https://www.dropbox.com/scl/fi/dagbvnhioq6ssgbycu393/skin_cancer_rates.csv?rlkey=axvpq6wz2e0ygy6d6pg1sa5dt&dl=1'
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
