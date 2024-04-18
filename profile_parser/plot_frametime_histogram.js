"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nodeplotlib_1 = require("nodeplotlib");
const MAX_BIN_X_VALUE = 200;
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
        let data = [];
        let x_array = [];
        for (let i = 0; i < frames.length; ++i) {
            const event = frames[i];
            let event_dur_ms = event.dur / 1000;
            if (event_dur_ms > MAX_BIN_X_VALUE) {
                event_dur_ms = MAX_BIN_X_VALUE;
            }
            x_array.push(event_dur_ms);
        }
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
                color: 'green'
            }
        };
        data.push(hist);
        const layout = {
            title: "Frametime Histogram for " + filename,
            xaxis: { title: "Frametime (ms)", range: [0, MAX_BIN_X_VALUE] },
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
                        color: 'orange',
                        width: 1,
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
                        color: 'red',
                        width: 1,
                        dot: 'dot'
                    }
                },
            ]
        };
        (0, nodeplotlib_1.plot)(data, layout);
    }
}
