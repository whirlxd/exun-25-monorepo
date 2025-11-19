import requests
import sys
import os
import time

BASE_URL = "https://exunhack.onrender.com"
TOKEN = None
WORKER_HASH = None
HEADERS = {}
SESSION_FILE = "worker_session.txt"  # owo dont blame me


class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    GRAY = '\033[90m'


def print_header():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("""        _____                _____                    _____                    _____                    _____                                            _____                  
         /\    \              /\    \                  /\    \                  /\    \                  /\    \                 ______                   /\    \                 
        /::\    \            /::\    \                /::\    \                /::\____\                /::\____\               |::|   |                 /::\    \                
       /::::\    \           \:::\    \               \:::\    \              /::::|   |               /:::/    /               |::|   |                /::::\    \               
      /::::::\    \           \:::\    \               \:::\    \            /:::::|   |              /:::/    /                |::|   |               /::::::\    \              
     /:::/\:::\    \           \:::\    \               \:::\    \          /::::::|   |             /:::/    /                 |::|   |              /:::/\:::\    \             
    /:::/__\:::\    \           \:::\    \               \:::\    \        /:::/|::|   |            /:::/    /                  |::|   |             /:::/__\:::\    \            
   /::::\   \:::\    \          /::::\    \              /::::\    \      /:::/ |::|   |           /:::/    /                   |::|   |            /::::\   \:::\    \           
  /::::::\   \:::\    \        /::::::\    \    ____    /::::::\    \    /:::/  |::|   | _____    /:::/    /      _____         |::|   |           /::::::\   \:::\    \          
 /:::/\:::\   \:::\    \      /:::/\:::\    \  /\   \  /:::/\:::\    \  /:::/   |::|   |/\    \  /:::/____/      /\    \  ______|::|___|___ ____  /:::/\:::\   \:::\    \         
/:::/__\:::\   \:::\____\    /:::/  \:::\____\/::\   \/:::/  \:::\____\/:: /    |::|   /::\____\|:::|    /      /::\____\|:::::::::::::::::|    |/:::/__\:::\   \:::\____\        
\:::\   \:::\   \::/    /   /:::/    \::/    /\:::\  /:::/    \::/    /\::/    /|::|  /:::/    /|:::|____\     /:::/    /|:::::::::::::::::|____|\:::\   \:::\   \::/    /        
 \:::\   \:::\   \/____/   /:::/    / \/____/  \:::\/:::/    / \/____/  \/____/ |::| /:::/    /  \:::\    \   /:::/    /  ~~~~~~|::|~~~|~~~       \:::\   \:::\   \/____/         
  \:::\   \:::\    \      /:::/    /            \::::::/    /                   |::|/:::/    /    \:::\    \ /:::/    /         |::|   |           \:::\   \:::\    \             
   \:::\   \:::\____\    /:::/    /              \::::/____/                    |::::::/    /      \:::\    /:::/    /          |::|   |            \:::\   \:::\____\            
    \:::\   \::/    /    \::/    /                \:::\    \                    |:::::/    /        \:::\__/:::/    /           |::|   |             \:::\   \::/    /            
     \:::\   \/____/      \/____/                  \:::\    \                   |::::/    /          \::::::::/    /            |::|   |              \:::\   \/____/             
      \:::\    \                                    \:::\    \                  /:::/    /            \::::::/    /             |::|   |               \:::\    \                 
       \:::\____\                                    \:::\____\                /:::/    /              \::::/    /              |::|   |                \:::\____\                
        \::/    /                                     \::/    /                \::/    /                \::/____/               |::|___|                 \::/    /                
         \/____/                                       \/____/                  \/____/                  ~~                      ~~                       \/____/                 
                                                                                                                                                                                  
""")
    print(f"{Colors.BOLD}{Colors.CYAN}" + "etinuxe j*b terminal" + f"{Colors.ENDC}")
    


def safe_req(method, endpoint, json=None, params=None):
    try:
        url = f"{BASE_URL}{endpoint}"
        if method == 'GET':
            response = requests.get(url, headers=HEADERS, params=params)
        elif method == 'POST':
            response = requests.post(url, headers=HEADERS, json=json)

        return response
    except Exception as e:
        print(f"{Colors.RED}[!] Connection Error: {e}{Colors.ENDC}")
        return None


def save_session(hash_val):
    try:
        with open(SESSION_FILE, 'w') as f:
            f.write(hash_val)
    except:  # noqa: E722
        print(f"{Colors.RED}[!] Failed to save session {Colors.ENDC}")
        pass


def load_session():
    if os.path.exists(SESSION_FILE):
        try:
            with open(SESSION_FILE, 'r') as f:
                return f.read().strip()
        except:  # noqa: E722 ?? litr printing
            print(f"{Colors.RED}[!] Failed to load session {Colors.ENDC}")
            pass
    return None


