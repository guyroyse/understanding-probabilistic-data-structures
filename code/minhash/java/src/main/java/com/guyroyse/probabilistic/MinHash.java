package com.guyroyse.probabilistic;

import org.apache.commons.codec.digest.MurmurHash3;

import java.lang.reflect.Array;
import java.util.*;
import java.util.function.Function;
import java.util.function.ToIntFunction;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class MinHash {

    private static final int DEFAULT_SHINGLE_SIZE = 3;
    private static final int DEFAULT_HASH_COUNT = 8;

    private int shingleSize;
    private List<ToIntFunction<String>> hashes;

    public MinHash() {
        this(DEFAULT_SHINGLE_SIZE, DEFAULT_HASH_COUNT);
    }

    public MinHash(int shingleSize, int hashCount) {

        if (shingleSize < 1) throw new IllegalArgumentException("You must have at shingle size of at least 1");
        if (hashCount < 1) throw new IllegalArgumentException("You must have at least 1 hash");

        Random random = new Random();

        this.shingleSize = shingleSize;
        this.hashes = random
            .ints(hashCount)
            .mapToObj((seed) -> (ToIntFunction<String>) s -> {
                return MurmurHash3.hash32x86(s.getBytes(), 0, s.getBytes().length, seed);
            })
            .collect(Collectors.toList());
    }

    public int getShingleSize() {
        return shingleSize;
    }

    public void setShingleSize(int shingleSize) {
        this.shingleSize = shingleSize;
    }

    public int getHashCount() {
        return hashes.size();
    }

    public List<ToIntFunction<String>> getHashes() {
        return this.hashes;
    }

    public Set<Integer> minhash(String s) {
        List<String> words = this.tokenize(s);
        List<String> shingles = this.shinglize(words);
        List<Integer> values = this.hashify(shingles);
        return values.stream().collect(Collectors.toSet());
    }

    public double similarity(Set<Integer> a, Set<Integer> b) {
        Set union = Stream.concat(a.stream(), b.stream()).collect(Collectors.toSet());
        Set intersection = a.stream().filter(b::contains).collect(Collectors.toSet());
        return (double) intersection.size() / (double) union.size();
    }

    public List<String> tokenize(String s) {
        return Arrays.asList(s.trim().split("\\s+"));
    }

    public List<String> shinglize(List<String> words) {
        return IntStream
            .range(0, words.size() - this.getShingleSize() + 1)
            .mapToObj(index -> {
                return words.subList(index, index + this.getShingleSize()).stream()
                    .collect(Collectors.joining(" "));
            })
            .collect(Collectors.toList());
    }

    public List<Integer> hashify(List<String> shingles) {
        return this.hashes.stream()
            .map(hash -> {
                return shingles.stream()
                    .mapToInt(hash)
                    .boxed()
                    .min(Integer::compare)
                    .get();
            })
            .collect(Collectors.toList());
    }
}
