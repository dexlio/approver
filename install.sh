apt update
apt install npm
cd /home
git clone https://github.com/dexlio/approver.git
cd approver
chmod 777 *.sh
npm install
./create.sh
./run.sh