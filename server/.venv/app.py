
from flask import Flask, request, jsonify
import re

app = Flask(__name__)

def extract_course_codes(text):
    pattern = r'([A-Z]+\s\d{3})'
    course_codes = re.findall(pattern, text)
    return course_codes

@app.route('/extract-course-codes', methods=['POST'])
def process_text():
    data = request.get_json()
    text = data.get('text', '')
    course_codes = extract_course_codes(text)
    return jsonify({"course_codes": course_codes})

if __name__ == '__main__':
    app.run(debug=True)
