from flask import Flask
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os
from app.models import *
from app.login.utils import *
def init_route(app: Flask):
    # upload File
    UPLOAD_FOLDER = './upload_files/'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    basedir = os.path.abspath(os.path.dirname(__file__))
    def allowed_file(filename):
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def upload_file():
        # data = request.get_json(force=True)
        if request.method == "POST":
            # check if the post request has the file part
            if 'file' not in request.files:
                print("if-1")
                flash('No file part')
                return redirect(request.url)
            file = request.files['file']
            result = request.form
            proj_id = result["proj_id"]
            uid = result["uid"]
            # print(uid)
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                print("if-2")
                flash('No selected file')
                return redirect(request.url)
            if file and allowed_file(file.filename):
                # print("if-3")
                filename = secure_filename(file.filename)
                # print(filename)
                path = os.path.join(basedir,app.config['UPLOAD_FOLDER'], filename)
                file.save(os.path.join(basedir, app.config['UPLOAD_FOLDER'], filename))
                # print("proj_id: ", proj_id)
                # print("uid: ", uid)
                f_num = FileModel.query.count()
                fid = generate_id("file", f_num)
                date_time = get_time()[0]
                add_file = FileModel(fid = fid, proj_id = proj_id, uid = uid, file_name = filename, file_url = path, type = file.content_type, ctime=date_time, utime=date_time, active=1)
                db.session.add(add_file)
                db.session.commit()
                # return redirect(url_for('download_file', upload_file=filename))
                return jsonify({'code': 200, 'msg': 'file success'})
        else:

            print("if-4")
            return jsonify({'code': 200, 'msg': 'file failed'})


    app.add_url_rule('/upload_file', view_func = upload_file, methods=['GET','POST'])
