const murmur = require('murmurhash')
const Heap = require('heap')

let compareCount = (a, b) => a.count - b.count

class HashArray {
  constructor(width) {
    let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

    this.hash = s => murmur.v3(s, seed)
    this.array = new Array(width).fill().map(_ => new Bucket())
  }

  get width() {
    return this.array.length 
  }

  getFingerprintOf(s) {
    return this.hash(s)
  }

  getBucketFor(s) {
    return this.getBucketForFingerprint(this.getFingerprintOf(s))
  }

  getBucketForFingerprint(fingerprint) {
    return this.array[fingerprint % this.width]
  }
}

class Bucket {
  constructor() {
    this.fingerprint = null
    this.counter = 0
  }

  isEmpty() {
    return this.counter === 0
  }

  hasFingerprint(fingerprint) {
    return this.fingerprint === fingerprint
  }

  seize(fingerprint) {
    this.fingerprint = fingerprint
  }

  increment() {
    this.counter = this.counter + 1
  }

  decrement() {
    this.counter = this.counter - 1
  }

  decay(rate) {
    let probability = Math.pow(rate, this.counter * -1)

    if (Math.random(1) <= probability) {
      this.decrement()
    }
  }
}

class TopK {
  constructor({ k, depth, width, decay }) {
    this.k = k
    this.decay = decay
    this.minHeap = new Heap(compareCount)
    this.hashArrays = new Array(depth)
      .fill().map(_ => new HashArray(width))
  }

  add(s) {
    this.addToHeavyKeeper(s)
    this.addToMinHeap(s)
  }

  query(s) {
    return this.hashArrays
      .map(hashArray => {
        let fingerprint = hashArray.getFingerprintOf(s)
        let bucket = hashArray.getBucketForFingerprint(fingerprint)
        return bucket.hasFingerprint(fingerprint) ? bucket : null
      })
      .filter(bucket => bucket !== null)
      .map(bucket => bucket.counter)
      .reduce((previous, current) => Math.max(previous, current), 0)
  }

  top() {
    return this.minHeap.toArray().sort(compareCount)
  }

  addToHeavyKeeper(s) {

    this.hashArrays.forEach(hashArray => {

      let fingerprint = hashArray.getFingerprintOf(s)
      let bucket = hashArray.getBucketForFingerprint(fingerprint)

      if (bucket.isEmpty()) {
        bucket.seize(fingerprint)
        bucket.increment()
        return
      } 

      if (bucket.hasFingerprint(fingerprint)) {
        bucket.increment()
        return
      }

      bucket.decay()
      if (bucket.isEmpty()) {
        bucket.seize(fingerprint)
        bucket.increment()
      }

    })

  }

  addToMinHeap(s) {

    let count = this.query(s)
    let item = this.minHeap.toArray().find(item => item.s === s)

    if (item) {
      item.count = count
      this.minHeap.heapify()
      return
    }
    
    if (this.minHeap.size() < this.k) {
      this.minHeap.push({ s, count })
      return
    }
    
    if (count > this.minHeap.peek().count) {
      this.minHeap.replace({ s, count })
      return
    }

  }

}

exports.TopK = TopK
