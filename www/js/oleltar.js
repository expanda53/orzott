/* leltarezes */
markaUpdate = false;
meretUpdate = false;
mintaUpdate = false;
siUpdate = false;
printing = false;

function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}

var OLeltar = function(){
	this.initMibizList();
	this.mibiz="";
	this.fejazon = 0;
	this.currentItem = "";
	this.currentPosition = '';
}
/* feladat valasztas */
OLeltar.prototype.initMibizList = function(){
	fn = 'leltar.mibizList';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':login_id},true, fn);
	/* OLeltar.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az OLeltar.tpl-ben van*/
}
OLeltar.prototype.mibizList = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'OLeltar';
	if (result.length>0) {
		res = result[0];
		leltar.mibiz=res.MIBIZ;
		leltar.fejazon=res.FEJAZON;
		css='';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divContent').html(css + tpl);
				//feladat valasztas inditasa
				leltar.selectTask();
				$('#divContent').show();
			});
			
		})

	//alert(JSON.stringify(res));
	}
	
	

}
OLeltar.prototype.selectTask = function() {
	/* feladat valaszto ajax inditas */
	app.BTEnabled();						

	$('#divheader').html('Õrzött leltár');
	ajaxCall('leltar.taskReg',{'mibiz':this.mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	
	$("#hAZON").val(leltar.fejazon);
	$("#hMIBIZ").val(leltar.mibiz);
	$('#bFolytMost').hide();
	$('#dataHkod').focus();
	$('#dataHkod').bind('change',function (event) {
		leltar.rszInit();
	})	
	$('#dataRendszam').bind('change',function (event) {
		leltar.rszChange();
	})	

}

/* feladat valasztas eddig */


/* rendszam */
OLeltar.prototype.rszInit = function() {
	/* hkod lelove, rendszam bevitelre valtas */
	$('#dataHkod').attr('disabled','disabled');
	$('#dataRendszam').val('');
	$('.drendszam').show();
	$('#dataRendszam').focus();
}

OLeltar.prototype.rszChange = function() {
	/* rendszam lelove, mentes inditasa */
	rendszam = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
	fn = 'leltar.rszSave';
	ajaxCall(fn,{'fejazon':this.fejazon, 'login':login_id, 'rendszam':rendszam, 'hkod':hkod},true, fn);
}

OLeltar.prototype.rszSave = function (result) {
	/* rendszam mentes eredmenye, rsz adatok */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		rendszam = $('#dataRendszam').val();
		$('.dataRSZ').html(rendszam);
		$('#dataRendszam').val('');
		$('.dataMeret').html(res.MARKA+' '+res.MERET+' '+res.MINTA+' '+res.SI);
		$('.dataFegu').html(res.FE+'/'+res.GU);
		$('.dataFeall').html(res.FEALL);
		$('.rszadatok').show();
		if (res.RESULT==0)	{
			$('#labelStatus').html(rendszam+': OK');
			$('#labelStatus').attr('class','labelStatusOK');
		}
		else {
			$('#labelStatus').html(rendszam+': Hiba!');
			$('#labelStatus').attr('class','labelStatusERROR');
			alert('Hiba');
		}
	}
	if ( $('#divmeres').is(":visible") ){
		$('#divmeres').hide();
		$('#divpanel').show();	
	}
}
/* rendszam eddig*/
/* fopanel */



OLeltar.prototype.rszJav = function (result) {
	/* mennyiseg javitas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FEGU);
		}
		else alert('Hiba');
	}
	if ( $('#divmeres').is(":visible") ){
		$('#divmeres').hide();
		$('#divpanel').show();	
	}
}

OLeltar.prototype.rszJavitas = function () {
	/* mennyiseg javitas ajax inditas */
	var r = confirm("A rendszámhoz tartozo elozo nyomtatas torlese,mehet?");
	if (r == true) {
		azon = $('#hAZON').val();
		sorsz = $('#hSORSZ').val();	
		rsz = $('#rendszam').val();
		drb2 = $('.dataDrbKesz').html();
		if (drb2>0) {
		  fn = 'leltar.rszJav';
		  r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
		}
	} else {

	}	

}




OLeltar.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}


/* fopanel eddig */




