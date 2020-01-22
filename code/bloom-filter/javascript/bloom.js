const fnv = require('fnv-plus')
const murmur = require('murmurhash')
const jenkins = require('jenkins-hash')

const hashFunctions = [
  s => fnv.fast1a32(s),
  s => murmur.v2(s),
  s => murmur.v3(s),
  s => jenkins.hashlittle(s, 0xbeeff00d)
]

class BloomFilter {

  constructor(size = 1024, hashCount = 8) {

    if (size < 1) throw "You must have at least 1 item in the filter"
    if (hashCount < 1) throw "You must have at least 1 hash"

    this.bits = new Array(size).fill(false)
    this.hashes = new Array(hashCount)
      .fill(null)
      .map(_ => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
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
