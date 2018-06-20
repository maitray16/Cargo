from flask import Blueprint, jsonify, request, g, send_file, make_response
from elasticsearch import Elasticsearch
from project.api.es_utils import scroll_data
from pymongo import MongoClient
from bson import json_util
import pandas as pd
import itertools
import random
import string
import json

main_blueprint = Blueprint('main', __name__)
client = MongoClient('192.168.99.100', 27017).cargo


def _get_connection(host):
    """ Maintains open connections to elasticsearch """
    if not hasattr(g, host):
        g.es = Elasticsearch(host)
    return g.es


@main_blueprint.route('/cargo/connect', methods=["POST"])
def connect_elastic():
    """ Start Page - Check for connection to elasticsearch. 
    TODO => 1. Add authentication and SSL Support 2. Handling connection failures """
    data = request.get_json()
    response_object = {'status': 'fail', 'data': 'true'}
    if not data:
         return jsonify(response_object), 400
    host = data.get("host")
    try:
        es = _get_connection(host)
        if es.ping():
            response_object['status'] = 'success',
            response_object['data'] = 'True'
            return jsonify(response_object), 200
    except:
        response_object['status'] = 'fail',
        response_object['data'] = 'false'
        return jsonify(response_object), 400


@main_blueprint.route('/cargo/index', methods=["POST"])
def get_index_list():
    """ Fetches list of indexes from elasticsearch
    TODO => 1. Handling connection failures """
    data = request.get_json()
    response_object = {'status': 'fail', 'data': 'Invalid Params'}
    if not data:
        return jsonify(response_object), 400
    host = data.get("host")
    try:
        es = _get_connection(host)
        response_object['status'] = 'success'
        response_object['data'] = [{
            "index": item
        } for item in es.indices.get_alias("*")]
        return jsonify(response_object), 200
    except:
        return jsonify(response_object), 400


@main_blueprint.route('/cargo/doc_count', methods=["POST"])
def get_doc_count():
    """ Queries for doc_count for given query elasticsearch
    TODO => 1. Handling connection failures """
    data = request.get_json()
    response_object = {'status': 'fail', 'data': 'Invalid Params'}
    if not data:
        return jsonify(response_object), 400
    host = data.get("host")
    index = data.get("index")
    query = data.get("query")
    try:
        es = _get_connection(host)
        #handling query syntax failures from elasticsearch and passing along to client
        count = es.count(index=index, body={"query": {"match_all": {}}})
        response_object['status'] = 'success'
        response_object['data'] = count['count']
        return jsonify(response_object), 200
    except:
        return jsonify(response_object), 400


@main_blueprint.route('/cargo/mapping', methods=["POST"])
def get_mapping():
    """ Fetches list of fields/mappings from elasticsearch 
    TODO => 1. Handling connection failures """
    data = request.get_json()
    response_object = {'status': 'fail', 'data': 'Invalid Params'}
    if not data:
        return jsonify(response_object), 400
    host = data.get("host")
    index = data.get("index")
    try:
        es = _get_connection(host)
        mapping_block = es.indices.get_mapping(index=index)
        doc_type = mapping_block[index]['mappings']
        for doc in doc_type.keys():
            mappings = mapping_block[index]['mappings'][doc]['properties']
        response_object['status'] = 'success'
        response_object['data'] = [{"field": item} for item in mappings.keys()]
        return jsonify(response_object), 200
    except:
        return jsonify(response_object), 400

@main_blueprint.route('/cargo/export', methods=["POST"])
def export_data():
    """ TODO => 1. Handling connection failures 2. Handling query failues
    3. Parallel processing of queries (in case of 1 shard - break down timerange query) """

    result_dataframe = pd.DataFrame()
    data = request.get_json()
    host = data.get("host")
    index = data.get("index")
    query = data.get("query")
    fields = data.get("fields")
    export_type = data.get("type")
    es = _get_connection(host)
    
    # audit_item = {
    #     "index": index,
    #     "host": host,
    #     "query": query,
    #     "fields": fields,
    #     "type": export_type
    # }

    # client.insert_one(audit_item)

    args = dict(
        index=index,
        scroll='60s',
        size=10000,
        _source=fields,
        body=json.loads(query))

    result_dataframe = scroll_data(
        es_connection=es, es_hosts=host, es_timeout=60, search_args=args)

    if export_type == 'csv':
        response = make_response(result_dataframe.to_csv())
        cd = 'attachment; filename=mycsv.csv'
        response.headers['Content-Disposition'] = cd
        response.mimetype = 'text/csv'
        return response
    
    elif export_type == 'mongo':
        collection_name = ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(5))
        data_json = json.loads(result_dataframe.to_json(orient='records'))
        client.collection_name.remove()
        client.collection_name.insert(data_json)
        
        data_string = "Database URL - 192.168.99.100" + '\n' + "Port - 27017" + '\n' + "Collection Name : " + collection_name + '\n' + "Fields - " + str(list(result_dataframe))

        response = make_response(data_string)
        cd = 'attachment; filename=mytxt.txt'
        response.headers['Content-Disposition'] = cd
        response.mimetype = 'text/plain'
        return response
        

        


@main_blueprint.route('/cargo/ping', methods=["GET"])
def ping():
    return jsonify({'status': 'success', 'data': 'Pong!!'})


# @main_blueprint.route('/cargo/audit', methods=["GET"])
# def get_audit():
#     output = []
#     for q in client.find({}):
#         output.append({'index': q['index'], 'fields':q['fields'], 'type': q['type'] ,'query': q['query'] })
#     return jsonify({'status': 'success', 'data': output})
        
