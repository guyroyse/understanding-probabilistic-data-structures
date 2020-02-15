const chai = require('chai')
const expect = chai.expect

const MinHash = require('../minhash').MinHash

describe("MinHash", function() {

  let subject

  const DEFAULT_SHINGLE_SIZE = 3
  const DEFAULT_HASH_COUNT = 8

  const SHINGLE_SIZE = 5
  const HASH_COUNT = 4

  it("complains when created with too few hashes", function() {
    expect(() => new MinHash(SHINGLE_SIZE, 0)).to.throw("You must have at least 1 hash")
  }) 

  it("complains when created with too small of a shingle size", function() {
    expect(() => new MinHash(0, HASH_COUNT))
      .to.throw("You must have at shingle size of at least 1")
  })

  context("when created with default values", function() {

    beforeEach(function() {
      subject = new MinHash()
    })

    it("it stores the expected shingle size", function() {
      expect(subject.shingleSize).to.equal(DEFAULT_SHINGLE_SIZE)
    })

    it("it stores the expected hash count", function() {
      expect(subject.hashCount).to.equal(DEFAULT_HASH_COUNT)
    })
  
    it("has the expected number of hashes", function() {
      expect(subject.hashes).to.have.lengthOf(DEFAULT_HASH_COUNT)
    })

    it("computes the similarity of two minhash sets of identical strings", function() {
      let thisSet = subject.minhash(LIPSUM_A)
      let thatSet = subject.minhash(LIPSUM_A)
      let result = subject.similarity(thisSet, thatSet)

      expect(result).to.equal(1)
    })
    
    it("computes the similarity of two minhash sets of differing strings", function() {
      let thisSet = subject.minhash(LIPSUM_A)
      let thatSet = subject.minhash(LIPSUM_B)
      let result = subject.similarity(thisSet, thatSet)

      expect(result).to.be.a('number')
    })

    describe("#minhash", function() {

      it("minhashes a string", function() {
        let result = subject.minhash(LIPSUM_A)
        expect(result).to.be.a('set')
        result.forEach(n => expect(n).to.be.a('number'))
      })

      describe("tokenizing strings", function() {

        it("splits a string with spaces", function() {
          expect(subject.tokenize("foo bar baz"))
            .to.have.ordered.members(['foo', 'bar', 'baz'])
        })

        it("splits a string with whitespace", function() {
          expect(subject.tokenize("foo  bar\r\n\tbaz"))
            .to.have.ordered.members(['foo', 'bar', 'baz'])
        })

        it("splits a string surrounded with whitespace", function() {
          expect(subject.tokenize("  foo bar baz \r\n\t"))
            .to.have.ordered.members(['foo', 'bar', 'baz'])
        })

      })

      describe("shinglizing words", function() {

        it("shinglizes a wordlist using the default shingle size", function() {
          expect(subject.shinglize(['foo', 'bar', 'baz', 'qux', 'quux']))
            .to.have.ordered.members(['foo bar baz', 'bar baz qux', 'baz qux quux'])
        })

        it("shinglizes a wordlist using an overridden shingle size", function() {
          subject.shingleSize = 2
          expect(subject.shinglize(['foo', 'bar', 'baz', 'qux']))
            .to.have.ordered.members(['foo bar', 'bar baz', 'baz qux'])
        })

        it("returns a single shingle with a wordlist of the same size as the shingle size", function() {
          expect(subject.shinglize(['foo', 'bar', 'baz']))
            .to.have.ordered.members(['foo bar baz'])
        })

        it("returns no shingles with a wordlist that is smaller than the shingle size", function() {
          expect(subject.shinglize(['foo', 'bar'])).to.be.an('array').that.is.empty
        })

      })

      describe("hashifying shingles", function() {

        it("returns a number of hashes equal to the number of hash functions", function() {
          expect(subject.hashify(['foo bar baz', 'bar baz qux', 'baz qux quux']))
            .to.be.an('array')
            .that.has.lengthOf(DEFAULT_HASH_COUNT)
        })

        it("returns only numbers", function() {
          subject.hashify(['foo bar baz', 'bar baz qux', 'baz qux quux'])
            .forEach(n => expect(n).to.be.a('number'))
        })

      })

    })

    describe("#similarity", function() {

      it("computes a similarity for identical sets", function() {
        let a = new Set([1, 2, 3])
        let b = new Set([1, 2, 3])
        expect(subject.similarity(a, b)).to.equal(1)
      })

      it("computes a similarity for completely different sets", function() {
        let a = new Set([1, 2, 3])
        let b = new Set([4, 5, 6])
        expect(subject.similarity(a, b)).to.equal(0)
      })

      it("computes a similarity for overlapping sets", function() {
        let a = new Set([1, 2, 3])
        let b = new Set([3, 4, 5])
        expect(subject.similarity(a, b)).to.equal(0.2)
      })

    })

  })

  context("when created with a specified shingle size and hash count", function() {

    beforeEach(function() {
      subject = new MinHash(SHINGLE_SIZE, HASH_COUNT)
    })
  
    it("it stores the expected shingle size", function() {
      expect(subject.shingleSize).to.equal(SHINGLE_SIZE)
    })

    it("it stores the expected hash count", function() {
      expect(subject.hashCount).to.equal(HASH_COUNT)
    })
  
    it("has the expected number of hashes", function() {
      expect(subject.hashes).to.have.lengthOf(HASH_COUNT)
    })

  })

})

