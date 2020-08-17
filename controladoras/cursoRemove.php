<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/cursoException.php");
	require_once("../modelo/cursoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$curso = json_decode($_POST['curso'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"] = "";
	try{
		$dao = new CursoDAO($conexao);
		$dao->remove($curso['id'], $resposta);
	}catch(CursoException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);

?>
