import { plot, Plot } from 'nodeplotlib';
import colors from "./color_cfg";

let data: Plot[] = [];

// Loading times for huge graph 255 MiB. JSON parsing step about 5 seconds
// Standard: 48, 48, 48, 48
// Change to Standard: 45, 48, 48, 49
let y_values = [48, 48];
let bar: Plot = { 
    x: ["Standard", "Change to Standard"],
    y: y_values,
    type: 'bar',
    name: "Standard",
    marker: {
        color: colors.BLUE,
    },
    // text: y_values.map(String),
    // textposition: "auto",
    // hoverinfo: "none",
    error_y: {
        type: 'data',
        symmetric: false,
        array: [0, 1],
        arrayminus: [0, 3],
        visible: true,
        color: "black",
        thickness: 1.0,
        width: 10,
    },
};
data.push(bar);

// Vertical: 37, 38, 39
// Change to Vertical: 34, 34, 37, 37, 38
y_values = [38, 37];
bar = { 
    x: ["Vertical", "Change to Vertical"],
    y: y_values,
    type: 'bar',
    name: "Vertical",
    marker: {
        color: colors.GREEN,
    },
    // text: y_values.map(String),
    // textposition: "auto",
    // hoverinfo: "none",
    error_y: {
        type: 'data',
        symmetric: false,
        array: [1, 1],
        arrayminus: [1, 3],
        visible: true,
        color: "black",
        thickness: 1.0,
        width: 10,
    },
};
data.push(bar);

const layout = {
    title: "Layout Loading Times",
    xaxis: {title: "Loading Scenario"},
    yaxis: {title: "Time (s)", autotick: false, dtick: 5, gridcolor: colors.GREY, gridwidth: 1.5},
}
plot(data, layout);
