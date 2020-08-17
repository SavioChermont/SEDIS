<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/cidadeException.php");
	require_once("../modelo/cidadeDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$cidade = json_decode($_POST['cidade'], true);

	$resposta["erro"]=false;
	$resposta["mensagem"]="";
	try{
		$dao = new CidadeDAO($conexao);
		$dao->obtemPeloId($cidade["id"], $resposta);
	}catch(CidadeException $e){
		$resposta["erro"]=true;
		$resposta["mensagem"]=$e->getMessage();
	}
	echo json_encode($resposta);
?>
