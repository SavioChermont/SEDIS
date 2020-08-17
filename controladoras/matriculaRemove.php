<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/matriculaException.php");
	require_once("../modelo/matriculaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$matricula = json_decode($_POST['matricula'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"] = "";
	try{
		$dao = new MatriculaDAO($conexao);
		$dao->remove($matricula['id'], $resposta);
	}catch(MatriculaException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);

?>