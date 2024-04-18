import fs from 'fs';

// Take tasks as framtimes if they are at least this long in microseconds.
// Very short tasks (< 2ms) don't correspond to frames drawn.
const MIN_TASK_DURATION = 2000;

const files_in_directory = fs.readdirSync("traces");

for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length) 

    if (filenamejsonsuffix === ".json") {
        
        const file_path = "traces/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });
        const trace = JSON.parse(file_data);

        const traceEvents = trace.traceEvents;
        const metadata = trace.metadata;

        let main_renderer_pid = undefined;
        let main_renderer_tid = undefined;
        for (let i = 0; i < traceEvents.length; ++i) {

            let event = traceEvents[i]; 
            if (event.args.name === "CrRendererMain") {
                main_renderer_pid = event.pid;
                main_renderer_tid = event.tid;
                break;
            }
        }

        if (main_renderer_pid === undefined || main_renderer_tid === undefined) {
            throw Error("Main renderer pid and tid not found");
        }

        let frametimeEvents: {
            statistics: any,
            metadata: any,
            tasks: any,
        } = {
            statistics: [],
            metadata: [],
            tasks: [],
        };

        let frametimes: number[] = [];
        for (let i = 0; i < traceEvents.length; ++i) {

            let event = traceEvents[i]; 
            if (event.pid === main_renderer_pid && event.tid === main_renderer_tid
                && event.name === "RunTask" && event.ph === "X") {

                    if (event.dur > MIN_TASK_DURATION) {
                        frametimeEvents.tasks.push(event);
                        frametimes.push(event.dur / 1000);
                    }
            }
        }
        
        frametimes.sort((a, b) => a - b);
        
        let sum = 0;
        for (let i = 0; i < frametimes.length; ++i) {
            sum += (frametimes[i]);
        }
        const avg_frametime = Math.round((sum / frametimes.length) * 100) / 100;

        const median_index = Math.floor(0.5 * frametimes.length);
        const median_frametime = Math.round((frametimes[median_index]) * 100) / 100;

        const ninetyfifth_percentile_index = Math.floor(0.95 * frametimes.length);
        const ninetyfifth_percentile_frametime = Math.round(frametimes[ninetyfifth_percentile_index] * 100) / 100;

        const statistics = {
            "NumberOfDataPoints": frametimes.length,
            "AvgFrameTime": avg_frametime,
            "MedianFrameTime": median_frametime,
            "95thPercentileFrameTime": ninetyfifth_percentile_frametime
        }

        frametimeEvents.statistics = statistics;
        frametimeEvents.metadata = metadata;

        const result_json = JSON.stringify(frametimeEvents, undefined, " ");
        const result_file_path = "results/result-" + filename;
        fs.writeFileSync(result_file_path, result_json);
    }
}



