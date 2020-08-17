<?php
	declare(strict_types=1);
	require_once("cidade.php");
	require_once("CidadeException.php");

class CidadeDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT *,CONCAT(
			'<button ',' onclick=\'buscaCidadeParaAlterar(',id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeCidade(',id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM cidade ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao listar cidades DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT * FROM cidade ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao listar cidades. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT * FROM cidade WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao obter cidade pelo id. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Cidade $cidade, array &$resposta){
		$this->sql="UPDATE cidade SET descricao=:DESCRICAO WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO",$cidade->getDescricao());
			$this->stmt->bindValue(":ID",$cidade->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Cidade alterada com sucesso!";
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao alterar cidade. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM cidade WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Cidade removida com sucesso!";
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao remover cidade. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Cidade $cidade, array &$resposta)
	{
		$this->sql = "INSERT INTO cidade(descricao) values(:DESCRICAO)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $cidade->getDescricao());
			$this->stmt->execute();
			$resposta["mensagem"] = "Cidade cadastrada com sucesso!";
		}catch(PDOException $e){
			throw new CidadeoException("Erro ao cadastrar cidade. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
