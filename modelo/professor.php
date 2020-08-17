<?php
  declare(strict_types=1);
  class Professor{
  	private $id = 0;
  	private $nome;
  	private $email;
    private $siape;
    //Alterado em 27/10
    private $telefones = array();

  	function __construct(array $professor = NULL){
      if (isset($professor["id"])) {
        $this->id = (int) $professor["id"];
      }
      if(isset($professor)){
        $this->nome = $professor["nome"];
        $this->email = $professor["email"];
        $this->siape = $professor["siape"];
        //Alterado em 30/09 
        $this->telefones = $professor["telefones"];
      }
  	}

    //Alterado em 27/10 
    public function setTelefones(array $telefones){
      $this->telefones = $telefones;
    }
    //Alterado em 27/10 
    public function getTelefones():array{
      return $this->telefones;
    }

  	public function setId(int $id){
  		if($id>0)
  			$this->id = $id;
  	}

  	public function getId():int{
  		return $this->id;
  	}

  	public function setNome(string $nome){
  		if(strlen($nome)>=5)
  			$this->nome = $nome;
  	}

  	public function getNome():string{
  		return $this->nome;
  	}

  	public function setEmail(string $email){
  		if(strripos($email, "@")===false)
  			$this->email = $email;
  	}

  	public function getEmail():string{
  		return $this->email;
  	}

    public function setSiape(string $siape){
        if(strlen($siape)==7)
        $this->siape = $siape;
    }

    public function getSiape():string{
        return $this->siape;
    }

  }
?>