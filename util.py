import locale
from datetime import datetime


def get_current_time():
    # Set the locale to Korean
    locale.setlocale(locale.LC_TIME, "ko_KR.UTF-8")

    # Get the current date and time
    current_datetime = datetime.now()

    # Format the date and time in Korean
    formatted_datetime = current_datetime.strftime("%m월%d일 %H:%M")

    # Return the formatted time
    return formatted_datetime


def find_subjects_with_changed_scores(arr1, arr2):
    differing_subjects = []
    for i in range(1, len(arr2)):
        print(arr2[i][8])
        if arr1 == "":
            differing_subjects.append(arr2[i][2])
            continue
        if arr1[i][8] != arr2[i][8]:
            differing_subjects.append(arr2[i][2])
    return ", ".join(differing_subjects)
