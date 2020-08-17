<?php
  declare(strict_types=1);
  class Usuario{
  	private $id = 0;
    private $nome;  
    private $cargo; 
    private $login; 
    private $senha;


  	function __construct(array $usuario = NULL){
    if(isset($usuario["id"])){
      $this->id = (int) $usuario["id"];
    }
  	$this->nome = $usuario["nome"];
		$this->cargo = $usuario["cargo"];
		$this->login = $usuario["login"];
		$this->senha = $usuario["senha"];
  	}

  	public function setId(int $id){
  		if($id>0)
  			$this->id = $id;
  	}

  	public function getId():int{
  		return $this->id;
  	}

    public function setNome(string $nome){
      $this->nome = $nome;
    }

    public function getNome():string{
      return $this->nome;
    }

    public function setCargo(string $cargo){
      $this->cargo = $cargo;
    }

    public function getCargo():string{
      return $this->cargo;
    }

    public function setLogin(string $login){
      $this->login = $login;
    }

    public function getLogin():string{
      return $this->login;
    }

    public function setSenha(string $senha){
      $this->senha = $senha;
    }

    public function getSenha():string{
      return $this->senha;
    }

  }
?>