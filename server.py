#!/usr/bin/env python3
"""
Simple HTTP server that always serves index.html at the root
"""
import http.server
import socketserver
import os

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()
    
    def do_GET(self):
        # If root path, serve index.html
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()

PORT = 8000

# Get the directory where server.py is located
SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
print(f"Server directory: {SERVER_DIR}")
print(f"Index.html exists: {os.path.exists(os.path.join(SERVER_DIR, 'index.html'))}")

# Change to that directory
os.chdir(SERVER_DIR)

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()

