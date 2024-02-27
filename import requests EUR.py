import requests
import os

# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/xpnftnhemp1u0lpzytofu/cancer_trends.csv?rlkey=wwessskyerveebfwpxj4zsxys&dl=1',
    'https://www.dropbox.com/scl/fi/05uwipxr5nd1zxi12mh5s/common_cancer_f.csv?rlkey=a3ilb6mwh48dtjatxumynpfpk&dl=1',
    'https://www.dropbox.com/scl/fi/ajr79p7cauubm5bnrdmjm/common_cancer_m.csv?rlkey=4ulpsej4alnejeer64da7q9im&dl=1',
    'https://www.dropbox.com/scl/fi/eratabnixaqb2n1dps1ok/lifetime_risk_mf.csv?rlkey=n7p8yrdjgq5arxw1r7ap2t4ye&dl=1',
    'https://www.dropbox.com/scl/fi/vq77hi5s10y7z1unfjxei/new_vs_death.csv?rlkey=whn2fbz22hyhhzven7yfkagre&dl=1'
]

# Function to extract file name from URL
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
