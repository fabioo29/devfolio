from django.shortcuts import render

from main.models import Git_Project

import os
import sys
import json
import smtplib
import requests

from decouple import config
from email.mime.text import MIMEText

SMTP_SSL_HOST = 'smtp.gmail.com'
SMTP_SSL_PORT = 465
EMAIL = config("EMAIL") # Turn off >> https://www.google.com/settings/security/lesssecureapps
PASSWORD = config("PASSWORD")
SENDER = EMAIL
TARGET = [config("TARGET")]

GITHUB_USER = config("GITHUB_USER")


def get_repos_info():
    '''
        Refresh Github repos archive in the database and return 
        all the info needed for each repo.
    '''

    headers = {}

    if "GITHUB_TOKEN" in os.environ:
        headers["Authorization"] = "token %s" % os.environ["GITHUB_TOKEN"]
    
    headers['Accept'] = 'application/vnd.github.mercy-preview+json'

    r = requests.get('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated', headers=headers)
    
    if r.status_code == 200:
        myrepos = r.json()
        
        for repo in myrepos:
            
            my_repo = {}
            my_repo['image'] = None
            my_repo['featured'] = 0
            my_repo['topics'] = ['']
            
            if len(Git_Project.objects.all().filter(id=repo['id'])):     
                my_repo['image'] = Git_Project.objects.get(pk=repo['id']).image
                my_repo['featured'] = Git_Project.objects.get(pk=repo['id']).featured
                my_repo['topics'] = Git_Project.objects.get(pk=repo['id']).topics
                Git_Project.objects.get(pk=repo['id']).delete()

            my_repo['id'] = repo['id']
            my_repo['title'] = ' '.join(repo['name'].split('-'))
            my_repo['desc'] = repo['description']
            my_repo['url'] = repo['html_url']
            
            with requests.get(repo['url'] + '/topics', headers=headers) as topics_r:
                if topics_r.status_code == 200:
                    my_repo['topics'] = topics_r.json()['names']
            
            Git_Project(
                id=my_repo['id'],
                title=my_repo['title'], 
                desc=my_repo['desc'], 
                topics=my_repo['topics'], 
                url=my_repo['url'], 
                image=my_repo['image'],
                featured=my_repo['featured']
            ).save()

        Git_Project.objects.all().exclude(id__in=[repo['id'] for repo in myrepos]).delete()

    return Git_Project.objects.all()[:6]
    

def send_email(data):
    '''
        Send an email to the devfolio owner based on the declared 
        vars above.
    '''
    
    for param in data.values():
        if not len(param):
            return False

    email_content = '''
        Name: {}\n
        Contact: {}\n
        Email: {}\n\n
        Message: {}
    '''.format(data['name'], data['contact'], data['email'], data['message'])
    
    msg = MIMEText(email_content)
    msg['Subject'] = data['subject']
    msg['From'] = SENDER
    msg['To'] = ', '.join(TARGET)
    
    server = smtplib.SMTP_SSL(SMTP_SSL_HOST, SMTP_SSL_PORT)
    server.login(EMAIL, PASSWORD)
    server.sendmail(SENDER, TARGET, msg.as_string())
    server.quit()


def index(request):
    '''
        Return main page with info needed as a dictionaire
    '''
    
    if request.method == 'POST':
        send_email(request.POST)

    mydict = {
        'repos_info': get_repos_info(),
        'feature_projects': Git_Project.objects.all().filter(featured=1)[:2]  
    } 
    
    for i, project in enumerate(mydict['feature_projects']):
        mydict['feature_projects'][i].image.name = ('/static/assets/' + project.image.name)

    return render(request, "main/index.html", mydict)
