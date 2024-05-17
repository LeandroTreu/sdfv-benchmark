import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';
import colors from "./color_cfg";

// The files should be ordered according to version benchmarked
// Each consecutive TRACES_PER_VERSION number of files get put in the same bucket
const N_VERSIONS = 2; // Number of different benchmark versions to compare (each version gets a color in the graph)
const TRACES_PER_VERSION = 3; // Number of samples/traces per version

const PLOT_TITLE = "Frametime Comparison";
const bar_colors = [colors.GREEN, colors.BLUE, colors.ORANGE, colors.RED];

let sample_index = 0;
let avg_frametimes: number[] = [];
let median_frametimes: number[] = [];
let percentile_frametimes: number[] = [];

const files_in_directory = fs.readdirSync("results");

let data: Plot[] = [];

for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length) 

    if (filenamejsonsuffix === ".json") {
    
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });
        const json_data = JSON.parse(file_data);
        const stats = json_data.statistics;

        const n_data_points = stats.NumberOfDataPoints;
        const avg_frametime = stats.AvgFrameTime;
        const median_frametime = stats.MedianFrameTime;
        const percentile_frametime = stats["95thPercentileFrameTime"];

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
            const plus_deltas = [avg_frametimes[avg_frametimes.length-1] - median_avg_ft, 
                                    median_frametimes[median_frametimes.length-1] - median_m_ft, 
                                    percentile_frametimes[percentile_frametimes.length-1] - median_p_ft];
            const y_values = [median_avg_ft, median_m_ft, median_p_ft];

            let plot_filename = filename.replace("result-", "");
            plot_filename = plot_filename.replace(".json", "");
            if (sample_index === 3) {
                // plot_filename = "Optimized";
                plot_filename = "Curved";
            }
            if (sample_index === 6) {
                // plot_filename = "Un-optimized";
                plot_filename = "Angular";
            }
            if (sample_index === 9) {
                plot_filename = "Straight";
            }

            const bar: Plot = { 
                x: ["Average", "Median", "95th Percentile"],
                y: y_values,
                type: 'bar',
                name: plot_filename,
                marker: {
                    color: bar_colors[Math.floor(sample_index / TRACES_PER_VERSION) - 1],
                },
                // text: y_values.map(String),
                // textposition: "auto",
                // hoverinfo: "none",
                error_y: {
                    type: 'data',
                    symmetric: false,
                    array: plus_deltas,
                    arrayminus: minus_deltas,
                    visible: true,
                    color: "black",
                    thickness: 1.0,
                    width: 10,
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
    title: PLOT_TITLE,
    yaxis: {title: "Frametime (ms)", autotick: false, dtick: 20, gridcolor: colors.GREY, gridwidth: 1.5},
    shapes: [
        // 60 fps line
        {
        opacity: 1.0,
        type: "line" as "line",
        x0: 0,
        y0: 16.7,
        x1: 1,
        y1: 16.7,
        xref: "paper" as "paper",
        line: {
            color: colors.YELLOW,
            width: 1,
            dot: 'dot'
        }
        },
        // 30 fps line
        {
        opacity: 1.0,
        type: "line" as "line",
        x0: 0,
        y0: 33.4,
        x1: 1,
        y1: 33.4,
        xref: "paper" as "paper",
        line: {
            color: colors.RED,
            width: 1,
            dot: 'dot'
        }
        },
    ]
}
plot(data, layout);
