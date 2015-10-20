/* elrakodas */
/*
	1. nincs feladat v�laszt�s, r�gt�n a rendsz�mra l�het.
	2. rendsz�mra l�v�s ut�n megn�zni, hogy ki van-e szedve teljesen.
	3a, ha ki van szedve, meg kell n�zni hogy a m�lys�gm�r�s el lett-e rajta v�gezve
	3b, ha nincs kiszedve teljesen, akkor hiba�zenet. Azt�n 1.
	4a, ha nem, akkor m�lys�g m�r�s. Ut�na 4b
	4b, ha volt m�lys�gm�r�s, akkor helyk�dra l�het


*/

markaUpdate = false;
meretUpdate = false;
mintaUpdate = false;
siUpdate = false;
printing = false;

function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}
function pingPrinter(){
	//nem kell, a nyomtat�t be lehet konfigolni, hogy ne kapcsoljon ki.
	//! U1 setvar "power.inactivity_timeout" "0"
	/*window.setTimeout(function(){
		if (!printing) {
			alert('ping start');
			var btPrint = function() {
						var tpl = '\r\n';
						var writeOk = function(){
						}
						var writeError = function(){
							console.log('btprint ping write error');
						}
						bluetoothSerial.write(tpl,writeOk,writeError);
			}
			var printError = function(){
				//console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
			}
			if(typeof bluetoothSerial != 'undefined') {
				try {
					printing=true;
					bluetoothSerial.isConnected(btPrint, printError);
				}
				finally {
					printing=false;
				}
			}
			alert('ping finish');
			
		}
		pingPrinter();
	},30*1000);
	*/
}
var OElrak = function(){
	this.meresKell=false;
	this.panelInit();
	this.currentItem = "";
	this.currentPosition = '';
}
OElrak.prototype.panelInit = function () {
	/* kezd� panel megjelen�t�se*/
	panelName='oelrak';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);		
			$('#divContent').show();
			$('#dataRendszam').bind('change',function (event) {
				elrak.rszChange();
			})	
			
		})
	})

}

/* fopanel */



OElrak.prototype.rszJav = function (result) {
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

OElrak.prototype.rszJavitas = function () {
	/* mennyiseg javitas ajax inditas */
	var r = confirm("A rendsz�mhoz tartozo elozo nyomtatas torlese,mehet?");
	if (r == true) {
		azon = $('#hAZON').val();
		sorsz = $('#hSORSZ').val();	
		rsz = $('#rendszam').val();
		drb2 = $('.dataDrbKesz').html();
		if (drb2>0) {
		  fn = 'beerk.rszJav';
		  r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
		}
	} else {

	}	

}




OElrak.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}


/* fopanel eddig */



/* allapot panel */
OElrak.prototype.showAllapotPanel = function(obj){
	this.currentItem = obj.attr('id'); 
	$('#bAllapotClose').show();
	if (this.meresKell || beerk.currentItem=="bGumi") {
		/* ha meressel kerte, vagy meres nelkul de gumit valasztott */
		panelName='meres';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				rsz = $('#rendszam').val();
				mibiz = $('#hMIBIZ').val();
				$('#divmeres').html(css + data);
				$('#divpanel').hide();
				$('#divmeres').show();
				var muvelet = "";
				if (beerk.currentItem=="bGumi") muvelet = "be�rkez�s: gumi";
				if (beerk.currentItem=="bFelni") muvelet = "be�rkez�s: felni";
				if (beerk.currentItem=="bGumiFelni") muvelet = "be�rkez�s: ker�k";
				beerk.currentPosition = '';
				$('#muvelet').html(muvelet);
				fn='beerk.getPositions';
				ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'login':login_id},true, fn);
				
			});
			
		})
	}
	else {
		/* ha meres nelkul kerte (kiveve gumi eseten, ott ilyenkor is van allapot panel) */
		/* felni eseten automatikus nyomtatas erkezesi sorrendben, nincs jelentosege, hogy melyik felni melyik pozicio*/
		/* kerek eseten csak mennyiseg noveles van, mivel nem merunk es nyomtatni sem kell, mert mossak oket */
		this.selectPosition(null);
	}
}
			
