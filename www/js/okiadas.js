/* kiadas */
/*
	1. aktualis feladat fejazonjanak beolvasa (pda_mibizlist_orzottki)
	2. rendszámra lövés után megnézni, hogy ki van-e szedve teljesen.
	3a, ha nincs kiszedve teljesen, akkor hibaüzenet. Aztán 1.
	3b ha ki van szedve teljesem, meg kell nézni hogy a mélységmérés el lett-e rajta végezve
	4a, ha nem, akkor mélység mérés. Utána 4b
	4b, ha volt mélységmérés, akkor helykódra lõhet
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
	this.aktbiztip = 'MO05';

	this.panelInit();
}
OKiadas.prototype.panelInit = function () {
	/* kezdõ panel megjelenítése*/
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
			/*
			$('#dataHkod').bind('focus',function (event) {
				$(this).val("");
				kiadas.hideRsz();
			})	
			*/
			
			/*
			$('#dataHkod').bind('change',function (event) {
				kiadas.hkodChange();
			})
			*/
					
			$('#bMenu, #bMenu1').bind('click',function () {
				showMenu();
			})	
			$('#bEllenorzes').bind('click',function () {
				kiadas.showReview();
			})	
			$('#bNincs').bind('click',function () {
				kiadas.rszNotFound();
			})
			$('#bCimke').bind('click',function () {
				kiadas.showCimkePanel();
			})
			$('#bCimkeClose').bind('click',function () {
				$('#divcimke').hide();
				$('#divpanel').show();
                $('#dataRendszam').focus();
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
					//else $('#dataHkod').focus();
				} else {
					return false;
				}
			})
			$('#bLezar').bind('click',function () {
				kiadas.lezarInit();
			})
			$('#kiadastip').bind('change',function(){
				akttip = $(this).val();
				fn = 'kiadas.raktarList';
				ajaxCall(fn,{'login':login_id,'biztip':kiadas.aktbiztip,'akttip':akttip},true, fn);
				
			})
			$('#raktarlist').bind('change',function(){
				akttip = $('#kiadastip').val();
                if (akttip=='H') /* teleptolto */ {
                    aktraktar = $(this).val();
                    fn = 'kiadas.telepList';
                    ajaxCall(fn,{'login':login_id,'biztip':kiadas.aktbiztip,'akttip':akttip,'aktraktar':aktraktar},true, fn);
                }
                else {
                    $("#teleplist").val("0");
                    $("#teleplist").hide();
                }
				
			})                
			$('#btStart').bind('click',function(){
				fn = 'kiadas.mibizList';
				akttip = $('#kiadastip').val();
				raktar = $('#raktarlist').val();
                if (akttip=='H') cegazon = $("#teleplist").val();
                else cegazon=0;
				ajaxCall(fn,{'login':login_id,'biztip':kiadas.aktbiztip,'akttip':akttip,'raktar':raktar,'cegazon':cegazon},true, fn);

			})
			
			//$('#dataHkod').focus();
			$('#kiadastip').trigger('change');
		})

		
	})
}

/* fopanel */
OKiadas.prototype.raktarList = function (result){
	html = "";
	$("#raktarlist").html('');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#raktarlist").append('<option value='+res.RAKTAR+'>'+res.RAKTAR+'</option>');
	}
    $('#raktarlist').trigger('change');
}

OKiadas.prototype.telepList = function (result){
	html = "";
	$("#teleplist").html('');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#teleplist").append('<option value='+res.CEGAZON+'>'+res.TELEPNEV+'</option>');
	}
    $("#teleplist").show();
}

OKiadas.prototype.mibizList = function (result){
	/* bfej.azon kiolvasasa, eltarolasa */
	//for (var i = 0;i < result.length;i++){
		res = result[0];
		kiadas.fejazon = res.FEJAZON;
		
		$('#dataSofor').html(res.FUVAR);
		$('#dataJarat').html($('#kiadastip option:selected').text());
		$('#dataRaktar').html(res.RAKTAR);
		
		/* kovetkezo kiszedendo helykod betoltese */
		fn = 'kiadas.nextHkodGet';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
		
		$('#divmibizlist').hide();
		$('#divpanel').show();		
	//}

}
OKiadas.prototype.nextHkodGet = function (result){
	/* elso kiszedendo helykod betoltese */
	//$('#dataHkod').val("");
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$('#labelHkodVart').html(res.HKOD);
		kiadas.currentHkod= res.HKOD;
		kiadas.hkodChange();
	}
}



