from flask import Blueprint, make_response, request
from flask_restful import Api, Resource, reqparse
from models import User, db, TokenBlocklist, bcrypt
from datetime import datetime, timezone
from config import jwt
from flask_jwt_extended import get_jwt, create_access_token, jwt_required, create_refresh_token, get_jwt_identity



auth_bp = Blueprint('auth_bp', __name__, url_prefix='/auth')
auth_api = Api(auth_bp)



# JWT Callbacks
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data['sub']
    return User.query.filter_by(id=identity).first()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload['jti']
    token = TokenBlocklist.query.filter_by(jti=jti).first()
    return token is not None



# Register
register_args = reqparse.RequestParser()
register_args.add_argument('username', type=str, required=True, help='Username is required')
register_args.add_argument('email', type=str, required=True, help='Email is required')
register_args.add_argument('password', type=str, required=True, help='Password is required')
register_args.add_argument('password2', type=str, required=True, help='Confirm password is required')



class Register(Resource):
    def post(self):
        args = register_args.parse_args()
        username = args['username']
        email = args['email']
        password = args['password']
        password2 = args['password2']


        if password != password2:
            return {"msg": "Passwords don't match"}, 400
        
        if User.query.filter_by(username=username).first():
            return {"msg": "User already exists"}, 400
        
        if User.query.filter_by(email=email).first():
            return {"msg": "Email already registered"}, 400
        
        
        if not username or not email or not password or not password2:
            return {"msg": "All fields are required"}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(
            username=username,
            email=email,
            password=hashed_password
        )

        try:
            db.session.add(new_user)
            db.session.commit()
            return {'msg': "User registration successful"}, 201
        
        except Exception as e:
            db.session.rollback()
            return {"msg": "Error creating User", "error": str(e)}, 500
        
auth_api.add_resource(Register, '/register')






# Login
login_args = reqparse.RequestParser()
login_args.add_argument('email', type=str, required=True, help='Email is required')
login_args.add_argument('password', type=str, required=True, help='Password is required')

class Login(Resource):
    def post(self):
        data = login_args.parse_args()
        user = User.query.filter_by(email=data.get('email')).first()

        if not user:
            return {"msg": "User does not exist"}, 404
        
        if not bcrypt.check_password_hash(user.password, data.get('password')):
            return {"msg": "Password does not match"}, 401
        
        token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return make_response({
           "token": token,
           "refresh_token": refresh_token
        }, 200)

auth_api.add_resource(Login, '/login')



class Refresh(Resource):
    @jwt_required(refresh=True)
    def get(self):
        current_user = get_jwt_identity()  
        token = create_access_token(identity=current_user)  
        return make_response({"token": token}, 200)
    
auth_api.add_resource(Refresh, '/refresh')



class Logout(Resource):
    @jwt_required()
    def get(self):
        jti = get_jwt()["jti"]
        now = datetime.now(timezone.utc)
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.commit()
        return {"msg": "JWT revoked"}
    
auth_api.add_resource(Logout, '/logout')