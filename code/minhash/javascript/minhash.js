const murmur = require('murmurhash')

class MinHash {

  constructor(shingleSize = 3, hashCount = 8) {

    if (shingleSize < 1) throw "You must have at shingle size of at least 1"
    if (hashCount < 1) throw "You must have at least 1 hash"

    this.shingleSize = shingleSize
    this.hashes = new Array(hashCount)
      .fill(Number.MAX_SAFE_INTEGER)
      .map(max => Math.floor(Math.random() * max))
      .map(seed => s => murmur.v3(s, seed))
  }

  get hashCount() {
    return this.hashes.length
  }

  minhash(s) {
    let words = this.tokenize(s)
    let shingles = this.shinglize(words)
    let values = this.hashify(shingles)
    return new Set(values)
  }

  similarity(a, b) {
    let union = new Set([...a, ...b])
    let intersection = new Set([...a].filter(x => b.has(x)))
    let similarity = intersection.size / union.size
    return similarity
  }

  tokenize(s) {
    return s.trim().split(/\s+/)
  }

  shinglize(words) {
    return words
      .slice(0, words.length - this.shingleSize + 1)
      .map((_, index) => words
        .slice(index, index + this.shingleSize)
        .join(' ')
      )
  }

  hashify(shingles) {
    return this.hashes.map(hash => {
      return shingles
        .map(shingle => hash(shingle))
        .reduce((min, num) => Math.min(min, num), Number.MAX_SAFE_INTEGER)
    })
  }

}

exports.MinHash = MinHash
