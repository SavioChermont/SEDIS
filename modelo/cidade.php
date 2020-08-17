<?php
  declare(strict_types=1);
  class Cidade{
  	private $id = 0;
  	private $descricao;

  	function __construct(array $cidade = NULL){
      if(isset($cidade["id"])){
        $this->id = (int) $cidade["id"];
      }
  		$this->descricao = $cidade["descricao"];
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


  }
?>