var printerDialog = {
	show: function(){
		panelName = 'printer';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divContent').html(css + tpl);
				$('#divContent').show();
				printerDialog.createTable();				
				$('#btNext').bind('click', function() {
					showMenu();
				})
				
			});
			
		})
	},
	createTable:function(){
				sorok = "";
				app.printers.forEach(function(printer){
					sorok+="<tr>";
					sorok+="<td class=printerid>"+printer.id+"</td>";
					if (printer.name=='undefined')	printer.name="";
					sorok+="<td class=printername>"+printer.name+"</td>";
					sorok+="</tr>";
					
				})
				if (sorok=="") {
					showMenu();
				}
				else {
					$("#tableprinter tbody").html(sorok);
					$('#tableprinter tr').bind('click',function(){
						tr = $(this);
						if (app.printerConnected) app.manageConnection(false);
						app.printerId = tr.find(".printerid").html();
						app.printerName = tr.find(".printername").html();
						try {
							app.BTEnabled();
						}
						finally {
							showMenu();
						}
						
					})
				}
				

	}
}
