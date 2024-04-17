#!/bin/bash

xdotool mousemove --sync 500 500
xdotool mousedown 1


num_iterations=20

for ((i = 0; i < num_iterations; i++)); do
    
    sleep 0.025
    xdotool mousemove_relative --sync 20 20
done


xdotool mouseup 1

