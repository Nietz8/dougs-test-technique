import { Wording } from './wording.vo';

describe('Wording (Value Object)', () => {
  describe('Creation & Normalization', () => {
    it('should create a valid wording and normalize spaces and case', () => {
      const wording = Wording.create('  Carte 14/03 Supermarché ');
      expect(wording.toString()).toBe('CARTE 14/03 SUPERMARCHE');
    });

    it('should handle already clean input without change', () => {
      const wording = Wording.create('VIREMENT CLIENT');
      expect(wording.toString()).toBe('VIREMENT CLIENT');
    });

    it('should throw an error if the input is empty or blank', () => {
      expect(() => Wording.create('   ')).toThrow('Wording cannot be empty');
    });

    it('should throw an error if input is not a string', () => {
      // @ts-expect-error - invalid input
      expect(() => Wording.create(123)).toThrow('Wording must be a string');
    });
  });

  describe('Comparison', () => {
    it('should return true for equal normalized wordings', () => {
      const w1 = Wording.create('Carte supermarché');
      const w2 = Wording.create('carte SUPERMARCHE');
      expect(w1.equals(w2)).toBe(true);
    });

    it('should return false for different wordings', () => {
      const w1 = Wording.create('VIREMENT CLIENT');
      const w2 = Wording.create('PRELEVEMENT EDF');
      expect(w1.equals(w2)).toBe(false);
    });
  });

  describe('Search / Inclusion', () => {
    const wording = Wording.create('CARTE 14/03 SUPERMARCHE PARIS');

    it('should return true if it includes a substring (case-insensitive)', () => {
      expect(wording.includes('supermarché')).toBe(true);
    });

    it('should return false if substring not found', () => {
      expect(wording.includes('salaire')).toBe(false);
    });
  });

  describe('String representation', () => {
    it('should return the normalized string when using toString', () => {
      const wording = Wording.create('  carte 12/03  magasin ');
      expect(wording.toString()).toBe('CARTE 12/03 MAGASIN');
    });

    it('should be stable across multiple calls (idempotent)', () => {
      const wording = Wording.create('VIREMENT FOURNISSEUR');
      expect(wording.toString()).toBe(wording.toString());
    });
  });
});
