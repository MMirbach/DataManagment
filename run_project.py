from config import server_port
import subprocess, os

with open("frontend/.env", "w") as env:
    env.write(f"REACT_APP_SERVER_PORT=\"{server_port}\"")

os.putenv('WERKZEUG_RUN_MAIN', 'true')

os.popen('CALL conda.bat activate DataManagment && python bot.py')
os.popen('CALL conda.bat activate DataManagment && python server.py')
process = subprocess.Popen('cd frontend && npm start', shell=True)
process.wait()

