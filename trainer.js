import { encodeNumber, mt_rand } from "./functions.js";

export default class Trainer { 
    constructor(net) {
        this.network = net;
    }
    trainYes(yes) {
        const input = encodeNumber(yes);
        this.network.train(input, 1);
    }
    trainNo(no) {
        const input = encodeNumber(no);
        this.network.train(input, 0);
    }
    /* symmetric training
    const yesValues = Array.from({ length: 2001 }, (_, i) => i * 5);
    const noValues = Array.from({ length: 10000 }, (_, i) => i).filter(n => n % 5 !== 0);
    */
    loop(net, count=60000) {
        const noValues = Array.from({ length: 10000 }, (_, i) => i).filter(n => n % 5 !== 0);
        for (let i = 0; i < count; i++) {
            const yes = mt_rand(0, 2000) * 5;
            this.trainYes(yes);
            const no = noValues[mt_rand(0, noValues.length -1)];
            this.trainNo(no);
        }
    }
}