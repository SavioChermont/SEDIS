<?php

declare(strict_types=1);
require_once("curso.php");

class Turma{
	private $id = 0;
	private $descricao;
	private $email;
	private $curso = null;
	private $horario;

	function __construct(array $turma = NULL){
		if(isset($turma["id"])){
			$this->id = (int) $turma["id"];
		}
		if(isset($turma)){
			$this->descricao = $turma["descricao"];
			$this->email = $turma["email"];
			$curso = new Curso($turma["curso"]);
			$this->curso = $curso;
			$this->horario = $turma["horario"];
		}	
	}

	public function setId(int $id){
		if($id>0)
			$this->id = $id;
	}

	public function getId():int{
		return $this->id;
	}

	public function setDescricao(string $descricao){
		if(strlen($descricao)>=5)
			$this->descricao = $descricao;
	}

	public function getDescricao():string{
		return $this->descricao;
	}

	public function setEmail(string $email){
		$this->email = $email;
	}

	public function getEmail():string{
		return $this->email;
	}

	public function setCurso(Curso $curso){
		$this->curso = $curso;
	}

	public function getCurso():Curso{
		return $this->curso;
	}

	public function setHorario(string $horario){
      $this->horario = $horario;
    }

    public function getHorario():string{
      return $this->horario;
    }
}