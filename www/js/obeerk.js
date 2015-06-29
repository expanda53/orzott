/* beerkezes */
login_id = '100';
var OBeerk = function(){
	this.initMibizList();
	
}
OBeerk.prototype.initMibizList = function(){
	fn = 'orzott.oBeerkMibizlist';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':login_id},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}
OBeerk.prototype.oBeerkMibizlist = function(result) {
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

OBeerk.prototype.panelInit = function (result) {
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#hAZON").val(res.AZON);
		$("#hMIBIZ").val(res.MIBIZ);
	}
}

OBeerk.prototype.oBeerkRendszamok = function(result) {
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
	ajaxCall('taskReg',{'mibiz':mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	fn = 'orzott.panelInit'; 
	r = ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);
	fn = 'orzott.oBeerkRendszamok';
	ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);

}
OBeerk.prototype.oBeerkRszAdatok = function (result){
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
	rsz = $('#rendszam').val();
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
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	$('.dataDrbKesz').html(res.RESULT);
		else alert('Hiba');
	}
}

OBeerk.prototype.rszJavitas = function () {
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


OBeerk.prototype.updateStart = function (obj) {
	tip=obj.attr('id');
	azon = $('#hAZON').val();
	sorsz = $('#hSORSZ').val();	
	drb = $('.dataDrbVart').html();
	drb2 = $('.dataDrbKesz').html();
	if (drb2<drb) {
		if (tip!='bPlus') {
			/* print */
		}
		fn = 'orzott.oBeerkRszMent';
		r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'login':login_id},true, fn);
	}
	else {
		alert('A beérkezett mennyiség '+drb+' db!');
		
	}

}

OBeerk.prototype.oBeerkRszMent = function(result) {
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	$('.dataDrbKesz').html(res.RESULT);
		else alert('Hiba');
	}
}


OBeerk.prototype.oBeerkReviewGet = function(result) {
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
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'orzott.oBeerkReviewGet';
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}

OBeerk.prototype.folytKesobb=function(){
	fn = 'orzott.oBeerkFolytUpdate';
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OBeerk.prototype.oBeerkFolytUpdate=function(result){
		$('#divreview').hide();
		orzott.initMibizList();
}

OBeerk.prototype.lezarStart = function(){
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
	orzott.oBeerkFolytUpdate(result);
}

OBeerk.prototype.nincsMeg = function(){
		mibiz = $('#hMIBIZ').val();
		sorsz = $('#hSORSZ').val();	
		rsz = $('#rendszam').val();
		fn = 'orzott.oBeerkNincsMeg';
		r = ajaxCall(fn,{'mibiz':mibiz,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
}
OBeerk.prototype.oBeerkNincsMeg = function (result) {
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	$('.dataDrbKesz').html('0');
		else alert('Hiba');
	}
}


/* beerkezes eddig */
