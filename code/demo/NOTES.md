python3.7 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python -m nltk.downloader -d nltk_data all

unzip nuforc_reports.zip

docker run -p 6379:6379 -d redislabs/rebloom

python build.py

python app.py