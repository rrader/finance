from peewee import *

db = SqliteDatabase('data.db')

class Currency(Model):
    name = CharField()
    
    class Meta:
        database = db


class Account(Model):
    name = CharField()
    balance = DoubleField()
    currency = ForeignKeyField(Currency, related_name='accounts')

    class Meta:
        database = db

class Category(Model):
    name = CharField()
    ctype = CharField()

    class Meta:
        database = db


class Transaction(Model):
    value = DoubleField()
    value2 = DoubleField(null=True)
    account_from = ForeignKeyField(Currency, related_name='transactions', null=True)
    account_to = ForeignKeyField(Currency, related_name='transactions', null=True)
    timestamp = DateTimeField()
    category = ForeignKeyField(Category, related_name='transactions', null=True)
    comment = CharField()

    class Meta:
        database = db

if __name__ == '__main__':
    Account.create_table()
    Currency.create_table()
    Category.create_table()
    Transaction.create_table()
    Currency(name="uah").save()
    Currency(name="usd").save()