var beerk = null;
var elrak = null;
var teszt = true;
$.support.cors=true;
$.ajaxSetup({ cache: false });
function ajaxCall( func, d,asyn,fn) {
  var res;
  console.debug('ajax:'+func+' data:'+JSON.stringify(d));
  $.ajax({
        type: "POST",
		url: "http://redmine.akh.hu/orzott_api/service.php/" + func, 
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
			res='ERROR';
            ajaxError(func);
        }
  });

  return res;
}

function ajaxError(func){
    alert(func);
}




function showMenu() {
	$('#divSettings').hide();
    panelName = 'menu';
	app.currentModule = "menu";
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);
            $('#divheader').bind('click',function(){
                app.getDepthMeters();
            })
            
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
			$('#bszortir').bind('click',function () {
				app.currentModule='szortir';
				szortir = new OSzortir();
			}) 

			$('#blogout').bind('click',function () {
				showLogin();
			}) 
			settings_to_users = settings.getItem('ORZOTT_BEALLITASOKAT_LATHAT');
			if (1==2 && settings_to_users != null && settings_to_users.indexOf(login_id)>-1) {
				$('#bsettings').show();
			}
			$('#divContent').show();

		});
		
	})
}

function showLogin() {
	/* depthmeter */
    app.BT2Disabled();
    /* printer */
	app.BTDisabled();
    app.currentModule='';
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
		fn='checkLogin'; /* query */
		ajaxCall(fn,{'user':user},true, fn);
}
function checkLogin(result){
	if (result!='undefined' && (result[0].RCOUNT==0 || result[0].RCOUNT=='')) {
		showMessage('Nem megfelel� felhaszn�l�i k�d!');
	}
    else
    if (result!='undefined' && (result[0].TELEP=='')) {
		showMessage('Nincs a kezel�h�z telep rendelve!');
	}
	else {	
		login_id=$('.divinput').text();
		login_id = login_id.replace(/(?:\r\n|\r|\n|\t)+/g, '');
		fn = 'loadSettings'; /* query */
		r = ajaxCall(fn,{},true, fn);

		app.getDepthMeters();
	}
}

function loadSettings(result) {
	if (settings.items==null) settings.setItems(result);
}


if (teszt) {
    $(document).ready(function () {
        showLogin();
    })
}

/*
    showLogin->orzottLogin->checkLogin->loadSettings, (index.js)app.getDepthMeters->(depthmeter.js)depthmeterDialog.show  ((printer.js)printerDialog.show) ->showMenu
*/