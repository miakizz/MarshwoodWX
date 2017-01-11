from bottle import route, run, template, hook, response
import requests

@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'

@route('/')
def index():
	r = requests.get('https://api.darksky.net/forecast/***REMOVED***/43.200710,-70.797379,2017-01-11T12:59:00-0500')
	moonPhase = int(r.json()["daily"]["data"][0]["moonPhase"] * 100)
	if(moonPhase == 0):
		moonStr = "New Moon"
	elif moonPhase > 0 and moonPhase < 25:
		moonStr = "Waxing Crescent"
	elif moonPhase == 25:
		moonStr = "First Quarter"
	elif moonPhase > 25 and moonPhase < 50:
		moonStr = "Waxing Gibbous"
	elif moonPhase == 50:
		moonStr = "Full Moon"
	elif moonPhase > 50 and moonPhase < 75:
		moonStr = "Waning Gibbous"
	elif moonPhase == 75:
		moonStr = "Last Quarter"
	elif moonPhase < 100:
		moonStr = "Waning Crescent"
	else:
		moonStr = "Error"
	return(moonStr)
    

run(host='localhost', port=8080)