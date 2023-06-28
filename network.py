import socket
import time

from util import get_current_time


def is_network_active():
    try:
        # Attempt to connect to a remote server
        socket.create_connection(("www.google.com", 80), timeout=1)
        return True
    except OSError:
        return False


def wait_for_network():
    while not is_network_active():
        print(get_current_time() + "Waiting for network...")
        # 네트워크가 불안정한 경우 20분 대기 후 다시 확인
        time.sleep(1200)
