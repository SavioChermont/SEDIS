<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/turmaException.php");
	require_once("../modelo/turmaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$turma = json_decode($_POST['turma'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	try{
		$dao = new TurmaDAO($conexao);
		$dao->obtemPeloId($turma["id"], $resposta);
	}catch(TurmaException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);

?>