OElrak.prototype.getPositions=function(result){
	/* mar kivalasztott poziciok: JE:A:13  (pozicio:tipus:melyseg)*/
	if (result[0].RESULT!='') {
		res = result[0].RESULT.split(',');
		for (var i = 0;i < res.length;i++){
			p = res[i].split(':');
			id='b' + p[0];
			$('#'+id).attr('disabled','disabled');
		}
	}
}


OElrak.prototype.selectPosition = function (obj) {
	/* nyomtatas inditas + mentes ajax*/
	tip = this.currentItem;
	var poz = "";
	if (obj == null) {
		/* felni vagy kerek meres nelkul*/
		poz='auto';
	}
	else poz=obj.attr('id');
	this.currentPosition = poz;
	
	var btPrint = function() {
		//tip = beerk.currentItem;
		rsz = $('#rendszam').val();
		$.get( "views/prn_rendszam_lerak.tpl", function( data ) {
				//data = $('#tplprint').val();
					if (beerk.currentPosition=='bJE') ppoz = 1;
					if (beerk.currentPosition=='bBE') ppoz = 2;
					if (beerk.currentPosition=='bJH') ppoz = 3;
					if (beerk.currentPosition=='bBH') ppoz = 4;
					if (beerk.currentPosition=='bPOT') ppoz = 5;
					if (beerk.currentPosition=='bJHI') ppoz = 6;
					if (beerk.currentPosition=='bBHI') ppoz = 7;
					if (beerk.currentItem=="bGumi") ptip = "A";
					if (beerk.currentItem=="bFelni") ptip = "F";
					if (beerk.currentItem=="bGumiFelni") ptip = "K";
				
				tpl = data.replace(/\[RENDSZPOZ\]/g,rsz+"_"+ppoz+ptip); 
				tpl += '\r\n';
				var writeOk = function(){
					fn = 'beerk.rszMent';
					r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':beerk.currentItem, 'poz':beerk.currentPosition, 'login':login_id},true, fn);
				}
				var writeError = function(){
					console.log('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
				}
				if (!teszt && beerk.currentItem!='bGumiFelni') bluetoothSerial.write(tpl,writeOk,writeError);
				if (teszt || beerk.currentItem=='bGumiFelni') writeOk();
				
		})
		
		
	}
	var printError = function(){
		console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
		alert('Nyomtat�si hiba');
	}
	azon = $('#hAZON').val();
	sorsz = $('#hSORSZ').val();	
	drb = $('.dataDrbVart').html();
	drb2 = $('.dataDrbKesz').html();
	if (beerk.currentPosition=='auto') {
					if (drb2==0) beerk.currentPosition='bJE';
					if (drb2==1) beerk.currentPosition='bBE';
					if (drb2==2) beerk.currentPosition='bJH';
					if (drb2==3) beerk.currentPosition='bBH';
					if (drb2==4) beerk.currentPosition='bPOT';
					if (drb2==5) beerk.currentPosition='bJHI';
					if (drb2==6) beerk.currentPosition='bBHI';
					poz=beerk.currentPosition;

	}
	
	if (drb2>=drb) {
		alert('A be�rkezett mennyis�g '+drb+' db!');
	}
	if (tip!='bGumiFelni') {
		/* print */
		if(typeof bluetoothSerial != 'undefined') {
			try {
				printing=true;
				bluetoothSerial.isConnected(btPrint, printError);
			}
			finally {
				printing=false;
			}
		}
		else {
			alert('printer not found');
			if (teszt) btPrint();
		}
	}
	else {
		/* kerek valasztasnal nincs nyomtatas (mivel mossak oket, es kesobb nyomtatjak)*/
		fn = 'beerk.rszMent';
		ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':tip,'poz':poz,'login':login_id},true, fn);
	}


}

OElrak.prototype.rszMent = function(result) {
	/* mentes ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FE+'/'+res.GU);
			
			id=beerk.currentPosition;
			$('.bpozicio').attr('disabled','disabled');
			$( '#'+id).addClass( "bpozicioSelected" );
			if (beerk.meresKell) {
				//meres panel betoltese
				$('#divallapot').show();
				$('#bAllapotMent').show();
				$('#bAllapotClose').hide();
				if (beerk.currentItem=='bGumi' || beerk.currentItem=='bGumiFelni') {
					fn = 'beerk.getMelyseg';
					ajaxCall(fn,{'poz':beerk.currentPosition, 'login':login_id},true, fn);
				}
			}
			
			
		}
		else alert('Hiba');
	}
}




OElrak.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-">V�lasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	$('#divgstat').show();
	
}

OElrak.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	if (this.meresKell && melyseg=='-' ) alert('Ment�s el�tt m�rd meg a m�lys�get!');
	else {
		rsz = $('#rendszam').val();
		mibiz = $('#hMIBIZ').val();
		tip=beerk.currentItem;
		fn='beerk.allapotMent';
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip},true, fn);
	}
}
OElrak.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
}
/* allapot panel eddig */

/* atnezo panel */
OElrak.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye */
	/*for (var i = 0;i < result.length;i++){
		res = result[i];
		//$(".dataCeg").html(res.CEGNEV);
		$(".dataMeret").html(res.MERETMINTA);
		$(".dataFegu").html(res.FEGU);
		$(".dataDrbVart").html(res.DRB);
		$(".dataDrbKesz").html(res.CDRB);
		$(".dataDrbFEGU").html(res.FEGUKESZ);
		$("#hSORSZ").val(res.SORSZ);
		beerk.fedb = res.FEDB;
		beerk.gudb = res.GUDB;
		beerk.rszAdatok = res.RSZADATOK.split("\n");
		beerk.rszAdatokTEMP = beerk.rszAdatok;
		feall='';
		if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
		if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
		$(".dataFeall").html(feall);
	}
	$('.rszadatok').show();
	$('.dcontrol').show();
	*/
	alert('teszt');

}

OElrak.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	fn = 'elrak.rszAdatokGet';
	ajaxCall(fn,{'rsz':rsz},true, fn);
	
}

