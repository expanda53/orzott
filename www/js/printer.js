var printerDialog = {
	show: function(){
		panelName = 'printer';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divSettings').html(css + tpl);
                $('#divContent').hide();
				$('#divSettings').show();
				printerDialog.createTable();				
				$('#btNext').bind('click', function() {
					printerDialog.showNext();
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
					printerDialog.showNext();
				}
				else {
					$("#tableprinter tbody").html(sorok);
					$('#tableprinter tr').bind('click',function(){
						tr = $(this);
						if (app.printerConnected) app.manageConnection(false,null);
						app.printerId = tr.find(".printerid").html();
						app.printerName = tr.find(".printername").html();
						try {
							app.BTEnabled(null,null);
						}
						finally {
							printerDialog.showNext();
						}
						
					})
				}
				

	},
    showNext:function(){
        if (app.currentModule=='') showMenu();
        else {
            $('#divSettings').hide();
            $('#divContent').show();
        }
    }
        
}
