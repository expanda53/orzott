/* beerkezes */
login_id = '100';
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
		sor += '<tr id="'+res.MIBIZ+'">';
		sor += '<td  class="tmszam3">'+res.FUVAR+'</td>'; 
		sor +=  '<td class="tmibiz">'+res.MIBIZ+'</td>'; 
		sor += '</tr>';
	}
	
	
	css='';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data.replace('<{sorok}>',sor); 
			$('#divContent').html(css + tpl);
			$('#divContent').show();
		});
		
	})

}
OBeerk.prototype.selectTask = function(mibiz,mszam3) {
	/* feladat valaszto ajax inditas */
	//app.BTEnabled();						
	this.meresKell = confirm("Állapotfelméréssel együtt?");
	if (this.meresKell) {
		$('#divheader').html('Õrzött beérkezés - állapot felméréssel - Sofõr:'+mszam3);
	}
	else {
		$('#divheader').html('Õrzött beérkezés - állapot felmérés nélkül - Sofõr:'+mszam3);
	}
	ajaxCall('taskReg',{'mibiz':mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	fn = 'beerk.panelInit'; 
	r = ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);

}
OBeerk.prototype.panelInit = function (result) {
	/* feladat indítás ajax eredménye*/
	app.BTEnabled();
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
		if (res.RESULT!=-1)	$('.dataDrbKesz').html(res.RESULT);
		else alert('Hiba');
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


/*
OBeerk.prototype.nincsMegStart = function(){
	//nincs meg gomb ajax inditas
	mibiz = $('#hMIBIZ').val();
	sorsz = $('#hSORSZ').val();	
	rsz = $('#rendszam').val();
	fn = 'beerk.nincsMeg';
	ajaxCall(fn,{'mibiz':mibiz,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
}
OBeerk.prototype.nincsMeg = function (result) {
	nincs meg gomb ajax eredmenye
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	$('.dataDrbKesz').html('0');
		else alert('Hiba');
	}
}
*/

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
				var muvelet = "";
				if (beerk.currentItem=="bGumi") muvelet = "beérkezés: gumi";
				if (beerk.currentItem=="bFelni") muvelet = "beérkezés: felni";
				if (beerk.currentItem=="bGumiFelni") muvelet = "beérkezés: kerék";
				beerk.currentPosition = '';
				$('#muvelet').html(muvelet);
				fn='beerk.getPositions';
				ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'login':login_id},true, fn);
				fn='beerk.getFelniTip';
				ajaxCall(fn,{'rsz':rsz,'login':login_id},true, fn);
				
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

OBeerk.prototype.getFelniTip=function(result){
	$("#felnitip").html('');
	$("#felnitip").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#felnitip").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
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
					if (beerk.currentItem=="bGumiFelni") ptip = "K";
				
				
				tpl = data.replace('[RENDSZPOZ]',rsz+"_"+ppoz+ptip); 
				tpl += '\r\n';
				var writeOk = function(){
					fn = 'beerk.rszMent';
					r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':beerk.currentItem, 'poz':beerk.currentPosition, 'login':login_id},true, fn);
				}
				var writeError = function(){
					console.log('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
				}
				if (!teszt && beerk.currentItem!='bGumiFelni') bluetoothSerial.write(tpl,writeOk,writeError);
				if (teszt || beerk.currentItem=='bGumiFelni') writeOk();
				
		})
		
		
	}
	var printError = function(){
		console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
		alert('Nyomtatási hiba');
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
		alert('A beérkezett mennyiség '+drb+' db!');
	}
	if (tip!='bGumiFelni') {
		/* print */
		if(typeof bluetoothSerial != 'undefined') {
			bluetoothSerial.isConnected(btPrint, printError);
		}
		else {
			alert('printer not found');
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
			id=beerk.currentPosition;
			$('.bpozicio').attr('disabled','disabled');
			$( '#'+id).addClass( "bpozicioSelected" );
			if (beerk.meresKell) {
				//meres panel betoltese
				$('#divallapot').show();
				$('#bAllapotMent').show();
				$('#bAllapotClose').hide();
				if (beerk.currentItem=='bGumi' || beerk.currentItem=='bGumiFelni') {
					fn = 'beerk.getMelyseg';
					ajaxCall(fn,{'poz':beerk.currentPosition, 'login':login_id},true, fn);
				}
			}
			
			
		}
		else alert('Hiba');
	}
}




