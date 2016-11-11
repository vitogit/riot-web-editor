# Riot.js Web Text  Editor
Simple text editor that sync with google drive.

It uses Javascript Google Api v3.

Is an experiment to authenticate, save, load and list files form your google drive

# Install

Add your api client_id to config.js. You can get the client id following the instruction
from step1 here https://developers.google.com/drive/v3/web/quickstart/js

Clone, install and run
```
npm install
npm start //to run the dev server
```

Then go to localhost:4000

#uses
The first time it will try to check if you are authorized, if not you should click the button to log in using your google account
and gives permissions. The you can write something in the text area and save it. It will create a new document named notes with your content. 
