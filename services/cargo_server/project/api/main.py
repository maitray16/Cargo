from flask import Blueprint, jsonify, request, g, send_file, make_response
from elasticsearch import Elasticsearch, ConnectionError
from project.api.ExportJobUtils.es_utils import scroll_data
from pymongo import MongoClient
from bson import json_util
import pandas as pd
import itertools
import random
import string
import json
import os

main_blueprint = Blueprint('main', __name__)
client = MongoClient('cargo_mongo_db', 27017).cargo


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
    except Exception as ce:
        response_object['status'] = 'fail',
        response_object['data'] = ce
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

    args = dict(
        index=index,
        scroll='60s',
        size=10000,
        _source=fields,
        body=json.loads(query))

    result_dataframe = scroll_data(
        es_connection=es, es_hosts=host, es_timeout=60, search_args=args)

    uid = ''.join(
        random.SystemRandom().choice(string.ascii_uppercase +
                                     string.ascii_lowercase + string.digits)
        for _ in range(6))

    client.history.insert_one(data)

    if export_type == 'csv':
        response = make_response(result_dataframe.to_csv())
        response.headers[
            'Content-Disposition'] = 'attachment; filename=' + uid + '.csv'
        response.mimetype = 'text/csv'
        return response

    elif export_type == 'mongo':
        data_json = json.loads(result_dataframe.to_json(orient='records'))
        client.uid.remove()
        client.uid.insert(data_json)

        data_string = "Database URL - cargo_mongo_db" + '\n' + "Port - 27017" + '\n' + "Collection Name : " + uid + '\n' + "Fields - " + str(
            list(result_dataframe))

        response = make_response(data_string)
        cd = 'attachment; filename=mytxt.txt'
        response.headers['Content-Disposition'] = cd
        response.mimetype = 'text/plain'
        return response


@main_blueprint.route('/cargo/ping', methods=["GET"])
def ping():
    return jsonify({'status': 'success', 'data': 'Pong!!'})


@main_blueprint.route('/cargo/history', methods=["GET"])
def get_audit():
    output = []
    for q in client.history.find({}):
        output.append({
            'host': q['host'],
            'index': q['index'],
            'fields': q['fields'],
            'type': q['type'],
            'query': q['query']
        })
    return jsonify({'status': 'success', 'data': output})
