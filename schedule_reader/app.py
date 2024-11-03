import tabula
import pandas as pd
import re
from pymongo import MongoClient
import os

file_path = 'schedule_reader/winter_2024_final.pdf'

def read_pdf_table(pdf_path):
    # Read exam schedule from pdf 
    tables = tabula.read_pdf_with_template(pdf_path, pages=None, template_path=f"{file_path}.tabula-template.json", lattice=True, guess=False)
    return tables


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
    
    #Handle exceptions for PAC 
    if "PAC 1, 2, 3, 4, 5, 6, 7, 8,"in row:
        row=row.replace("PAC 1, 2, 3, 4, 5, 6, 7, 8, ", "")
        isPac = True
    elif "PAC 1, 2, 3, 4, 5, 6, 7, 8 " in row:
        row=row.replace("PAC 1, 2, 3, 4, 5, 6, 7, 8 ", "")
        isPac = True
    match = re.match(pattern, row)

    # Extract course information from the row
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


if __name__ == "__main__":
    pdf_path = 'schedule_reader/winter_2024_final.pdf'
    tables = read_pdf_table(pdf_path)
    
    concatenated_data = []
    for table in tables:
        # Stack the columns into a single column so each course is expressed as a row
        column = table.stack().reset_index(drop=True)

        # Append the column to the list of columns
        concatenated_data.append(column)
    
    # Concatenate the columns into a single dataframe
    df = pd.concat(concatenated_data, ignore_index=True, axis=0)
    
    # Remove carriage returns
    df = df.str.replace('\r', ' ')
    print(df[71:77])
    # Apply extract_info function to each row of the DataFrame
    df_info = df.apply(extract_info)
    
    print(df_info)

    # Connect to MongoDB
    client = MongoClient(os.getenv('MONGO_URI'))
    db = client["uwexamexporter"]
    collection = db["exams"]
    # Convert DataFrame to a list of dictionaries
    courses = df_info.apply(lambda x: {
        "course_code": x[0],
        "course_section": x[1],
        "day_of_week": x[2],
        "month": x[3],
        "day": x[4],
        "year": x[5],
        "start_time": x[6],
        "end_time": x[7],
        "location": x[8]
    }).tolist()
    # Insert data into MongoDB
    collection.insert_many(courses)



