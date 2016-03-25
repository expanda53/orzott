/* elrakodas */
/*
	1. nincs feladat v�laszt�s, r�gt�n a rendsz�mra l�het.
	2. rendsz�mra l�v�s ut�n megn�zni, hogy ki van-e szedve teljesen.
	3a, ha nincs kiszedve teljesen, akkor hiba�zenet. Azt�n 1.
	3b ha ki van szedve teljesem, meg kell n�zni hogy a m�lys�gm�r�s el lett-e rajta v�gezve
	4a, ha nem, akkor m�lys�g m�r�s. Ut�na 4b
	4b, ha volt m�lys�gm�r�s, akkor helyk�dra l�het
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
			$('#bMenu').bind('click',function () {
				showMenu();
			})	
			$('#bEllenorzes').bind('click',function () {
				elrak.showReview();
			})	
			$('#bFolytMost').bind('click',function (event) {
				event.stopPropagation();
				event.preventDefault();
				if(event.handled !== true) {
					clickHelp();
					$('#divreview').hide();
					$('#divpanel').show();
					event.handled = true;
					if ($('#dataHkod').is(":visible")) $('#dataHkod').focus();
					else $('#dataRendszam').focus();
					
				} else {
					return false;
				}
			})
			
			$('#dataRendszam').focus();
		})
	})

}

/* fopanel */

OElrak.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye, rszChange ind�tja */
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
					errormsg='Nem megfelel� t�pus a poz�ci�n!';
					showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					showMessage(errormsg,clearObj);
					break;
				case 'DEEP': 
					errormsg='M�lys�gm�r�s nem lett elv�gezve!';
					showMessage(errormsg);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lel�tt poz�ci�n nem tal�lhat� abroncs a rendsz�mhoz!';
					showMessage(errormsg,clearObj);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					showMessage(errormsg,clearObj);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a v�rt �s a lerakodott mennyis�g! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva! helyk�d:'+res.ERRORTEXT;
					showMessage(errormsg);
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
	}
}

OElrak.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	fn = 'elrak.rszAdatokGet';
	ajaxCall(fn,{'rsz':rsz},true, fn);
	
}



OElrak.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}


/* fopanel eddig */



/* allapot panel */

OElrak.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="" disabled selected>V�lasszon</option>');
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
	$('.dhkod').show();
	$('#dataHkod').focus();
}
OElrak.prototype.hideHkod=function(){
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
			showMessage('Ment�s rendben');
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
			/*
			$('#hAZON').val(res.FEJAZON);
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
			elrak.currentItem=res.RSZTIP;
			elrak.currentPosition='b'+res.RSZPOZ;
			*/
			showMessage(errormsg);
			
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
	/* hkod ellen�rz�s, majd ment�s (ha a visszaadott result=ok) */
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
			clearObj='dataHkod';
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'DIFFERENT_HKOD': 
					errormsg='A kor�bban elrakodott term�kek m�s helyk�don vannak! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva erre a helyk�dra!';
					showMessage(errormsg);
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

OElrak.prototype.hkodSave = function (result){
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
			window.setTimeout(function(){
				$('#dataRendszam').focus();

			},2*1000);
			
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

/* atnezo panel */


OElrak.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendsz�m</th>"
					+"<th>Lerakodott</th>"
					+"<th>Elpakolt</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	elrak.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (res.DRB2==res.ROGDRB) tdclass=' rowhighlighted';
		sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sorok += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
		sorok +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
		sorok +=  '<td class="tmibiz">'+res.ROGDRB+'</td>'; 
		sorok += '</tr>';
		if (res.ROGDRB<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.ROGDRB);
		}
		
	}
	$('.tableReview').html(fej+sorok);
	if (hianydb!=0){
		$('.labelHiany').html('Elpakoland�:');
		$('.dataHiany').html(hianydb);
	}
	elrak.reviewFilter();

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
		fn = 'elrak.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OElrak.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#divreview').hide();
	$('bFolytMost').show();
	$('#divpanel').hide();
	fn = 'elrak.reviewRszFilter';
	r = ajaxCall(fn,{'login':login_id},true, fn);
	$('#divreview').show();
	
}

OElrak.prototype.reviewFilter = function() {
	/* elt�r�s/�sszes sor mutat�sa*/
	showAll = true;
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = elrak.reviewSet;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
			if (res.DRB2==res.ROGDRB) tdclass=' rowhighlighted';
			sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
			sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
			sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
			sor +=  '<td class="tmibiz">'+res.ROGDRB+'</td>'; 			
			sor += '</tr>';

		
	}
	$('.tableReview tbody').append(sor);
}






/* atnezo panel eddig */


/* elrakodas eddig */


