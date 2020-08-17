<?php
	declare(strict_types=1);
	require_once("disciplina.php");
	require_once("DisciplinaException.php");

class DisciplinaDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT d.id, d.descricao, c.descricao as curso_descricao, CONCAT(
			'<button ',' onclick=\'buscaDisciplinaParaAlterar(',d.id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeDisciplina(',d.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM curso c JOIN disciplina d on(d.curso_id = c.id) ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao listar disciplinas DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			if($cursoId>0){
				$this->sql="SELECT d.id, d.descricao, d.curso_id, c.descricao as curso_descricao FROM curso c JOIN disciplina d on(d.curso_id = c.id) WHERE d.curso_id=:CURSOID ORDER BY d.descricao"; 
				$this->stmt = $this->conexao->prepare($this->sql);
				$this->stmt->bindParam(":CURSOID", $cursoId);
			}
			else{
				$this->sql="SELECT d.id, d.descricao, d.curso_id, c.descricao as curso_descricao FROM curso c JOIN disciplina d on(d.curso_id = c.id) ORDER BY d.descricao";
			$this->stmt = $this->conexao->prepare($this->sql);
			}
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao listar disciplinas. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT d.id, d.descricao, d.curso_id, c.descricao as curso_descricao FROM  disciplina d JOIN curso c on(d.curso_id = c.id) WHERE d.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao obter disciplina pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Disciplina $disciplina, array &$resposta){
		$this->sql="UPDATE disciplina SET descricao=:DESCRICAO, curso_id=:CURSOID WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO",$disciplina->getDescricao());
			$this->stmt->bindValue(":CURSOID",$disciplina->getCurso()->getId());
			$this->stmt->bindValue(":ID",$disciplina->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Disciplina alterada com sucesso!";
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao alterar disciplina. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM disciplina WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Disciplina removida com sucesso!";
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao remover disciplina. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Disciplina $disciplina, array &$resposta)
	{
		$this->sql = "INSERT INTO disciplina(descricao, curso_id) values(:DESCRICAO,:CURSOID)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $disciplina->getDescricao());
			$this->stmt->bindValue(":CURSOID", $disciplina->getCurso()->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Disciplina cadastrada com sucesso!";
		}catch(PDOException $e){
			throw new DisciplinaException("Erro ao cadastrar disciplina. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
