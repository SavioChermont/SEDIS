<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/turmaException.php");
	require_once("../modelo/turmaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";

	$curso = json_decode($_POST["curso"], true);
	//var_dump($curso);

	if(isset($curso["id"]))
		$cursoId= (int) $curso["id"];
	else
		$cursoId=0;
	try{
		$dao = new TurmaDAO($conexao);
		$dao->listarTodos($resposta,$cursoId);
	}catch(TurmaException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();
	}
	echo json_encode($resposta);
?>