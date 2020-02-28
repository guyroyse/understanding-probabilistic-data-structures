from flask import Flask, jsonify, send_from_directory

from redisbloom.client import Client

client = Client()

# the Flask app
app = Flask(__name__, instance_relative_config=True)


# this route returns the TopK shapes as JSON
@app.route('/shapes')
def shapes():

  top_shapes = [{
    'shape': shape,
    'count': client.topkCount('ufo_shapes', shape)[0]
  } for shape in client.topkList('ufo_shapes')]

  return jsonify(top_shapes)


# this route returns the TopK shapes as JSON
@app.route('/words')
def words():

  top_words = [{ 
    'word': word, 
    'count': client.topkCount('ufo_words', word)[0]
  } for word in client.topkList('ufo_words')]

  return jsonify(top_words)


# this route serves up 'index.html'
@app.route('/')
def index():
  return send_from_directory('static', 'index.html')


# this route serves up any other paths from the static folder
@app.route('/<path:path>')
def send_static(path):
  return send_from_directory('static', path)


# kick off the Flask application
if __name__ == '__main__':
  app.run()
