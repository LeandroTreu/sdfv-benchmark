import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';

const PLOT_FILES_IN_ONE_GRAPH = true;
// The files should be ordered according to version benchmarked
// Each consecutive TRACES_PER_VERSION number of files get put in the same bucket
const N_VERSIONS = 2; // Number of different benchmark versions to compare (each version gets a color in the graph)
const TRACES_PER_VERSION = 3; // Number of samples/traces per version
const CPU_UTIL_SAMPLE_WINDOW_SIZE_MS = 250; // Adjust for sampling resolution / smoothing (Chrome uses about 500 ms)

const files_in_directory = fs.readdirSync("results");

let data: Plot[] = [];
const layout = {
    title: "CPU Utilization",
    xaxis: {title: "Time (s)"},
    yaxis: {title: "Utilization (%)", range: [0, 100]},
}

let plot_index = 0;
let plot_colors = ["green", "red", "orange", "blue", "purple", "black"];
let line_color = plot_colors[0];

for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length) 

    if (filenamejsonsuffix === ".json") {
    
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });
        
        const json_data = JSON.parse(file_data);
        const tasks = json_data.tasks as Array<any>;
        
        // Sort tasks by timestamps
        tasks.sort((a, b) => a.ts - b.ts);

        // All units in microseconds
        let cpu_util_samples = [];
        let x_axis = [];
        const total_duration = tasks[tasks.length-1].ts + tasks[tasks.length-1].dur - tasks[0].ts;
        const window_size = CPU_UTIL_SAMPLE_WINDOW_SIZE_MS * 1000;
        let window_start = tasks[0].ts;
        let window_end = window_start + window_size;
        const n_samples = Math.floor(total_duration / window_size);

        for (let i = 0; i < n_samples; ++i) {

            let sample_cpu_idle_time = window_size;
            for (let j = 0; j < tasks.length; ++j) {

                const event = tasks[j];
                if (event.ts <= window_end && event.ts + event.dur >= window_start) {
                    const clipped_task_time = Math.min(event.dur, window_end - event.ts, event.ts + event.dur - window_start);
                    sample_cpu_idle_time -= clipped_task_time;
                }
            }
            if (sample_cpu_idle_time < 0) {
                sample_cpu_idle_time = 0;
            }

            let sample_cpu_util = 1 - (sample_cpu_idle_time / window_size);
            sample_cpu_util = Math.round(10000 * sample_cpu_util) / 10000;
            cpu_util_samples.push(sample_cpu_util * 100);
            x_axis.push((window_start - tasks[0].ts) / 1000000);

            window_start = window_start + window_size;
            window_end = window_start + window_size;
        }
        
        if (plot_index % TRACES_PER_VERSION === 0) {
            line_color = plot_colors[Math.round(plot_index / TRACES_PER_VERSION)]
        }
        const plot_filename = filename.replace("result-", "");
        const line: Plot = { 
            x: x_axis,
            y: cpu_util_samples,
            type: 'scatter',
            name: plot_filename,
            mode: 'lines',
            line: {
                width: 1,
                color: line_color,
            }
        };
        data.push(line);
        if (!PLOT_FILES_IN_ONE_GRAPH) {
            plot(data, layout);
        }
        
        plot_index++;
    }

}

if (PLOT_FILES_IN_ONE_GRAPH) {
    plot(data, layout);
}

