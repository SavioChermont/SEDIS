<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/alunoException.php");
	require_once("../modelo/alunoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	try{
		$dao = new AlunoDAO($conexao);
		$dao->listarTodosDT($resposta);
	}catch(AlunoException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();;
	}
	echo json_encode($resposta);
?>
