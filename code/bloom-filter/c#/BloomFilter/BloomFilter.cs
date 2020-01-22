using System;
using System.Text;
using HashDepot;
using System.Linq;

namespace BloomFilter
{
    public class BloomFilter
    {
        private readonly Func<byte[], uint>[] AllHashes = {
            bytes => Fnv1a.Hash32(bytes),
            bytes => MurmurHash3.Hash32(bytes, 0xbeeff00d),
            bytes => XXHash.Hash32(bytes, 0xbeeff00d)
        };

        public readonly bool[] Bits;
        public readonly Func<byte[], uint>[] Hashes;

        public BloomFilter(int size, int hashCount = 3)
        {
            if (size < 1)
                throw new ArgumentException("You must have at least 1 item in the filter");

            if (hashCount < 1)
                throw new ArgumentException("You must have at least 1 hash");

            if (hashCount > AllHashes.Length)
                throw new ArgumentException("You cannot have more than 3 hashes");

            Bits = new bool[size];
            Hashes = AllHashes.Take(hashCount).ToArray();
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
