export default class TestHarness {
    prediction(net) {
        let correct = 0;
        for (let i = 0; i < 10000; i++) {
            const output = net.predict(i);
            if ( isNaN(output) ) {
                throw new Error("NaN from predict(): " + output);
            }
            const isYes = i % 5 === 0;
            if ((isYes && output > 0.9) || (!isYes && output < 0.1)) {
                correct++;
            }
        }
        console.log("Accuracy: " + (correct / 100) + "%");    
    }
}