<?php
	session_start();

	if ( !isset($_SESSION["loginSedis"]) ) {
   	 	echo "expirou";
    	die();
	}else{
		echo "valida";
	}
?>