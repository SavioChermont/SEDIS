<?php
	declare(strict_types=1);
	require_once("turma.php");
	require_once("turmaException.php");

class TurmaDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT t.id, t.descricao,t.email, c.descricao as curso_descricao, CONCAT(
			'<button ',' onclick=\'buscaTurmaParaAlterar(',t.id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeTurma(',t.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM curso c JOIN turma t on(t.curso_id = c.id) ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new TurmaException("Erro ao listar turmas DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta, int $cursoId){
		try{
			if($cursoId>0){
				$this->sql="SELECT t.id, t.descricao,t.email, t.curso_id, c.descricao as curso_descricao FROM curso c JOIN turma t on(t.curso_id = c.id) WHERE t.curso_id=:CURSOID ORDER BY t.descricao";
				$this->stmt = $this->conexao->prepare($this->sql);
				$this->stmt->bindParam(":CURSOID", $cursoId);
			}
			else{
				$this->sql="SELECT t.id, t.descricao,t.email, b.curso_id, c.descricao as curso_descricao FROM curso c JOIN turma t on(t.curso_id = c.id) ORDER BY t.descricao";
				$this->stmt = $this->conexao->prepare($this->sql);
			}
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new TurmaException("Erro ao listar turmas. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT t.id, t.descricao,t.email, t.curso_id,t.end_horario, c.descricao as curso_descricao FROM  turma t JOIN curso c on(t.curso_id = c.id) WHERE t.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new TurmaException("Erro ao obter turma pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Turma $turma, array &$resposta)
	{
		$this->sql = "INSERT INTO turma(descricao,email,curso_id,end_horario) values(:DESCRICAO,:EMAIL,:CURSOID,:EHORARIO)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $turma->getDescricao());
			$this->stmt->bindValue(":EMAIL", $turma->getEmail());
			$this->stmt->bindValue(":CURSOID", $turma->getCurso()->getId());
			$this->stmt->bindValue(":EHORARIO", $turma->getHorario());
			$this->stmt->execute();
			$resposta["mensagem"] = "Turma cadastrada com sucesso!";
		}catch(PDOException $e){
			throw new TurmaException("Erro ao cadastrar turma. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Turma $turma, array &$resposta){
		$this->sql="UPDATE turma SET descricao=:DESCRICAO,email=:EMAIL,curso_id=:CURSOID,end_horario=:EHORARIO WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO",$turma->getDescricao());
			$this->stmt->bindValue(":EMAIL", $turma->getEmail());
			$this->stmt->bindValue(":CURSOID",$turma->getCurso()->getId());
			$this->stmt->bindValue(":EHORARIO", $turma->getHorario());
			$this->stmt->bindValue(":ID",$turma->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Turma alterada com sucesso!";
		}catch(PDOException $e){
			throw new TurmaException("Erro ao alterar turma. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM turma WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Turma removida com sucesso!";
		}catch(PDOException $e){
			throw new TurmaException("Erro ao remover turma. <br>{$e->getMessage()}", 1);
		}
	}

}

?>