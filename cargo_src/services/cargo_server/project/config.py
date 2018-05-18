import os
class BaseConfig:
    """Base Configuration"""
    TESTING = False
    SECRET_KEY = 'mysecret'

class DevelopmentConfig(BaseConfig):
    """Development Configuration"""
    pass

class TestingConfig(BaseConfig):
    """Testing Configuration"""
    TESTING = True

class ProductionConfig(BaseConfig):
    """Production Configuration"""
    pass