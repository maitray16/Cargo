from flask import Blueprint, jsonify, request, g, send_file, make_response
from elasticsearch import Elasticsearch
from project.api.es_utils import scroll_data
import itertools
import pandas as pd
import json
from pymongo import MongoClient

main_blueprint = Blueprint('main', __name__)
client = MongoClient('192.168.99.100', 27017)

def _get_connection(host):
    """ Maintains open connections to elasticsearch """
    if not hasattr(g, host):
        g.es = Elasticsearch(host)
    return g.es


@main_blueprint.route('/cargo/connect', methods=["POST"])
def connect_elastic():
    """ Start Page - Check for connection to elasticsearch. 
    TODO => Add authentication and SSL Support """
    data = request.get_json()
    response_object = {'status': 'fail', 'data': 'Invalid Params'}
    if not data:
        return jsonify(response_object), 400
    host = data.get("host")
    try:
        es = _get_connection(host)
        if es.ping():
            response_object['status'] = 'success',
            response_object['data'] == es.ping()
            return jsonify(response_object), 200
    except:
        response_object['status'] = 'fail',
        response_object['data'] = False
        return jsonify(response_object), 400


@main_blueprint.route('/cargo/index', methods=["POST"])
def get_index_list():
    """ Fetches list of indexes from elasticsearch """
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
    """ Queries for doc_count for given query elasticsearch """
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
    """ Fetches list of fields/mappings from elasticsearch """
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
    result_dataframe = pd.DataFrame()
    data = request.get_json()
    #handling query syntax failures from elasticsearch and passing along to client
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

    response = make_response(result_dataframe.to_csv())
    cd = 'attachment; filename=mycsv.csv'
    response.headers['Content-Disposition'] = cd
    response.mimetype = 'text/csv'
    return response


@main_blueprint.route('/cargo/ping', methods=["GET"])
def ping():
    return jsonify({'status': 'success', 'data': 'Pong!!'})
