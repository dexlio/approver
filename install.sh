apt update
apt install npm
apt install screen
cd /home
git clone https://github.com/dexlio/approver.git
cd approver
chmod 777 *.sh
npm install
./run.sh