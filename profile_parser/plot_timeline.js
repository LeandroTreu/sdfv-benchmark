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
        for (let i = 0; i < frames.length; ++i) {
            let event = frames[i];
            const line = {
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
            title: "Frame Timeline " + filename,
            xaxis: { title: "Time (ticks)" },
        };
        (0, nodeplotlib_1.plot)(data, layout);
    }
}
