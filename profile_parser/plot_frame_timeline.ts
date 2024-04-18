import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';

const file_path = "results/test.json";
const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });

const timeline = JSON.parse(file_data);
const frames = timeline.tasks;

let data: Plot[] = [];

let x_array: number[] = [];
let y_array: number[] = [];
for (let i = 0; i < frames.length; ++i) {

    let event = frames[i]; 

    const line: Plot = { 
        x: [event.ts, event.ts + event.dur],
        y: [1, 1],
        type: 'scatter',
        name: (event.dur / 1000).toFixed(2) + "ms",
        mode: 'lines',
        line: {
            width: 10
        }
    };
    data.push(line);
}

const layout = {
    title: "Frame Timeline"
}

plot(data, layout);



