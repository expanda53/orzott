<?php
class Firebird {
	private static $link = null ;
	
	private static function getLink(){
		if (self::$link) return self::$link;

		$driver="firebird";
		$user="SYSDBA";
		$password="masterkey";
		//$host="192.168.22.122";
		//$dbname="C:\ALFA\TIR\DAT\F2010\F2010_TESZT.GDB" ;
		$host="192.168.1.68";
		$dbname="D:\ALFA\TIR\DAT\F2013\F2013.GDB" ;

		$port="3050";
		
        		
		
		$dsn = "${driver}:";
		$dsn .= 'dbname='.$host.':'.$dbname;
		$options=array();
		
		self::$link = new PDO($dsn, $user, $password, $options);
		$attributes = array();
		foreach ($attributes as $k => $v)
			self::$link->setAttribute(constant("PDO::{$k}"), constant( "PDO::{$v}" ));
				
		return self :: $link ;
	}

	/**
	 * Statikus PDO osztályhívások
	 * @param string $name
	 * @param string $args
	 * @return PDO
	 */
	public static function __callStatic($name, $args){
		$callback = array(self::getLink(), $name);
		return call_user_func_array($callback, $args);
	}
	
	public static function prepare($sql){
		return self::getLink()->prepare($sql);
	}

}
?>