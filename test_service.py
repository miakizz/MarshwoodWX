'''
This is a service for weewx that logs the data from LOOP packets and archive records.
/usr/share/weewx/user/test_service.py is a symbolic link to this file, which is originally from /home/weather/MarshwoodWX/test_service.py
In order to make it run, add user.test_service.Tester to the list of report_services in /etc/weewx/weewx.conf
'''

from __future__ import print_function
# Append /usr/share/weewx to the path so "import weewx" works:
import sys
sys.path.append("/usr/share/weewx")
import weewx
from weewx.engine import StdService
from collections import OrderedDict
import json

class Tester(StdService):
    # Init method: Bind methods to appropriate events:
    def __init__(self, engine, config_dict):
        super(Tester, self).__init__(engine, config_dict)
        self.bind(weewx.NEW_LOOP_PACKET, self.new_loop_packet)
        self.bind(weewx.NEW_ARCHIVE_RECORD, self.new_archive_record)
    # Whenever there is a new loop packet, add the "LOOP" property and print the dict with the keys ordered alphabetically:
    def new_loop_packet(self, event):
        event.packet["AAAtype"] = "LOOP"
        with open("/home/weather/out.txt", "a") as file:
            print(json.dumps(OrderedDict(sorted(event.packet.items(), key=lambda t: t[0]))), file=file)
    # Whenever there is a new archive record, add the "archive" property and print the sorted dict just like above:
    def new_archive_record(self, event):
        event.record["AAAtype"] = "archive"
        with open("/home/weather/out.txt", "a") as file:
            print(json.dumps(OrderedDict(sorted(event.record.items(), key=lambda t: t[0]))), file=file)