OLeltar.prototype.rszMent = function(result) {
	/* mentes ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FE+'/'+res.GU);
			
			id=leltar.currentPosition;
			$('.bpozicio').attr('disabled','disabled');
			$( '#'+id).addClass( "bpozicioSelected" );
			if (leltar.meresKell) {
				//meres panel betoltese
				$('#divallapot').show();
				$('#bAllapotMent').show();
				$('#bAllapotClose').hide();
				if (leltar.currentItem=='bGumi' || leltar.currentItem=='bGumiFelni') {
					fn = 'leltar.getMelyseg';
					ajaxCall(fn,{'poz':leltar.currentPosition, 'login':login_id},true, fn);
				}
			}
			
			
		}
		else alert('Hiba');
	}
}




OLeltar.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	$('#divgstat').show();
	
}

OLeltar.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	if (this.meresKell && melyseg=='-' ) alert('Mentés elõtt mérd meg a mélységet!');
	else {
		rsz = $('#rendszam').val();
		mibiz = $('#hMIBIZ').val();
		tip=leltar.currentItem;
		fn='leltar.allapotMent';
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip},true, fn);
	}
}
OLeltar.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
}
/* allapot panel eddig */

/* atnezo panel */
OLeltar.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		//$(".dataCeg").html(res.CEGNEV);
		$(".dataMeret").html(res.MERETMINTA);
		$(".dataFegu").html(res.FEGU);
		$(".dataDrbVart").html(res.DRB);
		$(".dataDrbKesz").html(res.CDRB);
		$(".dataDrbFEGU").html(res.FEGUKESZ);
		$("#hSORSZ").val(res.SORSZ);
		leltar.fedb = res.FEDB;
		leltar.gudb = res.GUDB;
		leltar.rszAdatok = res.RSZADATOK.split("\n");
		leltar.rszAdatokTEMP = leltar.rszAdatok;
		feall='';
		if (checkParam(leltar.rszAdatok[7])=='L' && leltar.fedb>0) feall='Lemez';
		if (checkParam(leltar.rszAdatok[7])=='A' && leltar.fedb>0) feall='Alu';
		$(".dataFeall").html(feall);
	}
	$('.rszadatok').show();
	$('.dcontrol').show();
	

}


OLeltar.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendszám</th>"
					+"<th>Lerakodandó</th>"
					+"<th>Lerakodott</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	leltar.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
		sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sorok += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
		sorok += '<td>'+res.DRB+'</td>'; 
		sorok +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
		sorok += '</tr>';
		if (res.DRB2<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
		}
		
	}
	$('.tableReview').html(fej+sorok);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		leltar.rszChange();
		$('#bFolytMost').trigger('click');

	})

	if (hianydb!=0){
		$('.labelHiany').html('Hiányzó mennyiség:');
		$('.dataHiany').html(hianydb);
	}
	leltar.reviewFilter();

}

OLeltar.prototype.reviewRszFilter = function(result) {
	/* atnezo panel filter ajax eredenye (rsz szures)*/
	sorok = '';
	$('.tableReviewFilter tbody').empty();
	sorok='<tbody>'
	var hianydb = 0;
	sorok += '<tr >';
	sorok += '<td id="rszall">*</td>';
	sorok += '</tr>';

	for (var i = 0;i < result.length;i++){
		res = result[i];
		sorok += '<tr >';
		sorok += '<td id="'+res.RENDSZAM+'">'+res.RENDSZAM+'</td>';
		sorok += '</tr>';
		
	}
	sorok+='</tbody>'
	$('.tableReviewFilter tbody').append(sorok);
	$('.tableReviewFilter tbody td').bind('click',function(){
		curTD = $(this);
		filter = curTD.html();
		azon = $('#hAZON').val();
		fn = 'leltar.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OLeltar.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('bFolytMost').show();
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'leltar.reviewRszFilter';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}

OLeltar.prototype.reviewFilter = function() {
	/* eltérés/összes sor mutatása*/
	val = $('#bElteres').html();
	showAll = (val!='Eltérések');
	if (val=='Eltérések') val='Összes sor';
	else val='Eltérések';
	$('#bElteres').html(val);
	
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = leltar.reviewSet;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (showAll || res.DRB!=res.DRB2) {
			if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
			sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
			sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
			sor += '<td>'+res.DRB+'</td>'; 
			sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
			sor += '</tr>';
		}
		
	}
	$('.tableReview tbody').append(sor);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		leltar.rszChange();
		$('#bFolytMost').trigger('click');

	})
}

OLeltar.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'leltar.folytUpdate';
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OLeltar.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	app.BTDisabled();
	leltar.initMibizList();
}

