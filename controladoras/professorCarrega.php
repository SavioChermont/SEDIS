<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/professorException.php");
	require_once("../modelo/professorDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$professor = json_decode($_POST['professor'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	//Alterado em 27/10
	$conexao->beginTransaction();
	try{
		$dao = new ProfessorDAO($conexao);
		$dao->obtemPeloId($professor["id"], $resposta);
		$dao->obtemTelefones($professor["id"], $resposta);
		$conexao->commit();
	}catch(ProfessorException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = "Transação falhou".$e->getMessage();
		$conexao->rollBack();
	}
	echo json_encode($resposta);
?>
