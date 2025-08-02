import Canvas from "./canvas.js";

export default class Visualiser {
    constructor(canvasID, w, h) {
        this.canvas = new Canvas(canvasID, w, h);
        this.width = w;
        this.height = h;
        this.circleRadius = 20;
    }
    setNetwork(n) {
        this.net = n;
    }
    valueToColor(v) {
        const red = Math.floor(v * 255);
        const blue = 255 - red;
        return `rgba(${red},0,${blue},0.5)`;
    }
    drawNeuron(x, y, radius, gap, value) {
        this.canvas.circle(x + radius, y + radius, radius, this.valueToColor(value));
        this.canvas.text(value.toFixed(2), x, y + radius + gap);
    }
    drawLayer(layer) {
        this.canvas.text(layer.title, layer.x, layer.top);
        layer.values.forEach((val, i) => {
            this.drawNeuron(layer.x, layer.yPos[i], layer.neuronRadius, layer.headingGap, val);
        });
    }
    config(cfg) {
        this.cfg = cfg;
    }
    enrich(layer, index) {
        const { baseX, xShift, headingHeight, boxSize, neuronRadius, headingGap } = this.cfg;
    
        const count = layer.values.length;
        const layerHeight = count * boxSize + headingHeight;
        const layerTop = Math.floor((this.height - layerHeight) / 2);
        
        let yPos = [];
        for (let j = 0; j < count; j++) {
            yPos.push(j * boxSize + layerTop + headingHeight);
        }
        
        Object.assign(layer, {
            count,
            x: index * xShift + baseX,
            top: layerTop,
            boxSize,
            headingHeight,
            neuronRadius,
            headingGap,
            yPos
        });
    }
    run() {
        const number = parseInt(document.getElementById("testInput").value);
        let layers = this.net.getActivations(number);
        this.canvas.clear();
        //this.canvas.grid();
        for (const [i, layer] of layers.entries()) {
            this.enrich(layer, i);
            this.drawLayer(layer);
        }
    }
}