OLeltar.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	hianydb = $('.dataHiany').html();
	stat='Z';
	mehet=true;
	if (hianydb!='' && hianydb!=0) {
		var mehet = confirm("Vannak hiányzó tételek, ennek ellenére lezárja?");
		stat='X';
	}
	if (mehet) {
		alert('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'leltar.lezarUpdate';
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OLeltar.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	leltar.folytUpdate(result);
}
/* atnezo panel eddig */


/* gumipanel */
function checkParam(str) {
	var res = str;
	if (str!=null) {
		res = str.replace(/\//g,'');
		res = res.replace(/\ /g,'');
		res = res.replace(/\./g,'');
		res = res.replace(/\*/g,'');
		res = res.replace(/(?:\r\n|\r|\n)+/g, '');
		
	}
	return res;
	
}
OLeltar.prototype.rszAdatokSet = function (result){
	//alert(JSON.stringify(result));
}

OLeltar.prototype.GPanelOptions = function (saveData){
  /* tengelyek adatainak masolasa, torlese  */
  $('#divGPOptions').show();
  $('#boptclose').bind('click',function(){
		$('#divGPOptions').hide();
  })
  $('#bcopyAB').bind('click',function(){
		leltar.GPanelFunctions('copy','A','B');
  })
  $('#bcopyAP').bind('click',function(){
		leltar.GPanelFunctions('copy','A','P');
  })
  $('#bcopyBA').bind('click',function(){
		leltar.GPanelFunctions('copy','B','A');
  })
  $('#bcopyBP').bind('click',function(){
		leltar.GPanelFunctions('copy','B','P');
  })
  $('#bdelA').bind('click',function(){
		leltar.GPanelFunctions('del','A','');
  })
  $('#bdelB').bind('click',function(){
		leltar.GPanelFunctions('del','B','');
  })
  $('#bdelP').bind('click',function(){
		leltar.GPanelFunctions('del','P','');
  })
  
  
}
OLeltar.prototype.GPanelFunctions = function(func,src,trg){
	if (func=='copy') {
		fn='getMarka';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMarka'+src).val();
		$('#gpMarka'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMinta';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMinta'+src).val();
		$('#gpMinta'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMeret';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMeret'+src).val();
		$('#gpMeret'+trg+' option[value='+def+']').prop('selected', 'selected');

	
		fn='getSI';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpSI'+src).val();
		$('#gpSI'+trg+' option[value='+def+']').prop('selected', 'selected');
		
	}
	else
	if (func=='del') {
		$('#gpMarka'+src).empty();
		$('#gpMeret'+src).empty();
		$('#gpMinta'+src).empty();
		$('#gpSI'+src).empty();
	}
	$('#divGPOptions').hide();
		
}

OLeltar.prototype.GPanelClose = function (saveData){
	if (saveData) {
			leltar.fedb = $('#gpFelnidb option:selected').val();
			leltar.rszAdatok[7]=$('#gpFelnitip option:selected').val();
			leltar.rszAdatok[9]=$('#gpMarkaA option:selected').text();
			leltar.rszAdatok[10]=$('#gpMeretA option:selected').text();
			leltar.rszAdatok[11]=$('#gpMintaA option:selected').text()
			leltar.rszAdatok[18]=$('#gpSIA option:selected').text();
			
			leltar.rszAdatok[12]=$('#gpMarkaB option:selected').text();
			leltar.rszAdatok[13]=$('#gpMeretB option:selected').text();
			leltar.rszAdatok[14]=$('#gpMintaB option:selected').text();
			leltar.rszAdatok[19]=$('#gpSIB option:selected').text();
			
			leltar.rszAdatok[15]=$('#gpMarkaP option:selected').text();
			leltar.rszAdatok[16]=$('#gpMeretP option:selected').text();
			leltar.rszAdatok[17]=$('#gpMintaP option:selected').text();
			leltar.rszAdatok[20]=$('#gpSIP option:selected').text();
			newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18];
			if (leltar.rszAdatok[12]!='' && leltar.rszAdatok[12]!=leltar.rszAdatok[9]) {
				newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18] + ' + ' + leltar.rszAdatok[12]+' '+leltar.rszAdatok[13]+' '+leltar.rszAdatok[14]+' '+leltar.rszAdatok[19];
			}
			else
			if (leltar.rszAdatok[12]!='' && leltar.rszAdatok[12]==leltar.rszAdatok[9]) {
				if (leltar.rszAdatok[13]!='' && leltar.rszAdatok[13]==leltar.rszAdatok[10]) {
					if (leltar.rszAdatok[14]!='' && leltar.rszAdatok[14]==leltar.rszAdatok[11]) {
						if (leltar.rszAdatok[19]!='' && leltar.rszAdatok[19]==leltar.rszAdatok[18]) {
							newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18]; //egyezik minden
						}
						else newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18]+'+'+leltar.rszAdatok[19]; //csak SI eltérés
						
					}
					else newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18] + ' + ' + leltar.rszAdatok[14]+' '+leltar.rszAdatok[19];//minta,si eltérés
				}
				else newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18] + ' + ' + leltar.rszAdatok[13]+' '+leltar.rszAdatok[14]+' '+leltar.rszAdatok[19]; //meret,minta,si eltérés
			}
			else newContent=leltar.rszAdatok[9]+' '+leltar.rszAdatok[10]+' '+leltar.rszAdatok[11]+' '+leltar.rszAdatok[18] + ' + ' + leltar.rszAdatok[12]+' '+leltar.rszAdatok[13]+' '+leltar.rszAdatok[14]+' '+leltar.rszAdatok[19]; //marka,meret,minta,si eltérés
			newContent = newContent.trim();
			if (newContent.indexOf('+')==0) {
				newContent = newContent.replace('+','').trim();
			}
			fn='leltar.rszAdatokSet';
			rsz = $('#rendszam').val();
			azon = $('#hAZON').val();				
			ajaxCall(fn,{'rsz':rsz,'azon':azon,'fedb':leltar.fedb,'data':JSON.stringify(leltar.rszAdatok),'login':login_id},true, fn);
			$('.dataMeret').html(newContent);
			$(".dataFegu").html(leltar.fedb+'/'+leltar.gudb);
			feall='';
			if (checkParam(leltar.rszAdatok[7])=='L' && leltar.fedb>0) feall='Lemez';
			if (checkParam(leltar.rszAdatok[7])=='A' && leltar.fedb>0) feall='Alu';
			$(".dataFeall").html(feall);
			
	}
	
	$('#gpMarkaA, #gpMarkaB, #gpMarkaP, #gpMeretA, #gpMeretB, #gpMeretP, #gpMintaA, #gpMintaB, #gpMintaP, #gpSIA, #gpSIB, #gpSIP').html('');	
	$('#divgpanel').hide();
	$('.drendszam, .rszadatok, .dcontrol').show();
	
}
OLeltar.prototype.showGPanel =function(){
	$('.drendszam, .rszadatok, .dcontrol').hide();
		/* marka */
		fn='getMarka';
		obj='gpMarka';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='A';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[9],'meret':leltar.rszAdatokTEMP[10],'minta':leltar.rszAdatokTEMP[11],'si':leltar.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[12],'meret':leltar.rszAdatokTEMP[13],'minta':leltar.rszAdatokTEMP[14],'si':leltar.rszAdatokTEMP[19]},true, fn+tengely);
		}
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[15],'meret':leltar.rszAdatokTEMP[16],'minta':leltar.rszAdatokTEMP[17],'si':leltar.rszAdatokTEMP[20]},true, fn+tengely);
		}

		/* meret */
		fn='getMeret';
		obj='gpMeret';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[9],'meret':leltar.rszAdatokTEMP[10],'minta':leltar.rszAdatokTEMP[11],'si':leltar.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[12],'meret':leltar.rszAdatokTEMP[13],'minta':leltar.rszAdatokTEMP[14],'si':leltar.rszAdatokTEMP[19]},true, fn+tengely);
		}

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[15],'meret':leltar.rszAdatokTEMP[16],'minta':leltar.rszAdatokTEMP[17],'si':leltar.rszAdatokTEMP[20]},true, fn+tengely);
		}

		/* minta */
		fn='getMinta';
		obj='gpMinta';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[9],'meret':leltar.rszAdatokTEMP[10],'minta':leltar.rszAdatokTEMP[11],'si':leltar.rszAdatokTEMP[18]},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[12],'meret':leltar.rszAdatokTEMP[13],'minta':leltar.rszAdatokTEMP[14],'si':leltar.rszAdatokTEMP[19]},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[15],'meret':leltar.rszAdatokTEMP[16],'minta':leltar.rszAdatokTEMP[17],'si':leltar.rszAdatokTEMP[20]},true, fn+tengely);
		}

		/* si */
		fn='getSI';
		obj='gpSI';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[9],'meret':leltar.rszAdatokTEMP[10],'minta':leltar.rszAdatokTEMP[11],'si':leltar.rszAdatokTEMP[18]},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[12],'meret':leltar.rszAdatokTEMP[13],'minta':leltar.rszAdatokTEMP[14],'si':leltar.rszAdatokTEMP[19]},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		if (checkParam(leltar.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':leltar.rszAdatokTEMP[15],'meret':leltar.rszAdatokTEMP[16],'minta':leltar.rszAdatokTEMP[17],'si':leltar.rszAdatokTEMP[20]},true, fn+tengely);
		}
		
		//felni:
		felnidef = checkParam(leltar.rszAdatokTEMP[7]);
		if (felnidef=='') felnidef='-';
		$('#gpFelnitip option[value='+felnidef+']').prop('selected', 'selected');
		$('#gpFelnidb option[value='+leltar.fedb+']').prop('selected', 'selected');
		$('#divgpanel').show();
	
}

