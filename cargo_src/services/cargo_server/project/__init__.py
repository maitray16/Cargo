import os
from flask import Flask, jsonify



def create_app(script_info=None):
    app = Flask(__name__)

    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)

    from project.api.main import main_blueprint
    app.register_blueprint(main_blueprint)

    app.shell_context_processor({'app': app})
    return app