/* elrakodas */
/*
	1. nincs feladat választás, rögtön a rendszámra lőhet.
	2. rendszámra lövés után megnézni, hogy ki van-e szedve teljesen.
	3a, ha nincs kiszedve teljesen, akkor hibaüzenet. Aztán 1.
	3b ha ki van szedve teljesem, meg kell nézni hogy a mélységmérés el lett-e rajta végezve
	4a, ha nem, akkor mélység mérés. Utána 4b
	4b, ha volt mélységmérés, akkor helykódra lőhet
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
	/* kezdő panel megjelenítése*/
	panelName='oelrak';
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
				elrak.rszChange();
			})	
			$('#dataRendszam').bind('focus',function (event) {
				$(this).val('');
				elrak.hideHkod();
				$('#dataHkod').val('');
			})	
	
			
			$('#dataHkod').bind('change',function (event) {
				elrak.hkodSaveInit();
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
			fn = 'elrak.getRszInProgress'; /*  PDA_ORZOTTHKOD_GETRSZSTARTED */
			ajaxCall(fn,{'login':login_id},true, fn);
            $('#dataRendszam').focus();
			
		})
	})

}

/* fopanel */
OElrak.prototype.getRszInProgress = function (result){
    /* munkaban rsz es hkod */
    for (var i = 0;i < result.length;i++){
        res = result[i];
        $('#dataRszWork').html(res.RENDSZAM);
        $('#dataRszWork').show();
        $('#labelRszWork').show();
        $('#rendszam').val(res.RENDSZAM);
        $('#hAZON').val(res.FEJAZON);

        $('#dataHkodWork').html(res.HKOD);
        $('#dataHkodWork').show();
        $('#labelHkodWork').show();
        
        $('#dataDrbWork').html(res.DRB+"/"+res.DRB2);
    }
}

OElrak.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#dataRendszam').val();
    if (rsz.length>15) {
        clearObj='dataRendszam';
        showMessage("A rendszám nem lehet hosszabb, mint 15 karakter!",clearObj);
    }
    else if (rsz.indexOf("B:")>-1) {    
        clearObj='dataRendszam';
        showMessage("Nem rendszám!",clearObj);
    }
    else {
        fn = 'elrak.rszAdatokGet'; /* PDA_ORZOTTHKOD_GETRSZ */
        ajaxCall(fn,{'rsz':rsz,'login':login_id},true, fn);
    }
	
}


OElrak.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye, rszChange indítja */
    /* ha van mar hkod es nem kell merni, akkor mentheto. Ha meg nincs hkod, akkor lonie kell hkodot */
	clearObj='dataRendszam';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
                /* volt melysegmeres*/
				$('#dataHkod').val('');
                if (res.HKOD!='') {
                    /* mar volt hkod love, mentheto */
                    $('#dataHkod').val(res.HKOD);
                    elrak.hkodSaveInit();
                }                
                else {
                    /* meg nincs hkod love, be kell loni */
                    elrak.showHkod();
                }
				
				
		}
		else {
			errormsg='';
			var meresKell=false;
            var showHkod = false;
			switch (res.RESULTTEXT) {
				case 'TYPE': 
					errormsg='Nem megfelelő típus a pozíción!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a lerakodott abroncsok között!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'DEEP': 
					errormsg='Mélységmérés nem lett elvégezve!';
					showMessage(errormsg,'',2);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lelőtt pozíción nem található abroncs a rendszámhoz!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendszámhoz tartozó pozíciók üresek!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a várt és a lerakodott mennyiség! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj,2);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi már el lett pakolva! helykód:'+res.ERRORTEXT;
					showMessage(errormsg,clearObj,2);
					//$('#dataHkod').val(res.ERRORTEXT);
                    //showHkod=true;
					break;
				case 'ALREADY_STARTED': 
					errormsg='Már van egy elkezdett garnitúra:<BR>'+res.ERRORTEXT;
					showMessage(errormsg,clearObj,2);
					break;
				default:
					errormsg = res.RESULTTEXT;
                    //showHkod = true;
					
			}
			$('#hAZON').val(res.FEJAZON);
			$('#hSORSZ').val(res.SORSZ);	
			$('#rendszam').val(res.RENDSZAM);
			$('#hMIBIZ').val(res.MIBIZ);	
            $('#dataHkod').val(res.HKOD);
            showHkod = false;
            if (!meresKell) {
                if (res.HKOD!='') {
                    if (showHkod) {
                        elrak.showHkod();
                    }
                }

            }
            
			elrak.currentItem=res.RSZTIP;
			elrak.currentPosition='b'+res.RSZPOZ;
			if (meresKell) {
					/* ha merni kell */
					panelName='elrak_meres';
					$.get( "views/"+panelName+".tpl", function( data ) { 
						rsz = $('#rendszam').val();
						mibiz = $('#hMIBIZ').val();
						$('#divmeres').html(data);
						$('#divmeres').show();
						fn = 'elrak.getMelyseg'; /* query */
						ajaxCall(fn,{'poz':elrak.currentPosition, 'login':login_id,'tip':elrak.currentItem},true, fn);
					});
			}
		}
	}

}

OElrak.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}
/* fopanel eddig */

/* allapot panel */

OElrak.prototype.getMelyseg=function(result){
    $("#dataRendszam").prop('disabled', true);
	$("#gstat").html('');
	$("#gstat").append('<option value="" disabled selected>Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	manualChoice = settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS')!=null && settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS').toUpperCase()=='IGEN';
	if (!manualChoice) $('#gstat').attr('disabled',true);
	$('#divgstat').show();
    // app.onData("7.651");
	
}

