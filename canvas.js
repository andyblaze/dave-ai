export default class Canvas {
    constructor(canvasID, w, h) {
        this.ctx = document.getElementById(canvasID).getContext('2d');
        this.width = w;
        this.height = h;
    }
    circle(x, y, r, fill) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        this.ctx.fillStyle = fill;
        this.ctx.fill();
        this.ctx.stroke();
    }
    text(txt, x, y) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = "20px sans-serif";
        this.ctx.fillText(txt, x, y);
    }
    grid() { // presuming width & height are equal
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 1;
        for ( let i = 80; i < this.width; i+=80 ) {
            // vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.width);
            this.ctx.stroke();   
            // horizontal lines            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.width, i);
            this.ctx.stroke();            
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}