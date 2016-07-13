/* beerkezes */
/* beerkezes */
markaUpdate = false;
meretUpdate = false;
mintaUpdate = false;
siUpdate = false;
printing = false;

function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}
function pingPrinter(){
	//nem kell, a nyomtatót be lehet konfigolni, hogy ne kapcsoljon ki.
	//! U1 setvar "power.inactivity_timeout" "0"
	/*window.setTimeout(function(){
		if (!printing) {
			alert('ping start');
			var btPrint = function() {
						var tpl = '\r\n';
						var writeOk = function(){
						}
						var writeError = function(){
							console.log('btprint ping write error');
						}
						bluetoothSerial.write(tpl,writeOk,writeError);
			}
			var printError = function(){
				//console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
			}
			if(typeof bluetoothSerial != 'undefined') {
				try {
					printing=true;
					bluetoothSerial.isConnected(btPrint, printError);
				}
				finally {
					printing=false;
				}
			}
			alert('ping finish');
			
		}
		pingPrinter();
	},30*1000);
	*/
}
var OBeerk = function(){
	this.meresKell=false;
	this.initMibizList();
	this.currentItem = "";
	this.currentPosition = '';
}
/* feladat valasztas */
OBeerk.prototype.initMibizList = function(){
	fn = 'beerk.mibizList';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':login_id},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}
OBeerk.prototype.mibizList = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'obeerk';
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		//alert(JSON.stringify(res));
		sor += '<tr id="'+res.MIBIZ+'">';
		sor += '<td  class="tmszam3">'+res.FUVAR+'</td>'; 
		sor +=  '<td class="tkezelo">'+res.KEZELOK+'</td>'; 
		sor +=  '<td class="tdrbsum">'+res.DRBSUM+'</td>'; 
		sor +=  '<td class="tstat">'+res.STATUSZ+'</td>'; 
		sor += '</tr>';
	}
	
	
	css='';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data.replace('<{sorok}>',sor); 
			$('#divContent').html(css + tpl);
			//feladat valasztas inditasa
			$('.tmibizlist tr').bind('click',function(){
				tr = $(this);
				id = tr.attr('id');
				mszam3 = tr.find(".tmszam3").html();
				beerk.selectTask(id,mszam3);
			})
			
			$('#divContent').show();
            $('#divheader').bind('click',function(){
                app.getDepthMeters();
            })
		});
		
	})

}
OBeerk.prototype.selectTask = function(mibiz,mszam3) {
	/* feladat valaszto ajax inditas */
	//app.BTEnabled();						
	//app.BT2Enabled();						
	
	this.meresKell = confirm("Állapot felméréssel?");
	if (this.meresKell) {
		$('#divheader').html('Õrzött beérkezés - állapot felméréssel - Sofõr:'+mszam3);
	}
	else {
		$('#divheader').html('Õrzött beérkezés - állapot felmérés nélkül - Sofõr:'+mszam3);
	}
	ajaxCall('beerk.taskReg',{'mibiz':mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	fn = 'beerk.panelInit'; 
	r = ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);

}
OBeerk.prototype.panelInit = function (result) {
	/* feladat indítás ajax eredménye*/
	//app.BTEnabled();
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#hAZON").val(res.AZON);
		$("#hMIBIZ").val(res.MIBIZ);
	}
	beerk.showReview();
	$('#bFolytMost').hide();
	
}

/* feladat valasztas eddig */

/* fopanel */



OBeerk.prototype.rszJav = function (result) {
	/* mennyiseg javitas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FEGU);
		}
		else alert('Hiba');
	}
	if ( $('#divmeres').is(":visible") ){
		$('#divmeres').hide();
		$('#divpanel').show();	
	}
}

OBeerk.prototype.rszJavitas = function () {
	/* mennyiseg javitas ajax inditas */
	var r = confirm("A rendszámhoz tartozo elozo nyomtatas torlese,mehet?");
	if (r == true) {
		azon = $('#hAZON').val();
		sorsz = $('#hSORSZ').val();	
		rsz = $('#rendszam').val();
		drb2 = $('.dataDrbKesz').html();
		if (drb2>0) {
		  fn = 'beerk.rszJav';
		  r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
		}
	} else {

	}	

}




OBeerk.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}


/* fopanel eddig */



