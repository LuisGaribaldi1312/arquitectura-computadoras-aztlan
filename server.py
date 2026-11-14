#!/usr/bin/env python3
"""
Servidor Local para el Portal de Arquitectura de Computadoras
Universidad Aztlán - Clave 636
Profesor Titular: Ing. Luis Garibaldi
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Habilitar CORS y caché adecuada
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def main():
    os.chdir(DIRECTORY)
    local_ip = get_local_ip()

    print("=" * 70)
    print("   UNIVERSIDAD AZTLAN - ARQUITECTURA DE COMPUTADORAS (CLAVE 636)")
    print("   PROFESOR TITULAR & SUPER ADMINISTRADOR: ING. LUIS GARIBALDI")
    print("=" * 70)
    print(f"\n[+] Servidor iniciado correctamente.")
    print(f"[+] Acceso local en este equipo:      http://localhost:{PORT}")
    print(f"[+] Acceso en red local para alumnos: http://{local_ip}:{PORT}")
    print("\n[+] Sincronizacion P2P en tiempo real activa.")
    print("[+] Presiona CTRL + C para detener el servidor.\n")
    print("=" * 70)

    # Abrir navegador automaticamente
    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido por el usuario.")
            sys.exit(0)

if __name__ == "__main__":
    main()
