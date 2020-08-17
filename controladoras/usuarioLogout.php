<?php  
	//require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/usuarioException.php");
	require_once("../modelo/usuarioDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();	

	$cookie = json_decode($_POST['cookie'], true);
	
	$idSessao = $cookie["id"];


	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	try{
		$dao = new UsuarioDAO($conexao);
		$dao->logoutUsuario($idSessao,$resposta);
	}catch(UsuarioException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>