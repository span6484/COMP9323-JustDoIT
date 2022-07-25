from flask import Flask
from . import views, projects


def init_route(app: Flask):
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/check_login', view_func=views.check_login)
    app.add_url_rule('/view_project', view_func=projects.view_project, methods=['POST'])
    app.add_url_rule('/change_project_status', view_func=projects.change_project_status, methods=['POST'])
    app.add_url_rule('/change_project_status2', view_func=projects.change_project_status2, methods=['POST'])
    app.add_url_rule('/view_comment', view_func=projects.view_comment, methods=['POST'])
    app.add_url_rule('/add_comment', view_func=projects.add_comment, methods=['POST'])
    app.add_url_rule('/reply_comment', view_func=projects.reply_comment, methods=['POST'])
    app.add_url_rule('/delete_comment', view_func=projects.delete_comment, methods=['POST'])