OBeerk.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	$('#divgstat').show();
	
}

OBeerk.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	if (this.meresKell && melyseg=='-' ) alert('Mentés elõtt mérd meg a mélységet!');
	else {
		rsz = $('#rendszam').val();
		mibiz = $('#hMIBIZ').val();
		tip=beerk.currentItem;
		fn='beerk.allapotMent';
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip},true, fn);
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
		$("#hSORSZ").val(res.SORSZ);
		beerk.rszAdatok = res.RSZADATOK.split("\n");
		beerk.rszAdatokTEMP = beerk.rszAdatok;
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
	/* atnezo panel ajax eredenye */
	sor = '';
	$('.tableReview tbody').html('');
	var hianydb = 0;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		tdclass='';
		if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
		sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
		sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
		sor += '<td>'+res.DRB+'</td>'; 
		sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
		sor += '</tr>';
		if (res.DRB2<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
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

	if (hianydb!=0){
		$('.labelHiany').html('Hiányzó mennyiség:');
		$('.dataHiany').html(hianydb);
	}
	$('#divreview').show();
}

OBeerk.prototype.reviewRszFilter = function(result) {
	/* atnezo panel filter ajax eredenye */
	sor = '';
	$('.tableReviewFilter tbody').html('');
	var hianydb = 0;
	sor += '<tr >';
	sor += '<td id="rszall">*</td>';
	sor += '</tr>';

	for (var i = 0;i < result.length;i++){
		res = result[i];
		sor += '<tr >';
		sor += '<td id="'+res.RENDSZAM+'">'+res.RENDSZAM+'</td>';
		sor += '</tr>';
		
	}
	$('.tableReviewFilter tbody').append(sor);
	
	$('.tableReviewFilter tbody td').bind('click',function(){
		curTD = $(this);
		filter = curTD.html();
		azon = $('#hAZON').val();
		fn = 'beerk.reviewRszGet';
		r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
	})
	
	
	filter='*';
	azon = $('#hAZON').val();
	fn = 'beerk.reviewRszGet';
	r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
}


OBeerk.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	$('bFolytMost').show();
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'beerk.reviewRszFilter';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	
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
	app.BTDisabled();
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
		alert('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'beerk.lezarUpdate';
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OBeerk.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	beerk.folytUpdate(result);
}
/* atnezo panel eddig */


/* gumipanel */
function checkParam(str) {
	var res = str;
	if (str!=null) {
		res = str.replace(/\//g,'');
		res = res.replace(/\ /g,'');
	}
	return res;
	
}
OBeerk.prototype.showGPanel =function(){
	$('.drendszam, .rszadatok, .dcontrol').hide();
		/* marka */
		fn='getMarka';
		obj='gpMarka';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='A';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});

		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka';
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);

		/* meret */
		fn='getMeret';
		obj='gpMeret';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);

		/* minta */
		fn='getMinta';
		obj='gpMinta';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val()},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);

		/* si */
		fn='getSI';
		obj='gpSI';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19]},true, fn+tengely);
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI';
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind'},false, fn+tengely);
		});
		ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20]},true, fn+tengely);


	$('#divgpanel').show();
	
}

function getMarka(result,tengely){
	def = $("#gpMarka"+tengely).val();
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
function getMarkaA(result){	getMarka(result,'A');}
function getMarkaB(result){	getMarka(result,'B');}
function getMarkaP(result){	getMarka(result,'P');}

function getMeret(result,tengely){
	def = $("#gpMeret"+tengely).val();
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
function getMeretA(result) {getMeret(result,'A')}
function getMeretB(result) {getMeret(result,'B')}
function getMeretP(result) {getMeret(result,'P')}

function getMinta(result,tengely){
	def = $("#gpMinta"+tengely).val();
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
function getMintaA(result) {getMinta(result,'A')}
function getMintaB(result) {getMinta(result,'B')}
function getMintaP(result) {getMinta(result,'P')}

function getSI(result,tengely){
	def = $("#gpSI"+tengely).val();
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
function getSIA(result) {getSI(result,'A')}
function getSIB(result) {getSI(result,'B')}
function getSIP(result) {getSI(result,'P')}
/* gumipanel eddig */
/* beerkezes eddig */
