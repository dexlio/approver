apt update
apt install npm
git clone https://github.com/dexlio/approver.git
cd approver
chmod 777 *.sh
npm install
nohup node approver.js