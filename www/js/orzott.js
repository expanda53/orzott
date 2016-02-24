var beerk = null;
var elrak = null;
var teszt = false;
$.support.cors=true;
$.ajaxSetup({ cache: false });
function ajaxCall( func, d,asyn,fn) {
  var res;
  console.debug('ajax:'+func+' data:'+JSON.stringify(d));
  $.ajax({
        type: "POST",
		//url: "http://192.168.22.200/orzottsrv/service.php/" + func, /* akh local teszt */
		//url: "http://192.168.1.105/orzottsrv/service.php/" + func, /* otthoni eles */
		url: "http://redmine.akh.hu/orzott_api/service.php/" + func, /* akh eles */
		//url: "http://192.168.22.144/orzott_api/service.php/" + func, /* akh eles */
		
        data: d,
		async: asyn,
        dataType: "json",
        success: function(data) {
			//console.debug('ajax success:'+fn+' data:'+JSON.stringify(data));
			res=data; 
			if (fn) {
				f=fn.split(".");
				if (f.length>1) {
					var myFunc = window[f[0]][f[1]];
				}
				else {
					var myFunc = window[fn];
				}
				if(typeof myFunc === 'function') {
					//console.debug('ajax success,start func:'+fn+' data:'+JSON.stringify(data));
					myFunc(data);
				}
			  
			}
        },
        error: function(data) {
            console.debug('ajax error:'+func+' data:'+JSON.stringify(data));
			//alert('ajax error:'+func+' data:'+JSON.stringify(data));
			res='ERROR';
        }
  });

  return res;
}


showMessage =function (msg, clearObj ){
	$('#dmsg .msgtxt').html(msg);
	$('#dmsg').show();

	window.setTimeout(function(){
		$('#dmsg').hide();
		if (clearObj!='') {
			$('#'+clearObj).val('');
		}
	},3*1000);
}


function showMenu() {
	panelName = 'menu';
	app.currentModule = "menu";
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);
			$('#bkiadas').bind('click',function () {
				app.currentModule='kiadas';
				kiadas = new OKiadas();
			}) 
			$('#bbeerk').bind('click',function () {
				app.currentModule='beerk';
				beerk = new OBeerk();
			}) 
			$('#bhkod').bind('click',function () {
				app.currentModule='elrak';
				elrak = new OElrak();
			}) 
			$('#bleltar').bind('click',function () {
				app.currentModule='leltar';
				leltar = new OLeltar();
			}) 

			$('#blogout').bind('click',function () {
				showLogin();
			}) 

			$('#divContent').show();

		});
		
	})
}

function showLogin() {
	app.BT2Disabled();
	app.BTDisabled();
	panelName = 'login';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);
			$('#divContent').show();

		});
		
	})
}

function orzottLogin(){
		user = $('.divinput').text();
		fn='checkLogin'
		ajaxCall(fn,{'user':user},true, fn);
}
function checkLogin(result){
	if (result!='undefined' && result[0].RCOUNT==0) {
		alert('Nem megfelelõ felhasználói kód!');
	}
	else {
		login_id=$('.divinput').text();
		login_id = login_id.replace(/(?:\r\n|\r|\n|\t)+/g, '');
		app.getDepthMeters();
	}
}

$(document).ready(function () {
	showLogin();
})

