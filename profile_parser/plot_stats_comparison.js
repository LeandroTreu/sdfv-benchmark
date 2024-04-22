"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nodeplotlib_1 = require("nodeplotlib");
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
        const y_values = [avg_frametime, median_frametime, percentile_frametime];
        const bar = {
            x: ["Average", "Median", "95th Percentile"],
            y: y_values,
            type: 'bar',
            name: plot_filename,
            text: y_values.map(String),
            textposition: "auto",
            hoverinfo: "none"
        };
        data.push(bar);
    }
}
const layout = {
    title: "Statistics Comparison",
    yaxis: { title: "Frametime (ms)" },
    shapes: [
        // 60 fps line
        {
            opacity: 0.7,
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
            opacity: 0.7,
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
