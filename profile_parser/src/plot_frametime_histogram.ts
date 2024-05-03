import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';

// Take tasks as framtimes if they are at least this long in microseconds.
// Very short tasks (< 2ms) don't correspond to frames drawn.
const MIN_FRAME_DURATION = 2000;
const MAX_BIN_X_VALUE = 200;

// The files should be ordered according to version benchmarked
// Each consecutive TRACES_PER_VERSION number of files get put in the same bucket
const N_VERSIONS = 2; // Number of different benchmark versions to compare (each version gets a color in the graph)
const TRACES_PER_VERSION = 3; // Number of samples/traces per version

let sample_index = 0;
let x_array: number[] = [];

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
        
        // Push data to x_array
        for (let i = 0; i < frames.length; ++i)  {
            const event = frames[i]; 
            if (event.dur > MIN_FRAME_DURATION) {
                let event_dur_ms = event.dur / 1000;
                if (event_dur_ms > MAX_BIN_X_VALUE) {
                    event_dur_ms = MAX_BIN_X_VALUE;
                }
                x_array.push(event_dur_ms);
            }
        }
        
        sample_index++;

        // Plot aggregated x_array data if all samples have been parsed
        if (sample_index !== 0 && sample_index % TRACES_PER_VERSION === 0) {
            let data: Plot[] = [];
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
    
            const plot_filename = filename.replace("result-", "");
            const layout = {
                title: "Frametime Histogram for " + plot_filename,
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
    
            // Reset array
            x_array = [];
        }
    }
}

