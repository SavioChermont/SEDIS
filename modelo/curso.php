<?php
  declare(strict_types=1);
  class Curso{
  	private $id = 0;
  	private $descricao;
    private $ano;

  	function __construct(array $curso = NULL){
      if(isset($curso["id"])){
        $this->id = (int) $curso["id"];
      }
      if(isset($curso)){
       $this->descricao = $curso["descricao"];
        $this->ano = $curso["ano"];
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
      $this->descricao = $descricao;
    }

    public function getDescricao():string{
      return $this->descricao;
    }

    public function setAno(string $ano){
      $this->ano = $ano;
    }

    public function getAno():string{
      return $this->ano;
    }

  }
?>