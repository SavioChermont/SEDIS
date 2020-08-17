<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/matriculaException.php");
	require_once("../modelo/matriculaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	try{
		$dao = new MatriculaDAO($conexao);
		$dao->listarTodosDT($resposta);
	}catch(MatriculaException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();;
	}
	echo json_encode($resposta);
?>