import json
import unittest

from project.tests.base import BaseTestCase


class TestMainService(BaseTestCase):
    def test_ping(self):
        response = self.client.get('cargo/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('Pong!!', data['data'])
        self.assertIn('success', data['status'])


if '__name__' == '__main__':
    unittest.main()