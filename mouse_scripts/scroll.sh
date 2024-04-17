#!/bin/bash

# Alt+Tab to the browser window
xdotool key Alt+Tab

# Set initial mouse position
xdotool mousemove --sync 737 558

delay=20
repetitions=600

xdotool click --repeat $repetitions --delay $delay 4

