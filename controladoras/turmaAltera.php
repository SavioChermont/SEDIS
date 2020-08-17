<?php
	require_once("configSession.php");
 	require_once("../modelo/pdoSingleton.php");
	require_once("../modelo/turmaException.php");
	require_once("../modelo/turmaDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$turmaMatriz = json_decode($_POST["turma"],true);

	$turma = new Turma($turmaMatriz);

	if(isset($_FILES["horario"])){
		$dirHorarios = "..".DIRECTORY_SEPARATOR."horarios";
		if(!is_dir($dirHorarios))
			mkdir($dirHorarios);
		$horario = $_FILES["horario"];
		$extensao = pathinfo($_FILES['horario']['name']);
		$extensao = ".".$extensao['extension'];

		$nomeDoArquivo = $turma->getDescricao()."_horario".$extensao;
		//var_dump($nomeDoArquivo);
		if(!move_uploaded_file($horario["tmp_name"], $dirHorarios.DIRECTORY_SEPARATOR.$nomeDoArquivo)){
				$resposta["mensagem"]="Erro ao enviar horario.";
				$resposta["erro"]=true;
				return;
		}
		$turma->setHorario($nomeDoArquivo);
	}else
		$turma->setHorario("");

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	try{
		$dao = new TurmaDAO($conexao);
		$dao->altera($turma, $resposta);
	}catch(TurmaException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = $e->getMessage();
	}
	echo json_encode($resposta);

?>
