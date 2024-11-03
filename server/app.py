
from flask import Flask, request, jsonify
import re
from pymongo import MongoClient
import os

app = Flask(__name__)

client = MongoClient(os.getenv('MONGO_URI'))
db = client["uwexamexporter"]
collection = db["exams"]


def extract_course_codes(text):
    pattern = r'([A-Z]+\s\d{3}[A-Z]?)'
    course_codes = re.findall(pattern, text)
    return course_codes

#Endpoint to extract course codes from Quest
@app.route('/extract-course-codes', methods=['POST'])
def process_text():
    print('received request')
    data = request.get_json()
    text = data.get('text', '')
    course_codes = extract_course_codes(text)
    print(course_codes)
    
    matched_courses = []
    for code in course_codes:
        query = {"course_code": code}
        projection = {"_id": 0}  # Exclude the _id field
        cursor = collection.find(query, projection)
        for result in cursor:
            matched_courses.append(result)
    return jsonify({"matched_courses": matched_courses})


