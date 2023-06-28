from difflib import SequenceMatcher
import time
from get_data import convert_to_hashable, crawl_table
from c_token import f_auth, f_auth_refresh, f_send_talk
from network import wait_for_network
from util import find_subjects_with_changed_scores
import time

# Initialize previous data as an empty string or load it from a persistent storage
previous_data = ""
r_token = f_auth()


# Function to send a notification
def send_notification(message):
    print(message)
    token = f_auth_refresh(r_token)
    f_send_talk(token, message)


while True:
    wait_for_network()

    current_data = crawl_table()

    current_data_hashable = convert_to_hashable(current_data)
    previous_data_hashable = convert_to_hashable(previous_data)

    similarity_ratio = SequenceMatcher(
        None, previous_data_hashable, current_data_hashable
    ).ratio()
    if similarity_ratio < 1.0 and previous_data != "":
        result = find_subjects_with_changed_scores(previous_data, current_data)
        send_notification(result + " 성적뜸!!")
    previous_data = current_data
    time.sleep(30)
