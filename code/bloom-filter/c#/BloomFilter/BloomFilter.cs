using System;
using System.Text;
using HashDepot;
using System.Linq;

namespace BloomFilter
{
    public class BloomFilter
    {
        public readonly bool[] Bits;
        public readonly Func<byte[], uint>[] Hashes;

        public BloomFilter(int size = 1024, int hashCount = 8)
        {
            if (size < 1)
                throw new ArgumentException("You must have at least 1 item in the filter");

            if (hashCount < 1)
                throw new ArgumentException("You must have at least 1 hash");

            Bits = new bool[size];

            var rand = new Random();
            Hashes = Enumerable
                .Repeat(int.MaxValue, hashCount)
                .Select(max => rand.Next(0, max))
                .Select(seed => {
                    Func<byte[], uint> func = bytes => MurmurHash3.Hash32(bytes, (uint) seed);
                    return func;
                })
                .ToArray();
        }

        public int Size
        {
            get { return Bits.Length; }
        }

        public int HashCount
        {
            get { return Hashes.Length; }
        }

        public void Add(string s)
        {
            ComputeHashes(s).ToList().ForEach(n => Bits[n] = true);
        }

        public bool Check(string s)
        {
            return ComputeHashes(s).All(n => Bits[n]);
        }

        private uint[] ComputeHashes(string s)
        {
            return Hashes.Select(hash => ComputeHash(hash, s)).ToArray();
        }

        private uint ComputeHash(Func<byte[], uint> hashFn, string s)
        {
            byte[] bytes = Encoding.Unicode.GetBytes(s);
            uint hash = hashFn(bytes);
            return hash % (uint) Size;
        }
    }
}
