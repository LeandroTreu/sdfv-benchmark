"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodeplotlib_1 = require("nodeplotlib");
const color_cfg_1 = __importDefault(require("./color_cfg"));
// Scroll
let data = [];
let benchmarks = [];
benchmarks.push({ name: "Un-optimized", values: [25.8, 23.4, 24.0], color: color_cfg_1.default.BLUE });
benchmarks.push({ name: "Opt. getImageData", values: [49.8, 51.0, 50.4], color: color_cfg_1.default.ORANGE });
benchmarks.push({ name: "Opt. willReadFrequently", values: [52.2, 52.2, 50.4], color: color_cfg_1.default.ORANGE });
benchmarks.push({ name: "Opt. GPU default", values: [57.6, 58.2, 58.2], color: color_cfg_1.default.GREEN });
benchmarks.push({ name: "Opt. GPU desync", values: [60.0, 60.0, 60.0], color: color_cfg_1.default.GREEN });
for (let i = 0; i < benchmarks.length; ++i) {
    const benchmark = benchmarks[i];
    let values = benchmark.values;
    values.sort((a, b) => a - b);
    let y_values = [values[1]];
    let bar = {
        x: [benchmark.name],
        y: y_values,
        type: 'bar',
        marker: {
            color: benchmark.color,
        },
        name: benchmark.name,
        // text: y_values.map(String),
        // textposition: "auto",
        // hoverinfo: "none",
        error_y: {
            type: 'data',
            symmetric: false,
            array: [values[2] - values[1]],
            arrayminus: [values[1] - values[0]],
            visible: true,
            color: "black",
            thickness: 1.0,
            width: 10,
        },
    };
    data.push(bar);
}
let layout = {
    title: "Zoom FPS Benchmark",
    yaxis: { title: "Average FPS", range: [0, 61], dtick: 5 },
};
(0, nodeplotlib_1.plot)(data, layout);
// Panning
data = [];
benchmarks = [];
benchmarks.push({ name: "Un-optimized", values: [17.4, 18.0, 17.4], color: color_cfg_1.default.BLUE });
benchmarks.push({ name: "Opt. getImageData", values: [25.2, 27.0, 25.8], color: color_cfg_1.default.ORANGE });
benchmarks.push({ name: "Opt. willReadFrequently", values: [27.0, 24.6, 27.0], color: color_cfg_1.default.ORANGE });
benchmarks.push({ name: "Opt. GPU default", values: [43.2, 42.0, 43.2], color: color_cfg_1.default.GREEN });
benchmarks.push({ name: "Opt. GPU desync", values: [40.8, 42.0, 42.0], color: color_cfg_1.default.GREEN });
for (let i = 0; i < benchmarks.length; ++i) {
    const benchmark = benchmarks[i];
    let values = benchmark.values;
    values.sort((a, b) => a - b);
    let y_values = [values[1]];
    let bar = {
        x: [benchmark.name],
        y: y_values,
        type: 'bar',
        marker: {
            color: benchmark.color,
        },
        name: benchmark.name,
        // text: y_values.map(String),
        // textposition: "auto",
        // hoverinfo: "none",
        error_y: {
            type: 'data',
            symmetric: false,
            array: [values[2] - values[1]],
            arrayminus: [values[1] - values[0]],
            visible: true,
            color: "black",
            thickness: 1.0,
            width: 10,
        },
    };
    data.push(bar);
}
layout = {
    title: "Panning FPS Benchmark",
    yaxis: { title: "Average FPS", range: [0, 61], dtick: 5 },
};
(0, nodeplotlib_1.plot)(data, layout);