OElrak.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendsz�m</th>"
					+"<th>Lerakodand�</th>"
					+"<th>Lerakodott</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	beerk.reviewSet = result;
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
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})

	if (hianydb!=0){
		$('.labelHiany').html('Hi�nyz� mennyis�g:');
		$('.dataHiany').html(hianydb);
	}
	beerk.reviewFilter();

}

OElrak.prototype.reviewRszFilter = function(result) {
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
		fn = 'beerk.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OElrak.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('bFolytMost').show();
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'beerk.reviewRszFilter';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}

OElrak.prototype.reviewFilter = function() {
	/* elt�r�s/�sszes sor mutat�sa*/
	val = $('#bElteres').html();
	showAll = (val!='Elt�r�sek');
	if (val=='Elt�r�sek') val='�sszes sor';
	else val='Elt�r�sek';
	$('#bElteres').html(val);
	
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = beerk.reviewSet;
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
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})
}

OElrak.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'beerk.folytUpdate';
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OElrak.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	app.BTDisabled();
	beerk.initMibizList();
}

OElrak.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	hianydb = $('.dataHiany').html();
	stat='Z';
	mehet=true;
	if (hianydb!='' && hianydb!=0) {
		var mehet = confirm("Vannak hi�nyz� t�telek, ennek ellen�re lez�rja?");
		stat='X';
	}
	if (mehet) {
		alert('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'beerk.lezarUpdate';
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OElrak.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	beerk.folytUpdate(result);
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
OElrak.prototype.rszAdatokSet = function (result){
	//alert(JSON.stringify(result));
}

OElrak.prototype.GPanelOptions = function (saveData){
  /* tengelyek adatainak masolasa, torlese  */
  $('#divGPOptions').show();
  $('#boptclose').bind('click',function(){
		$('#divGPOptions').hide();
  })
  $('#bcopyAB').bind('click',function(){
		beerk.GPanelFunctions('copy','A','B');
  })
  $('#bcopyAP').bind('click',function(){
		beerk.GPanelFunctions('copy','A','P');
  })
  $('#bcopyBA').bind('click',function(){
		beerk.GPanelFunctions('copy','B','A');
  })
  $('#bcopyBP').bind('click',function(){
		beerk.GPanelFunctions('copy','B','P');
  })
  $('#bdelA').bind('click',function(){
		beerk.GPanelFunctions('del','A','');
  })
  $('#bdelB').bind('click',function(){
		beerk.GPanelFunctions('del','B','');
  })
  $('#bdelP').bind('click',function(){
		beerk.GPanelFunctions('del','P','');
  })
  
  
}
OElrak.prototype.GPanelFunctions = function(func,src,trg){
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

OElrak.prototype.GPanelClose = function (saveData){
	if (saveData) {
			beerk.fedb = $('#gpFelnidb option:selected').val();
			beerk.rszAdatok[7]=$('#gpFelnitip option:selected').val();
			beerk.rszAdatok[9]=$('#gpMarkaA option:selected').text();
			beerk.rszAdatok[10]=$('#gpMeretA option:selected').text();
			beerk.rszAdatok[11]=$('#gpMintaA option:selected').text()
			beerk.rszAdatok[18]=$('#gpSIA option:selected').text();
			
			beerk.rszAdatok[12]=$('#gpMarkaB option:selected').text();
			beerk.rszAdatok[13]=$('#gpMeretB option:selected').text();
			beerk.rszAdatok[14]=$('#gpMintaB option:selected').text();
			beerk.rszAdatok[19]=$('#gpSIB option:selected').text();
			
			beerk.rszAdatok[15]=$('#gpMarkaP option:selected').text();
			beerk.rszAdatok[16]=$('#gpMeretP option:selected').text();
			beerk.rszAdatok[17]=$('#gpMintaP option:selected').text();
			beerk.rszAdatok[20]=$('#gpSIP option:selected').text();
			newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18];
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]!=beerk.rszAdatok[9]) {
				newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];
			}
			else
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]==beerk.rszAdatok[9]) {
				if (beerk.rszAdatok[13]!='' && beerk.rszAdatok[13]==beerk.rszAdatok[10]) {
					if (beerk.rszAdatok[14]!='' && beerk.rszAdatok[14]==beerk.rszAdatok[11]) {
						if (beerk.rszAdatok[19]!='' && beerk.rszAdatok[19]==beerk.rszAdatok[18]) {
							newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]; //egyezik minden
						}
						else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]+'+'+beerk.rszAdatok[19]; //csak SI elt�r�s
						
					}
					else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];//minta,si elt�r�s
				}
				else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //meret,minta,si elt�r�s
			}
			else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //marka,meret,minta,si elt�r�s
			newContent = newContent.trim();
			if (newContent.indexOf('+')==0) {
				newContent = newContent.replace('+','').trim();
			}
			fn='beerk.rszAdatokSet';
			rsz = $('#rendszam').val();
			azon = $('#hAZON').val();				
			ajaxCall(fn,{'rsz':rsz,'azon':azon,'fedb':beerk.fedb,'data':JSON.stringify(beerk.rszAdatok),'login':login_id},true, fn);
			$('.dataMeret').html(newContent);
			$(".dataFegu").html(beerk.fedb+'/'+beerk.gudb);
			feall='';
			if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
			if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
			$(".dataFeall").html(feall);
			
	}
	
	$('#gpMarkaA, #gpMarkaB, #gpMarkaP, #gpMeretA, #gpMeretB, #gpMeretP, #gpMintaA, #gpMintaB, #gpMintaP, #gpSIA, #gpSIB, #gpSIP').html('');	
	$('#divgpanel').hide();
	$('.drendszam, .rszadatok, .dcontrol').show();
	
}
OElrak.prototype.showGPanel =function(){
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
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		}
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);
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
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		}

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);
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
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);
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
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);
		}
		
		//felni:
		felnidef = checkParam(beerk.rszAdatokTEMP[7]);
		if (felnidef=='') felnidef='-';
		$('#gpFelnitip option[value='+felnidef+']').prop('selected', 'selected');
		$('#gpFelnidb option[value='+beerk.fedb+']').prop('selected', 'selected');
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
		def = beerk.rszAdatokTEMP[ix].trim();
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
		def = beerk.rszAdatokTEMP[ix].trim();
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
		def = beerk.rszAdatokTEMP[ix].trim();
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

		def = beerk.rszAdatokTEMP[ix].trim();
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
/* beerkezes eddig */


//pingPrinter();