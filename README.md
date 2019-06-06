# MarshwoodWX
Weewx skin, useful for non-interactive displays, using Google Materlize

# Notes
 * `/etc/weewx/skins/MarshwoodWX` is a symbolic link to the `MarshwoodWX` directory in this Git repo.
 * `record_loop.py` is a service for weewx that logs the LOOP packets from the weather station.
 * `loop_server.py` hosts a JSON file containing the data from the LOOP packets on http://localhost:8000.
 * `timesync.sh` is a shell script that links the computer's time to time.nist.gov.
 * `restart_weewx.sh` is a shell script that restarts weewx if it fails to update the HTML page.
 * `test_packet.json` is a JSON file containing data from an example LOOP packet.

# CRON jobs (added by using `crontab -e` command)

    @reboot /home/weather/weewx/timesync.sh
    @reboot /home/weather/weewx/loop_server.py
    @reboot cd /var/www/html/weewx/ && python3 -m http.server 8080
    * * * * * /home/weather/weewx/restart_weewx.sh
    * * * * * pgrep firefox || (export DISPLAY=:0 && firefox)
    * * * * * export DISPLAY=:0 && wmctrl -a firefox
    0 5 * * * shutdown -r now