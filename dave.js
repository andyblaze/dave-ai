function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
  return x * (1 - x); // x assumed to be sigmoid(x)
}

function create(inputSize, hiddenSize, learningRate = 0.1) {
  return {
    inputSize,
    hiddenSize,
    learningRate,
    // Initialize weights from input to hidden: hiddenSize x inputSize matrix
    inputToHiddenWeights: Array.from({ length: hiddenSize }, () =>
      Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
    ),
    hiddenBiases: Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1),
    // Initialize weights from hidden to output: 1 x hiddenSize vector
    hiddenToOutputWeights: Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1),
    outputBias: Math.random() * 2 - 1,
    hiddenActivations: []
  };
}

function feedForward(net, input) {
  net.hiddenActivations = net.inputToHiddenWeights.map((weights, i) => {
    let sum = net.hiddenBiases[i];
    for (let j = 0; j < net.inputSize; j++) {
      sum += weights[j] * input[j];
    }
    return sigmoid(sum);
  });

  let sumOut = net.outputBias;
  for (let i = 0; i < net.hiddenSize; i++) {
    sumOut += net.hiddenActivations[i] * net.hiddenToOutputWeights[i];
  }
  return sigmoid(sumOut);
}

function train(net, input, target) {
  const output = feedForward(net, input);
  const error = target - output;
  const outputGradient = error * sigmoidDerivative(output);

  // Update hidden-output weights and output bias
  for (let i = 0; i < net.hiddenSize; i++) {
    net.hiddenToOutputWeights[i] += net.hiddenActivations[i] * outputGradient * net.learningRate;
  }
  net.outputBias += outputGradient * net.learningRate;

  // Backpropagate error to hidden layer
  const hiddenGradients = net.hiddenActivations.map((h, i) => {
    const errorHidden = outputGradient * net.hiddenToOutputWeights[i];
    return errorHidden * sigmoidDerivative(h);
  });

  // Update input-hidden weights and hidden biases
  for (let i = 0; i < net.hiddenSize; i++) {
    for (let j = 0; j < net.inputSize; j++) {
      net.inputToHiddenWeights[i][j] += input[j] * hiddenGradients[i] * net.learningRate;
    }
    net.hiddenBiases[i] += hiddenGradients[i] * net.learningRate;
  }

  return error;
}

function predict(net, input) {
  return feedForward(net, input);
}