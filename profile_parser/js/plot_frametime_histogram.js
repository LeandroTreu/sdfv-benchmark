"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nodeplotlib_1 = require("nodeplotlib");
const color_cfg_1 = __importDefault(require("./color_cfg"));
// Take tasks as framtimes if they are at least this long in microseconds.
// Very short tasks (< 2ms) don't correspond to frames drawn.
const MIN_FRAME_DURATION = 2000;
const MAX_BIN_X_VALUE = 200; // Exclusive. All values above are capped to this value for plotting.
// The files should be ordered according to version benchmarked
// Each consecutive TRACES_PER_VERSION number of files get put in the same bucket
const N_VERSIONS = 2; // Number of different benchmark versions to compare (each version gets a color in the graph)
const TRACES_PER_VERSION = 3; // Number of samples/traces per version
const PLOT_TITLE_0 = "Optimized SDFV Frametime Histogram";
const PLOT_TITLE_1 = "Un-Optimized SDFV Frametime Histogram";
let plot_colors = [color_cfg_1.default.GREEN, color_cfg_1.default.BLUE, color_cfg_1.default.ORANGE, color_cfg_1.default.RED, color_cfg_1.default.YELLOW];
let sample_index = 0;
let x_array = [];
const files_in_directory = fs_1.default.readdirSync("results");
for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length);
    if (filenamejsonsuffix === ".json") {
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs_1.default.readFileSync(file_path, { encoding: 'utf8' });
        const timeline = JSON.parse(file_data);
        const frames = timeline.tasks;
        // Push data to x_array
        for (let i = 0; i < frames.length; ++i) {
            const event = frames[i];
            if (event.dur > MIN_FRAME_DURATION) {
                let event_dur_ms = event.dur / 1000;
                if (event_dur_ms >= MAX_BIN_X_VALUE) {
                    event_dur_ms = MAX_BIN_X_VALUE - 0.001;
                }
                x_array.push(event_dur_ms);
            }
        }
        sample_index++;
        // Plot aggregated x_array data if all samples have been parsed
        if (sample_index !== 0 && sample_index % TRACES_PER_VERSION === 0) {
            let data = [];
            const hist = {
                x: x_array,
                type: 'histogram',
                autobinx: false,
                xbins: {
                    start: 0,
                    size: 1,
                    end: 1000
                },
                marker: {
                    color: plot_colors[Math.floor(sample_index / TRACES_PER_VERSION) - 1]
                }
            };
            data.push(hist);
            let plot_filename = filename.replace("result-", "");
            let plot_title = "Frametime Histogram for " + plot_filename;
            if (sample_index === 3) {
                plot_title = PLOT_TITLE_0;
            }
            if (sample_index === 6) {
                plot_title = PLOT_TITLE_1;
            }
            const layout = {
                title: plot_title,
                xaxis: { title: "Frametime (ms)", range: [0, MAX_BIN_X_VALUE], dtick: 10 },
                yaxis: { title: "Count" },
                shapes: [
                    // 60 fps line
                    {
                        type: "line",
                        x0: 16.7,
                        y0: 0,
                        x1: 16.7,
                        y1: 1.0,
                        yref: "paper",
                        line: {
                            color: color_cfg_1.default.YELLOW,
                            width: 1.5,
                            dot: 'dot'
                        }
                    },
                    // 30 fps line
                    {
                        type: "line",
                        x0: 33.4,
                        y0: 0,
                        x1: 33.4,
                        y1: 1.0,
                        yref: "paper",
                        line: {
                            color: color_cfg_1.default.RED,
                            width: 1.5,
                            dot: 'dot'
                        }
                    },
                ]
            };
            (0, nodeplotlib_1.plot)(data, layout);
            // Reset array
            x_array = [];
        }
    }
}
