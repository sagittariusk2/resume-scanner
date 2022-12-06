from flask import Flask, request
from solve import scanResume, readFile
import pyrebase
import os
from flask_cors import CORS
from firebaseConfig import config

app = Flask(__name__)
CORS(app)
cors = CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}})

# firebase = Firebase(config)
firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

def downJob(file, extension):
    print(str(file))
    ans = "\job" + extension
    datadir = os.getcwd()
    try:
        print("Job Downloaded")
        file.download_to_filename(datadir + ans)
    except:
        print('Job Download Failed')
    return "job"+extension;

def downResume(file, extension):
    print(str(file))
    ans = "\job_resume" + extension
    datadir = os.getcwd()
    try:
        print("Resume Downloaded")
        file.download_to_filename(datadir + ans)
    except:
        print('Resume Download Failed')
    return "job_resume" + extension

def downloadFiles(inp):
    ans = []
    all_files = storage.list_files()
    for file in all_files:
        if "/"+inp+"/Job Description" in str(file):
            if ".txt" in str(file):
                ans.append(downJob(file, ".txt"))
            elif ".docx" in str(file):
                ans.append(downJob(file, ".docx"))
            elif ".pdf" in str(file):
                ans.append(downJob(file, ".pdf"))
            elif ".doc" in str(file):
                ans.append(downJob(file, ".doc"))
        
        if "/"+inp+"/Resume Description" in str(file):
            if ".txt" in str(file):
                ans.append(downResume(file, ".txt"))
            elif ".docx" in str(file):
                ans.append(downResume(file, ".docx"))
            elif ".pdf" in str(file):
                ans.append(downResume(file, ".pdf"))
            elif ".doc" in str(file):
                ans.append(downResume(file, ".doc"))
    return ans

def getJob(inp):
    ans = ""
    all_files = storage.list_files()
    for file in all_files:
        if "/"+inp+"/Job Description" in str(file):
            if ".txt" in str(file):
                ans = (downJob(file, ".txt"))
            elif ".docx" in str(file):
                ans = (downJob(file, ".docx"))
            elif ".pdf" in str(file):
                ans = (downJob(file, ".pdf"))
            elif ".doc" in str(file):
                ans = (downJob(file, ".doc"))
    return ans

def findIndexOfJobDesc(job):
    # job description
    for i in range(max(0, len(job)-16)):
        x = job[i:16+i].lower()
        if "job description" in x:
            return i+15
        if "description" in x:
            return i+11
        if "requirements" in x:
            return i+12
        if "responsibilities" in x:
            return i+16
    return 0

def getDesc(job):
    job = getJob(job)
    job = readFile(job)
    index = findIndexOfJobDesc(job)
    desc = job[index:index+min(len(job),200)]+"..."
    return desc

@app.route("/scan")
def scan():
    args = request.args
    file_size = downloadFiles(args["job"])
    if(len(file_size)==2):
        return str(round(scanResume(file_size[0], file_size[1]), 2))
    else:
        return "0.00"

@app.route("/getSummary")
def summery():
    args = request.args
    args = args["jobs"]
    args = args.split('<')
    ans = dict()
    for i in range(len(args)):
        if(len(args[i])>0):
            ans[i] = getDesc(args[i])
    return ans

if __name__=="__main__":
    app.run(debug=True)