/* fopanel eddig */



/* hkod innen */
OKiadas.prototype.showHkod=function(){
	$('.dhkod').show();
	//$('#dataHkod').val("");
	//$('#dataHkod').focus();
}
OKiadas.prototype.hideHkod=function(){
	//$('#dataHkod').val("");
	$('.dhkod').hide();
}
OKiadas.prototype.hkodChange=function(){
	
	//if ($('#dataHkod').val() == this.currentHkod) {
		$('.drendszam').show();
		$('#dataRendszam').empty();
		/* kovetkezo kiszedendo rendszam betoltese */
		fn = 'kiadas.nextRszGet';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod,'rsz':kiadas.currentRsz},true, fn);
		
		
	//}
	//else showMessage('Nem megfelelõ helykód!','dataHkod');
}


/* hkod eddig */

/* rendszam innen */
OKiadas.prototype.hideRsz=function(){
	$('.drendszam').hide();
}
OKiadas.prototype.setNextRsz = function (rszRec){
		if (rszRec.RSZ!=undefined) rsz = rszRec.RSZ;
		if (rszRec.NEXTRSZ!=undefined) rsz = rszRec.NEXTRSZ;
		meret = rszRec.MERET;
		minta=rszRec.MINTA;
		cicsop = rszRec.MARKA;
		fegu=rszRec.FEGU;
        telepnev = rszRec.TELEPNEV;
		
		$('#labelRendszamVart').html(rsz);
		$('#dmeretminta').html(meret+" "+cicsop+" "+minta+" ("+fegu+")");
        $('#dtelep').html(telepnev);
		kiadas.currentRsz= rsz;
		$('#dataRendszam').focus();
}

OKiadas.prototype.nextRszGet = function (result){
	/* elso kiszedendo rendszam betoltese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		kiadas.setNextRsz(res);
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
		showMessage('Rendszám nem egyezik!','dataRendszam');
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
					errormsg='Mentés rendben, HELYKÓD VÁLTÁS!';
					showMessage(errormsg,'dataRendszam');
					kiadas.hideRsz();
					fn = 'kiadas.nextHkodGet';
					ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
					
					
				}
				else {
					kiadas.setNextRsz(res);
					errormsg='Mentés rendben, RENDSZÁM VÁLTÁS!';
					showMessage(errormsg,'dataRendszam');
				}
				
			}
			
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a kiszedendõ abroncsok között!';
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a pozíció már ki lett szedve!';
					break;
				case 'DIFFERENT_HKOD': 
					errormsg='Más helykódon van ez a rendszám!';
					break;					
				case 'UNKNOWN_ERROR': 
					errormsg='Adatbázis hiba a felírásnál!';
					break;					
				case 'NOT_READY': 
					errormsg='Az elõzõ rendszám még nincs kész! ('+kiadas.lastRsz+')';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg,'dataRendszam');
			
		}
	}
}

OKiadas.prototype.rszNotFound = function(){
    if (confirm("Biztos nincs meg?")) {
		fn = 'kiadas.rszEmpty';
		ajaxCall(fn,{'rszshort':kiadas.currentRsz,'azon':kiadas.fejazon,'login':login_id,'hkod':kiadas.currentHkod},true, fn);
    }
    else $('#dataRendszam').focus();
	
}
OKiadas.prototype.rszEmpty = function(result){
	/* rendszam nullazasa (kiszedesek torlese) */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OKTOVABB' || res.RESULTTEXT=='OKVISSZA') {
            if (res.RESULTTEXT=='OKVISSZA') {
                hkod = $('#labelHkodVart').html();
                alert('Ne felejtsd el a kiszedett abroncsokat visszarakni a helyére: '+hkod+' !');
            }
			errormsg = res.RESULTTEXT;
			showMessage(errormsg,'dataRendszam');
			if (res.NEXTRSZ!='') {
				if (res.NEXTRSZ=='NEXTHKOD') {
					/* nincs a helykodon tobb kiszedheto rendszam*/
					errormsg='Mentés rendben, HELYKÓD VÁLTÁS!';
					showMessage(errormsg,'dataRendszam');
					kiadas.hideRsz();
					fn = 'kiadas.nextHkodGet';
					ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
					
					
				}
				else {
					kiadas.setNextRsz(res);
					errormsg='Mentés rendben, RENDSZÁM VÁLTÁS!';
					showMessage(errormsg,'dataRendszam');
				}
				
			}
            else {
                /* nincs tobb szedheto rsz a bizonylaton */
				errormsg='Mentés rendben, NINCS TÖBB SZEDHETÖ RENDSZÁM!';
				showMessage(errormsg,'dataRendszam');
            }
			
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a kiszedendõ abroncsok között!';
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a rendszám még nem lett kiszedve!';
					break;
				case 'DIFFERENT_HKOD': 
					errormsg='Más helykódon van ez a rendszám!';
					break;					
				case 'UNKNOWN_ERROR': 
					errormsg='Adatbázis hiba a felírásnál!';
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
					+"<th class='tdrsz'>Rendszám</th>"
					+"<th class='tdhkod'>Helykód</th>"
					+"<th>Kiszedendõ</th>"
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
		$('.labelHiany').html('Kiszedendõ:');
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
	/* eltérés/összes sor mutatása*/
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
			sor += '<tr stat="'+res.STAT3+'" class="'+tdclass+'" id="'+res.RENDSZAM+'">';
			sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
			sor += '<td class="tdhkod">'+res.HKOD+'</td>';
			sor +=  '<td class="tmibiz">'+res.DRB+'</td>'; 
			sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 			
			sor += '</tr>';

		
	}
	$('.tableReview tbody').append(sor);
	$('.tableReview tbody tr').bind('click',function(){
		curTR = $(this);
		rszTD = curTR.find('.tdrsz');
		if (curTR.attr('stat')=='X') {
			/* "nincs meg" esetén fut csak, "nincs meg" jelzes torles */
			if (confirm("Mégis szedhetõ?")) {
				rsz = rszTD.html();
				fn = 'kiadas.rszReset';
				r = ajaxCall(fn,{'rsz':rsz,'azon':kiadas.fejazon,'login':login_id},true, fn);
			}
		}
	})
}

