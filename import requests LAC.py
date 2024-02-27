import requests
import os
# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/pbupbh2otfu5wgxw5pnzz/breast_cancer_asr.csv?rlkey=z2co4sc6vpptndtgu9wk902p6&dl=1',
    'https://www.dropbox.com/scl/fi/75hj68i6qroxov3qj0n0j/cervical_cancer_asr.csv?rlkey=7ekrsumx12dztkfidrm0ualng&dl=1',
    'https://www.dropbox.com/scl/fi/awh1sytiz6k5qr45az0as/instance_vs_mortality.csv?rlkey=19fqm5r6cobqbx9gdm021g90f&dl=1',
    'https://www.dropbox.com/scl/fi/wyp7v9uywrbf78hah3x74/leading_cause.csv?rlkey=qey7ypfx52kgs0ucr80kd7wlh&dl=1',
    'https://www.dropbox.com/scl/fi/q4gqcib5wzbmt3cl2c2mr/new_vs_death.csv?rlkey=d92q2oke09aqrupacjcs1kr74&dl=1',
    'https://www.dropbox.com/scl/fi/b31crtxmj82t3wrvdn38e/prostate_cancer_asr.csv?rlkey=x30rjy9czp5fsl5ldgoa15dkk&dl=1',
    'https://www.dropbox.com/scl/fi/veuwj57xm3mgqv6sgubf9/stomach_cancer_asr_m.csv?rlkey=6kpu226xevaycgwwctlgt5h1j&dl=1'
]

# Function to extract file name from URL
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
