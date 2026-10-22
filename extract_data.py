import json
import base64
import os

def extract_notebook_data():
    with open('extracted_media/word/media/image1.png', 'rb') as f:
        logo_b64 = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')
    
    experiments = []
    
    # 1. Q 1-4
    with open('Q  1-4 Pandas Questions.ipynb', 'r', encoding='utf-8') as f:
        nb1 = json.load(f)
    
    def get_cell_content(cell):
        t = cell.get('cell_type')
        src = ''.join(cell.get('source', []))
        outs = []
        for o in cell.get('outputs', []):
            if 'text' in o:
                outs.append({'type': 'text', 'content': ''.join(o['text'])})
            elif 'data' in o:
                d = o['data']
                if 'image/png' in d:
                    outs.append({'type': 'image', 'content': 'data:image/png;base64,' + d['image/png'].strip()})
                elif 'text/plain' in d:
                    outs.append({'type': 'text', 'content': ''.join(d['text/plain'])})
        return {'type': t, 'source': src, 'outputs': outs}

    # Q1: cells 0..2
    q1_cells = [get_cell_content(c) for c in nb1['cells'][0:3]]
    experiments.append({
        'id': 1,
        'title': 'Question 1: Pandas Dataset Creation & Export',
        'shortTitle': 'Pandas: Create Student Dataset & CSV Export',
        'file': 'Q  1-4 Pandas Questions.ipynb',
        'description': 'Create a dataset of students with Name, Department, Marks, and Age, convert into DataFrame, and save to students.csv.',
        'date': '2025-08-18',
        'page': 4,
        'cells': q1_cells
    })
    
    # Q2: cells 3..13
    q2_cells = [get_cell_content(c) for c in nb1['cells'][3:14]]
    experiments.append({
        'id': 2,
        'title': 'Question 2: Pandas Data Operations & Filtering',
        'shortTitle': 'Pandas: Operations on CSV File (Filtering, Sorting, Grouping)',
        'file': 'Q  1-4 Pandas Questions.ipynb',
        'description': 'Perform operations on students.csv: display head/tail, column selection, marks filter (>75), Grade column, missing values, sorting, groupby.',
        'date': '2025-08-25',
        'page': 6,
        'cells': q2_cells
    })
    
    # Q3: cells 14..24
    q3_cells = [get_cell_content(c) for c in nb1['cells'][14:25]]
    experiments.append({
        'id': 3,
        'title': 'Question 3: Dataset Aggregations & Distribution Analysis',
        'shortTitle': 'Pandas: Student Dataset Statistical & Department Analysis',
        'file': 'Q  1-4 Pandas Questions.ipynb',
        'description': 'Analyze students.csv: total student count, highest & lowest marks, department breakdown, grade distributions, marks filtering (60-80).',
        'date': '2025-09-01',
        'page': 8,
        'cells': q3_cells
    })
    
    # Q4: cells 25..36
    q4_cells = [get_cell_content(c) for c in nb1['cells'][25:37]]
    experiments.append({
        'id': 4,
        'title': 'Question 4: Multi-Table Merging & Relational Operations',
        'shortTitle': 'Pandas: Multi-file Merge (students.csv & fees.csv)',
        'file': 'Q  1-4 Pandas Questions.ipynb',
        'description': 'Merge students.csv and fees.csv DataFrames on common Name, filter pending fees, paid fees with marks > 75, average marks by fee status.',
        'date': '2025-09-08',
        'page': 10,
        'cells': q4_cells
    })

    # Q5: Statistics
    with open('Q 5 Statistics for Data Science.ipynb', 'r', encoding='utf-8') as f:
        nb5 = json.load(f)
    q5_cells = [get_cell_content(c) for c in nb5['cells']]
    experiments.append({
        'id': 5,
        'title': 'Question 5: Descriptive Statistics & Data Visualization',
        'shortTitle': 'Statistics for Data Science (Mean, Median, IQR, Skewness, Plots)',
        'file': 'Q 5 Statistics for Data Science.ipynb',
        'description': 'Comprehensive statistical analysis for 30 students dataset: Central tendency, Dispersion, Quartiles, Skewness/Kurtosis, Covariance, Correlation, Outlier detection & Visualizations.',
        'date': '2025-09-15',
        'page': 13,
        'cells': q5_cells
    })

    # Q6: Linear Regression
    with open('Q 6 Linear Regression.ipynb', 'r', encoding='utf-8') as f:
        nb6 = json.load(f)
    q6_cells = [get_cell_content(c) for c in nb6['cells']]
    experiments.append({
        'id': 6,
        'title': 'Question 6: Simple Linear Regression',
        'shortTitle': 'Linear Regression: Study Hours vs Marks Prediction',
        'file': 'Q 6 Linear Regression.ipynb',
        'description': 'Implementation of Simple Linear Regression using scikit-learn, train/test split, MSE and R2 evaluation, prediction for 7.5 study hours, and regression line visualization.',
        'date': '2025-09-22',
        'page': 16,
        'cells': q6_cells
    })

    # Q7: Multiple Linear Regression
    with open('Multiple Linear Regression.ipynb', 'r', encoding='utf-8') as f:
        nb7 = json.load(f)
    q7_cells = [get_cell_content(c) for c in nb7['cells']]
    experiments.append({
        'id': 7,
        'title': 'Question 7: Multiple Linear Regression',
        'shortTitle': 'Multiple Linear Regression: Score Prediction with Multi-Features',
        'file': 'Multiple Linear Regression.ipynb',
        'description': 'Predict student exam scores using study hours, attendance and assignment scores, evaluate model performance, and inspect model coefficients and intercept.',
        'date': '2025-09-29',
        'page': 18,
        'cells': q7_cells
    })

    # Q8: Logistic Regression Classification
    with open('Logistic Regression Classification.ipynb', 'r', encoding='utf-8') as f:
        nb8 = json.load(f)
    q8_cells = [get_cell_content(c) for c in nb8['cells']]
    experiments.append({
        'id': 8,
        'title': 'Question 8: Logistic Regression Classification',
        'shortTitle': 'Logistic Regression: Student Pass/Fail Classification',
        'file': 'Logistic Regression Classification.ipynb',
        'description': 'Binary classification model using Logistic Regression to predict Pass or Fail status based on study hours and attendance, with accuracy and confusion matrix evaluation.',
        'date': '2025-10-06',
        'page': 20,
        'cells': q8_cells
    })

    # Q9: Decision Tree Classification
    with open('Decision Tree Classification.ipynb', 'r', encoding='utf-8') as f:
        nb9 = json.load(f)
    q9_cells = [get_cell_content(c) for c in nb9['cells']]
    experiments.append({
        'id': 9,
        'title': 'Question 9: Decision Tree Classification',
        'shortTitle': 'Decision Tree: Result Prediction & Tree Graph Visualization',
        'file': 'Decision Tree Classification.ipynb',
        'description': 'Decision Tree Classifier to predict student outcome based on study hours, attendance, and assignment score, with visual tree rendering and test predictions.',
        'date': '2025-10-13',
        'page': 22,
        'cells': q9_cells
    })

    data = {
        'university': 'MAULANA AZAD NATIONAL URDU UNIVERSITY',
        'universityUrdu': 'مولانا آزاد نیشنل اردو یونیورسٹی',
        'universitySub': '(A Central University established by an Act of Parliament in 1998)',
        'accreditation': 'Accredited Grade "A+" by NAAC',
        'address': 'Gachibowli, Hyderabad-500032, T.S. www.manuu.edu.in',
        'school': 'SCHOOL OF TECHNOLOGY',
        'department': 'DEPARTMENT OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY',
        'course': 'MASTER OF COMPUTER APPLICATION',
        'semester': '2ND Year / 3RD Semester',
        'academicYear': '2025-26',
        'labTitle': 'DATA SCIENCE LAB',
        'courseCode': 'MMCA311PCT',
        'submittedTo': {
            'name': 'Mr. Kamran Siddiqui',
            'designation': 'Assistant Professor',
            'department': 'Department of CS & IT, MANUU'
        },
        'defaultStudent': {
            'name': 'Saleh Hayat',
            'rollNo': '25MMCA019HY',
            'enrollmentNo': 'A250017'
        },
        'logoBase64': logo_b64,
        'experiments': experiments
    }

    os.makedirs('lab-record-app/src/data', exist_ok=True)
    with open('lab-record-app/src/data/labData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print('Successfully generated labData.json! Size:', os.path.getsize('lab-record-app/src/data/labData.json'))

if __name__ == '__main__':
    extract_notebook_data()
