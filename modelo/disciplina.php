<?php

declare(strict_types=1);
require_once("curso.php");

class Disciplina{
	private $id = 0;
	private $descricao;
	private $curso = null;

	function __construct(array $disciplina = NULL){
		if(isset($disciplina["id"])){
			$this->id = (int) $disciplina["id"];
		}
		if(isset($disciplina)){
			$this->descricao = $disciplina["descricao"];
			$curso = new Curso($disciplina["curso"]);
			$this->curso = $curso;
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

	public function setCurso(Curso $curso){
		$this->curso = $curso;
	}

	public function getCurso():Curso{
		return $this->curso;
	}
}

















?>