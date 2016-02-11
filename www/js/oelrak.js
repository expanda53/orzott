/* elrakodas */
/*
	1. nincs feladat választás, rögtön a rendszámra lõhet.
	2. rendszámra lövés után megnézni, hogy ki van-e szedve teljesen.
	3a, ha nincs kiszedve teljesen, akkor hibaüzenet. Aztán 1.
	3b ha ki van szedve teljesem, meg kell nézni hogy a mélységmérés el lett-e rajta végezve
	4a, ha nem, akkor mélység mérés. Utána 4b
	4b, ha volt mélységmérés, akkor helykódra lõhet
5

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

}
var OElrak = function(){
	this.meresKell=false;
	this.panelInit();
	this.currentItem = "";
	this.currentPosition = '';
}
OElrak.prototype.showMessage =function (msg, t, clearObj ){
	$('#dmsg').html(msg);
	$('#dmsg').show();

	window.setTimeout(function(){
		$('#dmsg').hide();
		if (clearObj!='') {
			$('#'+clearObj).val('');
		}
	},t*1000);
	
	
}
OElrak.prototype.panelInit = function () {
	/* kezdõ panel megjelenítése*/
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
			$('#dataRendszam').bind('focus',function (event) {
				$(this).val('');
				elrak.hideHkod();
				$('#dataHkod').val('');
			})	
	
			
			$('#dataHkod').bind('change',function (event) {
				elrak.hkodChange();
			})	
			$('#bHkodTorol').bind('click',function () {			
				elrak.hkodDelInit();
			})
			$('#dataRendszam').focus();
		})
	})

}

/* fopanel */

OElrak.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye, rszChange indítja */
	clearObj='dataRendszam';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
				$('#dataHkod').val('');
				elrak.showHkod();
				
		}
		else {
			errormsg='';
			var meresKell=false;
			switch (res.RESULTTEXT) {
				case 'TYPE': 
					errormsg='Nem megfelelõ típus a pozíción!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'DEEP': 
					errormsg='Mélységmérés nem lett elvégezve!';
					elrak.showMessage(errormsg,2);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lelõtt pozíción nem található abroncs a rendszámhoz!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a várt és a lerakodott mennyiség! '+res.ERRORTEXT;
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi már el lett pakolva! helykód:'+res.ERRORTEXT;
					elrak.showMessage(errormsg,2);
					$('#dataHkod').val(res.ERRORTEXT);
					elrak.showHkod();
					break;

				default:
					errormsg = res.RESULTTEXT;
					
			}
			$('#hAZON').val(res.FEJAZON);
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
			elrak.currentItem=res.RSZTIP;
			elrak.currentPosition='b'+res.RSZPOZ;
			if (meresKell) {
				/* ha merni kell */
				panelName='elrak_meres';
				
					$.get( "views/"+panelName+".tpl", function( data ) { 
						rsz = $('#rendszam').val();
						mibiz = $('#hMIBIZ').val();
						$('#divmeres').html(data);
						//$('#divpanel').hide();
						$('#divmeres').show();
						
						fn = 'elrak.getMelyseg';
						ajaxCall(fn,{'poz':elrak.currentPosition, 'login':login_id},true, fn);
					});
			}
		}
		//$(".dataCeg").html(res.CEGNEV);
		/*$(".dataMeret").html(res.MERETMINTA);
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
		*/
	}
	//$('.rszadatok').show();
	//$('.dcontrol').show();
	
	

}

OElrak.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	fn = 'elrak.rszAdatokGet';
	ajaxCall(fn,{'rsz':rsz},true, fn);
	
}

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
	var r = confirm("A rendszámhoz tartozo elozo nyomtatas torlese,mehet?");
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

OElrak.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	$('#divgstat').show();
	
}

OElrak.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	
	rsz = $('#rendszam').val();
	mibiz = $('#hMIBIZ').val();
	tip=elrak.currentItem;
	fn='elrak.allapotMent';
	ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip},true, fn);

}
OElrak.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
	elrak.showHkod();
}
/* allapot panel eddig */

