rm -rf ./dataBase/dbBackup
mongodump -h 127.0.0.1 -d blog -o ./dataBase/dbBackup