<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/ocorrenciaException.php");
	require_once("../modelo/ocorrenciaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	try{
		$dao = new OcorrenciaDAO($conexao);
		$dao->listarTodosDT($resposta);
	}catch(OcorrenciaException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();;
	}
	echo json_encode($resposta);
?>