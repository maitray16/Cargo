import itertools
import pandas as pd


def extract_data(data):
    for key, group in itertools.groupby(data, key=lambda x: x['_index']):
        rows = [datumn['_source'] for datumn in list(group)]
        df = pd.DataFrame.from_dict(rows)
        return df


def add_slice_if_needed(total_worker_count, search_args, worker_id):
    if total_worker_count > 1:
        search_args['body']['slice'] = {
            'id': worker_id,
            'max': total_worker_count
        }
    return search_args


def get_data_page(page):
    data = page['hits']['hits']
    sid = page['_scroll_id']
    return data, sid


def scroll_data(worker_id, total_worker_count, es_connection, es_hosts,
                es_timeout, search_args):
    es = es_connection
    search_args = add_slice_if_needed(total_worker_count, search_args,
                                      worker_id)
    page = es.search(**search_args)
    data, sid = get_data_page(page)
    dataFrame = pd.DataFrame()
    result = {}
    if data:
        dataFrame = dataFrame.append(extract_data(data=data))
    while True:
        page = es.scroll(scroll_id=sid, scroll='{}m'.format(es_timeout))
        data, sid = get_data_page(page)
        if data:
            dataFrame = dataFrame.append(extract_data(data=data))
        else:
            return dataFrame
