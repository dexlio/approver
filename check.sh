cd /home/approver
PID=$(cat save_pid.txt)
if ! ps -p $PID > /dev/null
then
   echo "$PID is stopped" >> /home/approver/check.log
   ./run.sh
fi

git remote update

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL != $REMOTE ]; then
./stop.sh
git pull
npm install
./run.sh

else
    echo "Up-to-date" >> /home/approver/check.log
fi