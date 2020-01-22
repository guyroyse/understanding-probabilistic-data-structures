const murmur = require('murmurhash')

class BloomFilter {

  constructor(size = 1024, hashCount = 8) {

    if (size < 1) throw "You must have at least 1 item in the filter"
    if (hashCount < 1) throw "You must have at least 1 hash"

    this.bits = new Array(size).fill(false)
    this.hashes = new Array(hashCount)
      .fill(Number.MAX_SAFE_INTEGER)
      .map(max => Math.floor(Math.random() * max))
      .map(seed => s => murmur.v3(s, seed))
  }

  get size() {
    return this.bits.length
  }

  get hashCount() {
    return this.hashes.length
  }

  add(s) {
    this.computeHashes(s)
      .forEach(n => this.bits[n] = true)
  }

  check(s) {
    return this.computeHashes(s)
      .every(n => this.bits[n])
  }

  computeHashes(s) {
    return this.hashes
      .map(fn => fn(s))
      .map(n => n % this.size)
  }

}

exports.BloomFilter = BloomFilter
