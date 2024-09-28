from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt


metadata = MetaData(
    naming_convention={"fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s"}
)

db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()



class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)


    # Relationships
    posts = db.relationship('Post', back_populates='userpost', lazy=True, cascade='all, delete-orphan')
    likes = db.relationship('Like', back_populates='userlike', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', back_populates='usercomment', lazy=True, cascade='all, delete-orphan')
    dislikes = db.relationship('Dislike', back_populates='userdislike', lazy=True, cascade='all, delete-orphan')




    # def set_password(self, password):
    #     self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    # def check_password(self, password):
    #     return bcrypt.check_password_hash(self.password, password)
    


class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # rules
    serialize_rules = ('-userpost.posts',)


    # Relationships
    userpost = db.relationship('User', back_populates='posts', lazy=True)
    postlikes = db.relationship('Like', back_populates='postliked', lazy=True, cascade='all, delete-orphan')
    postdislikes = db.relationship('Dislike', back_populates='postdisliked', lazy=True, cascade='all, delete-orphan')
    postcomments = db.relationship('Comment', back_populates='postcommented', lazy=True, cascade='all, delete-orphan')




class Like(db.Model, SerializerMixin):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)


    # rules
    serialize_rules = ('-userlike.likes', '-postliked.postlikes')


    # Relationships
    userlike = db.relationship('User', back_populates='likes', lazy=True)
    postliked = db.relationship('Post', back_populates='postlikes', lazy=True)




class Dislike(db.Model, SerializerMixin):
    __tablename__ = 'dislikes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)


    # rules
    serialize_rules = ('-userdislike.dislikes', '-postdisliked.postdislikes')


    # Relationships
    userdislike = db.relationship('User', back_populates='dislikes', lazy=True)
    postdisliked = db.relationship('Post', back_populates='postdislikes', lazy=True)



class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String(500), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # rules
    serialize_rules = ('-usercomment.comments', '-postcommented.postcomments')


    # Relationships
    usercomment = db.relationship('User', back_populates='comments', lazy=True)
    postcommented = db.relationship('Post', back_populates='postcomments', lazy=True)






class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String, nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)