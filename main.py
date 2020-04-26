from flask import Flask, render_template, request,session, redirect, url_for, escape, Request
import json
from flask import Flask, request, jsonify
import os
from datetime import timedelta
from time import gmtime, strftime

os.chdir(os.getcwd())
filename=os.getcwd()+"/data/sample_data.json"

app = Flask(__name__, template_folder='template')
app.secret_key = 'abc'
app.permanent_session_lifetime = timedelta(minutes=5)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
TEMPLATES_AUTO_RELOAD=True


@app.route('/')
def index():
    #print("called index session",session)
    return (render_template('index.html'))

@app.route('/get_details', methods = ['GET', 'POST'])
def get_details():
    data=""
    with open('data/sample_data.json') as f:
        data = json.load(f)
    return jsonify(data=data)

@app.route('/store_details',methods=['POST'])
def store_details():
   try:
        data = request.get_json(force=True)
        # #print("data",data)
        time2=strftime("%Y-%m-%d %H:%M:%S", gmtime())
        #print(time2)
        newdata=""
        with open(filename) as f:
            newdata = json.load(f)
        # #print("newdata",newdata)
        count=0
        if len(newdata)==0:
            count=len(newdata["data"])+1
        else:
            count=len(newdata["data"])+1
        obj={
            "id":count,
            "name":data["name"],
            "shop_name":data["shop_name"],
            "status":data["status"],
            "date":time2
        }
        newdata["data"].append(obj)
        # #print("newdata--AFTER",newdata)

        with open(filename, 'w') as outfile:
            json.dump(newdata, outfile)
        return jsonify(data="ok")

        
   except Exception as err:
            message = ('Failed to perform. Exception: {}'.format(err))
            # response = jsonify(status='error', error_message=message)
            # response.status_code = HTTP_BAD_REQUEST
            return message

@app.route('/update_details',methods=['PUT'])
def update_details():
   try:
        data = request.get_json(force=True)
        #print("data",data)
        chid=data["id"]   

        newdata=""
        with open(filename) as f:
            newdata = json.load(f)
        #print("newdata",newdata)
        temp=[]
        for dat in newdata["data"]:
            if(dat["id"]!=chid):
                temp.append(dat)
        temp.append(data)
        newdata["data"]=temp

        #print("AFTER LIST:",newdata)

        with open(filename, 'w') as outfile:
            json.dump(newdata, outfile)
        return jsonify(data="ok")

        
   except Exception as err:
            message = ('Failed to perform. Exception: {}'.format(err))
            # response = jsonify(status='error', error_message=message)
            # response.status_code = HTTP_BAD_REQUEST
            return message


@app.route('/delete_details',methods=['DELETE'])
def delete_details():
   try:
        data = request.get_json(force=True)
        #print("data",data)
        chid=data["id"]   

        newdata=""
        with open(filename) as f:
            newdata = json.load(f)
        #print("newdata",newdata)
        temp=[]
        for dat in newdata["data"]:
            if(dat["id"]!=chid):
                temp.append(dat)
        # temp.append(data)
        newdata["data"]=temp

        #print("AFTER LIST:",newdata)

        with open(filename, 'w') as outfile:
            json.dump(newdata, outfile)
        return jsonify(data="ok")

        
   except Exception as err:
            message = ('Failed to perform. Exception: {}'.format(err))
            # response = jsonify(status='error', error_message=message)
            # response.status_code = HTTP_BAD_REQUEST
            return message

if __name__ == '__main__':
    app.run(debug=True,host = '0.0.0.0', port = 5000)

