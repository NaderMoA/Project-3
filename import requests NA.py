import requests

# List of URLs to download
urls = [
    'https://www.dropbox.com/scl/fi/ff8dp9cfo9wgdm12nxqd4/colon_uterus_under50_US_CAN.csv?rlkey=gdpep8rnhfq62oigdyrjehvx7&dl=1',
    'https://www.dropbox.com/scl/fi/iodtyp1j2ufu12fp0fsbs/colorectal_death_mass_miss.csv?rlkey=yryi8mgi01nqar8zmv12rwshg&dl=1',
    'https://www.dropbox.com/scl/fi/lfaer562j35j8wa4nd2fp/colorectal_na_asr_mf.csv?rlkey=27mut6btk8908gm0w4f6mmwfh&dl=1',
    'https://www.dropbox.com/scl/fi/y2h12b4zbo23wfjzshfhx/colorectal_trends_over50_US_CAN.csv?rlkey=ktefi3feo9nh4uv1l8zvg15x9&dl=1',
    'https://www.dropbox.com/scl/fi/g6c5159emagedka31baz9/lung_cancer_death_US_CAN_mf.csv?rlkey=pr3jn9byo4ih2etpogugf29fv&dl=1',
    'https://www.dropbox.com/scl/fi/ibikff78wi6ugk5stadk5/new_vs_death.csv?rlkey=o2ju7hfg9kq21o5np8kekjd6n&dl=1'
]

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