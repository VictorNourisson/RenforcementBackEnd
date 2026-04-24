Lancement de l'application : 

    docker compose up -d

Installation :

    docker compose run app-assurmoi-app npm i
    docker compose run app-assurmoi-node npm i

BDD :

    docker compose run app-assurmoi-node npx sequelize-cli db:migrate
    docker compose run app-assurmoi-node npx sequelize-cli db:seed:all

Si localhost:8081 semble bloquer ou indisponible : 

    arrêter les conteneurs docker, les supprimer et relancer


Swagger :
http://localhost:3000/api-docs/

page login : <img width="1209" height="2625" alt="Capture d’écran 2026-04-24 à 15 11 04" src="https://github.com/user-attachments/assets/140713a6-ca9a-4940-8e05-c57e8babeceb" />
page d'accueil : <img width="1209" height="2625" alt="Capture d’écran 2026-04-24 à 15 11 44" src="https://github.com/user-attachments/assets/de3549bf-e14d-4989-afab-d87a457511cf" />
page sinistre : <img width="1209" height="2625" alt="Capture d’écran 2026-04-24 à 15 08 32" src="https://github.com/user-attachments/assets/0717ffb2-dbb1-461f-a7a8-3e13e2f87b92" />
<img width="502" height="816" alt="image" src="https://github.com/user-attachments/assets/e549f610-3435-42af-8371-cea8e70f5827" />




