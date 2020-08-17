<?php
declare(strict_types=1);

class MatriculaDao{

	private $conexao = null;
	private $stmt = null;
	private $sql = "";

	public function __construct(PDO $conexao){
		$this->conexao = $conexao;
	}

	public function listarTodosDT(array &$resposta){
		try{
			$this->sql="SELECT m.id, m.ano, m.turma_id, m.aluno_id, m.disciplina_id,m.professor_id, c.id as curso_id, a.nome as aluno_nome, t.descricao as turma_descricao, p.nome as professor_nome, d.descricao as disciplina_descricao, c.descricao as curso_descricao, CONCAT('<a ','  onclick=\'removeMatricula(',m.id,');\' title=\'Excluir\' class=\'btn btn-danger\'><i class=\'fa fa-trash\' aria-hidden=\'true\'></i></a>' 
					) as acoes FROM matricula m JOIN aluno a on(m.aluno_id=a.id) JOIN professor p on(m.professor_id=p.id) JOIN turma t on(m.turma_id=t.id) JOIN disciplina d ON(m.disciplina_id=d.id) JOIN curso c on(t.curso_id=c.id AND d.curso_id=c.id)  ORDER BY d.descricao, a.nome, p.nome";
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":ANO", $ano);
			$this->stmt->bindValue(":TURMA", $turma);
			$this->stmt->bindValue(":DISCIPLINA", $disciplina);
			$this->stmt->bindValue(":PROFESSOR", $professor);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new MatriculaException("Erro ao listar matriculas DT. <br>{$e->getMessage()}", 1);
		}
	}

	public function listarTodos(array &$resposta){
		try{
			$this->sql="SELECT m.id, m.ano, m.turma_id, m.aluno_id, m.disciplina_id,m.professor_id, c.id as curso_id, a.nome as aluno_nome, t.descricao as turma_descricao, p.nome as professor_nome, d.descricao as disciplina_descricao, c.descricao as curso_descricao, CONCAT(a.nome,'-',a.id) as alunoPesquisa FROM matricula m JOIN aluno a on(m.aluno_id=a.id) JOIN professor p on(m.professor_id=p.id) JOIN turma t on(m.turma_id=t.id) JOIN disciplina d ON(m.disciplina_id=d.id) JOIN curso c on(t.curso_id=c.id AND d.curso_id=c.id)  ORDER BY d.descricao, a.nome, p.nome";
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->execute();
			$resposta["data"]=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
		}catch(PDOException $e){
			throw new MatriculaException("Erro ao listar matriculas. <br>{$e->getMessage()}", 1);
		}
	}

	public function obtemPeloId(int $id, array &$resposta){
		$this->sql="SELECT m.id, m.ano, m.turma_id, m.aluno_id, m.disciplina_id,m.professor_id, c.id as curso_id, a.nome as aluno_nome, t.descricao as turma_descricao, p.nome as professor_nome, d.descricao as disciplina_descricao, c.descricao as curso_descricao, CONCAT(a.nome,'-',a.id) as alunoPesquisa FROM matricula m JOIN aluno a on(m.aluno_id=a.id) JOIN professor p on(m.professor_id=p.id) JOIN turma t on(m.turma_id=t.id) JOIN disciplina d ON(m.disciplina_id=d.id) JOIN curso c on(t.curso_id=c.id AND d.curso_id=c.id)  WHERE m.id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resultado=$this->stmt->fetchAll(PDO::FETCH_ASSOC);
			$resposta["data"] = $resultado[0];
		}catch(PDOException $e){
			throw new MatriculaException("Erro ao carregar matrícula. <br>{$e->getMessage()}", 1);
		}
	}

	public function insere(Matricula $matricula, array &$resposta)
	{
		$this->sql = "INSERT INTO matricula(ano, aluno_id, turma_id, disciplina_id, professor_id) values(:ANO,:ALUNOID,:TURMAID,:DISCIPLINAID,:PROFESSORID)";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindValue(":ANO", (string) $matricula->getAno());
			$this->stmt->bindValue(":ALUNOID", $matricula->getAluno()->getId());
			$this->stmt->bindValue(":TURMAID", $matricula->getTurma()->getId());
			$this->stmt->bindValue(":DISCIPLINAID", $matricula->getDisciplina()->getId());
			$this->stmt->bindValue(":PROFESSORID", $matricula->getProfessor()->getId());
			$this->stmt->execute();
			$resposta["mensagem"] = "Matricula cadastrada com sucesso!";
		}catch(PDOException $e){
			throw new MatriculaException("Erro ao cadastrar matricula. <br>{$e->getMessage()}", 1);
		}
	}

	public function remove(int $id, array &$resposta){
		$this->sql = "DELETE FROM matricula WHERE id=:ID";
		try{
			$this->stmt = $this->conexao->prepare($this->sql);
			$this->stmt->bindParam(":ID", $id);
			$this->stmt->execute();
			$resposta["mensagem"] = "Matrícula removida com sucesso!";
		}catch(PDOException $e){
			throw new MatriculaException("Erro ao remover matricula. <br>{$e->getMessage()}", 1);
		}
	}
}
?>