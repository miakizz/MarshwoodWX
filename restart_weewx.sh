#!/bin/bash
filename=/var/www/html/weewx/index.html
if [[ $(find "$filename" -mmin +10) ]]; then
    service weewx restart
    touch "$filename"
fi
