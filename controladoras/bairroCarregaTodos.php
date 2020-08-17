<?php
	require_once("configSession.php");
	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/bairroException.php");
	require_once("../modelo/bairroDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		if(isset($_GET['idCidade'])){
			$dao = new BairroDAO($conexao);
			$dao->listarTodosPorCidade($_GET['idCidade'], $resposta);
		}
		else
			$dao->listarTodos($resposta);
	}catch(BairroException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);
?>