/* allapot panel */
OBeerk.prototype.showAllapotPanel = function(obj){
	this.currentItem = obj.attr('id'); 
	$('#bAllapotClose').show();
	if (this.meresKell || beerk.currentItem=="bGumi") {
		/* ha meressel kerte, vagy meres nelkul de gumit valasztott */
		panelName='meres';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				rsz = $('#rendszam').val();
				mibiz = $('#hMIBIZ').val();
				$('#divmeres').html(css + data);
				$('#divpanel').hide();
				$('#divmeres').show();
				$('#divpozicio').show();				
				var muvelet = 'Rendszám: '+rsz+' ';
                
				if (beerk.currentItem=="bGumi") muvelet += "beérkezés: gumi";
				if (beerk.currentItem=="bFelni") muvelet += "beérkezés: felni";
				if (beerk.currentItem=="bGumiFelni") muvelet += "beérkezés: kerék";
                muvelet += beerk.szlevAllapot;
				beerk.currentPosition = '';
				$('#muvelet').html(muvelet);
				fn='beerk.getPositions';
				ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'login':login_id},true, fn);
				
			});
			
		})
	}
	else {
		/* ha meres nelkul kerte (kiveve gumi eseten, ott ilyenkor is van allapot panel) */
		/* felni eseten automatikus nyomtatas erkezesi sorrendben, nincs jelentosege, hogy melyik felni melyik pozicio*/
		/* kerek eseten csak mennyiseg noveles van, mivel nem merunk es nyomtatni sem kell, mert mossak oket */
		this.selectPosition(null);
	}
}
			
OBeerk.prototype.getPositions=function(result){
	/* mar kivalasztott poziciok: JE:A:13  (pozicio:tipus:melyseg)*/
	if (result[0].RESULT!='') {
		res = result[0].RESULT.split(',');
		for (var i = 0;i < res.length;i++){
			p = res[i].split(':');
			id='b' + p[0];
			$('#'+id).attr('disabled','disabled');
		}
	}
}


