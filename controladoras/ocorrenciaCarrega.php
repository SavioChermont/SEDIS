<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/ocorrenciaException.php");
	require_once("../modelo/ocorrenciaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$ocorrencia = json_decode($_POST['ocorrencia'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	try{
		$dao = new OcorrenciaDao($conexao);
		$dao->obtemPeloId($ocorrencia["id"], $resposta);
	}catch(OcorrenciaException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();
	}
	echo json_encode($resposta);
?>