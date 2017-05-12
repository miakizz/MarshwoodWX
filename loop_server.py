'''
This hosts a WSGI server on localhost:8000 that returns a JSON file containing the data from the most recent LOOP packet.
'''

from wsgiref.simple_server import make_server
import sys

# This is the file location of the JSON file:
filename = "/home/weather/loop_packet.json"
# If a file has been specified in a command line argument, use that:
if len(sys.argv) > 1: filename = sys.argv[1]

# This is the WSGI handler:
def serve_json(environ, start_response):
    # Get the data from the JSON file:
    with open(filename, "rb") as file: data = file.read()
    # Start response with 200 status and JSON content-type:
    # Remember to add Access-Control-Allow-Origin so AJAX will work.
    start_response("200 OK", [
        ("Content-Type", "application/json; charset=utf-8"), ("Content-Length", str(len(data))),
        ("Access-Control-Allow-Origin", "*")
    ])
    # Return the data from the file:
    return [data]

# Host the WSGI server on localhost:8000
httpd = make_server("localhost", 8000, serve_json)
httpd.serve_forever()
