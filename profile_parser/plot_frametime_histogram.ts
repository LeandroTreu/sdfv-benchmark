import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';

const MAX_BIN_X_VALUE = 200;

const files_in_directory = fs.readdirSync("results");

for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length) 

    if (filenamejsonsuffix === ".json") {
    
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });
        const timeline = JSON.parse(file_data);
        const frames = timeline.tasks;

        let data: Plot[] = [];
        let x_array: number[] = [];
        for (let i = 0; i < frames.length; ++i)  {
            const event = frames[i]; 
            let event_dur_ms = event.dur / 1000;
            if (event_dur_ms > MAX_BIN_X_VALUE) {
                event_dur_ms = MAX_BIN_X_VALUE;
            }
            x_array.push(event_dur_ms);
        }
        const hist: Plot = { 
            x: x_array,
            type: 'histogram',
            autobinx: false,
            xbins: {
                start: 0,
                size: 1,
                end: 1000
            },
            marker: {
                color: 'green'
            }
        };
        data.push(hist);

        const layout = {
            title: "Frametime Histogram for " + filename,
            xaxis: {title: "Frametime (ms)", range: [0, MAX_BIN_X_VALUE]},
            yaxis: {title: "Count"},
            shapes: [
                // 60 fps line
                {
                type: "line" as "line",
                x0: 16.7,
                y0: 0,
                x1: 16.7,
                y1: 1.0,
                yref: "paper" as "paper",
                line: {
                    color: 'orange',
                    width: 1,
                    dot: 'dot'
                }
                },
                // 30 fps line
                {
                type: "line" as "line",
                x0: 33.4,
                y0: 0,
                x1: 33.4,
                y1: 1.0,
                yref: "paper" as "paper",
                line: {
                    color: 'red',
                    width: 1,
                    dot: 'dot'
                }
                },
            ]
        }

        plot(data, layout);
    }
}

