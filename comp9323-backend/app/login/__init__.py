from flask import Flask
from . import views, projects, course


def init_route(app: Flask):
    # view
    app.add_url_rule('/login', view_func=views.login, methods=['POST'])
    app.add_url_rule('/register', view_func=views.register, methods=['POST'])
    app.add_url_rule('/check_login', view_func=views.check_login)
    app.add_url_rule('/check_role', view_func=views.check_role, methods=['POST'])
    app.add_url_rule('/get_message', view_func=views.get_message, methods=['POST'])
    app.add_url_rule('/set_message_read', view_func=views.set_message_read, methods=['POST'])
    app.add_url_rule('/delete_message', view_func=views.delete_message, methods=['POST'])
    app.add_url_rule('/get_awards', view_func=views.get_awards, methods=['POST'])
    app.add_url_rule('/change_password', view_func=views.change_password, methods=['POST'])
    app.add_url_rule('/get_user_profile', view_func=views.get_user_profile, methods=['POST'])
    app.add_url_rule('/get_award_detail', view_func=views.get_award_detail, methods=['POST'])
    # project
    app.add_url_rule('/view_project', view_func=projects.view_project, methods=['POST'])
    app.add_url_rule('/edit_project', view_func=projects.edit_project, methods=['POST'])
    app.add_url_rule('/change_project_status', view_func=projects.change_project_status, methods=['POST'])
    app.add_url_rule('/get_myProject', view_func=projects.get_myProject, methods=['POST'])
    app.add_url_rule('/view_comment', view_func=projects.view_comment, methods=['POST'])
    app.add_url_rule('/add_comment', view_func=projects.add_comment, methods=['POST'])
    app.add_url_rule('/reply_comment', view_func=projects.reply_comment, methods=['POST'])
    app.add_url_rule('/delete_comment', view_func=projects.delete_comment, methods=['POST'])
    app.add_url_rule('/view_works', view_func=projects.view_works, methods=['POST'])
    app.add_url_rule('/give_feedback', view_func=projects.give_feedback, methods=['POST'])
    app.add_url_rule('/join_quit_project', view_func=projects.join_quit_project, methods=['POST'])
    app.add_url_rule('/student_submit', view_func=projects.student_submit, methods=['POST'])
    app.add_url_rule('/give_award', view_func=projects.give_award, methods=['POST'])
    app.add_url_rule('/proj_start_end', view_func=projects.proj_start_end, methods=['POST'])
    # course
    app.add_url_rule('/get_courses', view_func=course.get_courses, methods=['POST'])
    app.add_url_rule('/get_course_detail', view_func=course.get_course_detail, methods=['POST'])
    app.add_url_rule('/add_requirement', view_func=course.add_requirement, methods=['POST'])
    app.add_url_rule('/get_requirements', view_func=course.get_requirements, methods=['POST'])
    app.add_url_rule('/get_requirement_detail', view_func=course.get_requirement_detail, methods=['POST'])
    app.add_url_rule('/add_proposal', view_func=course.add_proposal, methods=['POST'])
    app.add_url_rule('/delete_proposal', view_func=course.delete_proposal, methods=['POST'])
    app.add_url_rule('/get_proposals', view_func=course.get_proposals, methods=['POST'])
    app.add_url_rule('/public_course_to_reviewers', view_func=course.public_course_to_reviewers, methods=['POST'])
    app.add_url_rule('/get_projects_in_course', view_func=course.get_projects_in_course, methods=['POST'])
    app.add_url_rule('/edit_requirement', view_func=course.edit_requirement, methods=['POST'])
    app.add_url_rule('/delete_requirement', view_func=course.delete_requirement, methods=['POST'])




