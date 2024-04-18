"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// Take tasks as framtimes if they are at least this long in microseconds.
// Very short tasks (> 1ms) don't correspond to frames drawn.
const MIN_TASK_DURATION = 2000;
const files_in_directory = fs_1.default.readdirSync("traces");
for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length);
    if (filenamejsonsuffix === ".json") {
        const file_path = "traces/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs_1.default.readFileSync(file_path, { encoding: 'utf8' });
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
        let frametimeEvents = { tasks: [] };
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
        const result_file_path = "results/result-" + filename;
        fs_1.default.writeFileSync(result_file_path, result_json);
    }
}
