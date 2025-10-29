# Understanding Probabilistic Data Structures with 112,092 UFO Sightings

There are three reactions to the title of this talk:

- What the heck’s a probabilistic data structure?
- UFO Sightings… wha?
- 112,092 is an oddly specific number.

This is a talk about the first bullet point with the second thrown in just for fun. I like weird stuff—UFOs, Bigfoot, peanut butter and bologna on toast—maybe you do too? As far as the third bullet point, well, that’s how many sightings I have.

Now, if you’re like most developers, you probably have no idea what probabilistic data structures are. In fact, I did a super-scientific poll on Twitter and found that out of 119 participants, 58% had never heard of them and 22% had heard the term but nothing more. I wonder what percentage of that 22% heard the term for the first time in the poll. We’re a literal-minded lot at times.

Anyhow. That’s 4 out of 5 developers or, as I like to call it, the Trident dentist ratio. (It’s actually a manifestation of the Pareto principle but I’m a 70s kid). That’s a lot of folks that need to be educated. So, let’s do that.

A probabilistic data structure is, well, they’re sort of like the TARDIS—bigger on the inside—and JPEG compression—a bit lossy. And, like both, they are fast, accurate enough, and can take you to interesting places of adventure. That last one might not be something a JPEG does.

More technically speaking, most probabilistic data structures use hashes to give you faster and smaller data structures in exchange for precision. If you’ve got a mountain of data to process, this is super useful. In this talk, we’ll briefly go over some common probabilistic data structures; dive deep into a couple (Bloom Filter, MinHash, and Top-K); and show a running application that makes use of Top-K to analyze the most commonly used words in all 112,092 of my UFO sightings.

When we’re done, you’ll be ready to start using some of these structures in your own applications. And, if you use the UFO data, maybe you’ll discover that the truth really is out there.
