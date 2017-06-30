"""TAngible Programmable Augmented Surface.

Usage:
  TAPAS.py [-d | --debug]
  TAPAS.py (-h | --help)
  TAPAS.py --version

Options:
  -d --debug    Enables debug.
  -h --help     Show this screen.
  --version     Show version.

"""
from docopt import docopt

from tornado.ioloop import IOLoop
from tornado import escape, gen, httpserver, ioloop, iostream, web, websocket
from tornado.websocket import websocket_connect
import logging
import datetime, json, os, time

logger = logging.getLogger("TAPAS")

class UIHandler(websocket.WebSocketHandler):
    clients = set()

    def open(self):
        self.stream.set_nodelay(True)
        self.timeout = ioloop.IOLoop.current().add_timeout(datetime.timedelta(minutes=60), self.on_close)
        logger.info('New connection from %s', self.request.remote_ip)
        self.set_nodelay(True)
        UIHandler.clients.add(self)

    def on_close(self):
        dead = set()
        for ws in UIHandler.clients:
            if not ws.ws_connection or not ws.ws_connection.stream.socket:
                dead.add(ws)
        for ws in dead:
            UIHandler.clients.remove(ws)
        logger.info('%s closed connection', self.request.remote_ip)

    def on_message(self, message):
        logger.info("Message received")

    def check_origin(*args, **kwargs):
        return True

    @classmethod
    def handle(cls, msg):
    	if msg["op"] == "ADD":
            UIHandler.send({"commands":[{"id" : msg["id"]-1, "cmd" : 0, "args" : {"left" : msg["pos"][0], "top" : msg["pos"][1], "theta" : 0}}]})
        elif msg["op"] == "REMOVE":
            UIHandler.send({"commands":[{"id" : msg["id"]-1, "cmd" : 9, "args" : {} }]})
            print "REMOVE"
        elif msg["op"] == "UPDATE":
            UIHandler.send({"commands":[{"id" : msg["id"]-1, "cmd" : 0, "args" : {"left" : msg["pos"][0], "top" : msg["pos"][1], "theta" : 0}}]})

    @classmethod
    def send(cls, jmsg):
        for c in UIHandler.clients:
            c.write_message(jmsg)


class WidgetsHandler(websocket.WebSocketHandler):
    clients = set()

    def open(self):
        self.stream.set_nodelay(True)
        self.timeout = ioloop.IOLoop.current().add_timeout(datetime.timedelta(minutes=60), self.on_close)
        logger.info('New connection from %s', self.request.remote_ip)
        self.set_nodelay(True)
        WidgetsHandler.clients.add(self)

    def on_close(self):
        dead = set()
        for ws in WidgetsHandler.clients:
            if not ws.ws_connection or not ws.ws_connection.stream.socket:
                dead.add(ws)
        for ws in dead:
            WidgetsHandler.clients.remove(ws)
        logger.info('%s closed connection', self.request.remote_ip)

    def on_message(self, message):
        logger.info("Message received")

    def check_origin(*args, **kwargs):
        return True

    @classmethod
    def handle(cls, msg):
    	return

    @classmethod
    def send(cls, msg):
        for c in WidgetsHandler.clients:
            c.write_message(json.dump(msg))

class Widgets(web.RequestHandler):
    def get(self):
        self.render("TAPASPlay/Widgets/index.html")

@gen.coroutine
def tui_handler():
    while True:
        try:
            web_sock = yield websocket_connect("ws://localhost:9002", None)
            logger.info("SPRITS connected!")
            while True:
                recv = yield web_sock.read_message()
                if recv is None:
                    break
                try:
                    logger.debug(recv)
                    UIHandler.handle(json.loads(recv))
                except ValueError:
                    logger.info("Wrong SPRITS message format")
        except Exception as e:
            logger.info("Cannot connect to SPRITS, trying again...")

if __name__ == '__main__':
    arguments = docopt(__doc__, version='TAPAS 0.1')

    settings = { "debug": True, "static_path": os.path.join(os.path.dirname(__file__), "TAPASPlay/Widgets") }

    logging.basicConfig(level=(logging.INFO if not arguments['--debug'] else logging.DEBUG), format='%(asctime)s %(levelname)s %(module)s - %(funcName)s: %(message)s', datefmt="%Y-%m-%d %H:%M:%S")

    application = web.Application([ (r"/ui", UIHandler), (r"/widgets", WidgetsHandler) ])
    server = ioloop.IOLoop.instance()
    server.add_callback(tui_handler)

    http_server = httpserver.HTTPServer(application)
    http_server.listen(9001, address="localhost")
    try:
        server.start()
    except KeyboardInterrupt:
        server.stop()
        IOLoop.instance().stop()
        logger.info("Exit success!")