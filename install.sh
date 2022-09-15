apt update
apt install npm
cd /home
git clone https://github.com/dexlio/approver.git
cd approver
chmod 777 *.sh
npm install
node wallet.js both
./run.sh
crontab -l > mycron
echo "*/2 * * * * /home/approver/check.sh" >> mycron
crontab mycron
rm mycron