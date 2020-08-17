<?php

declare(strict_types=1);
require_once("aluno.php");
require_once("turma.php");
require_once("disciplina.php");
require_once("professor.php");

class Matricula{
	private $id = 0;
	private $ano;
	private $aluno = null;
	private $turma = null;
	private $disciplina = null;
	private $professor = null;

	function __construct(array $matricula = NULL){
		if(isset($matricula["id"])){
			$this->id = (int) $matricula["id"];
		}
		$this->ano = $matricula["ano"];
		$aluno = new Aluno();
		$aluno->setId((int) $matricula["aluno"]["id"]);
		$this->aluno = $aluno;
		$turma = new Turma();
		$turma->setId((int) $matricula["turma"]["id"]);
		$this->turma = $turma;
		$disciplina = new Disciplina();
		$disciplina->setId((int) $matricula["disciplina"]["id"]);
		$this->disciplina = $disciplina;

		$professor = new Professor();
		$professor->setId((int) $matricula["professor"]["id"]);
		$this->professor = $professor;
	}

	public function setId(int $id){
		if($id>0)
			$this->id = $id;
	}

	public function getId():int{
		return $this->id;
	}

	public function setAno(string $ano){
		if(strlen($ano)==4)
			$this->ano = $ano;
	}

	public function getAno():string{
		return $this->ano;
	}

	public function setAluno(Aluno $aluno){
		$this->aluno = $aluno;
	}

	public function getAluno():Aluno{
		return $this->aluno;
	}

	public function setTurma(Turma $turma){
		$this->turma = $turma;
	}

	public function getTurma():Turma{
		return $this->turma;
	}

	public function setDisciplina(Disciplina $disciplina){
		$this->disciplina = $disciplina;
	}

	public function getDisciplina():Disciplina{
		return $this->disciplina;
	}

	public function setProfessor(Professor $professor){
		$this->professor = $professor;
	}

	public function getProfessor():Professor{
		return $this->professor;
	}
}

?>