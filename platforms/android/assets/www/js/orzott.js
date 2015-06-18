function ajaxCall( func, d,asyn,fn) {
  var res;
  $.ajax({
        type: "POST",
        //url: "http://localhost/orzottsrv/service.php/" + func,
		url: "http://192.168.1.68:82/orzottsrv/service.php/" + func,
		//url: "http://localhost:82/orzottsrv/service.php/" + func,
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

function obeerk_init() {
	panelName = 'obeerk';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);
			$('#divContent').show();

		});
		
	})

}

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