OBeerk.prototype.selectPosition = function (obj) {
	/* nyomtatas inditas + mentes ajax*/
	tip = this.currentItem;
	var poz = "";
	if (obj == null) {
		/* felni vagy kerek meres nelkul*/
		poz='auto';
	}
	else poz=obj.attr('id');
	this.currentPosition = poz;
	
	var btPrint = function() {
		//tip = beerk.currentItem;
        if (app.printerConnected || teszt){
            //alert('printer connected');
            rsz = $('#rendszam').val();
            $.get( "views/prn_rendszam_lerak.tpl", function( data ) {
                    //data = $('#tplprint').val();
                        if (beerk.currentPosition=='bJE') ppoz = 1;
                        if (beerk.currentPosition=='bBE') ppoz = 2;
                        if (beerk.currentPosition=='bJH') ppoz = 3;
                        if (beerk.currentPosition=='bBH') ppoz = 4;
                        if (beerk.currentPosition=='bPOT') ppoz = 5;
                        if (beerk.currentPosition=='bJHI') ppoz = 6;
                        if (beerk.currentPosition=='bBHI') ppoz = 7;
                        if (beerk.currentItem=="bGumi") ptip = "A";
                        if (beerk.currentItem=="bFelni") ptip = "F";
                        if (beerk.currentItem=="bGumiFelni") ptip = "M";
                    
                    tpl = data.replace(/\[RENDSZPOZ\]/g,rsz+"_"+ppoz+ptip); 
                    tpl += '\r\n';
                    var writeOk = function(){
                        //alert('writeOk');
                        fn = 'beerk.rszMent';
                        r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':beerk.currentItem, 'poz':beerk.currentPosition, 'login':login_id},true, fn);
                    }
                    var writeError = function(){
                        console.log('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
                        //alert('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
                    }
                    mindenre = settings.getItem('ORZOTT_LERAKODAS_MINDENRE_NYOMTAT').toUpperCase();
                    mindenre_nyomtat = (mindenre =='IGEN');
                    //alert(mindenre);
                    //alert(mindenre_nyomtat);
                    if (!teszt && (beerk.currentItem!='bGumiFelni' || mindenre_nyomtat)) bluetoothSerial.write(tpl,writeOk,writeError);
                    if (teszt || (beerk.currentItem=='bGumiFelni' && !mindenre_nyomtat)) writeOk();
                    
            })
        }
		
		
	}
	var printError = function(){
        //alert('btprint printerror');
		console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
		app.printerConnected=false;
        //alert(app.printerId);
        if (app.printerId!="") {
            app.BTEnabled(btPrint);
        }
		if (app.printerConnected==false) alert('Nyomtatási hiba');
	}
	azon = $('#hAZON').val();
	sorsz = $('#hSORSZ').val();	
	drb = $('.dataDrbVart').html();
	drb2 = $('.dataDrbKesz').html();
	if (beerk.currentPosition=='auto') {
					if (drb2==0) beerk.currentPosition='bJE';
					if (drb2==1) beerk.currentPosition='bBE';
					if (drb2==2) beerk.currentPosition='bJH';
					if (drb2==3) beerk.currentPosition='bBH';
					if (drb2==4) beerk.currentPosition='bPOT';
					if (drb2==5) beerk.currentPosition='bJHI';
					if (drb2==6) beerk.currentPosition='bBHI';
					poz=beerk.currentPosition;

	}
	
	if (drb2>=drb) {
		showMessage('A beérkezett mennyiség '+drb+' db!');
	}
	/* ha a sajcegben a mindenre nyomtat=IGEN, akkor minden gombra nyomtatas van */
	mindenre_nyomtat = (settings.getItem('ORZOTT_LERAKODAS_MINDENRE_NYOMTAT').toUpperCase() == 'IGEN');
    
	if (mindenre_nyomtat || tip!='bGumiFelni' || teszt) {
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
	else {
		/* kerek valasztasnal nincs nyomtatas (mivel mossak oket, es kesobb nyomtatjak)*/
		fn = 'beerk.rszMent';
		ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':tip,'poz':poz,'login':login_id},true, fn);
	}


}

OBeerk.prototype.rszMent = function(result) {
	/* mentes ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FE+'/'+res.GU);
			
			id=beerk.currentPosition;
			//$('.bpozicio').attr('disabled','disabled');
			//$( '#'+id).addClass( "bpozicioSelected" );
			if (beerk.meresKell) {
				//meres panel betoltese
				$('#muvelet').append(' ('+beerk.currentPosition.substring(1)+')');
				$('#divpozicio').hide();
				$('#divallapot').show();
				$('#bAllapotMent').show();
				$('#bAllapotClose').hide();
				if (beerk.currentItem=='bGumi' || beerk.currentItem=='bGumiFelni') {
					fn = 'beerk.getMelyseg';
					ajaxCall(fn,{'poz':beerk.currentPosition, 'login':login_id},true, fn);
				}
			}
            else $('#bAllapotClose').trigger( "click" );
			
			
		}
		else showMessage('Hiba');
	}
}




OBeerk.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-" selected disabled>Mérjen!</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	manualChoice = settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS')!=null && settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS').toUpperCase()=='IGEN';
	if (!manualChoice) $('#gstat').attr('disabled',true);
	$('#divgstat').show();

	
}

OBeerk.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	csereok = $('#gcsok').val();
	if (this.meresKell && (melyseg=='-' || melyseg=='' || melyseg==null)) showMessage('Mentés elõtt mérd meg a mélységet!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere esetén töltd ki a csere okát!');
	}
	else {
		rsz = $('#rendszam').val();
		mibiz = $('#hMIBIZ').val();
		tip=beerk.currentItem;
		fn='beerk.allapotMent';
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip,'csereok':csereok},true, fn);
	}
}
OBeerk.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
}
/* allapot panel eddig */

/* atnezo panel */
OBeerk.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		//$(".dataCeg").html(res.CEGNEV);
		$(".dataMeret").html(res.MERETMINTA);
		$(".dataFegu").html(res.FEGU);
		$(".dataDrbVart").html(res.DRB);
		$(".dataDrbKesz").html(res.CDRB);
		$(".dataDrbFEGU").html(res.FEGUKESZ);
		$("#hSORSZ").val(res.SORSZ);
		beerk.fedb = res.FEDB;
		beerk.gudb = res.GUDB;
        beerk.evszak = res.EVSZAK;
		beerk.rszAdatok = res.RSZADATOK.split("\n");
		beerk.rszAdatokTEMP = beerk.rszAdatok;
		feall='';
		if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
		if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
		$(".dataFeall").html(feall);
        
        beerk.szlevAllapot = '  (Szállítólevélen JE:'+beerk.rszAdatok[0]+' BE:'+beerk.rszAdatok[1]+' JH:'+beerk.rszAdatok[2]+' BH:'+beerk.rszAdatok[3]+' POT:'+beerk.rszAdatok[4]+' JHI:'+beerk.rszAdatok[5]+' BHI:'+beerk.rszAdatok[6]+')';
        
	}
	$('.rszadatok').show();
	$('.dcontrol').show();
	

}

OBeerk.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#rendszam').val();
	/*
	$.get( "views/prn_rendszam_lerak.tpl", function( data ) {
				tpl = data.replace('[LVKODRENDSZ]',rsz); 
				tpl += '\r\n';
				$('#tplprint').val(tpl);
				
		})
	*/
	if (rsz!='-') {
		azon = $('#hAZON').val();
		fn = 'beerk.rszAdatokGet';
		ajaxCall(fn,{'rsz':rsz,'azon':azon},true, fn);
	}
	else {
		$('.rszadatok').hide();
		$('.dcontrol').hide();
	}
	
}

