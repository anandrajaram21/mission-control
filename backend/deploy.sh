docker build . -t sumukshashidhar/kappathon-server; 
docker run  --env-file .env -it -p 3000:3000 sumukshashidhar/kappathon-server;