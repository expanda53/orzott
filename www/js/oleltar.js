/* leltarazas */
markaUpdate = false;
meretUpdate = false;
mintaUpdate = false;
siUpdate = false;
printing = false;

function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}

var OLeltar = function(){
	this.initMibizList();
	this.mibiz="";
	this.fejazon = 0;
	this.currentItem = "";
	this.currentPosition = '';
    this.currentRsz = '';
    this.meresVisible = false;
}
/* feladat valasztas */
OLeltar.prototype.initMibizList = function(){
    gpanel = new OGPanel();
	fn = 'leltar.mibizList';
	r = ajaxCall(fn,{'biztip':'MO12', 'login':login_id},true, fn);
	/* OLeltar.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az OLeltar.tpl-ben van*/
}
OLeltar.prototype.mibizList = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'oleltar';
	if (result.length>0) {
		res = result[0];
		leltar.mibiz=res.MIBIZ;
		leltar.fejazon=res.FEJAZON;
		css='';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divContent').html(css + tpl);
				//feladat valasztas inditasa
				leltar.selectTask();
				$('#divContent').show();
                $('#divheader').bind('click',function(){
                    app.getDepthMeters();
                })
                $('#bUjHkod').bind('click',function(){
                    $('#divmeres').hide();
                    $('.rszadatok').hide();
                    $('.dcontrol').hide();
                    $('.drendszam').hide();
                    $("#dataRendszam").prop('disabled', false);
                    $('#dataRendszam').val('');
                    leltar.currentPosition="";
                    leltar.currentItem="";
                    leltar.currentRsz = "";  
                    $('#dataHkod').removeAttr('disabled');
                    $('#dataHkod').val('');
                    $('#bUjHkod').hide();
                    $('#dataHkod').focus();
                     
                })
                    
                $('.rszadatok').bind('click',function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    if(event.handled !== true) {
                        clickHelp();
                        leltar.meresVisible = $('#divmeres').is(":visible");
                        if (leltar.meresVisible) $('#divmeres').hide();
                        $.get( "views/gpanel.tpl", function( data ) { 
                                    css='';
                                    tpl = data; 
                                    $('#gpanelcontainer').html(css + tpl);
                                    fnSave = 'leltar.rszAdatokSet';
                                    fnCancel = 'leltar.rszAdatokBack';
                                    gpanel.showGPanel(leltar.rszAdatok,fnSave,fnCancel);
                        });
                        event.handled = true;
                    } else {
                        return false;
                    }

                })	                    
                
			});
			
		})
	//alert(JSON.stringify(res));
	}
	
	

}
OLeltar.prototype.selectTask = function() {
	/* feladat valaszto ajax inditas */
	//app.BTEnabled(null);						

	$('#divheader').html('Őrzött leltár');
	//ajaxCall('leltar.taskReg',{'mibiz':this.mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	
	$("#hAZON").val(leltar.fejazon);
	$("#hMIBIZ").val(leltar.mibiz);
	$('#bFolytMost').hide();
	$('#dataHkod').focus();
	$('#dataHkod').bind('change',function (event) {
		leltar.rszInit();
	})	
	$('#dataRendszam').bind('change',function (event) {
		leltar.rszChange();
	})	

}

/* feladat valasztas eddig */


/* rendszam */
OLeltar.prototype.rszInit = function() {
	/* hkod lelove, rendszam bevitelre valtas */
	$('#dataHkod').attr('disabled','disabled');
	$('#dataRendszam').val('');
    $('#bUjHkod').show();
	$('.drendszam').show();
	$('#dataRendszam').focus();
}

OLeltar.prototype.rszChange = function() {
	/* rendszam lelove, rendszam adatok lekerese */
	rendszam = $('#dataRendszam').val();
    hkod = $('#dataHkod').val();
	azon = leltar.fejazon;
	fn = 'leltar.rszAdatokGet';
	ajaxCall(fn,{'rendszam':rendszam,'fejazon':azon,'hkod':hkod},true, fn);
}