OElrak.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	
	rsz = $('#rendszam').val();
	mibiz = $('#hMIBIZ').val();
	tip=elrak.currentItem;
	fn='elrak.allapotMent'; /*PDA_ORZOTTLERAK_ALLAPOTMENT*/

	csereok = $('#gcsok').val();
	if ((melyseg=='-' || melyseg=='' || melyseg==null)) showMessage('Mentés előtt mérd meg a mélységet!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere esetén töltd ki a csere okát!');
	}
	else {
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip,'csereok':csereok},true, fn);
	}

}
OElrak.prototype.allapotClose=function(focusRendszam){
		$('#divmeres').hide();
		$('#divpanel').show();
        fn = 'elrak.getRszInProgress';
        ajaxCall(fn,{},true, fn);
        if (focusRendszam) {
            $("#dataRendszam").prop('disabled', false);
            $('#dataRendszam').focus();        
        }
}
OElrak.prototype.allapotMent=function(result){
    elrak.allapotClose(false);
    if ($('#dataHkodWork').html()!='NINCS') elrak.hkodSaveInit();
	else elrak.showHkod();
}
/* allapot panel eddig */

/* hkod innen */
OElrak.prototype.showHkod=function(){
    $("#dataRendszam").prop('disabled', true);
	$('.dhkod').show();
	$('#dataHkod').focus();
}
OElrak.prototype.hideHkod=function(){
	$('.dhkod').hide();
    fn = 'elrak.getRszInProgress'; /* PDA_ORZOTTHKOD_GETRSZSTARTED */
	ajaxCall(fn,{'login':login_id},true, fn);

   
}
OElrak.prototype.hkodDelInit=function(){
	/* hkod torles start */
	$('#dataHkod').val("");
	$('#dataHkod').focus();
	
	azon = $('#hAZON').val();
	rendszam = $('#rendszam').val();
	fn = 'elrak.hkodDel'; /* PDA_ORZOTTHKOD_HKODDEL */
	ajaxCall(fn,{'rsz':rendszam,'azon':azon,'login':login_id},true, fn);
}
OElrak.prototype.hkodDel=function(result){
	/*hkod torles eredmenye */
    elrak.allapotClose(false);
	for (var i = 0;i < result.length;i++){	
		res = result[i];
		if (res.RESULT=='OK') {
			showMessage('Törlés rendben');
            $("#dataRendszam").prop('disabled', false);
            $('#dataRendszam').focus();
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
}
OElrak.prototype.hkodSaveInit=function(){
	/* helykod mentes */
	rsz = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
    //showMessage(hkod);
    if (hkod.indexOf("B:")==-1 || (hkod.indexOf("_")>=0 && hkod.indexOf("-")>=0)) {
        showMessage('Nem helykód!','dataHkod');
        $('#dataHkod').focus();
    }
    else {
        if (hkod!='') {
            fn = 'elrak.hkodSaveCheck'; /* PDA_ORZOTTHKOD_HKODCHECK */
            ajaxCall(fn,{'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
        }
        else {
            showMessage('Helykód nem lehet üres!');
        }
    }
}

OElrak.prototype.hkodSaveCheck = function (result){
	/* hkod ellenőrzés, majd mentés (ha a visszaadott result=ok) */
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

			fn = 'elrak.hkodSave'; /* PDA_ORZOTTHKOD_HKODSAVE */
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
				case 'DEEP': 
					errormsg='Mélységmérés nem lett elvégezve!';
					showMessage(errormsg,clearObj);
					meresKell=true;
                    
                    elrak.hideHkod();
                    $('#dataHkod').val('');
                    
                    /* ha merni kell */
					panelName='elrak_meres';
					$.get( "views/"+panelName+".tpl", function( data ) { 
						rsz = $('#rendszam').val();
						mibiz = $('#hMIBIZ').val();
						$('#divmeres').html(data);
						$('#divmeres').show();
						fn = 'elrak.getMelyseg'; /* query */
						ajaxCall(fn,{'poz':elrak.currentPosition, 'login':login_id,'tip':elrak.currentItem},true, fn);
					});

                    
					break;
				default:
					errormsg = res.RESULTTEXT;
					showMessage(errormsg,clearObj);
					
			}
		}
	}
		
	
}

OElrak.prototype.hkodSave = function (result){
    $("#dataRendszam").prop('disabled', false);
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT=='OK') {
            showMessage('OK','',1);
            //munkaban levo rsz lekerdezese
            fn = 'elrak.getRszInProgress';/* PDA_ORZOTTHKOD_GETRSZSTARTED */
            ajaxCall(fn,{},true, fn);

			window.setTimeout(function(){
				$('#dataRendszam').focus();

			},500);
			
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
}
/* hkod eddig */

/* atnezo panel */
OElrak.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#divreview').hide();
	$('bFolytMost').show();
	$('#divpanel').hide();
	fn = 'elrak.reviewRszFilter'; /* query */
	r = ajaxCall(fn,{'login':login_id},true, fn);
	$('#divreview').show();
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
		fn = 'elrak.reviewRszGet'; /* query */
		r = ajaxCall(fn,{'filter':filter,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}

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
/*
panelInit->getRszInProgress->(#datarendszam.change)->rszChange()->rszAdatokGet->(meres volt, hkod van)hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres volt, hkod nincs)showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres nem volt)->getMelyseg->allapotMentes->allapotMent->(ha van hkod mar)->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                                                                                        ->(ha meg nincs hkod)->showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              
                                                                              
átnéző: showReview->reviewRszFilter->reviewRszGet->reviewFilter
*/

