"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const nodeplotlib_1 = require("nodeplotlib");
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
            x_array.push(event.dur / 1000);
        }
        const hist = {
            x: x_array,
            type: 'histogram',
            autobinx: false,
            xbins: {
                start: 0,
                size: 1,
                end: 200
            },
            marker: {
                color: 'green'
            }
        };
        data.push(hist);
        const layout = {
            title: "Frametime Histogram for " + filename,
            xaxis: { title: "Frametime (ms)" },
            yaxis: { title: "Count" },
            shapes: [
                {
                    type: "line",
                    x0: 16.7,
                    y0: 0,
                    x1: 16.7,
                    y1: 30,
                    line: {
                        color: 'black',
                        width: 1,
                        dot: 'dot'
                    }
                },
            ]
        };
        (0, nodeplotlib_1.plot)(data, layout);
    }
}
