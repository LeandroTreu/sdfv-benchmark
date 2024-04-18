import fs from 'fs';

// Take tasks as framtimes if they are at least this long in microseconds.
// Very short tasks (> 1ms) don't correspond to frames drawn.
const MIN_TASK_DURATION = 2000;

const file_path = "traces/short.json";
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

let frametimeEvents: {tasks: any[]} = {tasks: []};
for (let i = 0; i < traceEvents.length; ++i) {

    let event = traceEvents[i]; 
    if (event.pid === main_renderer_pid && event.tid === main_renderer_tid
        && event.name === "RunTask" && event.ph === "X") {

            if (event.dur > MIN_TASK_DURATION) {
                frametimeEvents.tasks.push(event);
            }
    }
}


const result_json = JSON.stringify(frametimeEvents, undefined, " ");
fs.writeFileSync("results/test.json", result_json);

