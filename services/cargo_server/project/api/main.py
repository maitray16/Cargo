from flask import Blueprint, jsonify, request
from elasticsearch import Elasticsearch

main_blueprint = Blueprint('main', __name__)

def get_connection(url):
    return Elasticsearch(url, http_compress=True)

@main_blueprint.route('/cargo/connect', methods=["POST"])
def connect_elastic():
    """ API to check connection to Elastic Host """
    data = request.get_json()
    url = data.get("url")
    es = get_connection(url)
    if es.ping():    
        response_object = {
            'status':'success',
            'message':'Connected',
            'ping': es.ping()
        }
    else:
        response_object = {
            'status':'fail',
            'message': 'Not Connected',
            'ping': 'False',
            
        }
    return jsonify(response_object)
  
@main_blueprint.route('/cargo/esinfo', methods=["POST"])
def info_elastic():
    data = request.get_json()
    url = data.get("url")
    es = get_connection(url)
    response_object = {
        'status': 'success',
        'message': es.info()
    }
    return jsonify(response_object), 200

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
        'data': index_list
    }
    return jsonify(response_object), 200




@main_blueprint.route('/cargo/ping', methods=["GET"])
def ping():
    return jsonify({
    'status':'success',
    'message':'Pong!!'
    }) 