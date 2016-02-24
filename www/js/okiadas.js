/* kiadas */
/*
	1. aktualis feladat fejazonjanak beolvasa (pda_mibizlist_orzottki)
	2. rendsz�mra l�v�s ut�n megn�zni, hogy ki van-e szedve teljesen.
	3a, ha nincs kiszedve teljesen, akkor hiba�zenet. Azt�n 1.
	3b ha ki van szedve teljesem, meg kell n�zni hogy a m�lys�gm�r�s el lett-e rajta v�gezve
	4a, ha nem, akkor m�lys�g m�r�s. Ut�na 4b
	4b, ha volt m�lys�gm�r�s, akkor helyk�dra l�het
5

*/

printing = false;

function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}
function pingPrinter(){

}
var OKiadas = function(){
	this.currentHkod = '';
	this.currentRsz = '';
	this.lastRsz = '';
	this.currentRow = 0;
	this.fejazon = -1;

	this.panelInit();
}
OKiadas.prototype.panelInit = function () {
	/* kezd� panel megjelen�t�se*/
	panelName='okiadas';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);		
			$('#divContent').show();
			$('#dataRendszam').bind('change',function (event) {
				kiadas.rszChange();
			})	
			$('#dataRendszam').bind('focus',function (event) {
				$(this).val("");
			})	
			$('#dataHkod').bind('focus',function (event) {
				$(this).val("");
				kiadas.hideRsz();
			})	
	
			
			$('#dataHkod').bind('change',function (event) {
				kiadas.hkodChange();
			})	
			$('#bMenu').bind('click',function () {
				showMenu();
			})	
			$('#bEllenorzes').bind('click',function () {
				kiadas.showReview();
			})	
			$('#bNincs').bind('click',function () {
				kiadas.rszNotFound();
			})
			$('#bFolytMost').bind('click',function (event) {
				event.stopPropagation();
				event.preventDefault();
				if(event.handled !== true) {
					clickHelp();
					$('#divreview').hide();
					$('#divpanel').show();
					event.handled = true;
					if ($('#dataRendszam').is(":visible")) $('#dataRendszam').focus();
					else $('#dataHkod').focus();
				} else {
					return false;
				}
			})
			$('#bLezar').bind('click',function () {
				kiadas.lezarInit();
			})
			
			$('#dataHkod').focus();
		})
		fn = 'kiadas.mibizList';
		ajaxCall(fn,{'login':login_id,'biztip':'MO05'},true, fn);

	})
	
	

}

/* fopanel */
OKiadas.prototype.mibizList = function (result){
	/* bfej.azon kiolvasasa, eltarolasa */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		kiadas.fejazon = res.FEJAZON;
		
		$('#dataSofor').html(res.FUVAR);
		$('#dataJarat').html(res.SORREND);
		$('#dataRaktar').html(res.RAKTAR);
		
		/* kovetkezo kiszedendo helykod betoltese */
		fn = 'kiadas.nextHkodGet';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
	}

}
OKiadas.prototype.nextHkodGet = function (result){
	/* elso kiszedendo helykod betoltese */
	$('#dataHkod').val("");
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$('#labelHkodVart').html(res.HKOD);
		kiadas.currentHkod= res.HKOD;
		
	}
}



/* fopanel eddig */



/* hkod innen */
OKiadas.prototype.showHkod=function(){
	$('.dhkod').show();
	$('#dataHkod').val("");
	$('#dataHkod').focus();
}
OKiadas.prototype.hideHkod=function(){
	$('#dataHkod').val("");
	$('.dhkod').hide();
}
OKiadas.prototype.hkodChange=function(){
	if ($('#dataHkod').val() == this.currentHkod) {
		$('.drendszam').show();
		$('#dataRendszam').empty();
		/* kovetkezo kiszedendo rendszam betoltese */
		fn = 'kiadas.nextRszGet';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod,'rsz':kiadas.currentRsz},true, fn);
		
		
	}
	else showMessage('Nem megfelel� helyk�d!','dataHkod');
}