OBeerk.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendszám</th>"
					+"<th>Lerakodandó</th>"
					+"<th>Lerakodott</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	beerk.reviewSet = result;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
		sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sorok += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
		sorok += '<td>'+res.DRB+'</td>'; 
		sorok +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
		sorok += '</tr>';
		if (res.DRB2<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
		}
		
	}
	$('.tableReview').html(fej+sorok);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})

	if (hianydb!=0){
		$('.labelHiany').html('Hiányzó mennyiség:');
		$('.dataHiany').html(hianydb);
	}
	beerk.reviewFilter();

}

OBeerk.prototype.reviewRszFilter = function(result) {
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
		azon = $('#hAZON').val();
		fn = 'beerk.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}


OBeerk.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('bFolytMost').show();
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'beerk.reviewRszFilter';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}

OBeerk.prototype.reviewFilter = function() {
	/* eltérés/összes sor mutatása*/
	val = $('#bElteres').html();
	showAll = (val!='Eltérések');
	if (val=='Eltérések') val='Összes sor';
	else val='Eltérések';
	$('#bElteres').html(val);
	
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = beerk.reviewSet;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (showAll || res.DRB!=res.DRB2) {
			if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
			sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
			sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
			sor += '<td>'+res.DRB+'</td>'; 
			sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
			sor += '</tr>';
		}
		
	}
	$('.tableReview tbody').append(sor);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})
}

OBeerk.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'beerk.folytUpdate';
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OBeerk.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	//app.BTDisabled();
	beerk.initMibizList();
}

