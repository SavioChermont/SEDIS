<?php
	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/alunoException.php");
	require_once("../modelo/alunoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$aluno = json_decode($_POST['aluno'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	//Alterado em 30/09 
	$conexao->beginTransaction();
	try{
		$dao = new AlunoDAO($conexao);
		$dao->obtemPeloId($aluno["id"], $resposta);
		$dao->obtemTelefones($aluno["id"], $resposta);
		$conexao->commit();
	}catch(AlunoException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = "Transação falhou".$e->getMessage();
		$conexao->rollBack();
	}
	echo json_encode($resposta);

?>
