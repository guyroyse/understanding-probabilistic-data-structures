# Bloom Filter Implementations

These are simple and unoptimized implementations of a Bloom filter in various languages. They are not intented for production use but to educate you on how Bloom filters work. If you use any of them in production, you should feel bad and are a bad person.

## Notes on the Code

In my tests, you'll notice that I am testing internals. This is not normally recommended for good BDD code. This is not good BDD code. Or even BDD at all. When the alogoritms is the goal it is hard to test-drive as the internal representation is what you care about. However, you can write tests to verify that the alogoithm is doing what you expect. This is why I tested the internals.

If I had simply tested the externals, then I would have simplied the code to be nothing more than a set and not a Bloom Filter.

Alternatively, I could have broken the code into several units that did the various parts of the algorithm and then test-driven those. With those, I could have written some integration tests to confirm that the units were working together as expected. However, this code is so short that seemed overkill for a simple example to explain how a Bloom filter works.

Again, this is not production code.
