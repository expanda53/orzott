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
    if (rsz.length>13) {
        clearObj='dataRendszam';
        showMessage("A rendsz�m nem lehet hosszabb, mint 13 karakter!",clearObj);
    }
    else if (rsz.indexOf("B:")>-1) {    
        clearObj='dataRendszam';
        showMessage("Nem rendsz�m!",clearObj);
    }
    else {
        fn = 'elrak.rszAdatokGet'; /* PDA_ORZOTTHKOD_GETRSZ */
        ajaxCall(fn,{'rsz':rsz,'login':login_id},true, fn);
    }
	
}


OElrak.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye, rszChange ind�tja */
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
					errormsg='Nem megfelel� t�pus a poz�ci�n!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'NOT_FOUND': 
					errormsg='Nem tal�lhat� ilyen rendsz�m a lerakodott abroncsok k�z�tt!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'DEEP': 
					errormsg='M�lys�gm�r�s nem lett elv�gezve!';
					showMessage(errormsg,'',2);
					meresKell=true;
					break;
				case 'POSITION_NOT_FOUND': 
					errormsg='Lel�tt poz�ci�n nem tal�lhat� abroncs a rendsz�mhoz!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'EMPTY_POSITION': 
					errormsg='A rendsz�mhoz tartoz� poz�ci�k �resek!';
					showMessage(errormsg,clearObj,2);
					break;
				case 'QUANTITY': 
					errormsg='Nem egyezik a v�rt �s a lerakodott mennyis�g! '+res.ERRORTEXT;
					showMessage(errormsg,clearObj,2);
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a gumi m�r el lett pakolva! helyk�d:'+res.ERRORTEXT;
					showMessage(errormsg,clearObj,2);
					//$('#dataHkod').val(res.ERRORTEXT);
                    //showHkod=true;
					break;
				case 'ALREADY_STARTED': 
					errormsg='M�r van egy elkezdett garnit�ra:<BR>'+res.ERRORTEXT;
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
	$("#gstat").append('<option value="" disabled selected>V�lasszon</option>');
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
	if ((melyseg=='-' || melyseg=='' || melyseg==null)) showMessage('Ment�s el�tt m�rd meg a m�lys�get!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere eset�n t�ltd ki a csere ok�t!');
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
	for (var i = 0;i < result.length;i++){	
		res = result[i];
		if (res.RESULT=='OK') {
			showMessage('T�rl�s rendben');
            $("#dataRendszam").prop('disabled', false);
            $('#dataRendszam').focus();
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
}
OElrak.prototype.hkodSaveInit=function(){
	/* helykod mentes */
	rsz = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
    //showMessage(hkod);
    if (hkod.indexOf("B:")==-1 || (hkod.indexOf("_")>=0 && hkod.indexOf("-")>=0)) {
        showMessage('Nem helyk�d!','dataHkod');
        $('#dataHkod').focus();
    }
    else {
        if (hkod!='') {
            fn = 'elrak.hkodSaveCheck'; /* PDA_ORZOTTHKOD_HKODCHECK */
            ajaxCall(fn,{'rsz':rsz,'hkod':hkod,'login':login_id},true, fn);
        }
        else {
            showMessage('Helyk�d nem lehet �res!');
        }
    }
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

			fn = 'elrak.hkodSave'; /* PDA_ORZOTTHKOD_HKODSAVE */
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
/*
panelInit->getRszInProgress->(#datarendszam.change)->rszChange()->rszAdatokGet->(meres volt, hkod van)hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres volt, hkod nincs)showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres nem volt)->getMelyseg->allapotMentes->allapotMent->(ha van hkod mar)->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                                                                                        ->(ha meg nincs hkod)->showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              
                                                                              
�tn�z�: showReview->reviewRszFilter->reviewRszGet->reviewFilter
*/

