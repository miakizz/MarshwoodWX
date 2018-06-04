# MarshwoodWX
Weewx skin, useful for non-interactive displays, using Google Materlize

# Notes
 * `/etc/weewx/skins/MarshwoodWX` is a symbolic link to the `MarshwoodWX` directory in this Git repo.
 * `record_loop.py` is a service for weewx that logs the LOOP packets from the weather station.
 * `loop_server.py` hosts a JSON file containing the data from the LOOP packets on http://localhost:8000.
 * `timesync.sh` is a shell script that links the computer's time to time.nist.gov.
 * `restart_weewx.sh` is a shell script that restarts weewx if it fails to update the HTML page.
 * `test_packet.json` is a JSON file containing data from an example LOOP packet.

## To do:
 * Create better startup script
