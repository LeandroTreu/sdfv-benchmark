"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nodeplotlib_1 = require("nodeplotlib");
// The files should be ordered according to version benchmarked
// Each consecutive TRACES_PER_VERSION number of files get put in the same bucket
const N_VERSIONS = 2; // Number of different benchmark versions to compare (each version gets a color in the graph)
const TRACES_PER_VERSION = 3; // Number of samples/traces per version
let sample_index = 0;
let avg_frametimes = [];
let median_frametimes = [];
let percentile_frametimes = [];
const files_in_directory = fs_1.default.readdirSync("results");
let data = [];
for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length);
    if (filenamejsonsuffix === ".json") {
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs_1.default.readFileSync(file_path, { encoding: 'utf8' });
        const json_data = JSON.parse(file_data);
        const stats = json_data.statistics;
        const n_data_points = stats.NumberOfDataPoints;
        const avg_frametime = stats.AvgFrameTime;
        const median_frametime = stats.MedianFrameTime;
        const percentile_frametime = stats["95thPercentileFrameTime"];
        const plot_filename = filename.replace("result-", "");
        avg_frametimes.push(avg_frametime);
        median_frametimes.push(median_frametime);
        percentile_frametimes.push(percentile_frametime);
        sample_index++;
        if (sample_index !== 0 && sample_index % TRACES_PER_VERSION === 0) {
            avg_frametimes.sort((a, b) => a - b);
            median_frametimes.sort((a, b) => a - b);
            percentile_frametimes.sort((a, b) => a - b);
            const median_avg_ft = avg_frametimes[Math.floor(avg_frametimes.length / 2)];
            const median_m_ft = median_frametimes[Math.floor(median_frametimes.length / 2)];
            const median_p_ft = percentile_frametimes[Math.floor(percentile_frametimes.length / 2)];
            const minus_deltas = [median_avg_ft - avg_frametimes[0],
                median_m_ft - median_frametimes[0],
                median_p_ft - percentile_frametimes[0]];
            const plus_deltas = [avg_frametimes[avg_frametimes.length - 1] - median_avg_ft,
                median_frametimes[median_frametimes.length - 1] - median_m_ft,
                percentile_frametimes[percentile_frametimes.length - 1] - median_p_ft];
            const y_values = [median_avg_ft, median_m_ft, median_p_ft];
            const bar = {
                x: ["Average", "Median", "95th Percentile"],
                y: y_values,
                type: 'bar',
                name: plot_filename,
                text: y_values.map(String),
                textposition: "auto",
                hoverinfo: "none",
                error_y: {
                    type: 'data',
                    symmetric: false,
                    array: plus_deltas,
                    arrayminus: minus_deltas,
                    visible: true
                },
            };
            data.push(bar);
            // Reset arrays for next bucket of samples
            avg_frametimes = [];
            median_frametimes = [];
            percentile_frametimes = [];
        }
    }
}
const layout = {
    title: "Frametime Comparison",
    yaxis: { title: "Frametime (ms)" },
    shapes: [
        // 60 fps line
        {
            opacity: 1.0,
            type: "line",
            x0: 0,
            y0: 16.7,
            x1: 1,
            y1: 16.7,
            xref: "paper",
            line: {
                color: 'orange',
                width: 1,
                dot: 'dot'
            }
        },
        // 30 fps line
        {
            opacity: 1.0,
            type: "line",
            x0: 0,
            y0: 33.4,
            x1: 1,
            y1: 33.4,
            xref: "paper",
            line: {
                color: 'red',
                width: 1,
                dot: 'dot'
            }
        },
    ]
};
(0, nodeplotlib_1.plot)(data, layout);
