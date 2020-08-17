<?php
	declare(strict_types=1);
	require_once("bairro.php");
	require_once("bairroException.php");

class BairroDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT b.id, b.descricao, c.descricao as cidade_descricao,CONCAT(
			'<button ',' onclick=\'buscaCidadeParaAlterar(',b.id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeCidade(',b.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM cidade c JOIN bairro b on(b.cidade_id = c.id) ORDER BY descricao";// LIMIT {$start},{$length}";

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new BairroException("Erro ao listar bairros DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT b.id, b.descricao, b.cidade_id, c.descricao as cidade_descricao FROM cidade c JOIN bairro b on(b.cidade_id = c.id) 
			 ORDER BY b.descricao"; 
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new BairroException("Erro ao listar bairros. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodosPorCidade($idCidade, array &$resposta){
		try{
			$this->sql="SELECT b.id, b.descricao, b.cidade_id, c.descricao as cidade_descricao FROM cidade c JOIN bairro b on(b.cidade_id = c.id) 
			 WHERE b.cidade_id = :CIDADEID 
			 ORDER BY b.descricao"; 

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":CIDADEID",$idCidade);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new BairroException("Erro ao listar bairros por cidade. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT b.id, b.descricao, b.cidade_id, c.descricao as cidade_descricao 
		FROM bairro b JOIN cidade c on(b.cidade_id=c.id) WHERE b.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new BairroException("Erro ao obter bairro pelo id. <br>{$e->getMessage()}", 1);
		}
	}
	public function altera(Bairro $bairro, array &$resposta){
		$this->sql="UPDATE bairro SET descricao=:DESCRICAO, cidade_id=:CIDADEID WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO",$bairro->getDescricao());
			$this->stmt->bindValue(":CIDADEID",$bairro->getCidade()->getId());
			$this->stmt->bindValue(":ID",$bairro->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Bairro alterado com sucesso!";
		}catch(PDOException $e){
			throw new BairroException("Erro ao alterar bairro. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM bairro WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Bairro removido com sucesso!";
		}catch(PDOException $e){
			throw new BairroException("Erro ao remover bairro. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Bairro $bairro, array &$resposta)
	{
		$this->sql = "INSERT INTO bairro(descricao, cidade_id) values(:DESCRICAO,:CIDADEID)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $bairro->getDescricao());
			$this->stmt->bindValue(":CIDADEID", $bairro->getCidade()->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Bairro cadastrado com sucesso!";
		}catch(PDOException $e){
			throw new BairroException("Erro ao cadastrar bairro. <br>{$e->getMessage()}", 1);
		}
	}
}
?>
