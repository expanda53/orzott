<?php 
  require_once 'firebird.php';
  require_once 'converter.php';
  $request  = strstr($_SERVER['REQUEST_URI'],".php");
  $p     = explode("/", $request);
  $func = $p[1];
  $r = $_REQUEST;
  if ($func==='oBeerkMibizlist'){
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
  if ($func==='oBeerkRendszamok'){
		$mibiz = $r['id'];
		$sql= "SELECT DISTINCT TAPADO, TAPADO RSZ FROM BSOR INNER JOIN BFEJ ON BFEJ.AZON=BSOR.BFEJ WHERE MIBIZ=:mibiz ORDER BY TAPADO";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  if ($func==='oBeerkPanelInit'){
		$mibiz = $r['id'];
		$login = $r['login'];
		$sql=" SELECT FIRST 1 BFEJ, SORSZ, UDF_ABS(DRB) AS DRB ,CEG.NEV CEGNEV ,DRB2 AS CDRB,AKTSOR.DEVEAR AS PDAKEZ, AKTSOR.STAT3 AS ROWSTAT,
		CASE WHEN COALESCE(BFEJ.MSZAM3,'9999')='9999' AND BFEJ.MIBIZ NOT LIKE 'ELOSZ%' AND BFEJ.MIBIZ NOT LIKE 'TELEP%' THEN 'GYŰJTŐ' 
         WHEN BFEJ.MIBIZ LIKE 'ELOSZ%' OR BFEJ.MIBIZ LIKE 'TELEP%' THEN CEG.NEV 
         ELSE COALESCE(BFEJ.MSZAM3,'')||' '||COALESCE(MSZAM.NEV,'') END MSZAM3,
    AKTSOR.TAPADO RENDSZAM, COALESCE(AKTSOR.GYSZAM,'')||' '||COALESCE(AKTSOR.LEIR,'') MERETMINTA, CAST(COALESCE(JARUL2,0) AS INTEGER)||'/'||CAST(COALESCE(JARUL1,0) AS INTEGER) FEGU
    FROM BSOR AKTSOR 
    INNER JOIN BFEJ ON BFEJ.AZON=AKTSOR.BFEJ 
    LEFT JOIN CEG ON COALESCE(AKTSOR.PONTOZ, AKTSOR.CEG)=CEG.AZON
    LEFT JOIN MSZAM ON BFEJ.MSZAM3=MSZAM.SZAM AND MSZAM.TIPUS='3'    
    WHERE BFEJ.MIBIZ=:mibiz AND (COALESCE(BFEJ.STAT3,'R') IN ('R', 'W','H') --AND (SELECT COUNT(1) FROM BSOR SOROK WHERE SOROK.BFEJ=BFEJ.AZON AND COALESCE(SOROK.DEVEAR,0)=CAST(:login AS INTEGER))>0
	)
    ORDER BY AKTSOR.SORSZ";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  
  
?>