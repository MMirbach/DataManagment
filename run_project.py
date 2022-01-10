from config import server_port

with open("frontend/.env", "w") as env:
    env.write(f"REACT_APP_SERVER_PORT=\"{server_port}\"")

