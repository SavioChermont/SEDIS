<?php
	declare(strict_types=1);
	require_once("curso.php");
	require_once("cursoException.php");

class CursoDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT *,CONCAT(
			'<button ',' onclick=\'buscaCursoParaAlterar(',id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeCurso(',id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM curso ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new CursoException("Erro ao listar cursos DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT * FROM curso ORDER BY descricao";
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new CursoException("Erro ao listar cursos. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT * FROM curso WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new CursoException("Erro ao obter curso pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Curso $curso, array &$resposta){
		$this->sql="UPDATE curso SET descricao=:DESCRICAO, ano=:ANO WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO",$curso->getDescricao());
			$this->stmt->bindValue(":ANO",$curso->getAno());
			$this->stmt->bindValue(":ID",$curso->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Curso alterado com sucesso!";
		}catch(PDOException $e){
			throw new CursoException("Erro ao alterar curso. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM curso WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Curso removido com sucesso!";
		}catch(PDOException $e){
			throw new CursoException("Erro ao remover curso. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Curso $curso, array &$resposta)
	{
		$this->sql = "INSERT INTO curso(descricao,ano) values(:DESCRICAO,:ANO)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $curso->getDescricao());
			$this->stmt->bindValue(":ANO",$curso->getAno());
			$this->stmt->execute();
			$resposta["mensagem"] = "Curso cadastrado com sucesso!";
		}catch(PDOException $e){
			throw new CursoException("Erro ao cadastrar curso. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
