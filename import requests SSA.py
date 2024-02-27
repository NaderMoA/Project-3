import requests
import os
# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/pf6hyz42brkn8bebw1xmn/common_cases.csv?rlkey=hgdf6a1kuee3qyfotf2vy19fv&dl=1',
    'https://www.dropbox.com/scl/fi/l7mkfitqdtio2ucui5f5m/common_deaths.csv?rlkey=phm5mscm47v4pe7ismk765kfd&dl=1',
    'https://www.dropbox.com/scl/fi/846yvk908hxbavx7gihdy/instance_vs_mortality_c.csv?rlkey=dj0flc96nogp870u9kvdkozj9&dl=1',
    'https://www.dropbox.com/scl/fi/dw3kjkso9h0jfwly99br6/instance_vs_mortality_f.csv?rlkey=0mesitytcj15t873vwr3fuvc5&dl=1',
    'https://www.dropbox.com/scl/fi/kw3rzahfb4qd7ms3gqlcg/instance_vs_mortality_m.csv?rlkey=8ybv8m10g60m8hcw9uksoiln1&dl=1',
    'https://www.dropbox.com/scl/fi/iatrah21uj4km087sop1j/new_vs_death.csv?rlkey=ep9e9kvbnsusprdhxo0v8o5c3&dl=1',
    'https://www.dropbox.com/scl/fi/qmvyqbobvyymedm941jb5/trends_asr.csv?rlkey=llzy24je8w3jjlphiq7irid1e&dl=1'
]

def extract_filename(url):
    path = url.split('?')[0]  # Remove query string
    filename = path.split('/')[-1]  # Extract file name
    return filename

# Loop through the URLs
for url in urls:
    response = requests.get(url)
    if response.status_code == 200:
        filename = extract_filename(url)
        with open(filename, 'wb') as file:
            file.write(response.content)
        print(f"{filename} downloaded successfully.")
    else:
        print(f"Failed to download {url}. Status code: {response.status_code}")
