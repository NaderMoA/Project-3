import requests
import os
# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/7cjucrkyvyabumk6efi9b/cancer_by_excess.csv?rlkey=pt4kr4e1tysjodcc2kf8ojmwe&dl=1',
    'https://www.dropbox.com/scl/fi/kxr332j3iwkplao1tg83p/death_type_mf.csv?rlkey=wr0ozp6wvunugxmnxs3lh6w5h&dl=1',
    'https://www.dropbox.com/scl/fi/inqgtqdftyjcdz3er8rtt/instance_vs_mortality.csv?rlkey=4s0rrbrv0kbkhtcrhhlbqdocr&dl=1',
    'https://www.dropbox.com/scl/fi/l5wtqx22bj6blbnzy1vq6/most_common_cancer_mf.csv?rlkey=bp9fq6kvxwtkru59qc8f6ss2h&dl=1',
    'https://www.dropbox.com/scl/fi/gdmaev7u83wmpvsnwe9zg/new_case_mf.csv?rlkey=l4m85xpj4qlwhu40uk7mmthz6&dl=1'
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
