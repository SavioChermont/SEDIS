<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/professorException.php");
	require_once("../modelo/professorDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$professorMatriz = json_decode($_POST['professor'], true);

	$professor = new Professor($professorMatriz);

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	//Alterado em 27/10
	$conexao->beginTransaction();
	try{
		$dao = new ProfessorDAO($conexao);
		$dao->insere($professor, $resposta);
		$dao->getLastInsertId($resposta);
		$id = $resposta["ultimo"];
		$dao->insereTelefones($id, $resposta, $professor->getTelefones());
		$conexao->commit();
	}catch(ProfessorException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = "Transação falhou".$e->getMessage();
		$conexao->rollBack();
	}
	echo json_encode($resposta);
?>