/* hkod innen */
OElrak.prototype.showHkod=function(){
	$("#labelStatus").hide();
	$('.dhkod').show();
	$('#dataHkod').focus();
}
OElrak.prototype.hideHkod=function(){
	$("#labelStatus").hide();
	$('.dhkod').hide();
}
OElrak.prototype.hkodChange=function(){
	this.hkodSaveInit();
}
OElrak.prototype.hkodDelInit=function(){
	/* hkod torles start */
	$('#dataHkod').val("");
	$('#dataHkod').focus();
	
	azon = $('#hAZON').val();
	rendszam = $('#rendszam').val();
	fn = 'elrak.hkodDel';
	ajaxCall(fn,{'rsz':rendszam,'azon':azon,'login':login_id},true, fn);
}
OElrak.prototype.hkodDel=function(result){
	/*hkod torles eredmenye */
	for (var i = 0;i < result.length;i++){	
		res = result[i];
		if (res.RESULT=='OK') {
			$("#labelStatus").attr("class", "statusOk");
			$("#labelStatus").html("Ok");
			$("#labelStatus").show();
		}
		else {
			errormsg='';
			$("#labelStatus").attr("class", "statusError");
			$("#labelStatus").html("Hiba!");
			$("#labelStatus").show();
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					break;
				case 'HKOD_EXISTS': 
					errormsg='Más helykódon is van ez a rendszám!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			/*
			$('#hAZON').val(res.FEJAZON);
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
			elrak.currentItem=res.RSZTIP;
			elrak.currentPosition='b'+res.RSZPOZ;
			*/
			showMessage(errormsg,2);
			
		}
	
	}
}
OElrak.prototype.hkodSaveInit=function(){
	/* helykod mentes */
	rsz = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
	fn = 'elrak.hkodSaveCheck';
	ajaxCall(fn,{'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
}

OElrak.prototype.hkodSaveCheck = function (result){
	/* hkod ellenõrzés, majd mentés (ha a visszaadott result=ok) */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$('#hAZON').val(res.FEJAZON);
		$('#hSORSZ').val(res.SORSZ);	
		$('#rendszam').val(res.RENDSZAM);
		$('#hMIBIZ').val(res.MIBIZ);	
		
		if (res.RESULT=='OK') {
			rsz = $('#dataRendszam').val();
			hkod = $('#dataHkod').val();
			azon = res.FEJAZON;
			sorsz = res.SORSZ;	

			fn = 'elrak.hkodSave';
			ajaxCall(fn,{'azon':azon, 'sorsz':sorsz,'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
		}
		else {
			$("#labelStatus").attr("class", "statusError");
			$("#labelStatus").html("Hiba!");
			$("#labelStatus").show();
			clearObj='dataHkod';
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'DIFFERENT_HKOD': 
					errormsg='A korábban elrakodott termékek más helykódon vannak! '+res.ERRORTEXT;
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi már el lett pakolva erre a helykódra!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					elrak.showMessage(errormsg,2,clearObj);
					break;
				case 'HKOD_EXISTS': 
					errormsg='Más helykódon is van ez a rendszám!';
					elrak.showMessage(errormsg,2,clearObj);
					break;					
				default:
					errormsg = res.RESULTTEXT;
					elrak.showMessage(errormsg,2,clearObj);
					
			}
		}
	}
		
	
}

OElrak.prototype.hkodSave = function (result){
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
			$("#labelStatus").attr("class", "statusOk");
			$("#labelStatus").html("Ok");
			$("#labelStatus").show();

			window.setTimeout(function(){
				$('#dataRendszam').focus();

			},2*1000);
			
		}
		else {
			errormsg='';
			$("#labelStatus").attr("class", "statusError");
			$("#labelStatus").html("Hiba!");
			$("#labelStatus").show();
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					break;
				case 'HKOD_EXISTS': 
					errormsg='Más helykódon is van ez a rendszám!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			/*
			$('#hAZON').val(res.FEJAZON);
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
			elrak.currentItem=res.RSZTIP;
			elrak.currentPosition='b'+res.RSZPOZ;
			*/
			elrak.showMessage(errormsg,2);
			
		}
	}
		


	//alert(JSON.stringify(result));
}
/* hkod eddig */

/* atnezo panel */


OElrak.prototype.reviewRszGet = function(result) {
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
		$('.labelHiany').html('Hiányzó mennyiség:');
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
	/* eltérés/összes sor mutatása*/
	val = $('#bElteres').html();
	showAll = (val!='Eltérések');
	if (val=='Eltérések') val='Összes sor';
	else val='Eltérések';
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
		var mehet = confirm("Vannak hiányzó tételek, ennek ellenére lezárja?");
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
						else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]+'+'+beerk.rszAdatok[19]; //csak SI eltérés
						
					}
					else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];//minta,si eltérés
				}
				else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //meret,minta,si eltérés
			}
			else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //marka,meret,minta,si eltérés
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