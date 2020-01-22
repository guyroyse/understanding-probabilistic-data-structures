const chai = require('chai')
const expect = chai.expect

const BloomFilter = require('../bloom').BloomFilter

describe("BloomFilter", function() {

  let subject

  const DEFAULT_FILTER_SIZE = 1024
  const DEFAULT_HASH_COUNT = 8

  const FILTER_SIZE = 512
  const HASH_COUNT = 4

  context("when created with default values", function() {

    beforeEach(function() {
      subject = new BloomFilter()
    })
  
    it("it stores the size", function() {
      expect(subject.size).to.equal(DEFAULT_FILTER_SIZE)
    })

    it("it stores the expected hash count", function() {
      expect(subject.hashCount).to.equal(DEFAULT_HASH_COUNT)
    })

    it("has the expected number of bits", function() {
      expect(subject.bits).to.have.lengthOf(DEFAULT_FILTER_SIZE)
    })

    it("has the expected number of hashes", function() {
      expect(subject.hashes).to.have.lengthOf(DEFAULT_HASH_COUNT)
    })

    it("all the bits are false", function() {
      expect(subject.bits.every(bit => bit == false)).to.be.true
    })

    it("has no strings", function() {
      expect(subject.check("foo")).to.be.false
      expect(subject.check("bar")).to.be.false
      expect(subject.check("baz")).to.be.false
      expect(subject.check("qux")).to.be.false
    })

    context("when a string is added", function() {

      beforeEach(function() {
        subject.add("foo")
      })
  
      it("stores it", function() {
        expect(subject.check("foo")).to.be.true
      })
    
      it("doesn't stores others", function() {
        expect(subject.check("bar")).to.be.false
        expect(subject.check("baz")).to.be.false
        expect(subject.check("qux")).to.be.false
      })

      it("at least 1 bit is set", function() {
        expect(subject.bits.some(bit => bit)).to.be.true
      })  
    
      it("no more than hashCount bits are set", function() {
        expect(subject.bits.filter(bit => bit)).to.have.lengthOf.at.most(DEFAULT_HASH_COUNT)
      })  
    
      context("when the rest of the strings are added", function() {

        beforeEach(function() {
          subject.add("bar")
          subject.add("baz")
          subject.add("qux")
        })
    
        it("stores them all", function() {
          expect(subject.check("foo")).to.be.true
          expect(subject.check("bar")).to.be.true
          expect(subject.check("baz")).to.be.true
          expect(subject.check("qux")).to.be.true
        })

        it("at least 1 bit is set", function() {
          expect(subject.bits.some(bit => bit)).to.be.true
        })  
      
        it("no more than hashCount * 4 bits are set", function() {
          expect(subject.bits.filter(bit => bit)).to.have.lengthOf.at.most(DEFAULT_HASH_COUNT * 4)
        })

      })

    })
  
  })

  context("when created with a specified size and hash count", function() {

    beforeEach(function() {
      subject = new BloomFilter(FILTER_SIZE, HASH_COUNT)
    })
  
    it("it stores the expected size", function() {
      expect(subject.size).to.equal(FILTER_SIZE)
    })

    it("it stores the expected hash count", function() {
      expect(subject.hashCount).to.equal(HASH_COUNT)
    })

    it("has the expected number of bits", function() {
      expect(subject.bits).to.have.lengthOf(FILTER_SIZE)
    })

    it("has the expected number of hashes", function() {
      expect(subject.hashes).to.have.lengthOf(HASH_COUNT)
    })

  })

  it("complains when created with too few hashes", function() {
    expect(() => new BloomFilter(FILTER_SIZE, 0)).to.throw("You must have at least 1 hash")
  })

  it("complains when created with too small of a size", function() {
    expect(() => new BloomFilter(0)).to.throw("You must have at least 1 item in the filter")
  })

})