OKiadas.prototype.rszReset = function(result){
	/* "nincs meg" jelzes torlese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			showMessage('Visszaállítás rendben!','');
			kiadas.showReview();
		}
		else {
			showMessage('HIBA:'+res.RESULTTEXT,'');
		}
	}
}


OKiadas.prototype.lezarInit = function() {
	if (confirm("Zárható?")) {
		fn = 'kiadas.closeCheck';
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	}
	
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
					errormsg='Még van kiszedettlen tétel!';
					break;
				case 'UNKNOWN_ERROR': 
					errormsg='Adatbázis hiba a lezárásnál!';
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
					errormsg='Adatbázis hiba a felírásnál!';
					break;					
				default:
					errormsg = res.RESULTTEXT;
					
			}
			showMessage(errormsg);
			
		}
	}

}
/* atnezo panel eddig */
/* cimke nyomtatas */
OKiadas.prototype.showCimkePanel = function(){
	$('#divpanel').hide();
	$('#divcimke').show();
	fn = 'kiadas.setLabelData';
	ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'rsz':this.currentRsz},true, fn);

}
OKiadas.prototype.setLabelData = function(result){
	/* cimke nyomtatashoz gombok */
	html = "";
	for (var i = 0;i < result.length;i++){
		res = result[i];
		html+="<div><button class='bcimkeprint' val='"+res.RSZ+"'>"+res.RSZ+"</button></div>";
	}
	$('#dcimkebuttons').html(html);
	$('.bcimkeprint').bind('click',function(){
		kiadas.printLabel( $(this) );
	});
}
OKiadas.prototype.printLabel = function(aktbutton){
	rszprint = aktbutton.attr('val');
	var btPrint = function() {
		$.get( "views/prn_rendszam_lerak.tpl", function( data ) {

				
				tpl = data.replace(/\[RENDSZPOZ\]/g,rszprint); 
				tpl += '\r\n';
				var writeOk = function(){
				}
				var writeError = function(){
					console.log('btprint write error:kiadas, label print:'+rszprint);
				}
				if (!teszt) bluetoothSerial.write(tpl,writeOk,writeError);
				if (teszt) writeOk();
				
		})
	}
	
	var printError = function(){
		console.log('btprint write error:kiadas, label print:'+rszprint);
		app.printerConnected=false;
		if (app.printerId!="") BTEnabled(null);
		if (app.printerConnected==false) alert('Nyomtatási hiba');
	}
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
			showMessage('printer not found');
			if (teszt) btPrint();
	}
	

}
/* cimke nyomtatas eddig */

/* kiadas eddig */


//pingPrinter();