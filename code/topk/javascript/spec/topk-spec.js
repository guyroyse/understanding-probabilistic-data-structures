const chai = require('chai')
const expect = chai.expect

const TopK = require('../topk').TopK

describe("TopK", function() {

  let subject

  beforeEach(function() {
    subject = new TopK({ k: 3, depth: 4, width: 100, decay: 1.05 })
  })

  describe("#query", function() {

    it("returns a count of 0 when queried for unknown string", function() {
      expect(subject.query("foo")).to.equal(0)
    })
  
    it("returns a count of 1 for a single item", function() {
      subject.add("foo")
      expect(subject.query("foo")).to.equal(1)
    })
  
    it("returns a bigger count for multiple items", function() {
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      expect(subject.query("foo")).to.equal(3)
    })
  
    it("multiple strings can be counted", function() {
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      subject.add("bar")
      subject.add("bar")
      subject.add("baz")
  
      expect(subject.query("foo")).to.equal(3)
      expect(subject.query("bar")).to.equal(2)
      expect(subject.query("baz")).to.equal(1)
      expect(subject.query("qux")).to.equal(0)
    })
  
  })

  describe("#top", function() {

    it("returns an empty array for an empty TopK", function() {
      expect(subject.top())
        .to.be.an('array')
        .that.is.empty
  })

    it("returns the count of a single item", function() {
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      expect(subject.top())
        .to.be.an('array')
        .that.has.lengthOf(1)
        .that.has.deep.ordered.members([{ s: 'foo', count: 3 }]);
    })

    it("returns an ordered count of multiple items", function() {
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      subject.add("bar")
      subject.add("bar")
      subject.add("baz")
      expect(subject.top())
        .to.be.an('array')
        .that.has.lengthOf(3)
        .that.has.deep.ordered.members([
          { s: 'baz', count: 1 },
          { s: 'bar', count: 2 },
          { s: 'foo', count: 3 }]);
    })

    it("doesn't count more than k items", function() {
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      subject.add("foo")
      subject.add("bar")
      subject.add("bar")
      subject.add("bar")
      subject.add("baz")
      subject.add("baz")
      subject.add("qux")
      expect(subject.top())
        .to.be.an('array')
        .that.has.lengthOf(3)
        .that.has.deep.ordered.members([
          { s: 'baz', count: 2 },
          { s: 'bar', count: 3 },
          { s: 'foo', count: 4 }]);
    })
  })
})
