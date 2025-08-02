function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
  return x * (1 - x); // x assumed to be sigmoid(x)
}

function mt_rand(min = 0, max = 2147483647) {
    if (min > max) [min, max] = [max, min]; // swap if min > max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function encodeNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) {
    throw new Error("encodeNumber received bad input: " + n);
  }
  return [
    n / 100,
    n % 10 === 0 ? 1 : 0,
    n % 10 === 5 ? 1 : 0
  ];
}

function average(arr) {
    if (!arr.length) return 0;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

class Dave {
    constructor(inputSize, hiddenSize, learningRate = 0.1) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.learningRate = learningRate;
        // Initialize weights from input to hidden: hiddenSize x inputSize matrix
        this.inputToHiddenWeights = Array.from({ length: hiddenSize }, () =>
          Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
        );
        this.hiddenBiases = Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1);
        // Initialize weights from hidden to output: 1 x hiddenSize vector
        this.hiddenToOutputWeights = Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1);
        this.outputBias = Math.random() * 2 - 1;
        this.hiddenActivations = [];
    }
    feedForward(input) {
        this.hiddenActivations = this.inputToHiddenWeights.map((weights, i) => {
        let sum = this.hiddenBiases[i];
        for (let j = 0; j < this.inputSize; j++) {
            sum += weights[j] * input[j];
        }
        return sigmoid(sum);
        });

        let sumOut = this.outputBias;
        for (let i = 0; i < this.hiddenSize; i++) {
            sumOut += this.hiddenActivations[i] * this.hiddenToOutputWeights[i];
        }
        return sigmoid(sumOut);
    }
    train(input, target) {
        const output = this.feedForward(input);
        const error = target - output;
        const outputGradient = error * sigmoidDerivative(output);

        // Update hidden-output weights and output bias
        for (let i = 0; i < this.hiddenSize; i++) {
            this.hiddenToOutputWeights[i] += this.hiddenActivations[i] * outputGradient * this.learningRate;
        }
        this.outputBias += outputGradient * this.learningRate;

        // Backpropagate error to hidden layer
        const hiddenGradients = this.hiddenActivations.map((h, i) => {
            const errorHidden = outputGradient * this.hiddenToOutputWeights[i];
            return errorHidden * sigmoidDerivative(h);
        });

        // Update input-hidden weights and hidden biases
        for (let i = 0; i < this.hiddenSize; i++) {
            for (let j = 0; j < this.inputSize; j++) {
                this.inputToHiddenWeights[i][j] += input[j] * hiddenGradients[i] * this.learningRate;
            }
            this.hiddenBiases[i] += hiddenGradients[i] * this.learningRate;
        }
        return error;
    }
    predict(number) {
        const input = encodeNumber(number);
        return this.feedForward(input);
    }
    getActivations(number) {
        const output = this.predict(number);
        return [
            { "title": "Input", "values": encodeNumber(number)},
            { "title": "IH Weights", "values": this.inputToHiddenWeights.map(wArr => average(wArr)) },
            { "title": "H Biases", "values": this.hiddenBiases },
            {"title": "Hidden", "values": this.hiddenActivations},
            { "title": "HO Weights", "values": this.hiddenToOutputWeights },
            { "title": "O Bias", "values": [this.outputBias] },
            { "title": "Output", "values": [output]}
        ];
    }
}
