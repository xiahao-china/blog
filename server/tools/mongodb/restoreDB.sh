source ./preCheck.sh

if [ "$CHECK_MONGODUMP_RES" == "true" ]; then
    rm -rf ./dataBase/blog
    mongorestore -h 127.0.0.1:27017 -d blog ./dataBase
fi

