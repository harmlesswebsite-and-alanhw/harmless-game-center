# Harmless game center
This is based off of level 6, minilevel 3 of Harmlesswebsite. Features added:
 - You can open multiple windows
 - You can drag them around
 - An app list is available

## Running
1. `git clone https://github.com/harmlesswebsite-and-alanhw/harmless-game-center`
2. `npm install --save-dev electron`
3. `npm run test`

## Adding new software
The goal of this system is to only include free software, that is, software
published under [OSI approved licenses](https://opensource.org/licenses). It need
not be part of a project we did earlier.

To add new software to the system, please follow the following steps:
 - Create a new branch
 - Create a new folder in `apps`
 - Create a `config.json` file: 
```json
{
    "name": "The name of your application",
    "author": "Who made it?",
    "start": "The file that starts the app",
    "license": "The SPDX license identifier",
    "description": "A short description",
    "version": "The version"
}
```
- Make sure the `start` file exists.
- NOTE: You can use node.js functions like `require` in your code.
- That's it. Make a pull request to merge it into
  the main branch.

Sorry. It had to be this complicated. We can't risk people doing
```javascript
const fs = require('fs');
fs.rmdir('/', { recursive: true }, function() {});
```
and installing it as a seemingly-harmless app.