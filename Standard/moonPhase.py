from bottle import route, run, template, hook, response
import requests

# This header allows the server to be used as an API:
@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'

@route('/')
def index():
    # Get the moonPhase data
	r = requests.get('https://api.darksky.net/forecast/***REMOVED***/43.200710,-70.797379,2017-01-11T12:59:00-0500')
    # We multiply by 100 and convert to int for exact comparisons:
	moonPhase = int(r.json()["daily"]["data"][0]["moonPhase"] * 100)
    # Based off the number, get a description:
	if moonPhase == 0:
		moonStr = "New Moon"
	elif moonPhase < 25:
		moonStr = "Waxing Crescent"
	elif moonPhase == 25:
		moonStr = "First Quarter"
	elif moonPhase < 50:
		moonStr = "Waxing Gibbous"
	elif moonPhase == 50:
		moonStr = "Full Moon"
	elif moonPhase < 75:
		moonStr = "Waning Gibbous"
	elif moonPhase == 75:
		moonStr = "Last Quarter"
	elif moonPhase < 100:
		moonStr = "Waning Crescent"
    # We should never reach this case and something has gone wrong if we do:
	else:
		moonStr = "Error"
    # Finally, return the description:
	return moonStr
    
run(host='localhost', port=8080)
