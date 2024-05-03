#!/bin/bash

# Set these according to screen size and element positions
# Find mouse pointer coordinates with "xdotool getmouselocation"
zoom_x=881
zoom_y=674
recording_button_x=1683
recording_button_y=161
delay=50 # In ms, between scroll ticks
repetitions=50

# Alt+Tab to the browser window
xdotool key Alt+Tab
sleep 0.5

# Start recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1
sleep 0.5

# Set zoom mouse position
xdotool mousemove --sync $zoom_x $zoom_y
xdotool click --repeat $repetitions --delay $delay 4

# Stop recording in devtools
xdotool mousemove --sync $recording_button_x $recording_button_y
xdotool click 1

# Alt+Tab back to terminal
xdotool key Alt+Tab
