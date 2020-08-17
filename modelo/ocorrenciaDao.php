<?php
	declare(strict_types=1);
	//require_once("aluno.php");

class OcorrenciaDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT o.id, o.descricao, o.data_ocorrencia, o.aluno_id, o.usuario_id, a.nome as aluno_nome, u.nome as usuario_nome, date_format(o.data_ocorrencia,'%d/%m/%Y') as data_ocorrenciaBR,CONCAT(
			'<button ',' onclick=\'buscaOcorrenciaParaAlterar(',o.id,');\' title=\'Editar\' class=\'btn btn-primary pull-right menu\' data-toggle=\'modal\' data-target=\'#modal-formulario\'><i class=\'fa fa-pencil\' aria-hidden=\'true\'></i></button>','&nbsp;&nbsp;',
			'<a ','  onclick=\'removeOcorrencia(',o.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
			) as acoes FROM aluno a JOIN aluno_ocorrencia o on(o.aluno_id = a.id) 
			JOIN usuario u on(o.usuario_id = u.id) ORDER BY aluno_nome, o.data_ocorrencia";// LIMIT 

			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			$resposta["mensagem"]="Erro ao listar ocorrencia DT. <br>{$e->getMessage()}";
			$resposta["erro"]=true;
		}
	}

	public function insere(Ocorrencia $ocorrencia, array &$resposta)
	{
		$this->sql = "INSERT INTO aluno_ocorrencia(descricao, aluno_id, usuario_id, data_ocorrencia) values(:DESCRICAO,:ALUNOID,:USUARIOID,:DATAOCORR)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $ocorrencia->getDescricao());
			$this->stmt->bindValue(":ALUNOID", $ocorrencia->getAluno()->getId());
			$this->stmt->bindValue(":USUARIOID", $ocorrencia->getUsuario()->getId());
			$this->stmt->bindValue(":DATAOCORR", $ocorrencia->getDataOcorrencia()->format("Y-m-d H:i:s"));
			$this->stmt->execute();
			$resposta["mensagem"] = "Ocorrência cadastrada com sucesso!";
		}catch(PDOException $e){
			throw new OcorrenciaException("Erro ao cadastrar ocorrencia. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT o.id, o.descricao, o.data_ocorrencia, o.aluno_id, o.usuario_id, a.nome as aluno_nome, u.nome as usuario_nome, date_format(o.data_ocorrencia,'%d/%m/%Y') as data_ocorrenciaBR FROM aluno a JOIN aluno_ocorrencia o on(o.aluno_id = a.id) 
			JOIN usuario u on(o.usuario_id = u.id) WHERE o.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new OcorrenciaException("Erro ao carregar ocorrência. <br>{$e->getMessage()}", 1);
		}
	}

	public function altera(Ocorrencia $ocorrencia, array &$resposta){
			$this->sql="UPDATE aluno_ocorrencia SET descricao=:DESCRICAO,aluno_id=:ALUNOID, usuario_id=:USUARIOID 
			,data_ocorrencia=:DATAOCORR WHERE id=:ID";
		
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":DESCRICAO", $ocorrencia->getDescricao());
			$this->stmt->bindValue(":ALUNOID", $ocorrencia->getAluno()->getId());
			$this->stmt->bindValue(":USUARIOID", $ocorrencia->getUsuario()->getId());
			$this->stmt->bindValue(":DATAOCORR", $ocorrencia->getDataOcorrencia()->format("Y-m-d H:i:s"));
			$this->stmt->bindValue(":ID", $ocorrencia->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Ocorrência alterada com sucesso!";
		}catch(PDOException $e){
			throw new OcorrenciaException("Erro ao alterar aluno. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM aluno_ocorrencia WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Ocorrência removida com sucesso!";
		}catch(PDOException $e){
			throw new OcorrenciaException("Erro ao remover curso. <br>{$e->getMessage()}", 1);
		}
	}
}
?>