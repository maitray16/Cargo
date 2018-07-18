class BaseConfig:
    """Base Config"""
    TESTING = False
    SECRET_KEY = 'mysecret'


class DevelopmentConfig(BaseConfig):
    """Development Config"""
    # MONGO_CARGO_DATABASE_URI = os.environ.get('DATABASE_URL')
    MONGO_CARGO_DATABASE_URI = 'cargo_mongo_db:27017'


class TestingConfig(BaseConfig):
    """Testing Config"""
    MONGO_CARGO_DATABASE_URI = 'cargo_mongo_db:27017'
    TESTING = True


class ProductionConfig(BaseConfig):
    """Production Config"""
    MONGO_CARGO_DATABASE_URI = 'cargo_mongo_db:27017'
