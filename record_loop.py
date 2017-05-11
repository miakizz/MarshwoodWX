'''
This is a service for weewx that logs the data from LOOP packets.
/usr/share/weewx/user/record_loop.py is a symbolic link to this file, which is originally from /home/weather/MarshwoodWX/record_loop.py
In order to make it run, add user.record_loop.Recorder to the list of report_services in /etc/weewx/weewx.conf
'''

from __future__ import print_function
# Append /usr/share/weewx to the path so "import weewx" works:
import sys
sys.path.append("/usr/share/weewx")
import weewx
from weewx.engine import StdService
from collections import OrderedDict
import json

class Recorder(StdService):
    # Init method: Bind methods to appropriate events:
    def __init__(self, engine, config_dict):
        super(Recorder, self).__init__(engine, config_dict)
        self.bind(weewx.NEW_LOOP_PACKET, self.new_loop_packet)
    # Whenever there is a new loop packet, add the "LOOP" property and print the dict with the keys ordered alphabetically:
    def new_loop_packet(self, event):
        with open("/home/weather/loop_packet.json", "w") as file:
            print(json.dumps(OrderedDict(sorted(event.packet.items(), key=lambda t: t[0]))), file=file)
