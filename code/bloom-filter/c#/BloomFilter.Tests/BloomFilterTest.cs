using Xunit;
using System;
using System.Linq;

namespace BloomFilter.Tests
{
    public class Constants
    {
        public const int FILTER_SIZE = 16;
        public const int HASH_COUNT = 2;
        public const int DEFAULT_HASH_COUNT = 3;
    }

    public class EmptyBloomFilterTest
    {
        private readonly BloomFilter Subject;

        public EmptyBloomFilterTest()
        {
            Subject = new BloomFilter(Constants.FILTER_SIZE);
        }

        [Fact]
        public void ItStoresTheSize()
        {
            Assert.Equal(Constants.FILTER_SIZE, Subject.Size);
        }

        [Fact]
        public void ItStoresTheExpectedHashCount()
        {
            Assert.Equal(Constants.DEFAULT_HASH_COUNT, Subject.HashCount);
        }

        [Fact]
        public void ItHasTheExpectedNumberOfBits() {
            Assert.Equal(Constants.FILTER_SIZE, Subject.Bits.Length);
        }

        [Fact]
        public void ItHasTheExpectedNumberOfHashes() {
            Assert.Equal(Constants.DEFAULT_HASH_COUNT, Subject.Hashes.Length);
        }

        [Fact]
        public void AllTheBitsAreFalse() {
            Assert.True(Subject.Bits.All(bit => bit == false));
        }

        [Theory]
        [InlineData("foo")]
        [InlineData("bar")]
        [InlineData("baz")]
        [InlineData("qux")]
        public void ItHasNoStrings(string s) {
            Assert.False(Subject.Check(s));
        }
    }

    public class UsedBloomFilterTest
    {
        private readonly BloomFilter Subject;

        public UsedBloomFilterTest()
        {
            Subject = new BloomFilter(Constants.FILTER_SIZE);
            Subject.Add("foo");
        }

        [Fact]
        public void ItStoresTheString()
        {
            Assert.True(Subject.Check("foo"));
        }

        [Theory]
        [InlineData("bar")]
        [InlineData("baz")]
        [InlineData("qux")]
        public void ItDoesntStoreOtherStrings(string s)
        {
            Assert.False(Subject.Check(s));
        }

        [Fact]
        public void ItHasAtLeastOneBitSet()
        {
            Assert.True(Subject.Bits
                .Where(bit => bit == true)
                .Count() >= 1);
        }
    
        [Fact]
        public void ItHasNoMoreThanHashCountBitsSet()
        {
            Assert.True(Subject.Bits
                .Where(bit => bit == true)
                .Count() <= Constants.DEFAULT_HASH_COUNT);
        }
    }

    public class WellUsedBloomFilterTest
    {
        private readonly BloomFilter Subject;

        public WellUsedBloomFilterTest()
        {
            Subject = new BloomFilter(Constants.FILTER_SIZE);
            Subject.Add("foo");
            Subject.Add("bar");
            Subject.Add("baz");
            Subject.Add("qux");
        }

        [Theory]
        [InlineData("foo")]
        [InlineData("bar")]
        [InlineData("baz")]
        [InlineData("qux")]
        public void ItStoresTheStrings(string s)
        {
            Assert.True(Subject.Check(s));
        }

        [Fact]
        public void ItHasAtLeastOneBitSet()
        {
            Assert.True(Subject.Bits
                .Where(bit => bit == true)
                .Count() >= 1);
        }
    
        [Fact]
        public void ItHasNoMoreThanHashCountTimesStringCountBitsSet()
        {
            Assert.True(Subject.Bits
                .Where(bit => bit == true)
                .Count() <= Constants.DEFAULT_HASH_COUNT * 4);
        }
    }

    public class BloomFilterWithSpecifiedHashCountTest
    {
        private readonly BloomFilter Subject;

        public BloomFilterWithSpecifiedHashCountTest()
        {
            Subject = new BloomFilter(Constants.FILTER_SIZE, Constants.HASH_COUNT);
        }

        [Fact]
        public void ItStoresTheExpectedHashCount()
        {
            Assert.Equal(Constants.HASH_COUNT, Subject.HashCount);
        }

        [Fact]
        public void ItHasTheExpectedNumberOfHashes() {
            Assert.Equal(Constants.HASH_COUNT, Subject.Hashes.Length);
        }
    }

    public class BloomFilterWithOutOfRangeHashCounts
    {
        [Fact]
        public void ItComplainsWhenCreatedWithTooFewHashes()
        {
            var ex = Assert.Throws<ArgumentException>(() => new BloomFilter(Constants.FILTER_SIZE, 0)); 
            Assert.Equal("You must have at least 1 hash", ex.Message);
        }

        [Fact]
        public void ItComplainsWhenCreatedWithTooManyHashes()
        {
            var ex = Assert.Throws<ArgumentException>(() => new BloomFilter(Constants.FILTER_SIZE, 4)); 
            Assert.Equal("You cannot have more than 3 hashes", ex.Message);
        }

        [Fact]
        public void ItComplainsWhenCreatedWithTooSmallASize()
        {
            var ex = Assert.Throws<ArgumentException>(() => new BloomFilter(0)); 
            Assert.Equal("You must have at least 1 item in the filter", ex.Message);
        }
    }
}
