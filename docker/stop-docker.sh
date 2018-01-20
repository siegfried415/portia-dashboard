portia_container_id=`sudo docker ps --format {{.ID}} -f ancestor=siegfried415/portia-dashboard`
echo $portia_container_id
sudo docker stop $portia_container_id 
