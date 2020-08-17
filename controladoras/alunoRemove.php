<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/alunoException.php");
	require_once("../modelo/alunoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();
	$aluno = json_decode($_POST['aluno'], true);
	$resposta["erro"]=false;
	$resposta["mensagem"] = "";
	try{
		$dao = new AlunoDAO($conexao);
		$dao->remove($aluno['id'], $resposta);
	}catch(AlunoException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();;
	}
	echo json_encode($resposta);
?>