OKiadas.prototype.hkodSaveCheck = function (result){
	/* hkod ellen�rz�s, majd ment�s (ha a visszaadott result=ok) */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		
		$('#hSORSZ').val(res.SORSZ);	
		$('#rendszam').val(res.RENDSZAM);
		$('#hMIBIZ').val(res.MIBIZ);	
		
		if (res.RESULT=='OK') {
			rsz = $('#dataRendszam').val();
			hkod = $('#dataHkod').val();
			azon = res.FEJAZON;
			sorsz = res.SORSZ;	

			fn = 'kiadas.hkodSave';
			ajaxCall(fn,{'azon':azon, 'sorsz':sorsz,'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
		}
		else {
			clearObj='dataHkod';
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'DIFFERENT_HKOD': 
					errormsg='A kor�bban kiadasodott term�kek m�s helyk�don vannak! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva erre a helyk�dra!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					showMessage(errormsg,clearObj);
					break;
				case 'HKOD_EXISTS': 
					errormsg='M�s helyk�don is van ez a rendsz�m!';
					showMessage(errormsg,clearObj);
					break;					
				default:
					errormsg = res.RESULTTEXT;
					showMessage(errormsg,clearObj);
					
			}
		}
	}
		
	
}

OKiadas.prototype.hkodSave = function (result){
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
			showMessage(res.RESULT);
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					break;
				case 'HKOD_EXISTS': 
					errormsg='M�s helyk�don is van ez a rendsz�m!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg);
			
		}
	}
		


	//alert(JSON.stringify(result));
}
/* hkod eddig */

/* rendszam innen */
OKiadas.prototype.hideRsz=function(){
	$('.drendszam').hide();
}
OKiadas.prototype.setNextRsz = function (rsz){
		$('#labelRendszamVart').html(rsz);
		kiadas.currentRsz= rsz;
		$('#dataRendszam').focus();
}

OKiadas.prototype.nextRszGet = function (result){
	/* elso kiszedendo rendszam betoltese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		kiadas.setNextRsz(res.RSZ);
	}
}
OKiadas.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	if (rsz.indexOf(kiadas.currentRsz)!=-1) {
		fn = 'kiadas.rszSave';
		ajaxCall(fn,{'rsz':rsz,'rszshort':kiadas.currentRsz,'azon':kiadas.fejazon,'login':login_id,'hkod':kiadas.currentHkod,'lastrsz':kiadas.lastRsz},true, fn);
	}
	else {
		showMessage('Rendsz�m nem egyezik!','dataRendszam');
	}
	
}
OKiadas.prototype.rszSave = function (result){
	/* belott rendszam mentese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			kiadas.lastRsz = kiadas.currentRsz;
			errormsg = res.RESULTTEXT;
			showMessage(errormsg,'dataRendszam');
			if (res.NEXTRSZ!='') {
				if (res.NEXTRSZ=='NEXTHKOD') {
					/* nincs a helykodon tobb kiszedheto rendszam*/
					errormsg='Ment�s rendben, HELYK�D V�LT�S!';
					showMessage(errormsg,'dataRendszam');
					kiadas.hideRsz();
					fn = 'kiadas.nextHkodGet';
					ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
					
					
				}
				else {
					kiadas.setNextRsz(res.NEXTRSZ);
					errormsg='Ment�s rendben, RENDSZ�M V�LT�S!';
					showMessage(errormsg,'dataRendszam');
				}
				
			}
			
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a kiszedend� abroncsok k�z�tt!';
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a poz�ci� m�r ki lett szedve!';
					break;
				case 'DIFFERENT_HKOD': 
					errormsg='M�s helyk�don van ez a rendsz�m!';
					break;					
				case 'UNKNOWN_ERROR': 
					errormsg='Adatb�zis hiba a fel�r�sn�l!';
					break;					
				case 'NOT_READY': 
					errormsg='Az el�z� rendsz�m m�g nincs k�sz! ('+kiadas.lastRsz+')';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg,'dataRendszam');
			
		}
	}
}