OBeerk.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	hianydb = $('.dataHiany').html();
	stat='Z';
	mehet=true;
	if (hianydb!='' && hianydb!=0) {
		var mehet = confirm("Vannak hiányzó tételek, ennek ellenére lezárja?");
		stat='X';
	}
	if (mehet) {
		showMessage('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'beerk.lezarUpdate';
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OBeerk.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	res = result[0];  
    if (res.RESULT!=0) showMessage('A lerakodás lezárása során hiba történt! Lezárás leállítva.');
    else {
        showMessage('A lezárás kész.');
    	beerk.folytUpdate(result);
    }
}
/* atnezo panel eddig */


/* gumipanel */
function checkParam(str) {
	var res = str;
	if (str!=null) {
		res = str.replace(/\//g,'');
		res = res.replace(/\ /g,'');
		res = res.replace(/\./g,'');
		res = res.replace(/\*/g,'');
		res = res.replace(/(?:\r\n|\r|\n)+/g, '');
		
	}
	return res;
	
}
OBeerk.prototype.rszAdatokSet = function (result){
	//alert(JSON.stringify(result));
}

OBeerk.prototype.GPanelOptions = function (saveData){
  /* tengelyek adatainak masolasa, torlese  */
  $('#divGPOptions').show();
  $('#boptclose').bind('click',function(){
		$('#divGPOptions').hide();
  })
  $('#bcopyAB').bind('click',function(){
		beerk.GPanelFunctions('copy','A','B');
  })
  $('#bcopyAP').bind('click',function(){
		beerk.GPanelFunctions('copy','A','P');
  })
  $('#bcopyBA').bind('click',function(){
		beerk.GPanelFunctions('copy','B','A');
  })
  $('#bcopyBP').bind('click',function(){
		beerk.GPanelFunctions('copy','B','P');
  })
  $('#bdelA').bind('click',function(){
		beerk.GPanelFunctions('del','A','');
  })
  $('#bdelB').bind('click',function(){
		beerk.GPanelFunctions('del','B','');
  })
  $('#bdelP').bind('click',function(){
		beerk.GPanelFunctions('del','P','');
  })
  
  
}
OBeerk.prototype.GPanelFunctions = function(func,src,trg){
	if (func=='copy') {
		fn='getMarka';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMarka'+src).val();
		$('#gpMarka'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMinta';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMinta'+src).val();
		$('#gpMinta'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMeret';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMeret'+src).val();
		$('#gpMeret'+trg+' option[value='+def+']').prop('selected', 'selected');

	
		fn='getSI';
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpSI'+src).val();
		$('#gpSI'+trg+' option[value='+def+']').prop('selected', 'selected');
		
	}
	else
	if (func=='del') {
		$('#gpMarka'+src).empty();
        $('#gpMarka'+src).val('');
		$('#gpMeret'+src).empty();
        $('#gpMeret'+src).val('');
		$('#gpMinta'+src).empty();
        $('#gpMinta'+src).val('');
		$('#gpSI'+src).empty();
        $('#gpSI'+src).val('');
	}
	$('#divGPOptions').hide();
		
}

OBeerk.prototype.GPanelClose = function (saveData){
	if (saveData) {
			beerk.evszak = $('#gpEvszak option:selected').val();
            beerk.fedb = $('#gpFelnidb option:selected').val();
			beerk.rszAdatok[7]=$('#gpFelnitip option:selected').val();
			beerk.rszAdatok[9]=$('#gpMarkaA option:selected').text();
			beerk.rszAdatok[10]=$('#gpMeretA option:selected').text();
			beerk.rszAdatok[11]=$('#gpMintaA option:selected').text()
			beerk.rszAdatok[18]=$('#gpSIA option:selected').text();
			
			beerk.rszAdatok[12]=$('#gpMarkaB option:selected').text();
			beerk.rszAdatok[13]=$('#gpMeretB option:selected').text();
			beerk.rszAdatok[14]=$('#gpMintaB option:selected').text();
			beerk.rszAdatok[19]=$('#gpSIB option:selected').text();
			
			beerk.rszAdatok[15]=$('#gpMarkaP option:selected').text();
			beerk.rszAdatok[16]=$('#gpMeretP option:selected').text();
			beerk.rszAdatok[17]=$('#gpMintaP option:selected').text();
			beerk.rszAdatok[20]=$('#gpSIP option:selected').text();
			newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18];
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]!=beerk.rszAdatok[9]) {
				newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];
			}
			else
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]==beerk.rszAdatok[9]) {
				if (beerk.rszAdatok[13]!='' && beerk.rszAdatok[13]==beerk.rszAdatok[10]) {
					if (beerk.rszAdatok[14]!='' && beerk.rszAdatok[14]==beerk.rszAdatok[11]) {
						if (beerk.rszAdatok[19]!='' && beerk.rszAdatok[19]==beerk.rszAdatok[18]) {
							newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]; //egyezik minden
						}
						else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]+'+'+beerk.rszAdatok[19]; //csak SI eltérés
						
					}
					else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];//minta,si eltérés
				}
				else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //meret,minta,si eltérés
			}
			else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //marka,meret,minta,si eltérés
			newContent = newContent.trim();
			if (newContent.indexOf('+')==0) {
				newContent = newContent.replace('+','').trim();
			}
			fn='beerk.rszAdatokSet';
			rsz = $('#rendszam').val();
			azon = $('#hAZON').val();				
			ajaxCall(fn,{'rsz':rsz,'azon':azon,'fedb':beerk.fedb,'data':JSON.stringify(beerk.rszAdatok),'evszak':beerk.evszak,'login':login_id},true, fn);
			$('.dataMeret').html(newContent);
			$(".dataFegu").html(beerk.fedb+'/'+beerk.gudb);
			feall='';
			if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
			if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
			$(".dataFeall").html(feall);
			
	}
	
	$('#gpMarkaA, #gpMarkaB, #gpMarkaP, #gpMeretA, #gpMeretB, #gpMeretP, #gpMintaA, #gpMintaB, #gpMintaP, #gpSIA, #gpSIB, #gpSIP').html('');	
	$('#divgpanel').hide();
	$('.drendszam, .rszadatok, .dcontrol').show();
	
}
OBeerk.prototype.showGPanel =function(){
	$('.drendszam, .rszadatok, .dcontrol').hide();
        /* evszak */
        $('#gpEvszak').val(beerk.evszak);
        $('#gpEvszak').bind('change',function(event){
            /* evszak valtasnal torlom az adatokat */
            beerk.GPanelFunctions('del','A','');
            beerk.GPanelFunctions('del','B','');
            beerk.GPanelFunctions('del','P','');
        });
		/* marka */
		fn='getMarka';
		obj='gpMarka';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='A';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* meret */
		fn='getMeret';
		obj='gpMeret';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* minta */
		fn='getMinta';
		obj='gpMinta';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* si */
		fn='getSI';
		obj='gpSI';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}
		
		//felni:
		felnidef = checkParam(beerk.rszAdatokTEMP[7]);
		if (felnidef=='') felnidef='-';
		$('#gpFelnitip option[value='+felnidef+']').prop('selected', 'selected');
		$('#gpFelnidb option[value='+beerk.fedb+']').prop('selected', 'selected');
		$('#divgpanel').show();
	
}

