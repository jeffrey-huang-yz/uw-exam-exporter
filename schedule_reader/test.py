import re
from pymongo import MongoClient
data = """

PAC 1, 2, 3, 4, 5, 6, 7, 8, MATH 138 0 0 1 -009,011MondayApril 15, 2024 12:30 PM3:00 PM PAC UPPER 9, 10, MC 4020
"""
def replace_multiple_spaces(text):
    while '  ' in text:
        text = text.replace('  ', ' ')
    return text


def extract_info(row):
    isPac = False
    row = replace_multiple_spaces(row)
    row = row.replace("0 ", "0")
    row = row.replace("1 ", "1")
    pattern = r'([A-Z]+\s\d{3}[A-Z]?)?(?:\s)?(\d{3}(?:\s)?-\d{3}(?:,\d{3})*|\d{3}-\d{3}|\d{3}(?:,\d{3})*|\d{3})?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?(\w+)? (\d{1,2})?,? (\d{4}) (\d{1,2}:\d{2}[AP]M)?(\d{1,2}:\d{2}[AP]M)?(.*)?'
    if "PAC 1, 2, 3, 4, 5, 6, 7, 8,"in row:
        row=row.replace("PAC 1, 2, 3, 4, 5, 6, 7, 8, ", "")
        isPac = True
    elif "PAC 1, 2, 3, 4, 5, 6, 7, 8 " in row:
        row=row.replace("PAC 1, 2, 3, 4, 5, 6, 7, 8 ", "")
        isPac = True
    match = re.match(pattern, row)
    if match:
        course_code = match.group(1)
        course_section = match.group(2) if match.group(2) else ''
        day_of_week = match.group(3) if match.group(3) else ''
        month = match.group(4) if match.group(4) else ''
        day = match.group(5) if match.group(5) else ''
        year = match.group(6) if match.group(6) else ''
        start_time = match.group(7) if match.group(7) else ''
        end_time = match.group(8) if match.group(8) else ''
        location = match.group(9) if match.group(9) else ''
        if isPac == True:
            location = "PAC 1, 2, 3, 4, 5, 6, 7, 8" + location 
        return course_code, course_section, day_of_week, month, day, year, start_time, end_time, location
    else:
        pattern2 = r'([A-Z]+\s\d{3}[A-Z]?)?(?:\s)?(\d{3}-\d{3}|\d{3}(?:,\d{3})*|\d{3})?'
        match = re.match(pattern2, row)
        course_code = match.group(1)
        course_section = match.group(2)
        day_of_week = ''
        month = ''
        day = ''
        year = ''
        start_time = ''
        end_time = ''
        location = ''
        return course_code, course_section, day_of_week, month, day, year, start_time, end_time, location


# Split the data into rows and process each row
rows = data.strip().split('\n')
for row in rows:
    info = extract_info(row)
    if info:
        print(info)
