/* szortirozas */


function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}

var OSzortir = function(){
	this.initMibizList();
	this.mibiz="";
	this.fejazon = 0;
	this.currentItem = "";
	this.currentPosition = '';
}
/* feladat valasztas */
OSzortir.prototype.initMibizList = function(){
	fn = 'szortir.mibizList';
	r = ajaxCall(fn,{'biztip':'MO03', 'login':login_id},true, fn);
	/* OSzortir.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az OSzortir.tpl-ben van*/
}
OSzortir.prototype.mibizList = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'oszortir';
	if (result.length>0) {
		res = result[0];
		szortir.mibiz=res.MIBIZ;
		szortir.fejazon=res.AZON;
		css='';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divContent').html(css + tpl);
				//feladat valasztas inditasa
				szortir.selectTask();
				$('#divContent').show();
                /*
                $('#divheader').bind('click',function(){
                    app.getDepthMeters();
                })
                */
                
			});
			
		})
	//alert(JSON.stringify(res));
	}
	
	

}
OSzortir.prototype.selectTask = function() {
	/* feladat valaszto ajax inditas */
	//app.BTEnabled(null);						

	$('#divheader').html('Õrzött szortir');
	//ajaxCall('szortir.taskReg',{'mibiz':this.mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	
	$("#hAZON").val(szortir.fejazon);
	$("#hMIBIZ").val(szortir.mibiz);
	szortir.rszInit();
	$('#dataRendszam').bind('change',function (event) {
		szortir.rszChange();
	})	

}

/* feladat valasztas eddig */


/* rendszam */
OSzortir.prototype.rszInit = function() {
	/* rendszam bevitel */
	$('#dataRendszam').val('');
    $('.dataRSZ').hide();
	$('.drendszam').show();
	$('#dataRendszam').focus();
}

OSzortir.prototype.rszChange = function() {
	/* rendszam lelove, adatok beolvasasa */
    $('.rszadatok').hide();
	rendszam = $('#dataRendszam').val();
	fn = 'szortir.getRszDetails';
	ajaxCall(fn,{'azon':this.fejazon, 'login':login_id, 'rsz':rendszam},true, fn);
}

OSzortir.prototype.getRszDetails = function (result) {
	rendszam = $('#dataRendszam').val();
    if (result.length>0) {
        res = result[0];    
        $('.dataRSZ').html(rendszam);
        if (res.RESULT>0) {
            //$('.dataCikk').html(res.MARKA+' '+res.MERETMINTA);
            //$('.dataFegu').html(res.FEGU);
            //$('.dataFeall').html(res.FEALL);
            //$('.dataPoz').html(res.POZICIO);
            //$('.dataGSTAT').html(res.GSTAT);
            //$('.dataCegnev').html(res.CEGNEV);
            $('#dataMszam3').html(res.MSZAM3);
            //$('.dataRaktarban').html(res.RAKTARBAN);
            $('#dataJarat').html(res.SORREND);
            $('#dataOsszdrb').html(res.ODRB);
            //$('#dataKeszdrb').html(res.ODRB2);
            $('.dataRSZ').show();
            $('.rszadatok').show();
            
            fn = 'szortir.rszSave';
            ajaxCall(fn,{'azon':szortir.fejazon, 'login':login_id, 'rsz':rendszam},true, fn);
            
        }
        if (res.RESULT==0) showMessage('Nincs ilyen rendszám a szortír listán!','');
        if (res.RESULT==-1) showMessage('Lekérdezési hiba!','');
    }
    $('#dataRendszam').val('');    
}

OSzortir.prototype.rszSave = function (result) {
	/* rendszam mentes eredmenye */
for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULTTEXT=='OK') {
			errormsg = res.RESULTTEXT;
            $('#dataRendszam').val('');
            $('#dataKeszdrb').html(res.ODRB2);            
			showMessage(errormsg,'',1);
		}
		else {
			errormsg='';
			switch (res.RESULTTEXT) {
				case 'NOT_FOUND': 
					errormsg='Nem található ilyen rendszám a szortírozandó abroncsok között!';
					break;
				case 'ALREADY_DONE': 
					errormsg='Ez a pozíció már szortírozva lett!';
                    $('#dataKeszdrb').html(res.ODRB2);
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
/* rendszam eddig*/


/* atnezo panel */
OSzortir.prototype.reviewLoad = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	
	$('.tableReview').empty();
	var hianydb = 0;
	//szortir.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sorok += '<td class="tdrsz">';
        sorok += '<span class="reviewData">'+res.RENDSZAM+'</span>';
		sorok +=  ' Járat:'+'<span class="reviewData">'+res.JARAT+'</span>'; 
        sorok +=  ' Hiányzik:'+'<span class="reviewData">'+res.HIANY+'</span>'; 
        sorok +=  '<br>';
        sorok +=  '<span class="reviewData">'+res.MERETMINTA+'</span>'; 
        sorok +=  ' Helykód:'+'<span class="reviewData">'+res.HELYKOD+'</span>';
        sorok += '</td>'; 
		sorok += '</tr>';
        hianydb = parseInt(hianydb) + parseInt(res.HIANYDB);
		
	}
	if (hianydb!=0){
		$('.labelHiany').html('Szortírozandó:');
		$('.dataHiany').html(hianydb);
	}
	$('.tableReview').html(sorok);
}



OSzortir.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('#bFolytMost').show();
	azon = this.fejazon;
	$('#divpanel').hide();
	fn = 'szortir.reviewLoad';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}


OSzortir.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'szortir.folytUpdate';
	azon = szortir.fejazon;
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OSzortir.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	//app.BTDisabled();
	showMenu();
}

OSzortir.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	azon=szortir.fejazon;
	fn = 'szortir.lezarUpdate';
	ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}


OSzortir.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	szortir.folytUpdate(result);
}
/* atnezo panel eddig */


/* leltar eddig */


//pingPrinter();