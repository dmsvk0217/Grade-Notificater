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
