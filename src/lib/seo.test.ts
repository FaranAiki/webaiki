import { describe, it, expect } from 'vitest';
import { extractKeywords, generateKeywordScrambles, getLanguageAlternates, SITE_URL } from './seo';

describe('SEO Utilities', () => {
  describe('extractKeywords', () => {
    it('should extract the most frequent keywords from text', () => {
      const text = "React is a JavaScript library for building user interfaces. React makes it painless to create interactive UIs.";
      const keywords = extractKeywords(text, 3);
      expect(keywords).toContain('react');
    });

    it('should ignore stop words and short words', () => {
      const text = "the a an is are for to with from this that about many some";
      const keywords = extractKeywords(text);
      expect(keywords.length).toBe(0); // All should be filtered out
    });
  });

  describe('generateKeywordScrambles', () => {
    it('should generate permutations of a phrase', () => {
      const scrambles = generateKeywordScrambles('Hello World');
      expect(scrambles).toContain('hello world');
      expect(scrambles).toContain('world hello');
      expect(scrambles.length).toBe(2);
    });

    it('should correctly handle three words', () => {
      const scrambles = generateKeywordScrambles('A B C');
      expect(scrambles).toContain('a b c');
      expect(scrambles).toContain('c b a');
      expect(scrambles.length).toBe(6); // 3! = 6
    });
  });

  describe('getLanguageAlternates', () => {
    it('should generate language alternates with correct mapping', () => {
      const alternates = getLanguageAlternates('/about');
      expect(alternates['en']).toBe(`${SITE_URL}/en/about`);
      expect(alternates['id']).toBe(`${SITE_URL}/id/about`);
      // 'jp' maps to 'ja' in HREFLANG_MAP
      expect(alternates['ja']).toBe(`${SITE_URL}/jp/about`);
      expect(alternates['x-default']).toBe(`${SITE_URL}/id/about`);
    });
  });
});
