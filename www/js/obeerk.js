/* beerkezes */
login_id = '100';
var OBeerk = function(){
	this.meresKell=false;
	this.initMibizList();
	this.currentItem = "";
}
OBeerk.prototype.initMibizList = function(){
	fn = 'orzott.oBeerkMibizlist';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':login_id},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}
OBeerk.prototype.oBeerkMibizlist = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'obeerk';
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		sor += '<tr id="'+res.MIBIZ+'">';
		sor += '<td>'+res.FUVAR+'</td>'; 
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

OBeerk.prototype.oBeerkRendszamok = function(result) {
	/* rendszam lista eredménye*/
	sor = '';
	$("#rendszam").html('');
	$("#rendszam").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#rendszam").append('<option value='+res.TAPADO+'>'+res.TAPADO+'</option>');
	}
	$('#divpanel').show();
}

OBeerk.prototype.selectTask = function(mibiz) {
	/* feladat valaszto ajax inditas */
	//app.BTEnabled();						
	this.meresKell = confirm("Állapotfelméréssel együtt?");
	if (this.meresKell) {
		$('#divheader').html('Õrzött beérkezés - állapot felméréssel');
	}
	else {
		$('#divheader').html('Õrzött beérkezés - állapot felmérés nélkül');
	}
	ajaxCall('taskReg',{'mibiz':mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	fn = 'orzott.panelInit'; 
	r = ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);
	fn = 'orzott.oBeerkRendszamok';
	ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);

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
	
}

OBeerk.prototype.oBeerkRszAdatok = function (result){
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];

		$(".dataSofor").html(res.MSZAM3);
		$(".dataCeg").html(res.CEGNEV);
		$(".dataMeret").html(res.MERETMINTA);
		$(".dataFegu").html(res.FEGU);
		$(".dataDrbVart").html(res.DRB);
		$(".dataDrbKesz").html(res.CDRB);
		$("#hSORSZ").val(res.SORSZ);
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
		fn = 'orzott.oBeerkRszAdatok';
		r = ajaxCall(fn,{'rsz':rsz,'azon':azon},true, fn);
	}
	else {
		$('.rszadatok').hide();
		$('.dcontrol').hide();
	}
	
}
OBeerk.prototype.oBeerkRszJav = function (result) {
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
		  fn = 'orzott.oBeerkRszJav';
		  r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
		}
	} else {

	}	

}

OBeerk.prototype.showPozPanel = function(obj) {
	this.melysegMeres(obj);
}

OBeerk.prototype.updateStart = function (obj) {
	/* nyomtatas inditas + mentes ajax*/
	tip = this.currentItem;
	var poz = "";
	if (obj == null) {tip='bPlus';poz='bJE';}
	else poz=obj.attr('id');
	this.currentPosition = poz;
	var orzott = this;
	var btPrint = function() {
		//tip = orzott.currentItem;
		rsz = $('#rendszam').val();
		$.get( "views/prn_rendszam_lerak.tpl", function( data ) {
				//data = $('#tplprint').val();
				tpl = data.replace('[LVKODRENDSZ]',rsz); 
				tpl += '\r\n';
				var writeOk = function(){
					fn = 'orzott.oBeerkRszMent';
					r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':orzott.currentItem, 'poz':orzott.currentPosition, 'login':login_id},true, fn);
				}
				var writeError = function(){
					console.log('btprint write error');
				}
				bluetoothSerial.write(tpl,writeOk);
				
		})
		
		
	}
	
	azon = $('#hAZON').val();
	sorsz = $('#hSORSZ').val();	
	drb = $('.dataDrbVart').html();
	drb2 = $('.dataDrbKesz').html();
	if (drb2<drb) {
		if (tip!='bPlus') {
			/* print */
			/*  */
			if(typeof bluetoothSerial != 'undefined') {
				bluetoothSerial.isConnected(btPrint, function(){console.log('btprint error')});
			}
			else {
				alert('printer not found');
				
			}
			/*  */
		}
		else {
			fn = 'orzott.oBeerkRszMent';
			r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':'','poz':'','login':login_id},true, fn);
		}
	}
	else {
		alert('A beérkezett mennyiség '+drb+' db!');
		
	}

}

OBeerk.prototype.oBeerkRszMent = function(result) {
	/* mentes ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			id=orzott.currentPosition;
			if (orzott.meresKell) {
				$('#'+id).attr('disabled','disabled');
				//meres panel betoltese
			}
			
			
		}
		else alert('Hiba');
	}
}


OBeerk.prototype.oBeerkReviewGet = function(result) {
	/* atnezo panel ajax eredenye */
	sor = '';
	$('.tableReview tbody').html('');
	var hianydb = 0;
	for (var i = 0;i < result.length;i++){
		res = result[i];
		sor += '<tr id="'+res.RENDSZAM+'">';
		sor += '<td>'+res.RENDSZAM+'</td>';
		sor += '<td>'+res.DRB+'</td>'; 
		sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
		sor += '</tr>';
		if (res.DRB2<res.DRB) {
			hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
		}
		
	}
	$('.tableReview tbody').append(sor);
	if (hianydb!=0){
		$('.labelHiany').html('Hiányzó mennyiség:');
		$('.dataHiany').html(hianydb);
	}
	$('#divreview').show();
}


OBeerk.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'orzott.oBeerkReviewGet';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}

OBeerk.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'orzott.oBeerkFolytUpdate';
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OBeerk.prototype.oBeerkFolytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	orzott.initMibizList();
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
		fn = 'orzott.oBeerkLezarUpdate';
		r = ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OBeerk.prototype.oBeerkLezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	orzott.oBeerkFolytUpdate(result);
}

OBeerk.prototype.nincsMeg = function(){
	/* nincs meg gomb ajax inditas */
	mibiz = $('#hMIBIZ').val();
	sorsz = $('#hSORSZ').val();	
	rsz = $('#rendszam').val();
	fn = 'orzott.oBeerkNincsMeg';
	ajaxCall(fn,{'mibiz':mibiz,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
}
OBeerk.prototype.oBeerkNincsMeg = function (result) {
	/* nincs meg gomb ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	$('.dataDrbKesz').html('0');
		else alert('Hiba');
	}
}

OBeerk.prototype.melysegMeres = function(obj){
	this.currentItem = obj.attr('id'); 
	var orzott = this;
	panelName='meres';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			rsz = $('#rendszam').val();
			fn='orzott.getFelniTip';
			$('#divmeres').html(css + data);
			$('#divpanel').hide();
			$('#divmeres').show();
			var muvelet = "";
			if (orzott.currentItem=="bGumi") muvelet = "beérkezés: gumi";
			if (orzott.currentItem=="bFelni") muvelet = "beérkezés: felni";
			if (orzott.currentItem=="bGumiFelni") muvelet = "beérkezés: kerék";
			$('#muvelet').html(muvelet);
			ajaxCall(fn,{'rsz':rsz,'login':login_id},true, fn);
			
		});
		
	})
}

OBeerk.prototype.getFelniTip=function(result){
	sor = '';
	$("#felnitip").html('');
	$("#felnitip").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#felnitip").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	
}

/* beerkezes eddig */
