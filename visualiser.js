import Canvas from "./canvas.js";
import { average, valueToColor } from "./functions.js";

class BaseRenderer {
    constructor(canvas) {
        this.canvas = canvas;
    }
    draw(data) {
        const bBox = data.boundingBox;
        console.log("in BaseRenderer.draw()", data.x, data.top);
        this.canvas.text(data.title, data.x, 35); //data.top);
        this.canvas.roundedRect(bBox.x, bBox.y, bBox.width, bBox.height, bBox.radius, bBox.fill, bBox.border);
        data.values.forEach((val, i) => {
            this.drawNeuron(data.x + bBox.xPad, data.yPos[i], data.neuronRadius, data.headingGap, val);
        });
    }
    drawNeuron(x, y, radius, gap, value) {
        this.canvas.circle(x + radius, y + radius, radius, valueToColor(value));
        this.canvas.text(value.toFixed(2), x, y + radius + gap);
    }
}

class JunctionBox extends BaseRenderer {
    constructor(canvas) {
        super(canvas);
    }
    draw(data) {
        this.canvas.circle(95, 400, 8, "black");
    }
}

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
    drawNeuron(x, y, radius, gap, value) {
        this.canvas.circle(x + radius, y + radius, radius, valueToColor(value));
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
    computeLayout(data, index) {
        const { baseX, xShift, headingHeight, boxSize } = this.cfg;
        console.log("in computeLayout()", baseX, xShift, headingHeight, boxSize);
        const count = data.values.length;
        const layerHeight = count * boxSize + headingHeight;
        const layerTop = Math.floor((this.height - layerHeight) / 2);
        const x = index * xShift + baseX;
        console.log("in computeLayout()", count, layerTop, x);
        return { count, layerTop, x };
    }

    computeYPositions(count, layerTop, headingHeight, boxSize) {
        return Array.from({ length: count }, (_, j) => j * boxSize + layerTop + headingHeight);
    }

    computeBoundingBox(yPos, data, index) {
        const { boxSize, xShift, baseX, neuronRadius } = this.cfg;
        const yPad = 10;
        return {
            width: boxSize,
            height: boxSize * yPos.length + yPad,
            fill: valueToColor(average(data.values), 0.1),
            border: valueToColor(average(data.values), 0.5),
            xPad: Math.floor((boxSize - (neuronRadius * 2)) / 2),
            radius: 6,
            x: index * xShift + baseX,
            y: yPos[0] - yPad
        };
    }
    enrich(data, index) {
        const layout = this.computeLayout(data, index);
        console.log("in enrich() layout", layout);
        const yPos = this.computeYPositions(layout.count, layout.layerTop, this.cfg.headingHeight, this.cfg.boxSize);
        const boundingBox = this.computeBoundingBox(yPos, data, index);

        Object.assign(data, {
            ...layout,
            yPos,
            boundingBox,
            boxSize: this.cfg.boxSize,
            headingHeight: this.cfg.headingHeight,
            neuronRadius: this.cfg.neuronRadius,
            headingGap: this.cfg.headingGap
        });
        console.log("in enrich data", data);
    }
    renderNetworkSnapshot() {
        const number = parseInt(document.getElementById("testInput").value);
        let layerData = this.net.getActivations(number);
        this.canvas.clear();
        //this.canvas.grid();
        let renderer = new BaseRenderer(this.canvas);
        let junctionBox = new JunctionBox(this.canvas);
        for (const [i, data] of layerData.entries()) {
            this.enrich(data, i); 
            //console.log(data);
            renderer.draw(data);
            if ( i === 0 )
                junctionBox.draw();
        }
    }
}