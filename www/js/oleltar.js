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
                    
                $('.rszadatok').bind('click',function (event) {
                    event.stopPropagation();
                    event.preventDefault();
                    if(event.handled !== true) {
                        clickHelp();
                        $.get( "views/gpanel.tpl", function( data ) { 
                                    css='';
                                    tpl = data; 
                                    $('#gpanelcontainer').html(css + tpl);
                                    fn = 'leltar.rszAdatokSet';
                                    gpanel.showGPanel(leltar.rszAdatok,fn);
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

	$('#divheader').html('Õrzött leltár');
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
	$('.drendszam').show();
	$('#dataRendszam').focus();
}

OLeltar.prototype.rszChange = function() {
	/* rendszam lelove, rendszam adatok lekerese */
	rendszam = $('#dataRendszam').val();
	azon = leltar.fejazon;
	fn = 'leltar.rszAdatokGet';
	ajaxCall(fn,{'rendszam':rendszam,'fejazon':azon},true, fn);
}

OLeltar.prototype.rszAdatokGet = function(result) {
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
        if (res.RESULT==0) {
            //$(".dataCeg").html(res.CEGNEV);
            $('.dataMeret').html(res.MARKA+' '+res.MERET+' '+res.MINTA+' '+res.SI);
            $('.dataFegu').html(res.FE+'/'+res.GU);
            $('.dataFeall').html(res.FEALL);
            
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
                rsz = $('#rendszam').val();
                mibiz = $('#hMIBIZ').val();
                $('#divmeres').html(data);
                $('#divmeres').show();
                fn = 'leltar.getMelyseg'; /* query */
                ajaxCall(fn,{'poz':leltar.currentPosition, 'login':login_id,'tip':leltar.currentItem},true, fn);
            });        
        }
        else {
            alert('Nem található ilyen rendszám!');
        }
	}

    
    
}
OLeltar.prototype.rszAdatokSet = function(rszadatok) {
    leltar.rszAdatok = rszadatok;
    fn = 'leltar.rszAdatokUpdate';
	ajaxCall(fn,{'rendszam':rendszam,'fejazon':azon,'rszadatok':JSON.stringify(rszadatok),'login':login_id},true, fn);
    
}
OLeltar.prototype.rszAdatokUpdate = function(result) {
    alert('rszadatok update');
}
/*
OLeltar.prototype.rszChange = function() {
	// rendszam lelove, mentes inditasa
	rendszam = $('#dataRendszam').val();
	hkod = $('#dataHkod').val();
	fn = 'leltar.rszSave';
	ajaxCall(fn,{'fejazon':this.fejazon, 'login':login_id, 'rendszam':rendszam, 'hkod':hkod},true, fn);
}
*/
    
OLeltar.prototype.rszSave = function (result) {
	/* rendszam mentes eredmenye, rsz adatok */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		rendszam = $('#dataRendszam').val();
		$('.dataRSZ').html(rendszam);
		$('#dataRendszam').val('');
		$('.dataMeret').html(res.MARKA+' '+res.MERET+' '+res.MINTA+' '+res.SI);
		$('.dataFegu').html(res.FE+'/'+res.GU);
		$('.dataFeall').html(res.FEALL);
		$('.rszadatok').show();
		if (res.RESULT==0)	{
			$('#labelStatus').html(rendszam+': OK');
			$('#labelStatus').attr('class','labelStatusOK');
		}
		else {
			$('#labelStatus').html(rendszam+': Hiba!');
			$('#labelStatus').attr('class','labelStatusERROR');
			alert('Hiba');
		}
	}
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
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	
	rsz = $('#rendszam').val();
	mibiz = $('#hMIBIZ').val();
	tip=elrak.currentItem;
	fn='leltar.allapotMent'; /*PDA_ORZOTTLERAK_ALLAPOTMENT*/

	csereok = $('#gcsok').val();
	if ((melyseg=='-' || melyseg=='' || melyseg==null)) showMessage('Mentés elõtt mérd meg a mélységet!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere esetén töltd ki a csere okát!');
	}
	else {
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip,'csereok':csereok},true, fn);
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
		sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sorok += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
		sorok +=  '<td class="tmibiz">'+res.HELYKOD+'</td>'; 
		sorok +=  '<td class="tmibiz"><button onclick="leltar.delRszInit(\''+res.RENDSZAM+'\')">Törlés</button></td>'; 
		sorok += '</tr>';
		
	}
	$('.tableReview').html(fej+sorok);
}



OLeltar.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#bFolytMost').show();
	azon = this.fejazon;
	$('#divpanel').hide();
	fn = 'leltar.reviewLoad';
	r = ajaxCall(fn,{'fejazon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}

OLeltar.prototype.delRszInit=function(rendszam){
	/* atnezon sortorles ajax inditas */
	fn = 'leltar.delRsz';
	azon = leltar.fejazon;
	r = ajaxCall(fn,{'azon':azon,'rendszam':rendszam},true, fn);
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
/* atnezo panel eddig */


/* leltar eddig */


//pingPrinter();