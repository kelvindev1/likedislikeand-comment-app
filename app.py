from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Api, Resource
from dotenv import load_dotenv
import os
from datetime import timedelta
from models import db
from config import jwt
from auth import auth_bp



load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})


app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY')
app.config['DEBUG'] = os.getenv('FLASK_DEBUG')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('FLASK_SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_ECHO'] = os.getenv('FLASK_SQLALCHEMY_ECHO')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('FLASK_SQLALCHEMY_TRACK_MODIFICATIONS')
app.config['JWT_SECRET_KEY'] = os.getenv('FLASK_JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=15)
app.json.compact = False



migrate = Migrate(app, db)
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
jwt.init_app(app)



app.register_blueprint(auth_bp)



if __name__ == '__main__':
    app.run(port=5555, debug=True)