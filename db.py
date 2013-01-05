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

if __name__ == '__main__':
    Account.create_table()
    Currency.create_table()