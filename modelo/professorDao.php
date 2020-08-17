<?php
	declare(strict_types=1);
	require_once("professor.php");
	require_once("professorException.php");

class ProfessorDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT *,CONCAT(
			'<button ',' onclick=\'buscaProfessorParaAlterar(',id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeProfessor(',id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM professor ORDER BY nome";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao listar professores DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT * FROM professor ORDER BY nome";// LIMIT {$start},{$length}";
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao listar professores. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT * FROM professor WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao obter professor pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Professor $professor, array &$resposta){
		$this->sql="UPDATE professor SET nome=:NOME,email=:EMAIL,siape=:SIAPE WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":NOME",$professor->getNome());
			$this->stmt->bindValue(":EMAIL",$professor->getEmail());
			$this->stmt->bindValue(":SIAPE", $professor->getSiape());
			$this->stmt->bindValue(":ID",$professor->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Professor alterado com sucesso!";
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao alterar professor. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM professor WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Professor removido com sucesso!";
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao remover professor. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Professor $professor, array &$resposta)
	{
		$this->sql = "INSERT INTO professor(nome,email,siape) values(:NOME,:EMAIL,:SIAPE)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":NOME", $professor->getNome());
			$this->stmt->bindValue(":EMAIL", $professor->getEmail());
			$this->stmt->bindValue(":SIAPE", $professor->getSiape());
			$this->stmt->execute();
			$resposta["mensagem"] = "Professor cadastrado com sucesso!";
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao cadastrar professor. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 27/10
	public function obtemTelefones(int $id, array &$resposta){
		$this->sql="SELECT * FROM professor_telefone WHERE professor_id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$this->stmt->execute();
			$resposta["data"]["telefones"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao carregar telefones do professor. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 27/10
	public function removeTelefones(int $id, array &$resposta){
		$this->sql = "DELETE FROM professor_telefone WHERE professor_id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao remover telefones do professor. <br>{$e->getMessage()}", 1);
		}
	}

	//Criada em 27/10
	public function getLastInsertId(array &$resposta){
		$this->sql = "SELECT MAX(id) as ultimo FROM professor";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["ultimo"] = $resultado[0]["ultimo"];
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao obter o id do professor cadastrado. <br>{$e->getMessage()}", 1);
		}
	}
	//Criada em 30/09
	public function insereTelefones(int $idProfessor, array &$resposta,array $telefones){
		$this->sql = "INSERT INTO professor_telefone(professor_id, ddd, telefone) values(:PROFESSORID,:DDD,:TELEFONE)";
		//var_dump($telefones);
		$this->stmt = $this->conexao->prepare($this->sql);
		try{
			for($i=0; $i<count($telefones);$i++){
				$this->stmt->bindValue(":PROFESSORID", $idProfessor);
				$this->stmt->bindValue(":DDD", $telefones[$i]["ddd"]);
				$this->stmt->bindValue(":TELEFONE", $telefones[$i]["telefone"]);
				$this->stmt->execute();
			}		
		}catch(PDOException $e){
			throw new ProfessorException("Erro ao cadastrar telefones do professor. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
