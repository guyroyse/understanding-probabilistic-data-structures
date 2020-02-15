package com.guyroyse.probabilistic;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class MinHashTests {

    private static final int DEFAULT_SHINGLE_SIZE = 3;
    private static final int DEFAULT_HASH_COUNT = 8;

    private static final int SHINGLE_SIZE = 5;
    private static final int HASH_COUNT = 4;

    private MinHash subject;

    @Test
    public void it_complains_when_created_with_too_few_hashes() {
        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> new MinHash(SHINGLE_SIZE, 0));
        assertThat(thrown.getMessage() , is("You must have at least 1 hash"));
    }

    @Test
    public void it_complains_when_created_with_too_small_of_a_shingle_size() {
        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class, () -> new MinHash(0, HASH_COUNT));
        assertThat(thrown.getMessage() , is("You must have at shingle size of at least 1"));
    }

    @Nested
    class WithDefaultValues {

        @BeforeEach
        public void setup() {
            subject = new MinHash();
        }

        @Test
        public void it_stores_the_expected_shingle_size() {
            assertThat(subject.getShingleSize(), is(DEFAULT_SHINGLE_SIZE));
        }

        @Test
        public void it_stores_the_expected_hash_count() {
            assertThat(subject.getHashCount(), is(DEFAULT_HASH_COUNT));
        }

        @Test
        public void it_has_the_expected_number_of_hashes() {
            assertThat(subject.getHashes(), hasSize(DEFAULT_HASH_COUNT));
        }

        @Test
        public void it_computes_the_similarity_of_two_minhash_sets_of_identical_strings() {
            Set<Integer> thisSet = subject.minhash(Lipsum.LIPSUM_A);
            Set<Integer> thatSet = subject.minhash(Lipsum.LIPSUM_A);
            assertThat(subject.similarity(thisSet, thatSet), is(1.0));
        }

        @Test
        public void it_computes_the_similarity_of_two_minhash_sets_of_differing_strings() {
            Set<Integer> thisSet = subject.minhash(Lipsum.LIPSUM_A);
            Set<Integer> thatSet = subject.minhash(Lipsum.LIPSUM_B);
            assertThat(subject.similarity(thisSet, thatSet), is(instanceOf(Double.class)));
        }

        @Nested
        class MinHashing {

            @Test
            public void it_minhashes_a_string() {
                Set<Integer> hashes = subject.minhash(Lipsum.LIPSUM_A);
                assertThat(hashes, everyItem(is(instanceOf(Integer.class))));
            }

            @Nested
            class Tokenizing {

                @Test
                public void it_splits_a_string_with_spaces() {
                    assertThat(subject.tokenize("foo bar baz"), contains("foo", "bar", "baz"));
                }

                @Test
                public void it_splits_a_string_with_whitespace() {
                    assertThat(subject.tokenize("foo  bar\r\n\tbaz"), contains("foo", "bar", "baz"));
                }

                @Test
                public void it_splits_a_string_surrounded_with_whitespace() {
                    assertThat(subject.tokenize("  foo bar baz \r\n\t"), contains("foo", "bar", "baz"));
                }
            }

            @Nested
            class Shinglizing {

                @Test
                public void it_shinglizes_a_wordlist_using_the_default_shingle_size() {
                    List<String> shingles = subject.shinglize(Arrays.asList("foo", "bar", "baz", "qux", "quux"));
                    assertThat(shingles, contains("foo bar baz", "bar baz qux", "baz qux quux"));
                }

                public void it_shinglizes_a_wordlist_using_an_overridden_shingle_size() {
                    subject.setShingleSize(2);
                    List<String> shingles = subject.shinglize(Arrays.asList("foo", "bar", "baz", "qux"));
                    assertThat(shingles, contains("foo bar", "bar baz", "baz qux"));
                }

                public void it_returns_a_single_shingle_with_a_wordlist_of_the_same_size_as_the_shingle_size() {
                    List<String> shingles = subject.shinglize(Arrays.asList("foo", "bar", "baz"));
                    assertThat(shingles, contains("foo bar baz"));
                }

                public void it_returns_no_shingles_with_a_wordlist_that_is_smaller_than_the_shingle_size() {
                    List<String> shingles = subject.shinglize(Arrays.asList("foo", "bar"));
                    assertThat(shingles, is(empty()));
                }
            }

            @Nested
            class Hashifying {

                @Test
                public void it_returns_a_number_of_hashes_equal_to_the_number_of_hash_functions() {
                    List<Integer> hashes = subject.hashify(Arrays.asList("foo bar baz", "bar baz qux", "baz qux quux"));
                    assertThat(hashes, hasSize(DEFAULT_HASH_COUNT));
                }

                @Test
                public void it_returns_only_numbers() {
                    List<Integer> hashes = subject.hashify(Arrays.asList("foo bar baz", "bar baz qux", "baz qux quux"));
                    assertThat(hashes, everyItem(is(instanceOf(Integer.class))));
                }
            }
        }

        @Nested
        class Similarity {

            @Test
            public void it_computes_a_similarity_for_identical_sets() {
                Set<Integer> a = Stream.of(1, 2, 3).collect(Collectors.toSet());
                Set<Integer> b = Stream.of(1, 2, 3).collect(Collectors.toSet());
                assertThat(subject.similarity(a, b), is(1.0));
            }

            @Test
            public void it_computes_a_similarity_for_completely_different_sets() {
                Set<Integer> a = Stream.of(1, 2, 3).collect(Collectors.toSet());
                Set<Integer> b = Stream.of(4, 5, 6).collect(Collectors.toSet());
                assertThat(subject.similarity(a, b), is(0.0));
            }

            @Test
            public void it_computes_a_similarity_for_overlapping_sets() {
                Set<Integer> a = Stream.of(1, 2, 3).collect(Collectors.toSet());
                Set<Integer> b = Stream.of(3, 4, 5).collect(Collectors.toSet());
                assertThat(subject.similarity(a, b), is(0.2));
            }
        }
    }

    @Nested
    class WithSpecifiedValues {

        @BeforeEach
        public void setup() {
            subject = new MinHash(SHINGLE_SIZE, HASH_COUNT);
        }

        @Test
        public void it_stores_the_expected_shingle_size() {
            assertThat(subject.getShingleSize(), is(SHINGLE_SIZE));
        }

        @Test
        public void it_stores_the_expected_hash_count() {
            assertThat(subject.getHashCount(), is(HASH_COUNT));
        }

        @Test
        public void it_has_the_expected_number_of_hashes() {
            assertThat(subject.getHashes(), hasSize(HASH_COUNT));
        }
    }
}