OLeltar.prototype.rszAdatokGet = function(result) {
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
        switch (res.RESULT) {
            case '0':
                //$(".dataCeg").html(res.CEGNEV);
                $("#dataRendszam").prop('disabled', true);
                $('.dataMeret').html(res.MARKA+' '+res.MERET+' '+res.MINTA+' '+res.SI);
                $('.dataFegu').html(res.FE+'/'+res.GU);
                $('.dataFeall').html(res.FEALL);
                leltar.currentRsz=res.SHORTRSZ;
                leltar.currentItem=res.TIP;
                leltar.currentPosition=res.POZ;
                
                leltar.rszAdatok = res;
                feall='';
                if (checkParam(res.FEALL)=='L' && res.FE>0) feall='Lemez';
                if (checkParam(res.FEALL)=='A' && res.FE>0) feall='Alu';
                $(".dataFeall").html(feall);
                
                $('.rszadatok').show();
                $('.dcontrol').show();
                panelName='leltar_meres';
                $.get( "views/"+panelName+".tpl", function( data ) { 
                    rsz = $('#dataRendszam').val();
                    mibiz = $('#hMIBIZ').val();
                    $('#divmeres').html(data);
                    $('#divmeres').show();
                    fn = 'leltar.getMelyseg'; /* query */
                    ajaxCall(fn,{'poz':leltar.currentPosition, 'login':login_id,'tip':leltar.currentItem},true, fn);
                });                        
                break;
            case '1':
                rendszam = $('#dataRendszam').val();
                showMessage('Nem található ilyen rendszám! ' + rendszam);
                $('#dataRendszam').val("");
                $('#dataRendszam').focus();
                leltar.currentPosition="";
                leltar.currentItem="";
                leltar.currentRsz = "";
                break;
            case '2':
                rendszam = $('#dataRendszam').val();
                showMessage(rendszam+': Már leltározva lett!');
                $('#divmeres').hide();
                $('.rszadatok').hide();
                $('.dcontrol').hide();
                $('#dataRendszam').val('');
                $('#dataRendszam').focus();
                leltar.currentPosition="";
                leltar.currentItem="";
                leltar.currentRsz = "";  
                break;
            case '3':
                rendszam = $('#dataRendszam').val();
                showMessage(rendszam+': Nem rakható más helykódra, mint a többi! Helykód:' + res.RESULTTEXT);
                $('#divmeres').hide();
                $('.rszadatok').hide();
                $('.dcontrol').hide();
                $('#dataRendszam').val('');
                $('#dataRendszam').focus();
                leltar.currentPosition="";
                leltar.currentItem="";
                leltar.currentRsz = "";  
                break;
            default:
                showMessage(rendszam+': Ismeretlen hiba!');
                //alert(JSON.stringify(result));
        }
    }
}

OLeltar.prototype.rszAdatokSet = function(rszadatok) {
    leltar.rszAdatok = rszadatok;
    fn = 'leltar.rszAdatokUpdate';
    rendszam = $('#dataRendszam').val();
	ajaxCall(fn,{'rendszam':rendszam,'fejazon':azon,'rszadatok':JSON.stringify(rszadatok),'login':login_id},true, fn);
    
}
OLeltar.prototype.rszAdatokUpdate = function(result) {
    leltar.rszAdatokBack();
    showMessage("Gumi adatok frissítve.");
        
}
OLeltar.prototype.rszAdatokBack = function() {
    //if (leltar.meresVisible) 
        $('#divmeres').show();    
}

    

/* rendszam eddig*/

/* allapot panel */

OLeltar.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="" disabled selected>Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	manualChoice = settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS')!=null && settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS').toUpperCase()=='IGEN';
	if (!manualChoice) $('#gstat').attr('disabled',true);
	$('#divgstat').show();
	
}

