/* beerkezes */
var OBeerk = function(){
	fn = 'oBeerkMibizlist';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':'100'},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}
OBeerk.prototype.mibizList = function(result) {
	panelName = 'obeerk';
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		sor += '<tr id="'+res.MIBIZ+'">';
		sor +=  '<td class="tmibiz">'+res.MIBIZ+'</td>'; 
		sor += '<td>'+res.FUVAR+'</td>'; 
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
	}
}

OBeerk.prototype.getRendszamok = function(result) {
	sor = '';
	$("#rendszam").html('');
	$("#rendszam").append('<option value="-">Válasszon</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#rendszam").append('<option value='+res.TAPADO+'>'+res.TAPADO+'</option>');
	}
	$('#divpanel').show();
}

OBeerk.prototype.selectTask = function(id) {
	$('#divmibizlist').hide();
	fn = 'oBeerkPanelInit'; 
	r = ajaxCall(fn,{'id':id, 'login':'100'},true, fn);
	fn = 'oBeerkRendszamok';
	ajaxCall(fn,{'id':id, 'login':'100'},true, fn);

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
	}
	$('.rszadatok').show();

}

OBeerk.prototype.rszChange = function (){
	rsz = $('#rendszam').val();
	if (rsz!='-') {
		azon = $('#hAZON').val();
		fn = 'oBeerkRszAdatok';
		r = ajaxCall(fn,{'rsz':rsz,'azon':azon},true, fn);
	}
	else $('.rszadatok').hide();
	
}

OBeerk.prototype.printClick = function (obj) {
	id=obj.attr('id');
	alert(id);
}

function oBeerkMibizlist(result){
	orzott.mibizList(result);
}


function oBeerkRendszamok(result) {
	orzott.getRendszamok(result);
}
function oBeerkRszAdatok(result) {
	orzott.oBeerkRszAdatok(result);
}

function oBeerkPanelInit(result) {
	orzott.panelInit(result);
}

function selectTask(id) {
	orzott.selectTask(id);
}

/* beerkezes eddig */
