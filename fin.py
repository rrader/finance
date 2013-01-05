from flask import Flask, url_for, json, Response, request
import db

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

if __name__ == '__main__':
    app.run(debug=True)