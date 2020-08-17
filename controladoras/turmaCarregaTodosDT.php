<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/turmaException.php");
	require_once("../modelo/turmaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		$dao = new TurmaDAO($conexao);
		$dao->listarTodosDT($resposta);
	}catch(TurmaException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();
	}
	echo json_encode($resposta);
?>
