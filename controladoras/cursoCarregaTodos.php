<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/cursoException.php");
	require_once("../modelo/cursoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();
	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	
	try{
		$dao = new CursoDAO($conexao);
		$dao->listarTodos($resposta);
	}catch(CursoException $e){
		$resposta["erro"]=false;
		$resposta["mensagem"]=$e->getMessage();
	}
	echo json_encode($resposta);
?>