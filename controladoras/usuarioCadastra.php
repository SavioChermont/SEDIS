<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/usuarioException.php");
	require_once("../modelo/usuarioDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$usuarioMatriz = json_decode($_POST['usuario'], true);

	$usuario = new Usuario($usuarioMatriz);

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		$dao = new UsuarioDAO($conexao);
		$dao->insere($usuario, $resposta);
	}catch(UsuarioException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>
