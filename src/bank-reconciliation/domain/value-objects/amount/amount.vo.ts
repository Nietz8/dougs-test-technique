export class Amount {
  private constructor(private readonly _value: number) {}

  private static format(value: number): number {
    return parseFloat(value.toFixed(2));
  }

  private static validateValue(value: number) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Amount must be a valid number');
    }
  }

  static create(value: number) {
    this.validateValue(value);
    const formattedValue = Amount.format(value);
    return new Amount(formattedValue);
  }

  getValue() {
    return this._value;
  }

  add(amount: Amount) {
    const addedValues = Amount.format(this._value + amount.getValue());
    return new Amount(addedValues);
  }

  subtract(amount: Amount) {
    const subtractedValues = Amount.format(this._value - amount.getValue());
    return new Amount(subtractedValues);
  }

  equals(amount: Amount) {
    return this._value === amount.getValue();
  }

  toString() {
    return this._value.toFixed(2);
  }
}
