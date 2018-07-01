import os


class BaseConfig:
    """Base Config"""
    TESTING = False
    SECRET_KEY = 'mysecret'


class DevelopmentConfig(BaseConfig):
    """Development Config"""
    pass


class TestingConfig(BaseConfig):
    """Testing Config"""
    TESTING = True


class ProductionConfig(BaseConfig):
    """Production Config"""
    pass