from flask import Blueprint, jsonify, request, g
from elasticsearch import Elasticsearch, helpers

main_blueprint = Blueprint('main', __name__)

def get_connection(url):
    if not hasattr(g, url):
        g.es = Elasticsearch(url, http_compress=True)
    return g.es


@main_blueprint.route('/cargo/connect', methods=["POST"])
def connect_elastic():
    data = request.get_json()
    url = data.get("url")
    es = get_connection(url)
    if es.ping():   
        response_object = {
            'status': 'success',
            'message': 'Connected',
            'ping': es.ping()
        }
    else:
        response_object = {
            'status': 'fail',
            'message': 'Not Connected',
            'ping': 'False'
        }
    return jsonify(response_object)

@main_blueprint.route('/cargo/indexlist', methods=["POST"])
def index_list_elastic():
    index_list = []
    data = request.get_json()
    url = data.get("url")
    es = get_connection(url)
    for index in es.indices.get_alias("*"):
        index_list.append(index)
    response_object = {
        'status': 'success',
        'data': [{"name": i} for i in index_list]
    }
    return jsonify(response_object), 200

@main_blueprint.route('/cargo/mapping', methods=["POST"])
def get_mapping():
    field_list = []
    timestamp = False
    data = request.get_json()
    url = data.get("url")
    index = data.get("index")
    es = get_connection(url)
    mapping_block = es.indices.get_mapping(index=index, doc_type=None)
    doc_type = mapping_block[index]['mappings']
    for doc in doc_type.keys():
        mappings = mapping_block[index]['mappings'][doc]['properties']
        for field in mappings.keys():
            field_list.append(field)
           
    response_object = {
        'status': 'success',
        'data': [{"field" : i} for i in field_list]
    }
    return jsonify(response_object), 200

@main_blueprint.route('/cargo/export', methods=["POST"])
def export_data():
    count = 0
    data = request.get_json()
    url = data.get("url")
    index = data.get("index")
    query = data.get("query")
    fields = data.get("fields")
    export_type = data.get("type")

    result = helpers.scan(
         client = get_connection(url),
         index = index,
         preserve_order=True,
         query=query,
    )
    for item in result:
        count = count + 1

    response_object = {
        'status': 'success',
        'data': 'message received',
        'count': count 
    }
    return jsonify(response_object), 200



@main_blueprint.route('/cargo/ping', methods=["GET"])
def ping():
    return jsonify({
        'status': 'success',
        'message': 'Pong!!'
    }) 