const LIPSUM_A = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. In faucibus nibh tortor, quis
  condimentum leo dignissim nec. In a laoreet leo. Suspendisse blandit luctus mollis.
  Praesent nec mi vel turpis vestibulum congue. Proin at diam nec lorem auctor feugiat et
  in ipsum. Pellentesque urna mauris, vulputate pulvinar lectus nec, egestas varius tellus.
  Sed ac mauris in massa venenatis tincidunt. Aliquam erat volutpat. Aliquam ipsum nunc,
  sagittis a tincidunt sit amet, dapibus sit amet lacus. Etiam rhoncus mattis dictum.
  Maecenas porta congue est convallis convallis. Mauris feugiat convallis leo, ut laoreet
  lorem elementum vitae.

  Donec vel risus vitae risus auctor fermentum id eget orci. Donec at condimentum nisl.
  Mauris mattis mi lacus. Phasellus a urna imperdiet dolor tincidunt hendrerit. Etiam
  tristique finibus dui eu varius. Class aptent taciti sociosqu ad litora torquent per
  conubia nostra, per inceptos himenaeos. Donec sodales nisi tellus, ut congue neque
  venenatis sed. Curabitur tempus mattis nunc vitae iaculis. Etiam vitae velit tincidunt,
  accumsan tellus at, egestas risus. Vivamus lectus ante, mollis vel placerat quis,
  hendrerit in nisl. Integer sodales ultricies condimentum. Aenean tempor dui dolor, et
  pellentesque elit fermentum sit amet. In eu scelerisque enim. Sed vel faucibus leo, a
  feugiat nibh.

  In et scelerisque justo. Sed aliquam scelerisque tortor, id porttitor tellus blandit
  quis. Nunc mattis, lorem nec aliquet rutrum, massa ex elementum neque, ac suscipit neque
  ante at arcu. Nam ultrices dignissim gravida. Aliquam eu nisi vel quam pulvinar mollis.
  Sed sapien massa, luctus quis condimentum non, laoreet non turpis. Suspendisse non
  viverra felis. Pellentesque maximus lectus vitae libero faucibus, blandit gravida ligula
  porttitor. In libero ex, ultrices nec egestas nec, pulvinar a justo.

  Vivamus quis gravida ex. Vestibulum egestas massa commodo dolor blandit sollicitudin.
  Quisque tempus sit amet sem vel ultrices. Class aptent taciti sociosqu ad litora torquent
  per conubia nostra, per inceptos himenaeos. Donec ac tincidunt metus. Etiam tincidunt
  ullamcorper purus, ut varius risus porttitor in. Cras facilisis est felis, vel egestas
  nunc semper in. Curabitur sit amet tortor viverra, tempor ante ac, accumsan sem. Nulla
  facilisi. Duis sed quam vitae nulla tincidunt suscipit. Sed laoreet elit orci, eget
  semper ex ultricies eget.

  Nulla facilisi. Praesent eleifend dui vitae mi pretium, convallis tempor ante congue.
  Maecenas finibus eu justo ut efficitur. Fusce sed orci nulla. Sed in sagittis turpis.
  Duis auctor diam sit amet dui gravida aliquam. Proin nec neque imperdiet, mattis arcu
  in, scelerisque lectus. Mauris metus enim, hendrerit vitae risus in, interdum suscipit
  velit. Cras vel venenatis arcu. Nulla facilisi. Sed lobortis justo eget sapien ultrices
  efficitur.
