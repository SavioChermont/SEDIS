<?php
	require_once("configSession.php");
 	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/professorException.php");
	require_once("../modelo/professorDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$professorMatriz = json_decode($_POST["professor"],true);

	$professor = new Professor($professorMatriz);

	$resposta["erro"] = true;
	$resposta["mensagem"] = "";
//Alterado em 30/09 
	$conexao->beginTransaction();
	try{
		$dao = new ProfessorDAO($conexao);
		$dao->altera($professor, $resposta);
		$dao->removeTelefones($professor->getId(), $resposta);
		$dao->insereTelefones($professor->getId(), $resposta, $professor->getTelefones());
		$conexao->commit();
	}catch(ProfessorException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = "Transação falhou".$e->getMessage();
		$conexao->rollBack();
	}
	echo json_encode($resposta);
?>
