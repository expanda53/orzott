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
var OElrak = function(){
	this.meresKell=false;
	this.panelInit();
	this.currentItem = "";
	this.currentPosition = '';
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
					showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					showMessage(errormsg,clearObj);
					break;
				case 'DEEP': 
					errormsg='Mélységmérés nem lett elvégezve!';
					showMessage(errormsg);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lelõtt pozíción nem található abroncs a rendszámhoz!';
					showMessage(errormsg,clearObj);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					showMessage(errormsg,clearObj);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a várt és a lerakodott mennyiség! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi már el lett pakolva! helykód:'+res.ERRORTEXT;
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
	$("#gstat").append('<option value="" disabled selected>Válasszon</option>');
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
			showMessage('Mentés rendben');
		}
		else {
			errormsg='';
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
			clearObj='dataHkod';
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'DIFFERENT_HKOD': 
					errormsg='A korábban elrakodott termékek más helykódon vannak! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					showMessage(errormsg,clearObj);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi már el lett pakolva erre a helykódra!';
					showMessage(errormsg);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					showMessage(errormsg,clearObj);
					break;
				case 'HKOD_EXISTS': 
					errormsg='Más helykódon is van ez a rendszám!';
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
					+"<th class='tdrsz'>Rendszám</th>"
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
		$('.labelHiany').html('Elpakolandó:');
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
	/* eltérés/összes sor mutatása*/
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


