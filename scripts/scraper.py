import sys
import re
import requests
from bs4 import BeautifulSoup
import json

urls = [
    'https://www.americanexpress.com/ca/en/customer-service/payments-statements-and-balance/payments/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/payments-statements-and-balance/transactions-statements/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/account-management/card-management/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/account-management/digital-servicing/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/products-and-services/cards/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/products-and-services/loans/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/products-and-services/insurance/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/products-and-services/other-services/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/benefits-rewards-and-offers/rewards-and-benefits/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/benefits-rewards-and-offers/offers-and-experiences/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/security-and-fraud/account-protection/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/security-and-fraud/security-features/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/travel/travel-benefits/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/travel/use-card-abroad/index.html',
    'https://www.americanexpress.com/ca/en/customer-service/disputes/index.html',
]
qa_responses = {
    "content": []
}
for url in urls:
    html = requests.get(url)
    indexHtml = BeautifulSoup(html.content, features="html.parser")
    for link in indexHtml.find_all(href=re.compile("customer-service/faq")):
        if link.has_attr('href'):
            helpPage = requests.get('https://www.americanexpress.com' + link['href'])
            helpHTML = BeautifulSoup(helpPage.content, features="html.parser")
            questionHTML = helpHTML.find(attrs={'class': 'heading-4'})
            answerHTML = helpHTML.find(attrs={'id': 'answer'})
            if (questionHTML and answerHTML):
                qa_responses['content'].append({
                    "prompt": questionHTML.text,
                    "completion": answerHTML.text
                })
            elif (questionHTML == None):
                print('could not find question HTML')
            elif (answerHTML == None):
                print('could not find answer HTML')

with open('answers.json', "w") as outfile:
    json.dump(qa_responses, outfile)