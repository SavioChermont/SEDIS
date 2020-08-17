<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/professorException.php");
	require_once("../modelo/professorDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		$dao = new ProfessorDAO($conexao);
		$dao->listarTodosDT($resposta);
	}catch(ProfessorException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>
