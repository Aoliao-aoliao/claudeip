import http.server, socketserver, os
PORT = 8900
class H(http.server.SimpleHTTPRequestHandler):
    def guess_type(self, path):
        t = super().guess_type(path)
        if isinstance(t, str) and t == "text/html": return "text/html; charset=utf-8"
        return t
    def log_message(self, f, *a): pass
os.chdir(os.path.dirname(os.path.abspath(__file__)))
with socketserver.TCPServer(("", PORT), H) as s:
    print(f"http://localhost:{PORT}")
    s.serve_forever()
