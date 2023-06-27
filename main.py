from difflib import SequenceMatcher
import time
from get_data import convert_to_hashable, crawl_table, send_notification

# Initialize previous data as an empty string or load it from a persistent storage
previous_data = ""

while True:
    current_data = crawl_table()

    current_data_hashable = convert_to_hashable(current_data)
    previous_data_hashable = convert_to_hashable(previous_data)

    similarity_ratio = SequenceMatcher(
        None, previous_data_hashable, current_data_hashable
    ).ratio()
    if similarity_ratio < 1.0:
        send_notification("Data mismatch detected!")
    previous_data = current_data
    time.sleep(600)
