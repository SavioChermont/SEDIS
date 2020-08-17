<?php
session_start();
if ( !isset($_SESSION['loginSedis']) ) {
    header('Location: ../visualizacao/tela-login.html');
}else{
  //Verifica se já transcorreram 3 minutos desde o último acesso e destrói a sessão
	if (isset($_SESSION['ultima_atividade']) && (time() - $_SESSION['ultima_atividade'] > 180)) {
    	// última atividade foi ha mais de 180 segundos atrás
    	session_unset();     
   	 	session_destroy();   // destroindo session 
	}
  //Renova por mais 180 segundos
	$_SESSION['ultima_atividade'] = time(); // update da ultima atividade
}
?>