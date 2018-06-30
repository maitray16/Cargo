import itertools
import json
import pandas as pd
import elasticsearch


class ESGetData:
    def __init__(self, params, es_connection):
        self.params = params
        index = []
        index = params.get("index")
        self.shard_count = self.get_shard_count(es_connection, index)

    def get_shard_count(self, es_connection, es_index):
        params = es_connection.indices.get_settings(es_index)
        shards = params[es_index[0]]['settings']['index']['number_of_shards']
        return shards

    def execute_job(self):
        if (int(self.shard_count) > 1):
            print("herhe")
