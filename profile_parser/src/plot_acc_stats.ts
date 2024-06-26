import { plot, Plot } from 'nodeplotlib';
import colors from "./color_cfg";

// Scroll
let data: Plot[] = [];
let benchmarks: {name: string, values: number[], color: string}[] = [];

benchmarks.push({name: "Un-optimized", values: [25.8, 23.4, 24.0], color: colors.BLUE});
benchmarks.push({name: "Opt. getImageData", values: [49.8, 51.0, 50.4], color: colors.ORANGE});
benchmarks.push({name: "Opt. willReadFrequently", values: [52.2, 52.2, 50.4], color: colors.ORANGE});
benchmarks.push({name: "Opt. GPU default", values: [57.6, 58.2, 58.2], color: colors.GREEN});
benchmarks.push({name: "Opt. GPU desync", values: [60.0, 60.0, 60.0], color: colors.GREEN});

for (let i = 0; i < benchmarks.length; ++i) {

    const benchmark = benchmarks[i];
    let values = benchmark.values;
    values.sort((a, b) => a - b);

    let y_values = [values[1]];
    let bar: Plot = { 
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
            array: [values[2]-values[1]],
            arrayminus: [values[1]-values[0]],
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
    yaxis: {title: "Average FPS", range: [0, 61], dtick: 5, gridcolor: colors.GREY, gridwidth: 1.5},
}
plot(data, layout);


// Panning
data = [];
benchmarks = [];

benchmarks.push({name: "Un-optimized", values: [17.4, 18.0, 17.4], color: colors.BLUE});
benchmarks.push({name: "Opt. getImageData", values: [25.2, 27.0, 25.8], color: colors.ORANGE});
benchmarks.push({name: "Opt. willReadFrequently", values: [27.0, 24.6, 27.0], color: colors.ORANGE});
benchmarks.push({name: "Opt. GPU default", values: [43.2, 42.0, 43.2], color: colors.GREEN});
benchmarks.push({name: "Opt. GPU desync", values: [40.8, 42.0, 42.0], color: colors.GREEN});

for (let i = 0; i < benchmarks.length; ++i) {

    const benchmark = benchmarks[i];
    let values = benchmark.values;
    values.sort((a, b) => a - b);

    let y_values = [values[1]];
    let bar: Plot = { 
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
            array: [values[2]-values[1]],
            arrayminus: [values[1]-values[0]],
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
    yaxis: {title: "Average FPS", range: [0, 61], dtick: 5, gridcolor: colors.GREY, gridwidth: 1.5},
}
plot(data, layout);