def auth_flow():
    global TOKEN, HEADERS, WORKER_HASH
    saved_hash = load_session()
    if saved_hash:
        print(f"{Colors.YELLOW}[*] Found saved session...{Colors.ENDC}")
        HEADERS = {"Authorization": f"Bearer {saved_hash}"}
        res = safe_req('GET', f'/chat/conversations/{saved_hash}')
        if res and res.status_code == 200:
            WORKER_HASH = saved_hash
            TOKEN = saved_hash
            print(
                f"{Colors.GREEN}[+] Auto-login successful: {WORKER_HASH}{Colors.ENDC}"
            )
            time.sleep(1)
            return True
        else:
            print(f"{Colors.RED}[!] Session expired or invalid.{Colors.ENDC}")
            HEADERS = {}

    print(f"\n{Colors.BOLD}AUTHENTICATION REQUIRED{Colors.ENDC}")
    print(f"1. {Colors.CYAN}Login w/ Pass{Colors.ENDC}")
    print(f"2. {Colors.CYAN}Signup{Colors.ENDC}")
    print(f"3. {Colors.CYAN}Login w/ Hash{Colors.ENDC}")

    choice = input(f"\n{Colors.HEADER}SELECT > {Colors.ENDC}").strip()

    if choice == '2':
        print(f"\n{Colors.BOLD}--- NEW WORKER REGISTRATION ---{Colors.ENDC}")
        username = input("Username: ")
        email = input("Email: ")
        password = input("Password: (min 6)")
        

        res = safe_req('POST',
                       '/auth/worker/signup',
                       json={
                           "username": username,
                           "email": email,
                           "password": password
                       })

        if res and res.status_code in [200, 201]:
            data = res.json()
            h = data.get('worker', {}).get('hash')
            print(f"{Colors.GREEN}[+] Signup Success! Hash: {h}{Colors.ENDC}")
            print("Please login with option 1 or 3.")
        else:
            print(f"{Colors.RED}[!] Signup Failed{Colors.ENDC}")
        return False

    elif choice == '3':
        h = input("Enter Your Hash: ").strip()
        if h:
            WORKER_HASH = h
            TOKEN = h
            HEADERS = {"Authorization": f"Bearer {TOKEN}"}
            save_session(h)
            print(f"{Colors.GREEN}[+] Hash stored.{Colors.ENDC}")
            return True
        return False

    elif choice == '1':
        email = input("Email: ")
        password = input("Password: ")
        res = safe_req('POST',
                       '/auth/worker/login',
                       json={
                           "email": email,
                           "password": password
                       })

        if res and res.status_code == 200:
            data = res.json()
            WORKER_HASH = data.get('worker', {}).get('hash')
            TOKEN = data.get('token') or WORKER_HASH
            HEADERS = {"Authorization": f"Bearer {TOKEN}"}
            save_session(WORKER_HASH)
            print(f"{Colors.GREEN}[+] Login Successful{Colors.ENDC}")
            return True
        else:
            print(f"{Colors.RED}[!] Login Failed{Colors.ENDC}")
            return False

    return False


def display(key, value, color=Colors.GREEN):
    print(
        f"{Colors.GRAY}{key.ljust(15)}:{Colors.ENDC} {color}{value}{Colors.ENDC}"
    )


def get_missions():
    print(f"\n{Colors.BOLD}{Colors.CYAN}--- LATEST OPERATION ---{Colors.ENDC}")
    res = safe_req('GET', '/mission/latest')

    if res and res.status_code == 200:
        data = res.json()
        m = data.get('mission') if 'mission' in data else data
        if m and isinstance(m, dict) and ('mission_id' in m or 'hash' in m):
            print(f"{Colors.YELLOW}" + "-" * 40 + f"{Colors.ENDC}")
            display("MISSION ID", m.get('mission_id', 'N/A'), Colors.RED)
            display("LOCATION", m.get('location', 'N/A'))
            display("DATE", m.get('date', 'N/A'))
            display("TIME", m.get('time', 'N/A'))
            display("CLIENT HASH", m.get('user_hash', 'N/A'), Colors.BLUE)
            print(f"{Colors.YELLOW}" + "-" * 40 + f"{Colors.ENDC}")
        else:
            print(f"{Colors.GRAY}No active missions available.{Colors.ENDC}")
    else:
        print(f"{Colors.RED}Failed to fetch mission feed.{Colors.ENDC}")


def get_gambling():
    print(
        f"\n{Colors.BOLD}{Colors.CYAN}--- HIGH STAKES CONTRACTS ---{Colors.ENDC}"
    )
    res = safe_req('GET', '/gambling/latest')

    if res and res.status_code == 200:
        data = res.json()
        c = data.get('contract') if 'contract' in data else data

        if c and isinstance(c, dict) and ('contract_id' in c or 'hash' in c):
            print(f"{Colors.YELLOW}" + "-" * 40 + f"{Colors.ENDC}")
            display("CONTRACT ID", c.get('contract_id', 'N/A'), Colors.RED)
            display("VENUE", c.get('venue', 'N/A'))
            display("GAME", c.get('game_type', 'N/A'))
            display("BUY-IN",
                    f"{c.get('buy_in', '0')} {c.get('payment_type', '')}",
                    Colors.YELLOW)
            display("START",
                    f"{c.get('date', 'N/A')} @ {c.get('start_time', 'N/A')}")
            display("CLIENT", c.get('user_hash', 'N/A'), Colors.BLUE)
            print(f"{Colors.YELLOW}" + "-" * 40 + f"{Colors.ENDC}")
        else:
            print(f"{Colors.GRAY}No active gambling contracts.{Colors.ENDC}")
    else:
        print(f"{Colors.RED}Failed to fetch contracts.{Colors.ENDC}")


