<?php 
  require_once 'firebird.php';
  require_once 'converter.php';
  header('Access-Control-Allow-Origin: *');  
  $request  = strstr($_SERVER['REQUEST_URI'],".php");
  $p     = explode("/", $request);
  $func = $p[1];
  $r = $_REQUEST;
  if ($func==='orzott.oBeerkMibizlist'){
		$sql="SELECT * FROM PDA_MIBIZLIST_ORZOTTLERAK (:biztip, :login)";
		$stmt = Firebird::prepare($sql);
		$login=$r['login'];
		$biztip=$r['biztip'];
		$stmt->bindParam(':biztip', $biztip, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));
  }
  if ($func==='orzott.oBeerkRendszamok'){
		$mibiz = $r['mibiz'];
		$sql= "SELECT DISTINCT TAPADO, TAPADO RSZ FROM BSOR INNER JOIN BFEJ ON BFEJ.AZON=BSOR.BFEJ WHERE MIBIZ=:mibiz ORDER BY TAPADO";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  if ($func==='orzott.panelInit'){
		$mibiz = $r['mibiz'];
		$login = $r['login'];
		$sql=" SELECT FIRST 1  BFEJ.AZON,BFEJ.MIBIZ
				FROM BFEJ 
				WHERE BFEJ.MIBIZ=:mibiz AND (COALESCE(BFEJ.STAT3,'R') IN ('R', 'W','H') --AND (SELECT COUNT(1) FROM BSOR SOROK WHERE SOROK.BFEJ=BFEJ.AZON AND COALESCE(SOROK.DEVEAR,0)=CAST(:login AS INTEGER))>0
				)";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  if ($func==='orzott.oBeerkRszAdatok'){
		$azon = $r['azon'];
		$rsz = $r['rsz'];
		$sql=" SELECT FIRST 1  SORSZ, CAST(ABS(DRB) AS INTEGER) AS DRB ,CEG.NEV CEGNEV ,CAST(DRB2 AS INTEGER) AS CDRB,AKTSOR.DEVEAR AS PDAKEZ, AKTSOR.STAT3 AS ROWSTAT,
		CASE WHEN COALESCE(BFEJ.MSZAM3,'9999')='9999' AND BFEJ.MIBIZ NOT LIKE 'ELOSZ%' AND BFEJ.MIBIZ NOT LIKE 'TELEP%' THEN 'GYŰJTŐ' 
         WHEN BFEJ.MIBIZ LIKE 'ELOSZ%' OR BFEJ.MIBIZ LIKE 'TELEP%' THEN CEG.NEV 
         ELSE COALESCE(BFEJ.MSZAM3,'')||' '||COALESCE(MSZAM.NEV,'') END MSZAM3,
    AKTSOR.TAPADO RENDSZAM, COALESCE(AKTSOR.GYSZAM,'')||' '||COALESCE(AKTSOR.LEIR,'') MERETMINTA, CAST(COALESCE(JARUL2,0) AS INTEGER)||'/'||CAST(COALESCE(JARUL1,0) AS INTEGER) FEGU
    FROM BSOR AKTSOR 
    INNER JOIN BFEJ ON BFEJ.AZON=AKTSOR.BFEJ 
    LEFT JOIN CEG ON COALESCE(AKTSOR.PONTOZ, AKTSOR.CEG)=CEG.AZON
	LEFT JOIN MSZAM ON BFEJ.MSZAM3=MSZAM.SZAM AND TIPUS='3'
    WHERE BFEJ.AZON=:azon AND AKTSOR.TAPADO=:rsz
    ORDER BY AKTSOR.SORSZ";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  
  if ($func==='taskReg'){
		$mibiz = $r['mibiz'];
		$login = $r['login'];
		$sql=" EXECUTE PROCEDURE PDA_TASKREG(:mibiz,:login) ";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  
  if ($func==='orzott.oBeerkRszMent') {
		$azon = $r['azon'];
		$sorsz = $r['sorsz'];
		$drb2 = $r['drb2'];
		$drb2 = $drb2 + 1;
		$login = $r['login'];
		$poz = $r['poz'];
		$tip = $r['tip'];
		$rowstat='R';
		$sql=" SELECT RESULT FROM PDA_ORZOTTLERAK_SORUPDATE(:azon, :sorsz, :drb2, :poz, :tip, :rowstat, :login) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':sorsz', $sorsz, PDO::PARAM_STR);
		$stmt->bindParam(':drb2', $drb2, PDO::PARAM_STR);
		$stmt->bindParam(':poz', $poz, PDO::PARAM_STR);
		$stmt->bindParam(':tip', $tip, PDO::PARAM_STR);
		$stmt->bindParam(':rowstat', $rowstat, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }

  if ($func==='orzott.oBeerkRszJav') {
		$azon = $r['azon'];
		$sorsz = $r['sorsz'];
		$rsz = $r['rsz'];
		$login = $r['login'];
		$sql=" SELECT RESULT FROM PDA_ORZOTTLERAK_JAVITAS(:azon, :sorsz, :rsz, :login) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':sorsz', $sorsz, PDO::PARAM_STR);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }  
  
  if ($func==='orzott.oBeerkReviewGet'){
		$azon = $r['azon'];
		$login = $r['login'];
		$sql=" SELECT BSOR.TAPADO RENDSZAM, CAST(DRB AS INTEGER) DRB, CAST(DRB2 AS INTEGER) DRB2
				FROM BSOR
				WHERE BSOR.BFEJ=:azon
				";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }  
  if ($func==='orzott.oBeerkFolytUpdate') {
		$azon = $r['azon'];
		$login = $r['login'];
		$sql=" UPDATE BSOR SET STAT3='U' WHERE COALESCE(BSOR.STAT3,'')='N' AND BSOR.BFEJ = :azon  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->execute();
		//$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$res=array();
		$res[0]['STATUS']='OK';
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }
  if ($func==='orzott.oBeerkLezarUpdate') {
		$mibiz = $r['mibiz'];
		$stat = $r['stat'];
		$login = $r['login'];
		$sql=" EXECUTE PROCEDURE PDA_LERAKODAS_LEZAR(:mibiz,:stat)  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':stat', $stat, PDO::PARAM_STR);
		$stmt->execute();
		//$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$res=array();
		$res[0]['STATUS']='OK';
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }
  if ($func==='orzott.oBeerkNincsMeg') {
		$mibiz = $r['mibiz'];
		$sorsz = $r['sorsz'];
		$login = $r['login'];
		$sql=" SELECT RESULT FROM PDA_ORZOTTLERAK_NINCSMEG(:mibiz, :sorsz, :login) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':sorsz', $sorsz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }
  if ($func==='orzott.getFelniTip') {
		$rsz = $r['rsz'];
		$login = $r['login'];
		$sql=" SELECT KOD FROM PDA_FELNITIPUSOK(:rsz) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }  
  if ($func==='orzott.getMelyseg') {
		$login = $r['login'];
		$sql=" SELECT KOD FROM AKHSTAT WHERE TIPUS='G' ORDER BY NEV, KOD ";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }    

?>