#!/bin/bash

# Set these according to screen size and element positions
# Find mouse pointer coordinates with "xdotool getmouselocation"
panning_start_x=1010
panning_start_y=600
recording_button_x=1683
recording_button_y=161
n_mousemove=20 # Mouse-movements per panning
panning_repetitions=5

# Alt+Tab to the browser window
xdotool key Alt+Tab
sleep 0.5

# Start recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1
sleep 0.5


xdotool mousemove --sync $panning_start_x $panning_start_y
xdotool mousedown 1
for ((j = 0; j < panning_repetitions; j++)); do
    
    for ((i = 0; i < n_mousemove; i++)); do
        
        sleep 0.025
        xdotool mousemove_relative --sync 0 20
    done
    for ((i = 0; i < n_mousemove; i++)); do
        
        sleep 0.025
        xdotool mousemove_relative --sync -- 0 -20
    done
done
xdotool mouseup 1


# Stop recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1

# Alt+Tab back to the terminal
xdotool key Alt+Tab
