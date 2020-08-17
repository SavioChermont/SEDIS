<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/ocorrencia.php");
	require_once("../modelo/ocorrenciaException.php");
	require_once("../modelo/ocorrenciaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$ocorrenciaMatriz = json_decode($_POST['ocorrencia'], true);

	$ocorrencia = new Ocorrencia($ocorrenciaMatriz);

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	try{
		$dao = new OcorrenciaDAO($conexao);
		$dao->insere($ocorrencia, $resposta);
	}catch(OcorrenciaException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>