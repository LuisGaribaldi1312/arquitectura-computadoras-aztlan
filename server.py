#!/usr/bin/env python3
"""
Servidor Central y API de Sincronización en Tiempo Real
Portal de Arquitectura de Computadoras - Universidad Aztlán (Clave 636)
Profesor Titular y Super Administrador: Ing. Luis Garibaldi
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys
import json
from urllib.parse import urlparse

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(DIRECTORY, "data")
DB_FILE = os.path.join(DATA_DIR, "aztlan_database.json")

os.makedirs(DATA_DIR, exist_ok=True)

def load_server_db():
    if os.path.exists(DB_FILE):
        try:
            with open(DB_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[!] Error leyendo {DB_FILE}: {e}")
    return {"version": 3, "progress": {}, "lastUpdated": None, "auditLog": []}

def save_server_db(data):
    try:
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[!] Error guardando {DB_FILE}: {e}")
        return False

def merge_progress(current_db, incoming_progress):
    if not incoming_progress:
        return current_db, False

    if "progress" not in current_db:
        current_db["progress"] = {}

    changed = False
    for st_id, st_data in incoming_progress.items():
        if st_id not in current_db["progress"]:
            current_db["progress"][st_id] = {
                "userId": st_id,
                "readTopics": [],
                "completedExercises": [],
                "scores": {},
                "exerciseAttempts": {},
                "timestamps": {},
                "teacherFeedback": {},
                "manualGrades": {
                    "investigacion": 0,
                    "reportes": 0,
                    "proyectos": 0,
                    "examenesParciales": 0,
                    "examenFinal": 0
                },
                "lastActivity": None
            }

        target = current_db["progress"][st_id]

        # 1. Fusionar lecturas de temas (Unión sin duplicados)
        incoming_reads = st_data.get("readTopics", [])
        for t in incoming_reads:
            if t not in target.get("readTopics", []):
                target.setdefault("readTopics", []).append(t)
                changed = True

        # 2. Fusionar ejercicios completados
        incoming_ex = st_data.get("completedExercises", [])
        for ex in incoming_ex:
            if ex not in target.get("completedExercises", []):
                target.setdefault("completedExercises", []).append(ex)
                changed = True

        # 3. Fusionar puntuaciones (Siempre la más alta, jamás reducirla)
        incoming_scores = st_data.get("scores", {})
        if "scores" not in target:
            target["scores"] = {}
        for ex_id, score in incoming_scores.items():
            curr = target["scores"].get(ex_id, 0)
            if score > curr:
                target["scores"][ex_id] = score
                changed = True

        # 4. Fusionar intentos
        incoming_att = st_data.get("exerciseAttempts", {})
        if "exerciseAttempts" not in target:
            target["exerciseAttempts"] = {}
        for ex_id, att in incoming_att.items():
            target["exerciseAttempts"][ex_id] = max(target["exerciseAttempts"].get(ex_id, 0), att)

        # 5. Fusionar marcas de tiempo
        incoming_ts = st_data.get("timestamps", {})
        if "timestamps" not in target:
            target["timestamps"] = {}
        target["timestamps"].update(incoming_ts)

        # 6. Fusionar temas desbloqueados manualmente
        incoming_unlocked = st_data.get("manuallyUnlockedTopics", [])
        for u in incoming_unlocked:
            if u not in target.get("manuallyUnlockedTopics", []):
                target.setdefault("manuallyUnlockedTopics", []).append(u)
                changed = True

        # 7. Preservar última actividad
        last_act = st_data.get("lastActivity")
        if last_act:
            if not target.get("lastActivity") or last_act > target.get("lastActivity"):
                target["lastActivity"] = last_act

    if changed:
        import datetime
        current_db["lastUpdated"] = datetime.datetime.now().isoformat()

    return current_db, changed

class SyncHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/sync":
            db = load_server_db()
            response_bytes = json.dumps({
                "success": True,
                "progress": db.get("progress", {}),
                "lastUpdated": db.get("lastUpdated")
            }, ensure_ascii=False).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(response_bytes)))
            self.end_headers()
            self.wfile.write(response_bytes)
            return

        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/sync":
            try:
                length = int(self.headers.get('Content-Length', 0))
                body = self.rfile.read(length).decode('utf-8')
                payload = json.loads(body)

                incoming_prog = payload.get("progress")
                if not incoming_prog and payload.get("studentId") and payload.get("studentProgress"):
                    incoming_prog = { payload["studentId"]: payload["studentProgress"] }

                db = load_server_db()
                db, changed = merge_progress(db, incoming_prog)

                if changed or not os.path.exists(DB_FILE):
                    save_server_db(db)
                    print(f"[+] Sincronización exitosa: Avances de alumnos actualizados en el servidor.")

                response_bytes = json.dumps({
                    "success": True,
                    "changed": changed,
                    "progress": db.get("progress", {}),
                    "lastUpdated": db.get("lastUpdated")
                }, ensure_ascii=False).encode("utf-8")

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(response_bytes)))
                self.end_headers()
                self.wfile.write(response_bytes)
            except Exception as e:
                print(f"[!] Error procesando /api/sync POST: {e}")
                err_bytes = json.dumps({"success": False, "error": str(e)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.send_header("Content-Length", str(len(err_bytes)))
                self.end_headers()
                self.wfile.write(err_bytes)
            return

        self.send_response(404)
        self.end_headers()

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
    print("   SERVIDOR CENTRAL CON API DE SINCRONIZACIÓN EN TIEMPO REAL")
    print("=" * 70)
    print(f"\n[+] Servidor HTTP y API de Sincronización activos:")
    print(f"[+] Acceso local del Profesor:       http://localhost:{PORT}")
    print(f"[+] Acceso en Red Local de Alumnos:  http://{local_ip}:{PORT}")
    print(f"[+] API de Sincronización Central:   http://localhost:{PORT}/api/sync")
    print("\n[+] Base de datos central en disco: data/aztlan_database.json")
    print("[+] Sincronización en Tiempo Real P2P y Nube: ACTIVA")
    print("[+] Presiona CTRL + C para detener el servidor.\n")
    print("=" * 70)

    # Abrir navegador automaticamente
    webbrowser.open(f"http://localhost:{PORT}")

    with socketserver.TCPServer(("", PORT), SyncHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido por el usuario.")
            sys.exit(0)

if __name__ == "__main__":
    main()
