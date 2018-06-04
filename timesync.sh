#!/bin/bash
service ntp stop
ntpdate time.nist.gov
service ntp start
