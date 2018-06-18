import json
import unittest

from project.tests.base import BaseTestCase


class TestMainService(BaseTestCase):

    def test_ping(self):
        response = self.client.get('/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('Pong!!', data['message'])
        self.assertIn('success', data['status'])

    def test_connect_invalid_json(self):
    """ /cargo/connect - if the request is empty """
        with self.client:
            response = self.client.post(
                '/cargo/connect',
                data = json.dumps({}),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])
    
    def test_connect_invalid_json_keys(self):
    """ /cargo/connect - if the request doesnt have host key """
        with self.client:
            response = self.client.post(
                '/cargo/connect',
                data = json.dumps({
                    'url': 'http://something:9200/'
                }),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])

    def test_index_invalid_json(self):
        """ /cargo/index - if the request is empty """
        with self.client:
            response = self.client.post(
                '/cargo/index',
                data = json.dumps({}),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])
    
    def test_index_invalid_json_keys(self):
    """ /cargo/index - if the request doesnt have host key """
        with self.client:
            response = self.client.post(
                '/cargo/index',
                data = json.dumps({
                    'url': 'http://something:9200/'
                }),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])

    def test_mapping_invalid_json(self):
        """ /cargo/mapping - if the request is empty """
        with self.client:
            response = self.client.post(
                '/cargo/mapping',
                data = json.dumps({}),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])
    
    def test_mapping_invalid_json_keys(self):
    """ /cargo/mapping - if the request doesnt have index key """
        with self.client:
            response = self.client.post(
                '/cargo/mapping',
                data = json.dumps({
                    'host': 'http://172.16.123.1:9200/'
                }),
                content_type = 'application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid Params', data['data'])
            self.assertIn('fail', data['status'])
    

if '__name__' == '__main__':
    unittest.main()