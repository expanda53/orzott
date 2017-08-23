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
            $('#divheader').bind('click',function(){
                app.getDepthMeters();
            })
            
			$('#dataRendszam').bind('change',function (event) {
				kiadas.rszChange();
			})	
			$('#dataRendszam').bind('focus',function (event) {
				$(this).val("");
			})	
					
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
                    fn = 'kiadas.telepList'; /* PDA_ORZOTTKI_TELEPLIST */
                    ajaxCall(fn,{'login':login_id,'biztip':kiadas.aktbiztip,'akttip':akttip,'aktraktar':aktraktar},true, fn);
                }
                else {
                    $("#teleplist").val("0");
                    $("#teleplist").hide();
                }
				
			})                
			$('#btStart').bind('click',function(){
				fn = 'kiadas.mibizList'; /*  PDA_MIBIZLIST_ORZOTTKI */
				akttip = $('#kiadastip').val();
				raktar = $('#raktarlist').val();
                if (akttip=='H') cegazon = $("#teleplist").val();
                else cegazon=0;
				ajaxCall(fn,{'login':login_id,'biztip':kiadas.aktbiztip,'akttip':akttip,'raktar':raktar,'cegazon':cegazon},true, fn);

			})
			
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
	res = result[0];
	kiadas.fejazon = res.FEJAZON;
		
	$('#dataSofor').html(res.FUVAR);
	$('#dataJarat').html($('#kiadastip option:selected').text());
	$('#dataRaktar').html(res.RAKTAR);
		
	/* kovetkezo kiszedendo helykod betoltese */
	fn = 'kiadas.nextHkodGet'; /* PDA_ORZOTTKI_HKOD */
	ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod},true, fn);
		
	$('#divmibizlist').hide();
	$('#divpanel').show();		


}
OKiadas.prototype.nextHkodGet = function (result){
	/* elso kiszedendo helykod betoltese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
        if (res.HKOD=='NOTFOUND') {
            showMessage('Nincs több szedhetõ tétel!','');
            kiadas.showReview();
            
        }
        else {
            $('#labelHkodVart').html(res.HKOD);
            kiadas.currentHkod= res.HKOD;
            kiadas.hkodChange();
        }
	}
}



/* fopanel eddig */



/* hkod innen */
OKiadas.prototype.showHkod=function(){
	$('.dhkod').show();
}
OKiadas.prototype.hideHkod=function(){
	$('.dhkod').hide();
}
OKiadas.prototype.hkodChange=function(){
	$('.drendszam').show();
	$('#dataRendszam').empty();
	/* kovetkezo kiszedendo rendszam betoltese */
	fn = 'kiadas.nextRszGet'; /* PDA_ORZOTTKI_RSZ */
	ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon,'hkod':kiadas.currentHkod,'rsz':kiadas.currentRsz},true, fn);
}

/* hkod eddig */

/* rendszam innen */
OKiadas.prototype.hideRsz=function(){
	$('.drendszam').hide();
}
OKiadas.prototype.nextRszGet = function (result){
	/* elso kiszedendo rendszam betoltese */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		kiadas.setNextRsz(res);
	}
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


