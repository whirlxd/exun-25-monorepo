import requests
import sys
import os
import time
import shutil
import re
import hashlib
from cryptography.fernet import Fernet
import base64

BASE_URL = "https://exunhack.onrender.com"
TOKEN = None
WORKER_HASH = None
HEADERS = {}
SESSION_FILE = ".worker_session.enc"  


class Colors:
    GREEN = '\033[38;2;34;197;94m'      # #22C55E
    GRAY = '\033[38;2;75;85;99m'       # #4B5563
    MUTED = '\033[38;2;156;163;175m'   # #9CA3AF
    DIM = '\033[38;2;107;114;128m'     # #6B7280
    SOFT = '\033[38;2;229;231;235m'    # #E5E7EB
    RED = '\033[38;2;255;0;60m'        # #FF003C
    WHITE = '\033[38;2;255;255;255m'   # #FFFFFF
    BLACK = '\033[38;2;0;0;0m'         # #000000

    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    ENDC = '\033[0m'


ANSI_RE = re.compile(r'\x1b\[[0-9;]*m')


def strip_ansi(s: str) -> str:
    return ANSI_RE.sub('', s)


def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')


def print_header():
    clear_screen()
    width = shutil.get_terminal_size(fallback=(80, 24)).columns
    crest_line1 = """▄▀███▄  """
    crest_line2 = "        █▀██▄█  "

    text1 = f"{Colors.GREEN}NMIPC          {Colors.ENDC}"
    text2 = f"{Colors.MUTED}micro-ops field terminal{Colors.ENDC}"

    line1 = crest_line1 + text1
    line2 = crest_line2 + text2

    def center(line: str):
        raw_len = len(strip_ansi(line))
        pad = max(0, (width - raw_len) // 2)
        print(" " * pad + line)

    center(line1)
    center(line2)
    print("")

    sep = "─" * min(width - 4, 68)
    center(f"{Colors.GRAY}{sep}{Colors.ENDC}")
    print("")


def micro_delay(dot_count=3, delay=0.08):
    for _ in range(dot_count):
        sys.stdout.write(f"{Colors.DIM}.{Colors.ENDC}")
        sys.stdout.flush()
        time.sleep(delay)
    print("")


def safe_req(method, endpoint, json=None, params=None):
    try:
        url = f"{BASE_URL}{endpoint}"
        if method == 'GET':
            response = requests.get(url, headers=HEADERS, params=params)
        elif method == 'POST':
            response = requests.post(url, headers=HEADERS, json=json)
        else:
            return None
        return response
    except Exception as e:
        print(f"{Colors.RED}[!] connection error: {e}{Colors.ENDC}")
        return None


def get_machine_key():
    """Generate a key based on machine-specific identifiers"""
    try:
        machine_id = f"{os.getlogin()}-{os.name}-{sys.platform}"
    except:
        machine_id = f"{os.name}-{sys.platform}-fallback"
    

    key_material = hashlib.sha256(machine_id.encode()).digest()
    return base64.urlsafe_b64encode(key_material)


def save_session(hash_val):
    try:
        key = get_machine_key()
        cipher = Fernet(key)
        encrypted = cipher.encrypt(hash_val.encode())
        
        with open(SESSION_FILE, 'wb') as f:
            f.write(encrypted)
    except Exception as e:
        print(f"{Colors.RED}[!] failed to save session: {e}{Colors.ENDC}")


def load_session():
    if os.path.exists(SESSION_FILE):
        try:
            key = get_machine_key()
            cipher = Fernet(key)
            
            with open(SESSION_FILE, 'rb') as f:
                encrypted = f.read()
            
            decrypted = cipher.decrypt(encrypted)
            return decrypted.decode().strip()
        except Exception as e:
            print(f"{Colors.RED}[!] failed to load session (may be corrupted){Colors.ENDC}")
            # Remove corrupted session file
            try:
                os.remove(SESSION_FILE)
            except:
                pass
    return None


def auth_flow():
    global TOKEN, HEADERS, WORKER_HASH

    print_header()
    saved_hash = load_session()
    if saved_hash:
        print(f"{Colors.MUTED}[*] found saved session – verifying{Colors.ENDC}", end="")
        micro_delay(3, 0.05)
        HEADERS = {"Authorization": f"Bearer {saved_hash}"}
        res = safe_req('GET', f'/chat/conversations/{saved_hash}')
        if res and res.status_code == 200:
            WORKER_HASH = saved_hash
            TOKEN = saved_hash
            print(f"{Colors.GREEN}[+] auto-login: {WORKER_HASH[:8]}…{Colors.ENDC}")
            time.sleep(0.7)
            return True
        else:
            print(f"{Colors.RED}[!] session expired or invalid{Colors.ENDC}")
            HEADERS = {}

    print(f"{Colors.SOFT}{Colors.BOLD}auth required – nmipc operator node{Colors.ENDC}")
    print(f"{Colors.DIM}select authentication mode:{Colors.ENDC}")
    print(f"  {Colors.GREEN}1{Colors.ENDC}   login with password")
    print(f"  {Colors.GREEN}2{Colors.ENDC}   signup")
    print(f"  {Colors.GREEN}3{Colors.ENDC}   login with operator hash\n")

    choice = input(f"{Colors.DIM}select > {Colors.ENDC}").strip()

    if choice == '2':
        print(f"\n{Colors.SOFT}{Colors.BOLD}new operator registration{Colors.ENDC}")
        username = input(f"{Colors.SOFT}username: {Colors.ENDC}")
        email = input(f"{Colors.SOFT}email: {Colors.ENDC}")
        password = input(f"{Colors.SOFT}password (min 6): {Colors.ENDC}")

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
            print(f"{Colors.GREEN}[+] signup ok – worker-hash: {h}{Colors.ENDC}")
            print(f"{Colors.MUTED}use login option 1 or 3 next time.{Colors.ENDC}")
        else:
            print(f"{Colors.RED}[!] signup failed{Colors.ENDC}")
        time.sleep(1.2)
        return False

    elif choice == '3':
        h = input(f"{Colors.SOFT}operator hash: {Colors.ENDC}").strip()
        if h:
            WORKER_HASH = h
            TOKEN = h
            HEADERS = {"Authorization": f"Bearer {TOKEN}"}
            save_session(h)
            print(f"{Colors.GREEN}[+] manual hash accepted{Colors.ENDC}")
            time.sleep(0.7)
            return True
        return False

    elif choice == '1':
        email = input(f"{Colors.SOFT}email: {Colors.ENDC}")
        password = input(f"{Colors.SOFT}password: {Colors.ENDC}")
        print(f"{Colors.MUTED}authenticating", end="")
        micro_delay(3, 0.06)
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
            print(f"{Colors.GREEN}[+] login ok – worker::{WORKER_HASH[:8]}…{Colors.ENDC}")
            time.sleep(0.7)
            return True
        else:
            print(f"{Colors.RED}[!] login failed{Colors.ENDC}")
            time.sleep(1.0)
            return False

    return False


def display(key, value, color=Colors.SOFT):
    key_str = key.upper().ljust(14)
    print(f"{Colors.DIM}{key_str}{Colors.ENDC} {color}{value}{Colors.ENDC}")


def pause():
    input(f"\n{Colors.DIM}[enter] return to menu{Colors.ENDC}")


def get_missions():
    print(f"\n{Colors.GRAY}── {Colors.SOFT}latest operation feed{Colors.GRAY} ────────────────{Colors.ENDC}")
    res = safe_req('GET', '/mission/latest')

    if res and res.status_code == 200:
        data = res.json()
        m = data.get('mission') if 'mission' in data else data
        if m and isinstance(m, dict) and ('mission_id' in m or 'hash' in m):
            print(f"{Colors.GRAY}" + "─" * 48 + f"{Colors.ENDC}")
            display("mission id", m.get('mission_id', 'N/A'), Colors.RED)
            display("location", m.get('location', 'N/A'), Colors.GREEN)
            display("date", m.get('date', 'N/A'))
            display("time", m.get('time', 'N/A'))
            display("client hash", m.get('user_hash', 'N/A'), Colors.MUTED)
            print(f"{Colors.GRAY}" + "─" * 48 + f"{Colors.ENDC}")
        else:
            print(f"{Colors.MUTED}no active missions available.{Colors.ENDC}")
    else:
        print(f"{Colors.RED}[!] failed to fetch mission feed{Colors.ENDC}")

    pause()


def get_gambling():
    print(f"\n{Colors.GRAY}── {Colors.SOFT}high-stakes contracts{Colors.GRAY} ───────────────{Colors.ENDC}")
    res = safe_req('GET', '/gambling/latest')

    if res and res.status_code == 200:
        data = res.json()
        c = data.get('contract') if 'contract' in data else data

        if c and isinstance(c, dict) and ('contract_id' in c or 'hash' in c):
            print(f"{Colors.GRAY}" + "─" * 48 + f"{Colors.ENDC}")
            display("contract id", c.get('contract_id', 'N/A'), Colors.RED)
            display("venue", c.get('venue', 'N/A'), Colors.GREEN)
            display("game", c.get('game_type', 'N/A'))
            buy_in = f"{c.get('buy_in', '0')} {c.get('payment_type', '').replace('_', ' ')}".strip()
            display("buy-in", buy_in)
            start = f"{c.get('date', 'N/A')} @ {c.get('start_time', 'N/A')}"
            display("start", start)
            display("client", c.get('user_hash', 'N/A'), Colors.MUTED)
            print(f"{Colors.GRAY}" + "─" * 48 + f"{Colors.ENDC}")
        else:
            print(f"{Colors.MUTED}no active gambling contracts.{Colors.ENDC}")
    else:
        print(f"{Colors.RED}[!] failed to fetch contracts{Colors.ENDC}")

    pause()


def chat_room(target_hash):
    clear_screen()
    width = shutil.get_terminal_size(fallback=(80, 24)).columns
    title = f"{Colors.SOFT}{Colors.BOLD}uplink: {target_hash}{Colors.ENDC}"
    subtitle = f"{Colors.MUTED}secure micro-channel established{Colors.ENDC}"
    sep = "─" * min(width - 4, 68)

    def center(line: str):
        raw_len = len(strip_ansi(line))
        pad = max(0, (width - raw_len) // 2)
        print(" " * pad + line)

    center(f"{Colors.GRAY}{sep}{Colors.ENDC}")
    center(title)
    center(subtitle)
    center(f"{Colors.GRAY}{sep}{Colors.ENDC}")
    print(f"{Colors.DIM}type 'exit' or 'back' to return. press enter to refresh.{Colors.ENDC}\n")

    last_count = 0

    while True:
        res = safe_req('GET',
                       f'/chat/messages/{WORKER_HASH}',
                       params={'with': target_hash})
        if res and res.status_code == 200:
            msgs = res.json().get('messages') or []
            if len(msgs) > last_count:
                for m in msgs[last_count:]:
                    is_me = m.get('from_hash') == WORKER_HASH
                    sender = "YOU" if is_me else "CLIENT"
                    color = Colors.GREEN if is_me else Colors.RED
                    print(f"{color}[{sender}]{Colors.ENDC} {Colors.SOFT}{m.get('content')}{Colors.ENDC}")
                last_count = len(msgs)

        try:
            msg = input(f"{Colors.DIM}msg > {Colors.ENDC}").strip()
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
        print(f"\n{Colors.GRAY}── {Colors.SOFT}comms uplink{Colors.GRAY} ───────────────────────{Colors.ENDC}")
        res = safe_req('GET', f'/chat/conversations/{WORKER_HASH}')
        convs = res.json().get('conversations', []) if res and res.status_code == 200 else []

        if not convs:
            print(f"{Colors.MUTED}no active conversations.{Colors.ENDC}")

        print(f"\n  {Colors.RED}[0]{Colors.ENDC}   back")
        print(f"  {Colors.GREEN}[N]{Colors.ENDC}   new connection\n")

        for i, c in enumerate(convs):
            unread = f"{Colors.RED}*{Colors.ENDC}" if c.get('unread_count', 0) > 0 else " "
            last_msg = c.get('last_message') or ""
            if len(last_msg) > 32:
                last_msg = last_msg[:29] + "..."
            print(
                f"  {Colors.SOFT}[{i+1}]{Colors.ENDC} {unread} {Colors.DIM}{c.get('participant_hash')} | {Colors.SOFT}{last_msg}{Colors.ENDC}"
            )

        choice = input(f"\n{Colors.DIM}select > {Colors.ENDC}").strip().lower()

        if choice in ['0', 'back']:
            break
        elif choice == 'n':
            t = input(f"{Colors.SOFT}target hash: {Colors.ENDC}").strip()
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
            ans = input(f"{Colors.DIM}retry? (y/n): {Colors.ENDC}").lower()
            if ans != 'y':
                sys.exit(0)
            print_header()

    while True:
        print_header()
        print(f"{Colors.MUTED}operator node: {Colors.GREEN}{WORKER_HASH[:9]}{Colors.ENDC}")
        print(f"{Colors.GRAY}\n── operations ───────────────────────────────{Colors.ENDC}")
        print(f"  {Colors.GREEN}1{Colors.ENDC}   mission feed")
        print(f"  {Colors.GREEN}2{Colors.ENDC}   gambling adjustments")
        print(f"  {Colors.GREEN}3{Colors.ENDC}   comms uplink")

        print(f"{Colors.GRAY}\n── session ──────────────────────────────────{Colors.ENDC}")
        print(f"  {Colors.RED}4{Colors.ENDC}   logout")
        print(f"  {Colors.RED}5{Colors.ENDC}   exit\n")

        cmd = input(f"{Colors.DIM}command > {Colors.ENDC}").strip().lower()

        if cmd in ['1', 'missions', 'm']:
            get_missions()
        elif cmd in ['2', 'gambling', 'g']:
            get_gambling()
        elif cmd in ['3', 'chat', 'c']:
            chat_shell()
        elif cmd in ['4', 'logout']:
            if os.path.exists(SESSION_FILE):
                os.remove(SESSION_FILE)
            print(f"{Colors.MUTED}logged out. session cleared.{Colors.ENDC}")
            time.sleep(0.6)
            clear_screen()
            time.sleep(0.4)
            sys.exit(0)
        elif cmd in ['5', 'exit', 'q']:
            print(f"{Colors.MUTED}terminating session.{Colors.ENDC}")
            time.sleep(0.4)
            sys.exit(0)
        elif cmd in ['clear', 'cls']:
            print_header()
        else:
            print(f"{Colors.DIM}unrecognized command.{Colors.ENDC}")
            time.sleep(0.4)


if __name__ == "__main__":
    try:
        main_shell()
    except KeyboardInterrupt:
        print(f"\n{Colors.MUTED}session terminate by operator.{Colors.ENDC}")
