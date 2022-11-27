cd /home/approver
PID=$(cat save_pid.txt)
if ! ps -p $PID > /dev/null
then
   echo "$PID is stopped" >> /home/approver/check.log
   ./run.sh
fi