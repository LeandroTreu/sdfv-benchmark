import fs from 'fs';

const file_path = "traces/short.json";
const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });

const trace = JSON.parse(file_data);

const traceEvents = trace.traceEvents;
const metadata = trace.metadata;
console.log(traceEvents[0]);

