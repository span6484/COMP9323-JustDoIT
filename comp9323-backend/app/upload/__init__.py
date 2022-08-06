from flask import Flask
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os
from app.models import *
from app.login.utils import *
from qiniu import Auth, put_file, etag
import qiniu.config
def upload_pdf(filepath,new_filename):
    # 需要填写你的 Access Key 和 Secret Key
    access_key = 'v3MHegseyWvv-nWth1rNLEhEHlBIYTJVxxKwjU1C'
    secret_key = 'hNP6rsfl27TnPpNBOo2fitFZDieu-Y-q1IysX88r'
    # 构建鉴权对象
    q = Auth(access_key, secret_key)
    # 要上传的空间
    bucket_name = 'amber-li-pdf'
    # filepath = 'file/123.pdf'
    # 上传后保存的文件名
    key = new_filename
    # 生成上传 Token，可以指定过期时间等
    token = q.upload_token(bucket_name, key, 3600)
    # 要上传文件的本地路径
    # localfile = 'file/123.pdf'
    try:
        ret, info = put_file(token, key, filepath, version='v2')
        return {
                    'pdf_url': 'http://rg6rfshto.hn-bkt.clouddn.com/' + key
                }
    except Exception as e:
        return {
                    'pdf_url': 'http://rg6rfshto.hn-bkt.clouddn.com/' + key
                }

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
            # proj_id = result["proj_id"]
            # uid = result["uid"]
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
                # 上传后保存的文件名

                timeNow = get_time()[1]
                _key_list = filename.split(".")
                new_filename = _key_list[0] + "_" + str(timeNow) + "." + _key_list[1]

                path = os.path.join(basedir,app.config['UPLOAD_FOLDER'], new_filename)
                file.save(os.path.join(basedir, app.config['UPLOAD_FOLDER'], new_filename))
                result = upload_pdf(path,new_filename)
                # print("proj_id: ", proj_id)
                # print("uid: ", uid)
                # f_num = FileModel.query.count()
                # fid = generate_id("file", f_num)
                # date_time = get_time()[0]
                # add_file = FileModel(fid = fid, proj_id = proj_id, uid = uid, file_name = filename, file_url = path, type = file.content_type, ctime=date_time, utime=date_time, active=1)
                # db.session.add(add_file)
                # db.session.commit()
                # return redirect(url_for('download_file', upload_file=filename))

                return jsonify({'code': 200, 'msg': 'file success','result': result})
        else:

            print("if-4")
            return jsonify({'code': 200, 'msg': 'file failed'})


    app.add_url_rule('/upload_file', view_func = upload_file, methods=['GET','POST'])