OKiadas.prototype.rszNotFound = function(){
		fn = 'kiadas.rszEmpty';
		ajaxCall(fn,{'rszshort':kiadas.currentRsz,'azon':kiadas.fejazon,'login':login_id,'hkod':kiadas.currentHkod},true, fn);
	
}
OKiadas.prototype.rszEmpty = function(result){
	/* rendszam nullazasa (kiszedesek torlese) */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			errormsg = res.RESULTTEXT;
			showMessage(errormsg,'dataRendszam');
			if (res.NEXTRSZ!='') {
				if (res.NEXTRSZ=='NEXTHKOD') {
					/* nincs a helykodon tobb kiszedheto rendszam*/
					errormsg='Ment�s rendben, HELYK�D V�LT�S!';
					showMessage(errormsg,'dataRendszam');
					kiadas.hideRsz();
					fn = 'kiadas.nextHkodGet';
					ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
					
					
				}
				else {
					kiadas.setNextRsz(res.NEXTRSZ);
					errormsg='Ment�s rendben, RENDSZ�M V�LT�S!';
					showMessage(errormsg,'dataRendszam');
				}
				
			}
			
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a kiszedend� abroncsok k�z�tt!';
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a rendsz�m m�g nem lett kiszedve!';
					break;
				case 'DIFFERENT_HKOD': 
					errormsg='M�s helyk�don van ez a rendsz�m!';
					break;					
				case 'UNKNOWN_ERROR': 
					errormsg='Adatb�zis hiba a fel�r�sn�l!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg,'dataRendszam');
			
		}
	}
}
/* rendszam eddig */

/* atnezo panel */


OKiadas.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '<tr><td/></tr>';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendsz�m</th>"
					+"<th class='tdhkod'>Helyk�d</th>"
					+"<th>Kiszedend�</th>"
					+"<th>Kiszedett</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	kiadas.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.DRB2<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
		}
	}

	if (hianydb!=0){
		$('.labelHiany').html('Kiszedend�:');
		$('.dataHiany').html(hianydb);
	}
	$('.tableReview').html(fej+sorok);
	kiadas.reviewFilter();

}

OKiadas.prototype.reviewRszFilter = function(result) {
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
		fn = 'kiadas.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'login':login_id,'azon':kiadas.fejazon},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OKiadas.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#divreview').hide();
	$('bFolytMost').show();
	$('#divpanel').hide();
	fn = 'kiadas.reviewRszFilter';
	r = ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	$('#divreview').show();
	
}

OKiadas.prototype.reviewFilter = function() {
	/* elt�r�s/�sszes sor mutat�sa*/
	showAll = true;
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = kiadas.reviewSet;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
			if (res.DRB2==res.DRB) tdclass=' rowhighlighted';
			if (res.DRB2==0 && res.STAT3=='X') tdclass=' rowhighlighted_notfound';
			sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
			sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
			sor += '<td class="tdhkod">'+res.HKOD+'</td>';
			sor +=  '<td class="tmibiz">'+res.DRB+'</td>'; 
			sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 			
			sor += '</tr>';

		
	}
	$('.tableReview tbody').append(sor);
}


OKiadas.prototype.lezarInit = function() {
	fn = 'kiadas.closeCheck';
	ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	
}
OKiadas.prototype.closeCheck = function(result){
	/* szedesi bizonylat zaras elotti ellenorzese*/
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			fn = 'kiadas.closeIt';
			ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_READY': 
					errormsg='M�g van kiszedettlen t�tel!';
					break;
				case 'UNKNOWN_ERROR': 
					errormsg='Adatb�zis hiba a lez�r�sn�l!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg);
			
		}
	}
}
OKiadas.prototype.closeIt = function(result){
	/* szedesi bizonylat zarasa*/
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			$('#bMenu').trigger('click');
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'UNKNOWN_ERROR': 
					errormsg='Adatb�zis hiba a fel�r�sn�l!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg);
			
		}
	}

}
/* atnezo panel eddig */


/* kiadas eddig */


//pingPrinter();