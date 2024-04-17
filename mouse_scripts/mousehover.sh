#!/bin/bash

# Alt+Tab to the browser window
xdotool key Alt+Tab

# Set initial mouse position
xdotool mousemove --sync 800 480

hover_iter=30
repetitions=5

for ((r = 0; r < repetitions; r++)); do

    # Move mouse down
    for ((i = 0; i < hover_iter; i++)); do
        
        sleep 0.01
        xdotool mousemove_relative --sync 0 10
    done


    # Move mouse up again
    for ((i = 0; i < hover_iter; i++)); do
        
        sleep 0.01
        xdotool mousemove_relative --sync -- 0 -10
    done

done
