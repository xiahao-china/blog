source ./preCheck.sh

if [ "$CHECK_MONGODUMP_RES" == "true" ]; then
    rm -rf ./dataBase/blog
    mongodump -h 127.0.0.1 -d blog -o ./dataBase
fi
