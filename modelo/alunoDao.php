<?php
	declare(strict_types=1);
	require_once("aluno.php");

class AlunoDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT a.id, a.nome, a.email, a.matricula, a.bairro_id
			, b.descricao as bairro_descricao, c.id as cidade_id
			, c.descricao as cidade_descricao, CONCAT(
			'<button ',' onclick=\'buscaAlunoParaAlterar(',a.id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeAluno(',a.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM aluno a JOIN bairro b on(a.bairro_id = b.id) 
			JOIN cidade c on(b.cidade_id = c.id) ORDER BY a.nome";// LIMIT 

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new AlunoException("Erro ao listar alunos DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT a.id, a.nome, a.email, a.matricula, a.bairro_id
			, b.descricao as bairro_descricao, c.id as cidade_id
			, c.descricao as cidade_descricao FROM aluno a JOIN bairro b 
			on(a.bairro_id = b.id) 
			JOIN cidade c on(b.cidade_id = c.id) ORDER BY a.nome";// LIMIT 

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new AlunoException("Erro ao listar alunos. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodosAC(array &$resposta){
		try{
			$this->sql="SELECT concat(nome,'-',id) as nome from aluno ORDER BY nome";// LIMIT 

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new AlunoException("Erro ao listar alunos. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT a.id, a.nome, a.email, a.matricula, a.bairro_id
			, b.descricao as bairro_descricao, c.id as cidade_id
			, c.descricao as cidade_descricao, a.data_nascimento,a.problema_saude, a.repetente, a.end_foto FROM aluno a JOIN bairro b 
			on(a.bairro_id = b.id) 
			JOIN cidade c on(b.cidade_id = c.id) WHERE a.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new AlunoException("Erro ao carregar alunos. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Aluno $aluno, array &$resposta){
		if(strlen($aluno->getFoto())>0){
			$this->sql="UPDATE aluno SET nome=:NOME,email=:EMAIL, bairro_id=:BAIRROID 
			,matricula=:MATRICULA, repetente=:REPETENTE, problema_saude=:PROBLEMA
			, data_nascimento=:DN,end_foto=:EFOTO WHERE id=:ID";
		}else{
			$this->sql="UPDATE aluno SET nome=:NOME,email=:EMAIL, bairro_id=:BAIRROID 
			,matricula=:MATRICULA, repetente=:REPETENTE, problema_saude=:PROBLEMA
			, data_nascimento=:DN WHERE id=:ID";
		}
		
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":NOME",$aluno->getNome());
			$this->stmt->bindParam(":EMAIL",$aluno->getEmail());
			$this->stmt->bindParam(":ID",$aluno->getId());
			$this->stmt->bindValue(":BAIRROID", $aluno->getBairro()->getId());
			$this->stmt->bindvalue(":MATRICULA", $aluno->getMatricula());
			$this->stmt->bindvalue(":REPETENTE", $aluno->getRepetente());
			$this->stmt->bindvalue(":PROBLEMA", $aluno->getProblemaSaude());
			$this->stmt->bindvalue(":DN", $aluno->getDataNascimento()->format("Y-m-d H:i:s"));
			if(strlen($aluno->getFoto())>0)
				$this->stmt->bindValue(":EFOTO", $aluno->getFoto());
			$this->stmt->execute();
			$resposta["mensagem"] = "Aluno alterado com sucesso!";
		}catch(PDOException $e){
			throw new AlunoException("Erro ao alterar aluno. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM aluno WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Aluno removido com sucesso!";
		}catch(PDOException $e){
			throw new AlunoException("Erro ao remover aluno. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Aluno $aluno, array &$resposta)
	{
		$this->sql = "INSERT INTO aluno(nome,email, bairro_id ,matricula, repetente, problema_saude, data_nascimento,end_foto) values(:NOME,:EMAIL,:BAIRROID,:MATRICULA,:REPETENTE,:PROBLEMA,:DN,:EFOTO)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":NOME", $aluno->getNome());
			$this->stmt->bindValue(":EMAIL", $aluno->getEmail());
			$this->stmt->bindValue(":BAIRROID", $aluno->getBairro()->getId());
			$this->stmt->bindvalue(":MATRICULA", $aluno->getMatricula());
			$this->stmt->bindvalue(":REPETENTE", $aluno->getRepetente());
			$this->stmt->bindvalue(":PROBLEMA", $aluno->getProblemaSaude());
			$this->stmt->bindvalue(":DN", $aluno->getDataNascimento()->format("Y-m-d H:i:s"));
			$this->stmt->bindValue(":EFOTO", $aluno->getFoto());
			$this->stmt->execute();
			$resposta["mensagem"] = "Aluno cadastrado com sucesso!";
		}catch(PDOException $e){
			throw new AlunoException("Erro ao cadastrar aluno. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 30/09
	public function obtemTelefones(int $id, array &$resposta){
		$this->sql="SELECT * FROM aluno_telefone WHERE aluno_id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$this->stmt->execute();
			$resposta["data"]["telefones"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new AlunoException("Erro ao carregar telefones do aluno. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 30/09
	public function removeTelefones(int $id, array &$resposta){
		$this->sql = "DELETE FROM aluno_telefone WHERE aluno_id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
		}catch(PDOException $e){
			throw new AlunoException("Erro ao remover telefones do aluno. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 30/09
	public function getLastInsertId(array &$resposta){
		$this->sql = "SELECT MAX(id) as ultimo FROM aluno";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["ultimo"] = $resultado[0]["ultimo"];
		}catch(PDOException $e){
			throw new AlunoException("Erro ao obter o id do alunos cadastrado. <br>{$e->getMessage()}", 1);
		}
	}
	//Criada em 30/09
	public function insereTelefones(int $idAluno, array &$resposta,array $telefones){
		$this->sql = "INSERT INTO aluno_telefone(aluno_id, ddd, telefone) values(:ALUNOID,:DDD,:TELEFONE)";
		//var_dump($telefones);
		$this->stmt = $this->conexao->prepare($this->sql);
		try{
			for($i=0; $i<count($telefones);$i++){
				$this->stmt->bindValue(":ALUNOID", $idAluno);
				$this->stmt->bindValue(":DDD", $telefones[$i]["ddd"]);
				$this->stmt->bindValue(":TELEFONE", $telefones[$i]["telefone"]);
				$this->stmt->execute();
			}		
		}catch(PDOException $e){
			throw new AlunoException("Erro ao cadastrar telefones do aluno. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
