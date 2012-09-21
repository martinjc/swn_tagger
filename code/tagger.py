import collections
import urllib2
import urllib
import json

api_key='5e1aff6b88998e05c176abbd5118d6ba'


if __name__ == "__main__":

    delchars = ''.join(c for c in map(chr, range(256)) if not c.isalnum())

    days = [
        {'day' : 'thurs', 'file_name': 'thursday.csv'},
        {'day' : 'fri', 'file_name': 'friday.csv'},
        {'day' : 'sat', 'file_name': 'saturday.csv'},
        {'day' : 'sun', 'file_name': 'sunday.csv'}
    ]

    output_file = open('bands.json', 'w')

    for day in days:

        bands_file = open(day['file_name'], 'r')

        bands = []

        for line in bands_file:
            # new artist

            band = {}

            tags = {}
            artist_name = line.strip()
            band['artist'] = artist_name
            band['artist_name'] = artist_name.translate(None, delchars).lower()
            band['tags'] = {}
            params = {
                "artist" : artist_name,
                "api_key" : api_key,
                "method" : "artist.gettoptags",
                "format" : "json"
            }

            url = "http://ws.audioscrobbler.com/2.0/?" + urllib.urlencode(params)

            print url

            try:
                response = urllib2.urlopen(url)
            except urllib2.HTTPError, e:
                raise e
            except urllib2.URLError, e:
                raise e

            raw_data = response.read()
            py_data = json.loads(raw_data)

            print py_data

            if py_data.get('toptags', None) is not None:
                if py_data['toptags'].get('tag', None) is not None:
                    tags = py_data['toptags']['tag']
                    print tags
                    if type(tags) == type([]):
                        for tag in tags:
                            name = tag['name'].encode('utf-8')
                            count = 1 if int(tag['count']) == 0 else int(tag['count'])
                            band['tags'][name] = count
                    else:
                        name = tags['name'].encode('utf-8')
                        count = 1 if int(tags['count']) == 0 else int(tags['count'])
                        band['tags'][name] = count

            bands.append(band)
        day['bands'] = bands

    output_file.write(json.dumps(days))
