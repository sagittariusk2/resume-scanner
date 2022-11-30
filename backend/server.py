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

def getDesc(job):
    job = getJob(job)
    job = readFile(job)
    desc=job[0:min(len(job),300)]+"..."
    return desc

@app.route("/scan")
def scan():
    args = request.args
    file_size = downloadFiles(args["job"])
    if(len(file_size)==2):
        return str(round(scanResume(file_size[0], file_size[1]), 2))
    else:
        return "0.00"

@app.route("/summery")
def summery():
    args = request.args
    args = args["jobs"]
    print(args)
    args = args.split('>')
    print(args)
    ans = dict()
    for i in range(len(args)):
        ans[i] = getDesc(args[i])
    return ans


if __name__=="__main__":
    app.run(debug=True)