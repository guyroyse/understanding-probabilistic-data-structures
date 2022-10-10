# The TopK is Out There

## Up and Running

Setup Python:

    $ python3 -m venv venv

Activate it:

    $ source venv/bin/activate

Install all the requirements:

    $ pip install -r requirements.txt

Download and install the NLTK data using `python download-nltk`. Select all and put the files in the `nltk_data` folder under this folder.

Unzip the data we'll be using:

    $ unzip nuforc_reports.zip

Startup Redis:

    $ ./start-redis.sh

Start processing the data:

    $ python build.py

Start the Flask app:

    $ python app.py
