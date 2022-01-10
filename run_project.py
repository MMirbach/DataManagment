from config import server_port
import subprocess

with open("frontend/.env", "w") as env:
    env.write(f"REACT_APP_SERVER_PORT=\"{server_port}\"")

#  os.popen('python backend/bot.py')
#  os.popen('python backend/server.py')
process = subprocess.Popen('cd frontend && npm start', shell=True)
process.wait()

