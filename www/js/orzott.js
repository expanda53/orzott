function ajaxCall( func, d,asyn,fn) {
  var res;
  $.ajax({
        type: "POST",
		url: "http://localhost/orzottsrv/service.php/" + func, /*akh teszt*/
		//url: "http://192.168.1.68:82/orzottsrv/service.php/" + func, /* otthoni eles */
		//url: "http://localhost:82/orzottsrv/service.php/" + func, /* otthoni teszt */
        data: d,
		async: asyn,
        dataType: "json",
        success: function(data) {
		  res=data; 
		  if (fn) {
			  var myFunc = window[fn];
			  if(typeof myFunc === 'function') {
				myFunc(data);
			  }
			  
		  }
        },
        error: function(data) {
            console.log(data);
			res='ERROR';
        }
  });

  return res;
}

//result=ajaxCall('tesztws',{'op1':'xx'},true, 'tesztfn');



function tesztfn (result) {
for (var i = 0;i < result.length;i++){
	res = result[i];
	css = '';
	$.get( "css/login.css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/login.tpl", function( data ) { 
			tpl = data.replace('<{op1}>',res.op1); 
			$('#divContent').html(css + tpl);
			$('#divContent').show();

		});
		
	})
	
}
	
}
/* beerkezes */
function oBeerkMibizlist(result) {
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
	


function obeerk_init() {
	fn = 'oBeerkMibizlist';
	r = ajaxCall(fn,{'biztip':'MO06', 'login':'100'},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}

function oBeerkRendszamok(result) {
	sor = '';
	$("#rendszam").html('');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#rendszam").append('<option value='+res.TAPADO+'>'+res.TAPADO+'</option>');
	}
	$('#divpanel').show();
}
function oBeerkPanelInit(result) {
	sor = '';

	for (var i = 0;i < result.length;i++){
		res = result[i];
		$(".dataSofor").html(res.MSZAM3);
	}
	
}


function selectTask(id) {
	$('#divmibizlist').hide();
	fn = 'oBeerkPanelInit';
	r = ajaxCall(fn,{'id':id, 'login':'100'},true, fn);
	fn = 'oBeerkRendszamok';
	ajaxCall(fn,{'id':id, 'login':'100'},true, fn);
}
/* beerkezes eddig */


function showMenu() {
	panelName = 'menu';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);

			$('#bbeerk').bind('click',function () {
				obeerk_init()
			}
			) 
			$('#divContent').show();

		});
		
	})
}


$(document).ready(function () {
	showMenu();
})

