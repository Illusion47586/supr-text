if [ $1 = "db" ]
then
    docker compose --profile selfdb up
else
    docker compose up
fi
