import os
os.environ['NLTK_DATA'] = './nltk_data'

from redisbloom.client import Client

import pandas as pd

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

STOP_WORDS = set(stopwords.words('english'))

def main():
  client = setup_rebloom()
  data = load_data('nuforc_reports.csv')
  process_data(client, data)

def setup_rebloom():
  # create the client
  client = Client()

  # remove any old keys
  words_exist = client.exists('ufo_words')
  if (words_exist):
    client.delete('ufo_words')

  words_exist = client.exists('ufo_shapes')
  if (words_exist):
    client.delete('ufo_shapes')

  # setup some Top-K action!
  client.topkReserve('ufo_words', k=10, width=400, depth=10, decay=0.9)
  client.topkReserve('ufo_shapes', k=10, width=20, depth=10, decay=0.9)

  # return the client
  return client

def load_data(filename):
  # read in the CSV data
  df = pd.read_csv(filename, encoding='utf-8')
  print(f"Read {df.shape[0]} rows and {df.shape[1]} columns from '{filename}'.")

  # drop all columns except 'text' and 'shape' (and make 'em strings)
  df = df.filter(items=['text', 'shape']).astype(str)
  print(f"Dropped all columns except {df.columns.to_list()}.")

  return df

def process_data(client, data):
  for index, row in data.iterrows():

    # get the shape and the words
    shape = row['shape']
    words = parse_words(row['text'])

    # print a status
    print("Row   : ", index)
    print("Shape : ", shape)
    print("Words : ", words)
    print()

    # add the shapes and words
    client.topkAdd('ufo_shapes', shape)
    [client.topkAdd('ufo_words', w) for w in words]

def parse_words(text):
  words = word_tokenize(text.lower())
  return [w for w in words if w not in STOP_WORDS and w.isalpha()]


if __name__ == '__main__':
  main()