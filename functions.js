export function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

export function sigmoidDerivative(x) {
  return x * (1 - x); // x assumed to be sigmoid(x)
}

export function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function encodeNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error("encodeNumber received bad input: " + n);
  }
  return [
    n / 100,
    n % 10 === 0 ? 1 : 0,
    n % 10 === 5 ? 1 : 0
  ];
}

export function average(arr) {
    if (!arr.length) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}