function getMarka(result,tengely){
	if (markaUpdate==false) {
	markaUpdate=true;
	def = $("#gpMarka"+tengely+' option:selected').val();
	if (def=='mind') def='';
	if (def=='' || def==null) {
		if (tengely=='A') ix=9;
		if (tengely=='B') ix=12;
		if (tengely=='P') ix=15;
		def = beerk.rszAdatokTEMP[ix].trim();
	}
	$("#gpMarka"+tengely).html('');
	$("#gpMarka"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gpMarka"+tengely).append('<option value="'+res.MARKA+'">'+res.MARKA+'</option>');
	}
	if (def!='') $('#gpMarka'+tengely+' option[value='+def+']').prop('selected', 'selected');
	
	}
	markaUpdate=false;
}
function getMarkaA(result){	getMarka(result,'A');}
function getMarkaB(result){	getMarka(result,'B');}
function getMarkaP(result){	getMarka(result,'P');}

function getMeret(result,tengely){
	if (meretUpdate==false) {
	meretUpdate=true;
	def = $("#gpMeret"+tengely+' option:selected').val();
	if (def=='mind') def='';
	optid = '';
	if (def=='' || def==null) {
		if (tengely=='A') ix=10;
		if (tengely=='B') ix=13;
		if (tengely=='P') ix=16;
		def = beerk.rszAdatokTEMP[ix].trim();
	}
	
	$("#gpMeret"+tengely).html('');
	$("#gpMeret"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		optid = checkParam(res.MERET);
		$("#gpMeret"+tengely).append('<option value="'+optid+'">'+res.MERET+'</option>');
	}
	if (def!=null)optid = checkParam(def);
	if (optid!='') $('#gpMeret'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	meretUpdate=false;
}
function getMeretA(result) {getMeret(result,'A')}
function getMeretB(result) {getMeret(result,'B')}
function getMeretP(result) {getMeret(result,'P')}

function getMinta(result,tengely){
	if (mintaUpdate==false) {
	mintaUpdate=true;
	def = $("#gpMinta"+tengely+' option:selected').val();
	if (def=='mind') def='';
	optid='';
	if (def=='' || def==null) {
		if (tengely=='A') ix = 11;
		if (tengely=='B') ix = 14;	
		if (tengely=='P') ix = 17;	
		def = beerk.rszAdatokTEMP[ix].trim();
	}
	
	$("#gpMinta"+tengely).html('');
	$("#gpMinta"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		optid = checkParam(res.MINTA);
		$("#gpMinta"+tengely).append('<option value="'+optid+'">'+res.MINTA+'</option>');
	}
	if (def!=null)optid = checkParam(def);
	if (optid!='') $('#gpMinta'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	mintaUpdate=false;
}
function getMintaA(result) {getMinta(result,'A')}
function getMintaB(result) {getMinta(result,'B')}
function getMintaP(result) {getMinta(result,'P')}

function getSI(result,tengely){
	if (siUpdate==false) {
	siUpdate=true;
	def = $("#gpSI"+tengely+' option:selected').val();
	if (def=='mind') def='';
	if (def=='' || def==null) {
		if (tengely=='A') ix = 18;
		if (tengely=='B') ix = 19;	
		if (tengely=='P') ix = 20;	

		def = beerk.rszAdatokTEMP[ix].trim();
	}

	$("#gpSI"+tengely).html('');
	$("#gpSI"+tengely).append('<option value=mind></option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gpSI"+tengely).append('<option value="'+res.SI+'">'+res.SI+'</option>');
	}
	if (def!='') $('#gpSI'+tengely+' option[value='+def+']').prop('selected', 'selected');
	}
	siUpdate=false;
}
function getSIA(result) {getSI(result,'A')}
function getSIB(result) {getSI(result,'B')}
function getSIP(result) {getSI(result,'P')}


/* gumipanel eddig */
/* beerkezes eddig */


//pingPrinter();