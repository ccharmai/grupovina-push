# WEB PUSH example for Grupovina

## How to launch project
1. Run ```yarn``` command
2. Read and follow instructions in sections [how to create your personal web push token](#how-to-create-your-personal-web-push-token)
3. Add your service email into this **.env** file
4. Run ```yarn dev``` command
5. Open [localhost:8000](http://localhost:8000/) in your browser

## How to create your personal web push token
1. Make sure that you have already installed all the project dependencies with the ```yarn``` command
2. Run ```./node_modules/.bin/web-push generate-vapid-keys``` command in the folder of this project
3. Copy and paste public and private key into the **.env** file
