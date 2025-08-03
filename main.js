import Dave from "./dave.js";
import Trainer from "./trainer.js";
import TestHarness from "./test-harness.js";
import Visualiser from "./visualiser.js";

$(document).ready(function() {
    const net = new Dave(3, 10);
    const trainer = new Trainer(net);
    const test = new TestHarness();
    const visualiser = new Visualiser("nnCanvas", 1280, 800);
    trainer.loop(net);
    test.prediction(net);
    visualiser.setNetwork(net);
    const settings = {
        baseX: 20,
        xShift: 130,
        headingHeight: 25,
        boxSize: 70,
        neuronRadius: 20,
        headingGap: 40
    };
    visualiser.config(settings);
    $("#visualise").on("click", () => visualiser.renderNetworkSnapshot());
});
