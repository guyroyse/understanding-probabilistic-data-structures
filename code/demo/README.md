# The TopK is Out There

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

python -m nltk.downloader -d nltk_data all

unzip nuforc_reports.zip

python build.py

python app.py