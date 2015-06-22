var orzott = null;
$.ajaxSetup({ cache: false });
function ajaxCall( func, d,asyn,fn) {
  var res;
  $.ajax({
        type: "POST",
		//url: "http://localhost/orzottsrv/service.php/" + func, /*akh teszt*/
		//url: "http://192.168.1.68:82/orzottsrv/service.php/" + func, /* otthoni eles */
		url: "http://localhost:82/orzottsrv/service.php/" + func, /* otthoni teszt */
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




function showMenu() {
	panelName = 'menu';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data; 
			$('#divContent').html(css + tpl);

			$('#bbeerk').bind('click',function () {
				orzott = new OBeerk();
			}
			) 
			$('#divContent').show();

		});
		
	})
}


$(document).ready(function () {
	showMenu();
})

