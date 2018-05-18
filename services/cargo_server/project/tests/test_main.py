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

    # def test_connect_invalid_json(self):
    #     with self.client:
    #         response = self.client.post(
    #             '/connect',
    #             data = json.dumps({}),
    #             content_type = 'application/json',
    #         )
    #         data = json.loads(response.data.decode())
    #         self.assertEqual(response.status_code, 400)
    #         self.assertIn('Invalid payload', data['message'])
    #         self.assertIn('fail', data['status'])


if '__name__' == '__main__':
    unittest.main()