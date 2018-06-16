import itertools
import pandas as pd
import elasticsearch

def extract_data(data, write_headers):
    for key, group in itertools.groupby(data, key=lambda x: x['_index']):
        rows = [datumn['_source'] for datumn in list(group)]
        df = pd.DataFrame.from_dict(rows)
        return df


def get_data_page(page):
    data = page['hits']['hits']
    sid = page['_scroll_id']
    return data, sid


def scroll_data(es_connection, es_hosts, es_timeout, search_args):
    es = es_connection
    page = es.search(**search_args)
    data, sid = get_data_page(page)
    total_hits = page['hits']['total']
    dataFrame = pd.DataFrame()
    headers_written = False
    if data:
        dataFrame = dataFrame.append(extract_data(data=data, write_headers=(not headers_written)))
        headers_written = True
    while True:
        page = es.scroll(scroll_id=sid, scroll='{}m'.format(es_timeout))
        data, sid = get_data_page(page)
        if data:
            dataFrame = dataFrame.append(
                extract_data(data=data, write_headers=(not headers_written)))
            headers_written = True
        else:
            return dataFrame
            break
