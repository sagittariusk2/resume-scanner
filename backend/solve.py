from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2

def readFile(pdf):
    pdffileobj=open(pdf,'rb')
    pdfreader=PyPDF2.PdfFileReader(pdffileobj)
    x=pdfreader.numPages
    ans = ""
    for i in range(x):
        pageobj=pdfreader.getPage(i)
        ans += pageobj.extractText()
    return ans

def scanResume(job, user_resume):
    job_description = readFile(job)
    # print("-------------------")
    # print(job_description)
    resume = readFile(user_resume)
    # print("-------------------")
    # print(resume)
    content = [job_description, resume]
    # cv = CountVectorizer()
    cv = TfidfVectorizer()
    matrix = cv.fit_transform(content)
    similarity_matrix = cosine_similarity(matrix)
    return similarity_matrix[1][0]*100