OKiadas.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
	if (rsz.indexOf(kiadas.currentRsz)!=-1) {
		fn = 'kiadas.rszSave'; /* PDA_ORZOTTKI_SORUPDATE */
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
            $('#dataRendszam').val('');
			showMessage(errormsg,'',1.5);
			if (res.NEXTRSZ!='') {
				if (res.NEXTRSZ=='NEXTHKOD') {
					/* nincs a helykodon tobb kiszedheto rendszam*/
					errormsg='Mentés rendben, HELYKÓD VÁLTÁS!';
					showMessage(errormsg,'dataRendszam');
					kiadas.hideRsz();
					fn = 'kiadas.nextHkodGet'; /* PDA_ORZOTTKI_HKOD */
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
		fn = 'kiadas.rszEmpty'; /* PDA_ORZOTTKI_SORVISSZA */
		ajaxCall(fn,{'rszshort':kiadas.currentRsz,'azon':kiadas.fejazon,'login':login_id,'hkod':kiadas.currentHkod},true, fn);
    }
    else $('#dataRendszam').focus();
	
}
OKiadas.prototype.rszEmpty = function(result){
	/* rendszam nullazasa (kiszedesek torlese) */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OKTOVABB' || res.RESULTTEXT=='OKVISSZA') {
            //OKTOVABB: nem kell uzenet a visszarakasrol, mert nem volt belole kiszedes
            //OKVISSZA: volt belole kiszedes, vissza kell rakni
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
					fn = 'kiadas.nextHkodGet'; /* PDA_ORZOTTKI_HKOD */
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

OKiadas.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#divreview').hide();
	$('bFolytMost').show();
	$('#divpanel').hide();
	fn = 'kiadas.reviewRszFilter'; /* query */
	r = ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	$('#divreview').show();
	
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
		fn = 'kiadas.reviewRszGet'; /* query */
		r = ajaxCall(fn,{'filter':filter,'login':login_id,'azon':kiadas.fejazon},true, fn);
	})

	$('#rszall').trigger('click');
	
}

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
				fn = 'kiadas.rszReset'; /* PDA_ORZOTTKI_RSZRESET */
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
		fn = 'kiadas.closeCheck'; /* PDA_ORZOTTKI_CLOSECHECK */
		ajaxCall(fn,{'login':login_id,'azon':kiadas.fejazon},true, fn);
	}
	
}
OKiadas.prototype.closeCheck = function(result){
	/* szedesi bizonylat zaras elotti ellenorzese*/
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			fn = 'kiadas.closeIt'; /* PDA_ORZOTTKI_CLOSE */
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
	fn = 'kiadas.setLabelData'; /* PDA_ORZOTTKI_CIMKEADATOK */
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
    rsztomb = rszprint.split("_");
	var btPrint = function() {
		$.get( "views/prn_rendszam_lerak"+app.printerTplPrefix+".tpl", function( data ) {
                poz="";
                tip="";
                rsz="";
                pozstr="";
                tipstr="";
                if (rsztomb.length>1) {
                    rsz = rsztomb[0];
                    poz = rsztomb[1].substring(0,1);
                    tip = rsztomb[1].substring(1);
                    if (poz=="1") pozstr = "JE";
                    if (poz=="2") pozstr = "BE";
                    if (poz=="3") pozstr = "JH";
                    if (poz=="4") pozstr = "BH";
                    if (poz=="5") pozstr = "POT";
                    if (poz=="6") pozstr = "JHI";
                    if (poz=="7") pozstr = "BHI";
                    if (tip=="A") tipstr="Gumi";
                    if (tip=="F") tipstr="Felni";
                    if (tip=="M") tipstr="Kerék";
                }
                else rsz=rszprint;
                tpl = data;
                tpl = tpl.replace(/\[RENDSZ\]/g,rsz); 
                tpl = tpl.replace(/\[TIPUS\]/g,tipstr); 
                tpl = tpl.replace(/\[POZSTR\]/g,pozstr); 
                tpl = tpl.replace(/\[RENDSZPOZ\]/g,rszprint); 
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


/*
panelInit->(#kiadastip.change)->raktarList->(#raktarlist.change)->[(akttip='H' teleptolto)->telepList]->(#btStart.click)->mibizList->nextHkodGet->
                                                                                                                                            (van tetel)->hkodChange->nextRszGet->setNextRsz->(#dataRendszam.change)->rszChange->rszSave->
                                                                                                                                                            ->(nincs több rsz a helykódon)->nextHkodGet
                                                                                                                                                            ->(köv. rendszám a helykódról)->setNextRsz
                                                                                                                                            (nincs tetel)->showReview
    
//nincs meg:
rszNotFound->rszEmpty->rsz/hkod valtas (ld fent)

    
//lezaras:
lezarInit->closeCheck->closeIt
    
//átnézõ: 
showReview->reviewRszFilter->reviewRszGet->reviewFilter->(stat3=X:rszReset - "nincs meg" torles->showReview)
*/