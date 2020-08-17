<?php
	require_once("configSession.php");
 	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/bairro.php");
	require_once("../modelo/bairroException.php");
	require_once("../modelo/bairroDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$bairroMatriz = json_decode($_POST["bairro"],true);

	$bairro = new Bairro($bairroMatriz);

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		$dao = new BairroDao($conexao);
		$dao->altera($bairro, $resposta);
	}catch(BairroException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>