def chat_room(target_hash):
    os.system('cls' if os.name == 'nt' else 'clear')
    print(
        f"{Colors.BOLD}{Colors.BLUE}SECURE UPLINK ESTABLISHED >> {target_hash}{Colors.ENDC}"
    )
    print(
        f"{Colors.GRAY}Type 'exit' or 'back' to return to menu. Press Enter to refresh.{Colors.ENDC}"
    )
    print("-" * 50)

    last_count = 0

    while True:
        #  poll msgs
        res = safe_req('GET',
                       f'/chat/messages/{WORKER_HASH}',
                       params={'with': target_hash})
        if res and res.status_code == 200:

            msgs = res.json().get('messages') or []
            if len(msgs) > last_count:
                # compare and print only new
                for m in msgs[last_count:]:
                    is_me = m.get('from_hash') == WORKER_HASH
                    sender = "YOU" if is_me else "CLIENT"
                    color = Colors.GREEN if is_me else Colors.YELLOW
                    print(f"{color}[{sender}]{Colors.ENDC} {m.get('content')}")
                last_count = len(msgs)

        try:
            msg = input(f"{Colors.CYAN}MSG > {Colors.ENDC}").strip()
        except KeyboardInterrupt:
            break

        if msg.lower() in ['exit', 'back', 'quit']:
            break

        if msg:
            safe_req('POST',
                     '/chat/send',
                     json={
                         "from_hash": WORKER_HASH,
                         "to_hash": target_hash,
                         "content": msg
                     })


def chat_shell():
    while True:
        print(f"\n{Colors.BOLD}{Colors.CYAN}--- COMMS UPLINK ---{Colors.ENDC}")
        res = safe_req('GET', f'/chat/conversations/{WORKER_HASH}')
        convs = res.json().get('conversations',[]) if res and res.status_code == 200 else []

        if not convs:
            print(f"{Colors.GRAY}No active conversations.{Colors.ENDC}")

        print(f"\n{Colors.RED}[0]{Colors.ENDC} Back")
        print(f"{Colors.GREEN}[N]{Colors.ENDC} New Connection")

        for i, c in enumerate(convs):
            unread = f"{Colors.RED}*{Colors.ENDC}" if c.get('unread_count',0) > 0 else " "
            print(
                f"{Colors.YELLOW}[{i+1}]{Colors.ENDC} {unread} {c.get('participant_hash')} | {c.get('last_message')[:20]}..."
            )

        choice = input(
            f"\n{Colors.HEADER}SELECT > {Colors.ENDC}").strip().lower()

        if choice == '0' or choice == 'back':
            break
        elif choice == 'n':
            t = input("Target Hash: ").strip()
            if t:
                chat_room(t)
        elif choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(convs):
                chat_room(convs[idx].get('participant_hash'))


def main_shell():
    print_header()
    while not TOKEN:
        if not auth_flow():
            if input("Retry? (y/n): ").lower() != 'y':
                sys.exit(0)

    while True:
        print(
            f"\n{Colors.BOLD}{Colors.HEADER}WORKER::{WORKER_HASH[:8]}...{Colors.ENDC}"
        )
        print(f"1. {Colors.CYAN}View Latest Mission{Colors.ENDC}")
        print(f"2. {Colors.CYAN}View Gambling Contracts{Colors.ENDC}")
        print(f"3. {Colors.CYAN}Chat Uplink{Colors.ENDC}")
        print(f"4. {Colors.RED}Logout{Colors.ENDC}")
        print(f"5. {Colors.RED}Exit{Colors.ENDC}")

        cmd = input(
            f"\n{Colors.HEADER}COMMAND > {Colors.ENDC}").strip().lower()

        if cmd == '1' or cmd == 'missions':
            get_missions()
        elif cmd == '2' or cmd == 'gambling':
            get_gambling()
        elif cmd == '3' or cmd == 'chat':
            chat_shell()
        elif cmd == '4' or cmd == 'logout':
            if os.path.exists(SESSION_FILE):
                os.remove(SESSION_FILE)
            print("Logged out.")
            sys.exit(0)
        elif cmd == '5' or cmd == 'exit':
            sys.exit(0)
        elif cmd == 'clear':
            os.system('cls' if os.name == 'nt' else 'clear')
            print_header()


if __name__ == "__main__":
    try:
        main_shell()
    except KeyboardInterrupt:
        print("\nTerminated.")