`

const LIPSUM_B = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis hendrerit metus. Sed
  metus risus, ultricies non ex id, tincidunt iaculis lorem. Sed facilisis felis neque,
  ac ornare felis bibendum id. Etiam vitae maximus ex, sit amet vestibulum libero. Phasellus
  aliquam justo purus, ut dictum est fringilla vitae. Vivamus suscipit feugiat dignissim.
  Quisque ornare pellentesque erat. Donec lobortis a lectus malesuada dapibus. Vivamus
  massa magna, maximus id sem vel, euismod sagittis dui.

  Ut a leo id lacus consectetur varius. Ut pellentesque dictum mi, quis sodales dui viverra
  at. Nam et quam vel nulla lacinia porttitor. Praesent vulputate neque felis, vitae rutrum
  urna porta id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
  cubilia Curae; Maecenas velit ante, varius at interdum vel, fringilla vitae elit. Nam a
  nibh porttitor, placerat purus vitae, ullamcorper diam. Phasellus accumsan mauris est,
  sed dictum urna varius vel.

  Aliquam bibendum suscipit cursus. Proin vulputate hendrerit risus ac euismod. Maecenas
  a luctus nisl. Etiam cursus leo vitae feugiat efficitur. Cras metus magna, facilisis
  rhoncus dui vitae, facilisis dignissim risus. Vivamus dignissim libero ut elit tristique,
  at laoreet nisl condimentum. Ut fringilla vitae lectus sit amet rhoncus.

  Aenean id massa ac urna pharetra molestie eu in tellus. Donec blandit tristique justo
  eget vestibulum. Maecenas pellentesque convallis nisi, quis venenatis ligula blandit
  sit amet. Nullam quis laoreet felis. Proin augue est, convallis eget ullamcorper id,
  efficitur vel magna. Pellentesque vitae velit at lectus pellentesque euismod vel ut
  nulla. Vivamus dapibus magna eget quam feugiat, at finibus metus auctor. Proin vel
  nibh molestie, cursus leo vel, ultrices felis. Nullam non ante ipsum. Aenean ipsum
  nisi, facilisis blandit nisl nec, mattis porttitor ligula. Morbi quis iaculis lectus,
  eget laoreet nulla. Vivamus vel suscipit odio, sit amet sagittis ante. Nam dictum commodo
  rhoncus. Nam id nibh congue, aliquet eros non, maximus lectus. Suspendisse ipsum erat,
  efficitur sed est vitae, convallis imperdiet urna. Proin sed dignissim dolor.

  Quisque eu suscipit enim. Sed a semper dolor. Nam accumsan ultricies nisl eget ultricies.
  Aliquam rhoncus scelerisque sodales. Aliquam sed odio ut diam tempus auctor ac vel
  tortor. Nullam pulvinar gravida ante, in ullamcorper mauris tempus quis. Sed auctor eget
  arcu non viverra.
`