function getMarka(result,tengely){
	if (markaUpdate==false) {
	markaUpdate=true;
	def = $("#gpMarka"+tengely+' option:selected').val();
	if (def=='mind') def='';
	if (def=='' || def==null) {
		if (tengely=='A') ix=9;
		if (tengely=='B') ix=12;
		if (tengely=='P') ix=15;
		def = leltar.rszAdatokTEMP[ix].trim();
	}
	$("#gpMarka"+tengely).html('');
	$("#gpMarka"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gpMarka"+tengely).append('<option value="'+res.MARKA+'">'+res.MARKA+'</option>');
	}
	if (def!='') $('#gpMarka'+tengely+' option[value='+def+']').prop('selected', 'selected');
	
	}
	markaUpdate=false;
}
function getMarkaA(result){	getMarka(result,'A');}
function getMarkaB(result){	getMarka(result,'B');}
function getMarkaP(result){	getMarka(result,'P');}

function getMeret(result,tengely){
	if (meretUpdate==false) {
	meretUpdate=true;
	def = $("#gpMeret"+tengely+' option:selected').val();
	if (def=='mind') def='';
	optid = '';
	if (def=='' || def==null) {
		if (tengely=='A') ix=10;
		if (tengely=='B') ix=13;
		if (tengely=='P') ix=16;
		def = leltar.rszAdatokTEMP[ix].trim();
	}
	
	$("#gpMeret"+tengely).html('');
	$("#gpMeret"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		optid = checkParam(res.MERET);
		$("#gpMeret"+tengely).append('<option value="'+optid+'">'+res.MERET+'</option>');
	}
	if (def!=null)optid = checkParam(def);
	if (optid!='') $('#gpMeret'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	meretUpdate=false;
}
function getMeretA(result) {getMeret(result,'A')}
function getMeretB(result) {getMeret(result,'B')}
function getMeretP(result) {getMeret(result,'P')}

function getMinta(result,tengely){
	if (mintaUpdate==false) {
	mintaUpdate=true;
	def = $("#gpMinta"+tengely+' option:selected').val();
	if (def=='mind') def='';
	optid='';
	if (def=='' || def==null) {
		if (tengely=='A') ix = 11;
		if (tengely=='B') ix = 14;	
		if (tengely=='P') ix = 17;	
		def = leltar.rszAdatokTEMP[ix].trim();
	}
	
	$("#gpMinta"+tengely).html('');
	$("#gpMinta"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		optid = checkParam(res.MINTA);
		$("#gpMinta"+tengely).append('<option value="'+optid+'">'+res.MINTA+'</option>');
	}
	if (def!=null)optid = checkParam(def);
	if (optid!='') $('#gpMinta'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	mintaUpdate=false;
}
function getMintaA(result) {getMinta(result,'A')}
function getMintaB(result) {getMinta(result,'B')}
function getMintaP(result) {getMinta(result,'P')}

function getSI(result,tengely){
	if (siUpdate==false) {
	siUpdate=true;
	def = $("#gpSI"+tengely+' option:selected').val();
	if (def=='mind') def='';
	if (def=='' || def==null) {
		if (tengely=='A') ix = 18;
		if (tengely=='B') ix = 19;	
		if (tengely=='P') ix = 20;	

		def = leltar.rszAdatokTEMP[ix].trim();
	}

	$("#gpSI"+tengely).html('');
	$("#gpSI"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gpSI"+tengely).append('<option value="'+res.SI+'">'+res.SI+'</option>');
	}
	if (def!='') $('#gpSI'+tengely+' option[value='+def+']').prop('selected', 'selected');
	}
	siUpdate=false;
}
function getSIA(result) {getSI(result,'A')}
function getSIB(result) {getSI(result,'B')}
function getSIP(result) {getSI(result,'P')}


/* gumipanel eddig */
/* leltarezes eddig */


//pingPrinter();