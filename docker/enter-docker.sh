portia_container_id=`sudo docker ps --format {{.ID}} -f ancestor=siegfried415/portia-dashboard`
echo $portia_container_id
portia_container_pid=`sudo docker inspect --format {{.State.Pid}} $portia_container_id`
echo $portia_container_pid
sudo nsenter --target $portia_container_pid --mount --uts --ipc --net --pid
