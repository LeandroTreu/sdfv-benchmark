"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const file_path = "traces/short.json";
const file_data = fs_1.default.readFileSync(file_path, { encoding: 'utf8' });
const trace = JSON.parse(file_data);
const traceEvents = trace.traceEvents;
const metadata = trace.metadata;
console.log(traceEvents[0]);
