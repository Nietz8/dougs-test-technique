export class Wording {
  private constructor(private readonly _value: string) {}

  static create(value: string): Wording {
    if (typeof value !== 'string') {
      throw new Error('Wording must be a string');
    }

    const trimmed = value.trim();
    if (!trimmed) {
      throw new Error('Wording cannot be empty');
    }

    const normalizedString = Wording.normalize(trimmed);

    return new Wording(normalizedString);
  }

  private static normalize(value: string): string {
    const noAccents = value.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove accents

    return noAccents.trim().replace(/\s+/g, ' ').toUpperCase();
  }

  equals(other: Wording): boolean {
    return this._value === other._value;
  }

  includes(substring: string): boolean {
    const normalizedSub = Wording.normalize(substring);
    return this._value.includes(normalizedSub);
  }

  toString(): string {
    return this._value;
  }

  getValue(): string {
    return this._value;
  }
}
