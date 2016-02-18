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
	this.panelInit();
	this.currentItem = "";
	this.currentPosition = '';
	this.fejazon = -1;
}
OKiadas.prototype.showMessage =function (msg, clearObj ){
	$('#dmsg').html(msg);
	$('#dmsg').show();

	window.setTimeout(function(){
		$('#dmsg').hide();
		if (clearObj!='') {
			$('#'+clearObj).val('');
		}
	},3*1000);
	
	
}
OKiadas.prototype.panelInit = function () {
	/* kezd� panel megjelen�t�se*/
	panelName='OKiadas';
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
				$(this).val('');
			})	
	
			
			$('#dataHkod').bind('change',function (event) {
				kiadas.hkodChange();
			})	
			$('#bHkodUj').bind('click',function () {			
				kiadas.hkodDelInit();
			})
			$('#bMenu').bind('click',function () {
				showMenu();
			})	
			$('#bEllenorzes').bind('click',function () {
				kiadas.showReview();
			})	
			$('#dataHkod').focus();
		})
		fn = 'kiadas.mibizList';
		ajaxCall(fn,{'login':login_id,'biztip':'MO03'},true, fn);

	})
	
	

}

/* fopanel */
OKiadas.prototype.mibizList = function (result){
	/* bfej.azon kiolvasasa, eltarolasa */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		kiadas.fejazon = res.FEJAZON;
		
		/* elso kiszedendo helykod betoltese */
		fn = 'kiadas.firstHkodGet';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	}

}
OKiadas.prototype.firstHkodGet = function (result){
	/* elso kiszedendo helykod betoltese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
	}
}
OKiadas.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye, rszChange ind�tja */
	clearObj='dataRendszam';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
				$('#dataHkod').val('');
				kiadas.showHkod();
				
		}
		else {
			errormsg='';
			var meresKell=false;
			switch (res.RESULTTEXT) {
				case 'TYPE': 
					errormsg='Nem megfelel� t�pus a poz�ci�n!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'DEEP': 
					errormsg='M�lys�gm�r�s nem lett elv�gezve!';
					kiadas.showMessage(errormsg);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lel�tt poz�ci�n nem tal�lhat� abroncs a rendsz�mhoz!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a v�rt �s a lerakodott mennyis�g! '+res.ERRORTEXT;
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva! helyk�d:'+res.ERRORTEXT;
					kiadas.showMessage(errormsg);
					$('#dataHkod').val(res.ERRORTEXT);
					kiadas.showHkod();
					break;

				default:
					errormsg = res.RESULTTEXT;
					
			}
			
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
			kiadas.currentItem=res.RSZTIP;
			kiadas.currentPosition='b'+res.RSZPOZ;
			if (meresKell) {
				/* ha merni kell */
				panelName='kiadas_meres';
				
					$.get( "views/"+panelName+".tpl", function( data ) { 
						rsz = $('#rendszam').val();
						mibiz = $('#hMIBIZ').val();
						$('#divmeres').html(data);
						//$('#divpanel').hide();
						$('#divmeres').show();
						
						fn = 'kiadas.getMelyseg';
						ajaxCall(fn,{'poz':kiadas.currentPosition, 'login':login_id},true, fn);
					});
			}
		}
	}
}

OKiadas.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	fn = 'kiadas.rszAdatokGet';
	ajaxCall(fn,{'rsz':rsz},true, fn);
	
}



OKiadas.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}


/* fopanel eddig */



/* allapot panel */

OKiadas.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-">V�lasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	$('#divgstat').show();
	
}

OKiadas.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	
	rsz = $('#rendszam').val();
	mibiz = $('#hMIBIZ').val();
	tip=kiadas.currentItem;
	fn='kiadas.allapotMent';
	ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip},true, fn);

}
OKiadas.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
	kiadas.showHkod();
}
/* allapot panel eddig */

/* hkod innen */
OKiadas.prototype.showHkod=function(){
	$("#labelStatus").hide();
	$('.dhkod').show();
	$('#dataHkod').focus();
}
OKiadas.prototype.hideHkod=function(){
	$("#labelStatus").hide();
	$('.dhkod').hide();
}
OKiadas.prototype.hkodChange=function(){
	this.hkodSaveInit();
}
OKiadas.prototype.hkodDelInit=function(){
	/* hkod torles start */
	$('#dataHkod').val("");
	$('#dataHkod').focus();
	

	rendszam = $('#rendszam').val();
	fn = 'kiadas.hkodDel';
	ajaxCall(fn,{'rsz':rendszam,'azon':kiadas.fejazon,'login':login_id},true, fn);
}
OKiadas.prototype.hkodDel=function(result){
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
}
OKiadas.prototype.hkodSaveInit=function(){
	/* helykod mentes */
	rsz = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
	fn = 'kiadas.hkodSaveCheck';
	ajaxCall(fn,{'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
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
			$("#labelStatus").attr("class", "statusError");
			$("#labelStatus").html("Hiba!");
			$("#labelStatus").show();
			clearObj='dataHkod';
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'DIFFERENT_HKOD': 
					errormsg='A kor�bban kiadasodott term�kek m�s helyk�don vannak! '+res.ERRORTEXT;
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva erre a helyk�dra!';
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					kiadas.showMessage(errormsg,clearObj);
					break;
				case 'HKOD_EXISTS': 
					errormsg='M�s helyk�don is van ez a rendsz�m!';
					kiadas.showMessage(errormsg,clearObj);
					break;					
				default:
					errormsg = res.RESULTTEXT;
					kiadas.showMessage(errormsg,clearObj);
					
			}
		}
	}
		
	
}

OKiadas.prototype.hkodSave = function (result){
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
			kiadas.showMessage(errormsg);
			
		}
	}
		


	//alert(JSON.stringify(result));
}
/* hkod eddig */

/* atnezo panel */


OKiadas.prototype.reviewRszGet = function(result) {
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
	kiadas.reviewSet = result;
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
		r = ajaxCall(fn,{'filter':filter,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OKiadas.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#divreview').hide();
	$('bFolytMost').show();
	$('#divpanel').hide();
	fn = 'kiadas.reviewRszFilter';
	r = ajaxCall(fn,{'login':login_id},true, fn);
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


/* kiadasodas eddig */


//pingPrinter();