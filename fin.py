from flask import Flask, json, Response, request
import db
import datetime
import time

app = Flask(__name__, static_folder="client")

@app.route('/api/currencies')
def api_currencies():
    js = json.dumps([ currency._data for currency in db.Currency.select()])
    return Response(js, status=200, mimetype='application/json')


@app.route('/api/accounts', methods=["POST", "GET", "DELETE"])
def api_accounts():
    if request.method == 'GET':
        def prepare_account(acc):
            acc['currency'] = db.Currency.get(id=acc['currency'])._data
            return acc

        js = json.dumps([ prepare_account(account._data) for account in db.Account.select()])
        return Response(js, status=200, mimetype='application/json')

    if request.method == 'POST':
        name = request.args['name']
        start_balance = float(request.args['start_balance'])
        currency = db.Currency.get(id=int(request.args['currency']))
        new_c = db.Account(name=name, balance=start_balance, currency=currency)
        new_c.save()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')

    if request.method == 'DELETE':
        acc = db.Account.get(id=int(request.args['id']))
        acc.delete_instance()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')

@app.route('/api/categories', methods=["POST", "GET", "DELETE"])
def api_categories():
    if request.method == 'GET':
        def prepare(acc):
            return acc

        js = json.dumps([ prepare(cat._data) for cat in db.Category.select()])
        return Response(js, status=200, mimetype='application/json')

    if request.method == 'POST':
        name = request.args['name']
        ctype = request.args['type']
        new_c = db.Category(name=name, ctype=ctype)
        new_c.save()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')

    if request.method == 'DELETE':
        acc = db.Category.get(id=int(request.args['id']))
        acc.delete_instance()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')



@app.route('/api/transactions', methods=["POST", "GET", "DELETE"])
def api_transactions():
    if request.method == 'GET':
        def prepare(acc):
            try:
                acc['account_to'] = db.Account.get(id=acc['account_to'])._data
            except db.Account.DoesNotExist:
                pass

            try:
                acc['account_from'] = db.Account.get(id=acc['account_from'])._data
            except db.Account.DoesNotExist:
                pass

            try:
                acc['category'] = db.Category.get(id=acc['category'])._data
            except db.Category.DoesNotExist:
                pass
            
            acc['timestamp'] = int(time.mktime(acc['timestamp'].timetuple()))

            return acc

        js = json.dumps([ prepare(item._data) for item in 
            db.Transaction.select().order_by(db.Transaction.timestamp.desc())])
        return Response(js, status=200, mimetype='application/json')

    if request.method == 'POST':
        if 'account_from' in request.args:
            acc_from = db.Account.get(id=request.args['account_from'])
        else:
            acc_from = None

        if 'account_to' in request.args:
            acc_to = db.Account.get(id=request.args['account_to'])
        else:
            acc_to = None
        value1 = float(request.args['value1'])

        if 'value2' in request.args:
            value2 = float(request.args['value2'])
        else:
            value2 = None
        
        timestamp = int(request.args['timestamp'])
        comment = request.args['comment']
        try:
            category = db.Category.get(id=request.args['category'])
        except:
            category = None
        new_t = db.Transaction(account_from=acc_from, account_to=acc_to,
                                value=value1, value2=value2,
                                timestamp=datetime.datetime.fromtimestamp(timestamp),
                                comment=comment,
                                category=category)
        new_t.save()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')

    if request.method == 'DELETE':
        acc = db.Transaction.get(id=int(request.args['id']))
        acc.delete_instance()

        return Response(json.dumps({'request':'ok'}), status=200, mimetype='application/json')



if __name__ == '__main__':
    app.run(debug=True)