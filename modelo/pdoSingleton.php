<?php
	declare(strict_types=1);

	class PDOSingleton{
		private static $instancia=null;
		private $conexaoPdo= null;

		private function __construct(){
			$host = "localhost";
			$database = "sediscefet";
			$usuario = "root";
			$senha = "";

			try{
				$this->conexaoPdo = new PDO("mysql:dbname={$database};host={$host}","{$usuario}","{$senha}");
				$this->conexaoPdo->exec("SET CHARSET SET UTF8");
				$this->conexaoPdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$this->conexaoPdo->exec('SET NAMES utf8');
			}catch(PDOException $e){
				echo $e->getMessage();
				die("Connect Error".$e->getMessage());
			}
		}

		public static function getInstancia():PDOSingleton{
			if(!isset(self::$instancia))
				self::$instancia = new PDOSingleton();
			return self::$instancia;
		}

		public function getConexaoPdo():PDO{
			return $this->conexaoPdo;
		}
	}
	/*
	$conexao = $pdoSingleton->getConexaoPdo();
	$conexao2 = PDOSingleton::getInstancia()->getConexaoPdo();
	var_dump($conexao);
	var_dump($conexao2);
	*/
?>
