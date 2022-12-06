from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


import PyPDF2
import math



def unique_words(text):
  distinct_word = set()
#   stop_words = {"really", "sometimes", "go", "since", "whither", "they", "its", "them", "well", "meanwhile", "seems", "and", "latterly", "regarding", "somehow", "sixty", "whole", "anyway", "else", "few", "‘m", "beside", "to", "namely", "someone", "see", "moreover", "wherein", "for", "former", "bottom", "it", "next", "six", "along", "once", "might", "whenever", "below", "another", "yourself", "each", "just", "ourselves", "everyone", "any", "across", "get", "that", "eight", "we", "which", "therefore", "may", "‘s", "keep", "among", "give", "such", "are", "indeed", "everywhere", "same", "herself", "yourselves", "alone", "were", "was", "take", "seem", "say", "why", "show", "between", "during", "elsewhere", "or", "though", "forty", "made", "used", "others", "whereafter", "formerly", "several", "via", "does", "please", "three", "also", "fifty", "afterwards", "‘s", "noone", "do", "perhaps", "further", "i", "beforehand", "myself", "empty", "‘ll", "yet", "thereby", "been", "both", "never", "put", "without", "him", "a", "nothing", "thereafter", "make", "then", "whom", "must", "sometime", "against", "through", "being", "four", "back", "become", "our", "himself", "because", "anything", "‘re", "nor", "therein", "due", "until", "own", "ca", "most", "now", "while", "of", "only", "am", "itself", "too", "‘m", "nobody", "if", "one", "whereas", "twelve", "together", "can", "who", "even", "be", "she", "besides", "herein", "off", "‘d", "last", "no", "whereupon", "the", "‘m", "thru", "out", "hereupon", "by", "us", "already", "became", "here", "hers", "onto", "beyond", "down", "enough", "did", "some", "over", "serious", "quite", "move", "around", "nowhere", "amongst", "but", "so", "wherever", "twenty", "often", "part", "again", "where", "re", "within", "at", "n‘t", "yours", "front", "unless", "could", "anyone", "third", "whatever", "doing", "‘d", "nevertheless", "before", "rather", "fifteen", "her", "me", "thereupon", "mostly", "throughout", "hence", "‘re", "mine", "ten", "hundred", "nine", "call", "when", "about", "will", "whereby", "this", "upon", "you", "should", "always", "themselves", "not", "has", "behind", "on", "anywhere", "side", "their", "hereby", "latter", "after", "‘ve", "none", "these", "name", "n‘t", "every", "although", "‘s", "however", "he", "becoming", "how", "whose", "still", "hereafter", "whether", "towards", "more", "everything", "whoever", "seemed", "cannot", "up", "otherwise", "in", "would", "under", "done", "thence", "whence", "seeming", "either", "other", "with", "into", "amount", "five", "much", "‘re", "except", "his", "thus", "‘ll", "what", "almost", "becomes", "least", "ever", "above", "is", "first", "there", "somewhere", "top", "‘ve", "‘ve", "than", "n‘t", "have", "toward", "per", "all", "ours", "full", "‘d", "anyhow", "as", "‘ll", "many", "various", "your", "had", "eleven", "from", "something", "less", "those", "using", "an", "two", "my", "very", "neither"}
  for i in text:
    words = i.split(" ")
    for j in words:
        # if j not in stop_words:
        distinct_word.add(j)
  return distinct_word



"""
text -> document that to be examined
return -> 2-d matrix of term-frequency
"""
def term_frequency(text):
  distinct_word = unique_words(text)
  ans = []
  """
  Iterate through each document
  """
  for i in text:
    words = i.split(" ")
    n = len(words)
    cnt = {}
    tmp = []
    """
    Count the words
    """
    for j in words:
      if j in cnt.keys():
        cnt[j]+=1
      else:
        cnt[j]=1
    """
    
    """
    for j in distinct_word:
      if j in cnt.keys():
        tmp.append(cnt[j])
      else:
        tmp.append(0)
    for j in range(len(tmp)):
      tmp[j] /= n
    ans.append(tmp)
  return ans




"""
text -> complete document
return -> vector of inverse-document-frequency
"""
def inverse_document_frequency(text):
  n = len(text)
  distinct_word = unique_words(text)
  ans = []
  for i in distinct_word:
    cnt = 0
    for j in text:
      if i in j:
        cnt += 1
    ans.append(n/cnt)
  return ans




"""
tf -> 2D vector of term-frequency
idf -> vector of inverse-document-frequency
return -> 2d matrix of tf-idf
"""
def term_frequency_inverse_document_frequency(tf, idf):
  for i in range(len(tf)):
    for j in range(len(idf)):
      tf[i][j] *= idf[j]
  return tf



"""
Read PDF file page by page
"""
def readFile(pdf):
    """
    Open file in read mode
    """
    pdffileobj=open(pdf,'rb')
    """
    Get all pages from the pdf
    """
    pdfreader=PyPDF2.PdfFileReader(pdffileobj)
    x=pdfreader.numPages
    ans = ""
    for i in range(x):
        pageobj=pdfreader.getPage(i)
        ans += pageobj.extractText()
    return ans



def customTFIDFVectorizer(content):
    tf = term_frequency(content)
    idf = inverse_document_frequency(content)
    tfidf = term_frequency_inverse_document_frequency(tf, idf)
    return tfidf



def customCosineSimilarity(tfidf):
    product = 0
    x, y = 0, 0
    for i in range(len(tfidf[0])):
        print(tfidf[0][i], tfidf[1][i])
        product += tfidf[0][i]*tfidf[1][i]
        x += tfidf[0][i]*tfidf[0][i]
        y += tfidf[1][i]*tfidf[1][i]
    return product/(math.sqrt(x)*math.sqrt(y))

def customScan(content):
    matrix = customTFIDFVectorizer(content)
    print(len(matrix))
    similarity_matrix = customCosineSimilarity(matrix)
    return round(similarity_matrix*100, 2)

def scan(content):
    # cv = CountVectorizer()
    """
    Using TF-IDF Concept,
    convert the document into 2-D vector containing TF-IDF values
    """
    cv = TfidfVectorizer()
    matrix = cv.fit_transform(content)
    """
    Using cosine similarity formulae 
    cosine similarity = A.B/|A|.|B|
    """
    similarity_matrix = cosine_similarity(matrix)
    return similarity_matrix[1][0]*100


def scanResume(job, user_resume):
    job_description = readFile(job)
    # print("-------------------")
    # print(job_description)
    resume = readFile(user_resume)
    # print("-------------------")
    # print(resume)
    content = [job_description, resume]
    return scan(content)
    # return customScan(content)