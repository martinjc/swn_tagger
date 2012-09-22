import urllib2
import urllib

from bs4 import BeautifulSoup

lineup_page = "http://swnfest.com/lineup-2/"

try:
    response = urllib2.urlopen(lineup_page)
except urllib2.HTTPError, e:
    raise e
except urllib2.URLError, e:
    raise e

raw_data = response.read()

soup = BeautifulSoup(raw_data)

links = soup.select(".lineup")

pages = []

for link in links:
    page = link.contents
    print page[0]['href']
    pages.append(page[0]['href'])

print pages

for page in pages:
    try:
        response = urllib2.urlopen(page)
    except urllib2.HTTPError, e:
        raise e
    except urllib2.URLError, e:
        raise e

    raw_data = response.read()

    soup = BeautifulSoup(raw_data)

    for elem in soup('a', text="Soundcloud"):
        print elem['href']
