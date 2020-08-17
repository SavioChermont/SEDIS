<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/matricula.php");
	require_once("../modelo/matriculaException.php");
	require_once("../modelo/matriculaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$matriculaMatriz = json_decode($_POST['matricula'], true);

	$matricula = new Matricula($matriculaMatriz);

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	try{
		$dao = new MatriculaDAO($conexao);
		$dao->insere($matricula, $resposta);
	}catch(MatriculaException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>