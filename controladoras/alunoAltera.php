<?php
	require_once("configSession.php");
 	require_once("../modelo/pdoSingleton.php");
 	require_once("../modelo/alunoException.php");
	require_once("../modelo/alunoDao.php");

	$conexao = PDOSingleton::getInstancia()->getConexaoPdo();

	$alunoMatriz = json_decode($_POST["aluno"],true);
	$aluno = new Aluno($alunoMatriz);

	if(isset($_FILES["foto"])){
		$dirFotos = "..".DIRECTORY_SEPARATOR."fotos";
		if(!is_dir($dirFotos))
			mkdir($dirFotos);
		$foto = $_FILES["foto"];
		$extensao = pathinfo($_FILES['foto']['name']);
		$extensao = ".".$extensao['extension'];

		$nomeDoArquivo = $aluno->getMatricula().$extensao;
		//var_dump($nomeDoArquivo);
		if(!move_uploaded_file($foto["tmp_name"], $dirFotos.DIRECTORY_SEPARATOR.$nomeDoArquivo)){
				$resposta["mensagem"]="Erro ao enviar foto.";
				$resposta["erro"]=true;
				return;
		}
		$aluno->setFoto($nomeDoArquivo);
	}else
		$aluno->setFoto("");

	$resposta["erro"] = false;
	$resposta["mensagem"] = "";
	//Alterado em 30/09 
	$conexao->beginTransaction();
	try{
		$dao = new AlunoDAO($conexao);
		$dao->altera($aluno, $resposta);
		$dao->removeTelefones($aluno->getId(), $resposta);
		$dao->insereTelefones($aluno->getId(), $resposta, $aluno->getTelefones());
		$conexao->commit();
	}catch(AlunoException $e){
		$resposta["erro"] = true;
		$resposta["mensagem"] = "Transação falhou".$e->getMessage();
		$conexao->rollBack();
	}
	echo json_encode($resposta);
?>
