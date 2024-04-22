#!/bin/bash

# Set these according to screen size and element positions
hover_start_x=884
hover_start_y=670
recording_button_x=1683
recording_button_y=161
hover_iter=30 # Mouse-movements per hover
repetitions=5 # Number of straight line hovers

# Alt+Tab to the browser window
xdotool key Alt+Tab
sleep 0.5

# Start recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1
sleep 0.5


# Set initial mouse position
xdotool mousemove --sync $hover_start_x $hover_start_y

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

# Stop recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1

# Alt+Tab back to the terminal
xdotool key Alt+Tab
