import Canvas from "./canvas.js";
import { average } from "./functions.js";

class BaseRenderer {
    constructor(canvas) {
        this.canvas = canvas;
    }
    valueToColor(v, a=0.5) {
        const red = Math.floor(v * 255);
        const blue = 255 - red;
        return `rgba(${red},0,${blue},${a})`;
    }
    draw(data) {
        this.canvas.text(data.title, data.x, data.top);
        const height = data.boxSize * data.yPos.length + 10;
        const color = average(data.values);
        this.canvas.roundedRect(data.x, data.yPos[0] - 10, data.boxSize, height, 6, this.valueToColor(color, 0.1), this.valueToColor(color, 0.5));
        data.values.forEach((val, i) => {
            this.drawNeuron(data.x + 14, data.yPos[i], data.neuronRadius, data.headingGap, val);
        });
    }
    drawNeuron(x, y, radius, gap, value) {
        this.canvas.circle(x + radius, y + radius, radius, this.valueToColor(value));
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
    enrich(data, index) {
        const { baseX, xShift, headingHeight, boxSize, neuronRadius, headingGap } = this.cfg;
    
        const count = data.values.length;
        const layerHeight = count * boxSize + headingHeight;
        const layerTop = Math.floor((this.height - layerHeight) / 2);
        
        let yPos = [];
        for (let j = 0; j < count; j++) {
            yPos.push(j * boxSize + layerTop + headingHeight);
        }
        
        Object.assign(data, {
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
    renderNetworkSnapshot() {
        const number = parseInt(document.getElementById("testInput").value);
        let layerData = this.net.getActivations(number);
        this.canvas.clear();
        //this.canvas.grid();
        let renderer = new BaseRenderer(this.canvas);
        let junctionBox = new JunctionBox(this.canvas);
        for (const [i, data] of layerData.entries()) {
            this.enrich(data, i); 
            console.log(data);
            renderer.draw(data);
            if ( i === 0 )
                junctionBox.draw();
        }
    }
}