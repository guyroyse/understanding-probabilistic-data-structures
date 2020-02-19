const chai = require('chai')
const expect = chai.expect

const TopK = require('../topk').TopK

describe("TopK", function() {

  let subject

  beforeEach(function() {
    subject = new TopK(4, 100, 1.05)
  })

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
