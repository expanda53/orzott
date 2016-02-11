<?php 
 error_reporting(0);
<?php 
  require_once 'firebird.php';
  require_once 'converter.php';
  header('Access-Control-Allow-Origin: *');  
  $request  = strstr($_SERVER['REQUEST_URI'],".php");
  $p     = explode("/", $request);
  $func = $p[1];
  $r = $_REQUEST;
  if ($func==='checkLogin'){
		$sql="select count(1) RCOUNT from pda_kezelok where kezelo=:login";
		$stmt = Firebird::prepare($sql);
		$login=trim($r['user']);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));
  }
  
  if ($func==='beerk.mibizList'){
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

  if ($func==='beerk.panelInit'){
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
  if ($func==='beerk.rszAdatokGet'){
		$azon = $r['azon'];
		$rsz = $r['rsz'];
		$sql=" SELECT FIRST 1  SORSZ, CAST(ABS(DRB) AS INTEGER) AS DRB ,CEG.NEV CEGNEV ,CAST(DRB2 AS INTEGER) AS CDRB,AKTSOR.DEVEAR AS PDAKEZ, AKTSOR.STAT3 AS ROWSTAT,
		CASE WHEN COALESCE(BFEJ.MSZAM3,'9999')='9999' AND BFEJ.MIBIZ NOT LIKE 'ELOSZ%' AND BFEJ.MIBIZ NOT LIKE 'TELEP%' THEN 'GYÛJTÕ' 
         WHEN BFEJ.MIBIZ LIKE 'ELOSZ%' OR BFEJ.MIBIZ LIKE 'TELEP%' THEN CEG.NEV 
         ELSE COALESCE(BFEJ.MSZAM3,'')||' '||COALESCE(MSZAM.NEV,'') END MSZAM3,
    AKTSOR.TAPADO RENDSZAM, COALESCE(AKTSOR.GYSZAM,'')||' '||COALESCE(AKTSOR.LEIR,'') MERETMINTA, CAST(COALESCE(JARUL2,0) AS INTEGER)||'/'||CAST(COALESCE(JARUL1,0) AS INTEGER) FEGU,
	AKTSOR.MJBEL RSZADATOK,CAST(COALESCE(JARUL2,0) AS INTEGER) FEDB,CAST(COALESCE(JARUL1,0) AS INTEGER) GUDB,(SELECT FEGU FROM PDA_ORZOTTLERAK_FEGU(CAST(AKTSOR.MJSOR2 AS VARCHAR(500)))) FEGUKESZ
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
  if ($func==='beerk.rszAdatokSet'){
		$azon = $r['azon'];
		$rsz = $r['rsz'];
		$fedb = $r['fedb'];
		$login = $r['login'];
		$rszadatok = implode("\r\n", str_replace("\r",'',json_decode($r['data'])));
		$sql=" SELECT RESULT FROM PDA_ORZOTTLERAK_RSZUPDATE(:azon, :rsz, '$rszadatok', :fedb, :login) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->bindParam(':fedb', $fedb, PDO::PARAM_STR);
		try { 
			$stmt->execute();
			$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
			Firebird::commit();
		} catch (PDOException $e) { 
			Firebird::rollback();
			$res=array('errorcode'=>$e->getCode(),'errorinfo'=>$e->getMessage());
		} 

		echo json_encode($res);

  }  
  if ($func==='beerk.taskReg'){
		$mibiz = $r['mibiz'];
		$login = $r['login'];
		$sql=" EXECUTE PROCEDURE PDA_ORZOTTLERAK_TASKREG ( :mibiz, :login ) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		Firebird::commit();
		$res=null;
		//$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }
  
  if ($func==='beerk.rszMent') {
		$azon = $r['azon'];
		$sorsz = $r['sorsz'];
		$drb2 = $r['drb2'];
		$drb2 = $drb2 + 1;
		$login = $r['login'];
		$poz = $r['poz'];
		$tip = $r['tip'];
		$rowstat='R';
		$sql=" SELECT RESULT,FE,GU FROM PDA_ORZOTTLERAK_SORUPDATE(:azon, :sorsz, :drb2, :poz, :tip, :rowstat, :login) ";
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

  if ($func==='beerk.rszJav') {
		$azon = $r['azon'];
		$sorsz = $r['sorsz'];
		$rsz = $r['rsz'];
		$login = $r['login'];
		$sql=" SELECT RESULT,FEGU FROM PDA_ORZOTTLERAK_JAVITAS(:azon, :sorsz, :rsz, :login) ";
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
  
  if ($func==='beerk.reviewRszFilter'){
		$azon = $r['azon'];
		$login = $r['login'];
		$sql=" SELECT DISTINCT LEFT(BSOR.TAPADO,2) RENDSZAM
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
  
  if ($func==='beerk.reviewRszGet'){
		$filter = $r['filter'];
		$filterStr='';
		if ($filter!='*') {
			$filterStr = " AND BSOR.TAPADO STARTING WITH '$filter' ";
		}
		$azon = $r['azon'];
		$login = $r['login'];
		$sql=" SELECT BSOR.TAPADO RENDSZAM, CAST(DRB AS INTEGER) DRB, CAST(DRB2 AS INTEGER) DRB2
				FROM BSOR
				WHERE BSOR.BFEJ=:azon $filterStr
				";

		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));

  }  
  
  if ($func==='beerk.folytUpdate') {
		$azon = $r['azon'];
		$login = $r['login'];
		/*
		$sql=" UPDATE BSOR SET STAT3='U' WHERE COALESCE(BSOR.STAT3,'')='N' AND BSOR.BFEJ = :azon  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->execute();
		*/

		$sql=" UPDATE BFEJ SET STAT3='R',KONTI1=NULL WHERE BFEJ.AZON = :azon  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->execute();

		//$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$res=array();
		$res[0]['STATUS']='OK';
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }
  if ($func==='beerk.lezarUpdate') {
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
  if ($func==='beerk.getPositions') {
		$rsz = $r['rsz'];
		$mibiz = $r['mibiz'];
		$login = $r['login'];
		$sql=" SELECT * FROM PDA_ORZOTTLERAK_GETPOZ(:mibiz, :rsz) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
  }  
  if ($func==='beerk.getMelyseg' || $func==='elrak.getMelyseg') {
		$login = $r['login'];
		$sql=" SELECT KOD FROM AKHSTAT WHERE TIPUS='G' ORDER BY KOD3,KOD2,KOD";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  } 
  if ($func==='beerk.allapotMent' || $func==='elrak.allapotMent') {
		$rsz = $r['rsz'];
		$mibiz = $r['mibiz'];
		$login = $r['login'];
		$poz = $r['poz'];
		$tip = $r['tip'];
		$melyseg = $r['melyseg'];
		$sql=" SELECT * FROM PDA_ORZOTTLERAK_ALLAPOTMENT(:mibiz, :rsz, :poz,:tip, :melyseg,:login) ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
		$stmt->bindParam(':mibiz', $mibiz, PDO::PARAM_STR);
		$stmt->bindParam(':poz', $poz, PDO::PARAM_STR);
		$stmt->bindParam(':tip', $tip, PDO::PARAM_STR);
		$stmt->bindParam(':melyseg', $melyseg, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
  }  
  if ($func=='getMarka'){
		$marka = trim($r['marka']);
		$meret = trim($r['meret']);
		$minta = trim($r['minta']);
		$si = trim($r['si']);
		if (strtoupper($marka)=='MIND') $marka='';
		if (strtoupper($meret)=='MIND') $meret='';
		if (strtoupper($minta)=='MIND') $minta='';
		if (strtoupper($si)=='MIND') $si='';
		$marka=str_replace('\\r','',$marka);
		$meret=str_replace('\\r','',$meret);		
		$minta=str_replace('\\r','',$minta);		
		$si=str_replace('\\r','',$si);
		$where='';
		if (trim($marka)!='') $where = " MARKA = '$marka' ";
		if (trim($meret)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(MERET,'/',''),' ','') = replace(replace('$meret','/',''),' ','') ";}
		if (trim($minta)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(replace(replace(MINTA,'/',''),' ',''),'.',''),'*','') = replace(replace(replace(replace('$minta','/',''),' ',''),'.',''),'*','') ";}
		if (trim($si)!='') 	  {if ($where!='') $where.=' AND ';$where .= " SI = '$si' ";}
		if ($where!='') $where = ' AND ' .$where;
		$sql=" SELECT DISTINCT MARKA FROM AKHTORZS WHERE CICSOP STARTING WITH 'A' $where";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));	  
  }
  if ($func=='getMeret'){
		$marka = trim($r['marka']);
		$meret = trim($r['meret']);
		$minta = trim($r['minta']);
		$si = trim($r['si']);
		if (strtoupper($marka)=='MIND') $marka='';
		if (strtoupper($meret)=='MIND') $meret='';
		if (strtoupper($minta)=='MIND') $minta='';
		if (strtoupper($si)=='MIND') $si='';
		$marka=str_replace('\\r','',$marka);
		$meret=str_replace('\\r','',$meret);		
		$minta=str_replace('\\r','',$minta);		
		$si=str_replace('\\r','',$si);
		$where='';
		if (trim($marka)!='') $where = " MARKA = '$marka' ";
		if (trim($meret)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(MERET,'/',''),' ','') = replace(replace('$meret','/',''),' ','') ";}
		if (trim($minta)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(replace(replace(MINTA,'/',''),' ',''),'.',''),'*','') = replace(replace(replace(replace('$minta','/',''),' ',''),'.',''),'*','') ";}
		if (trim($si)!='') 	  {if ($where!='') $where.=' AND ';$where .= " SI = '$si' ";}
		if ($where!='') $where = ' AND ' .$where;
		$sql=" SELECT DISTINCT MERET FROM AKHTORZS  WHERE CICSOP STARTING WITH 'A' $where";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));	  
  }
  if ($func=='getMinta'){
		$marka = trim($r['marka']);
		$meret = trim($r['meret']);
		$minta = trim($r['minta']);
		$si = trim($r['si']);
		if (strtoupper($marka)=='MIND') $marka='';
		if (strtoupper($meret)=='MIND') $meret='';
		if (strtoupper($minta)=='MIND') $minta='';
		if (strtoupper($si)=='MIND') $si='';
		$marka=str_replace('\\r','',$marka);
		$meret=str_replace('\\r','',$meret);		
		$minta=str_replace('\\r','',$minta);		
		$si=str_replace('\\r','',$si);
		$where='';
		if (trim($marka)!='') $where = " MARKA = '$marka' ";
		if (trim($meret)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(MERET,'/',''),' ','') = replace(replace('$meret','/',''),' ','') ";}
		if (trim($minta)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(replace(replace(MINTA,'/',''),' ',''),'.',''),'*','') = replace(replace(replace(replace('$minta','/',''),' ',''),'.',''),'*','') ";}
		if (trim($si)!='') 	  {if ($where!='') $where.=' AND ';$where .= " SI = '$si' ";}
		if ($where!='') $where = ' AND ' .$where;

		$sql=" SELECT DISTINCT MINTA FROM AKHTORZS  WHERE CICSOP STARTING WITH 'A' $where";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));	  
  }
  if ($func=='getSI'){
		$marka = trim($r['marka']);
		$meret = trim($r['meret']);
		$minta = trim($r['minta']);
		$si = trim($r['si']);
		if (strtoupper($marka)=='MIND') $marka='';
		if (strtoupper($meret)=='MIND') $meret='';
		if (strtoupper($minta)=='MIND') $minta='';
		if (strtoupper($si)=='MIND') $si='';
		$marka=str_replace('\\r','',$marka);
		$meret=str_replace('\\r','',$meret);		
		$minta=str_replace('\\r','',$minta);		
		$si=str_replace('\\r','',$si);
		$where='';
		if (trim($marka)!='') $where = " MARKA = '$marka' ";
		if (trim($meret)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(MERET,'/',''),' ','') = replace(replace('$meret','/',''),' ','') ";}
		if (trim($minta)!='') {if ($where!='') $where.=' AND ';$where .= " replace(replace(replace(replace(MINTA,'/',''),' ',''),'.',''),'*','') = replace(replace(replace(replace('$minta','/',''),' ',''),'.',''),'*','') ";}
		if (trim($si)!='') 	  {if ($where!='') $where.=' AND ';$where .= " SI = '$si' ";}
		if ($where!='') $where = ' AND ' .$where;

		$sql=" SELECT DISTINCT SI FROM AKHTORZS  WHERE CICSOP STARTING WITH 'A' $where";
		$stmt = Firebird::prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));	  
  }
  
  if ($func=='elrak.rszAdatokGet') {
	/* elrakodasnal rendszam adatok + adott rendszambol mennyi van kiszedve*/
	$rsz = $r['rsz'];
	$sql=" SELECT * FROM PDA_ORZOTTHKOD_GETRSZ(:rsz) ";
	$stmt = Firebird::prepare($sql);
	$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
	$stmt->execute();
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	Firebird::commit();
	echo json_encode(Converter::win2utf_array($res));
  }

  if ($func=='elrak.hkodSaveCheck') {
	/* elrakodasnal hkod mentes elotti ellenorzesek*/
	$rsz = $r['rsz'];
	$hkod = $r['hkod'];
	$login = $r['login'];
	$sql=" SELECT * FROM PDA_ORZOTTHKOD_HKODCHECK(:rsz,:hkod, :login) ";
	$stmt = Firebird::prepare($sql);
	$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
	$stmt->bindParam(':hkod', $hkod, PDO::PARAM_STR);
	$stmt->bindParam(':login', $login, PDO::PARAM_STR);
	$stmt->execute();
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	Firebird::commit();
	echo json_encode(Converter::win2utf_array($res));
  }

  if ($func=='elrak.hkodSave') {
	/* elrakodasnal hkod mentes (elotte ellenorzes volt, ide csak akkor kerul, ha azon tuljutott)*/
	$azon = $r['azon'];
	$sorsz = $r['sorsz'];
	$rsz = $r['rsz'];
	$hkod = $r['hkod'];
	$login = $r['login'];
	$sql=" SELECT * FROM PDA_ORZOTTHKOD_HKODSAVE(:azon, :sorsz, :rsz,:hkod, :login) ";
	$stmt = Firebird::prepare($sql);
	$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
	$stmt->bindParam(':sorsz', $sorsz, PDO::PARAM_STR);
	$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
	$stmt->bindParam(':hkod', $hkod, PDO::PARAM_STR);
	$stmt->bindParam(':login', $login, PDO::PARAM_STR);
	$stmt->execute();
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	Firebird::commit();
	echo json_encode(Converter::win2utf_array($res));
  }
  if ($func==='elrak.hkodDel') {
	/* elrakodasnal adott rendszamhoz tartozo hkodok torlese */
	$azon = $r['azon'];
	$rsz = $r['rsz'];
	$login = $r['login'];
	$sql=" SELECT * FROM PDA_ORZOTTHKOD_HKODDEL(:azon, :rsz, :login) ";
	$stmt = Firebird::prepare($sql);
	$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
	$stmt->bindParam(':rsz', $rsz, PDO::PARAM_STR);
	$stmt->bindParam(':login', $login, PDO::PARAM_STR);
	$stmt->execute();
	$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
	Firebird::commit();
	echo json_encode(Converter::win2utf_array($res));	
  }
  /* orzott leltar */
  if ($func==='leltar.mibizList'){
		$sql="SELECT * FROM PDA_MIBIZLIST_ORZOTTLELTAR (:biztip, :login)";
		$stmt = Firebird::prepare($sql);
		$login=$r['login'];
		$biztip=$r['biztip'];
		$stmt->bindParam(':biztip', $biztip, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
  }
  if ($func==='leltar.rszSave'){
		$sql="SELECT * FROM PDA_ORZOTTLELTAR_SORUPDATE (:login,:fejazon, :hkod, :rendszam)";
		$stmt = Firebird::prepare($sql);
		$login=$r['login'];
		$fejazon=$r['fejazon'];
		$hkod=$r['hkod'];
		$rendszam=$r['rendszam'];
		$stmt->bindParam(':fejazon', $fejazon, PDO::PARAM_STR);
		$stmt->bindParam(':hkod', $hkod, PDO::PARAM_STR);
		$stmt->bindParam(':rendszam', $rendszam, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
  }
  if ($func==='leltar.reviewLoad'){
		$sql="SELECT * FROM PDA_ORZOTTLELTAR_REVIEW (:login,:fejazon)";
		$stmt = Firebird::prepare($sql);
		$login=$r['login'];
		$fejazon=$r['fejazon'];
		$stmt->bindParam(':fejazon', $fejazon, PDO::PARAM_STR);
		$stmt->bindParam(':login', $login, PDO::PARAM_STR);
		$stmt->execute();
		$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode(Converter::win2utf_array($res));
  }
  if ($func==='leltar.folytUpdate') {
		$azon = $r['azon'];
		$login = $r['login'];

		$sql=" UPDATE BFEJ SET STAT3='R' WHERE BFEJ.AZON = :azon  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->execute();

		//$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
		$res=array();
		$res[0]['STATUS']='OK';
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }
  if ($func==='leltar.lezarUpdate') {
		$azon = $r['azon'];
		$sql=" UPDATE BFEJ SET STAT3='Z' WHERE AZON=:azon  ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->execute();
		$res=array();
		$res[0]['STATUS']='OK';
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }  
  if ($func==='leltar.delRsz') {
		$azon = $r['azon'];
		$rendszam = $r['rendszam'];
		$sql=" DELETE FROM BSOR WHERE BFEJ=:azon and cikk=:rendszam ";
		$stmt = Firebird::prepare($sql);
		$stmt->bindParam(':azon', $azon, PDO::PARAM_STR);
		$stmt->bindParam(':rendszam', $rendszam, PDO::PARAM_STR);
		$stmt->execute();
		$res=array();
		$res[0]['RENDSZAM']=$rendszam;
		Firebird::commit();
		echo json_encode(Converter::win2utf_array($res));
	  
  }    
?>