OLeltar.prototype.allapotMentes=function(){
	melyseg = $('#gstat').val();
	hkod = $('#dataHkod').val();
	rsz =  $('#dataRendszam').val();
	fn='leltar.rszSave';  /*PDA_ORZOTTLERAK_SORUPDATE*/

	csereok = $('#gcsok').val();
	if ((melyseg=='-' || melyseg=='' || melyseg==null)) showMessage('Mentés előtt mérd meg a mélységet!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere esetén töltd ki a csere okát!');
	}
	else {
        ajaxCall(fn,{'fejazon':leltar.fejazon, 'login':login_id, 'rendszam':rendszam, 'hkod':hkod,'csereok':csereok,'melyseg':melyseg},true, fn);
	}

}
OLeltar.prototype.rszSave = function (result) {
	/* rendszam mentes eredmenye, rsz adatok */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		rendszam = $('#dataRendszam').val();
        switch (res.RESULTTEXT) {
				case 'OK': 		
                    showMessage(rendszam+': OK!');
                    $('#divmeres').hide();
                    $('.rszadatok').hide();
                    $('.dcontrol').hide();
                    $("#dataRendszam").prop('disabled', false);
                    $('#dataRendszam').val('');
                    $('#dataRendszam').focus();
                    leltar.currentPosition="";
                    leltar.currentItem="";
                    leltar.currentRsz = "";
                    break;
                case 'EXISTS':
                    showMessage(rendszam+': Már leltározva lett!');
                    $('#divmeres').hide();
                    $('.rszadatok').hide();
                    $('.dcontrol').hide();
                    $("#dataRendszam").prop('disabled', false);
                    $('#dataRendszam').val('');
                    $('#dataRendszam').focus();
                    leltar.currentPosition="";
                    leltar.currentItem="";
                    leltar.currentRsz = "";                    
                    break;
                default:
                    showMessage(rendszam+': Ismeretlen hiba!');
                    $("#dataRendszam").prop('disabled', false);
                    $('#dataRendszam').val('');
                    $('#dataRendszam').focus();
                    
		}

	}
}
OLeltar.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
    //if ($('#dataHkodWork').html()!='NINCS') elrak.hkodSaveInit();
	//else elrak.showHkod();
}
/* allapot panel eddig */

/* atnezo panel */
OLeltar.prototype.reviewLoad = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendszám</th>"
					+"<th>Helykód</th>"
					+"<th></th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	//leltar.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		//if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
		sorok += '<tr class="'+tdclass+'" id="'+res.RSZSHORT+'">';
		sorok += '<td class="tdrsz">'+res.RSZSHORT+'<br><div class="tpoz">JE:'+res.JE+' BE:'+res.BE+' JH:'+res.JH+' BH:'+res.BH+' POT:'+res.POT+'</div></td>';
		sorok +=  '<td class="tmibiz">'+res.HELY+'</td>'; 
		//sorok +=  '<td class="tpoz">JE:'+res.JE+' BE:'+res.BE+' JH:'+res.JH+' BH:'+res.BH+' POT:'+res.POT+'</td>'; 
		sorok +=  '<td class="tmibiz"><button onclick="leltar.delRszInit(\''+res.RSZSHORT+'\')">Törlés</button></td>'; 
		sorok += '</tr>';
		
	}
	$('.tableReview').html(fej+sorok);
}



OLeltar.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#bFolytMost').show();
	azon = leltar.fejazon;
    leltar.meresVisible = $('#divmeres').is(":visible");
	$('#divpanel').hide();
	$('#gpanelcontainer').hide();
	$('#divmeres').hide();
    
	fn = 'leltar.reviewLoad';
	r = ajaxCall(fn,{'fejazon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}

OLeltar.prototype.delRszInit=function(rendszam){
	/* atnezon sortorles ajax inditas */
  	torles = confirm(rendszam+": Biztos törli a rendszámot a leltárból?");
	if (torles) {
        fn = 'leltar.delRsz';
        azon = leltar.fejazon;
        r = ajaxCall(fn,{'azon':azon,'rendszam':rendszam},true, fn);
    }
}
OLeltar.prototype.delRsz = function(result) {
	/* sortorles ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		rendszam = res.RENDSZAM;
		$('#'+rendszam).hide();
	}

}

OLeltar.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'leltar.folytUpdate';
	azon = leltar.fejazon;
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OLeltar.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	//app.BTDisabled();
	showMenu();
}

OLeltar.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	azon=leltar.fejazon;
	fn = 'leltar.lezarUpdate';
	ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}


OLeltar.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	leltar.folytUpdate(result);
}
OLeltar.prototype.folytMost =function(event){
		event.stopPropagation();
        event.preventDefault();
        if(event.handled !== true) {
			clickHelp();
			$('#divreview').hide();
			$('#divpanel').show();
            if (leltar.meresVisible) $('#divmeres').show();    
            $('#gpanelcontainer').show();
            if ($('#dataRendszam').is(":visible")) $('#dataRendszam').focus();
            else if ($('#dataHkod').is(":visible")) $('#dataHkod').focus();
            
            event.handled = true;
        } else {
            return false;
        }
}
/* atnezo panel eddig */


/* leltar eddig */


//pingPrinter();