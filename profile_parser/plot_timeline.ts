import fs from 'fs';
import { plot, Plot } from 'nodeplotlib';

const files_in_directory = fs.readdirSync("results");

for (let i = 0; i < files_in_directory.length; ++i) {
    const filename = files_in_directory[i];
    const filenamejsonsuffix = filename.substring(filename.length - 5, filename.length) 

    if (filenamejsonsuffix === ".json") {
    
        const file_path = "results/" + filename;
        console.log("Parsing file %s ...", filename);
        const file_data = fs.readFileSync(file_path, { encoding: 'utf8' });
        
        const timeline = JSON.parse(file_data);
        const frames = timeline.tasks;
        
        let data: Plot[] = [];
        
        for (let i = 0; i < frames.length; ++i) {
        
            let event = frames[i]; 
        
            const line: Plot = { 
                x: [event.ts, event.ts + event.dur],
                y: [1, 1],
                type: 'scatter',
                name: (event.dur / 1000).toFixed(2) + "ms",
                mode: 'lines',
                line: {
                    width: 10
                }
            };
            data.push(line);
        }
        
        const layout = {
            title: "Frame Timeline " + filename,
            xaxis: {title: "Time (ticks)"},
        }
        
        plot(data, layout);
    }
}



