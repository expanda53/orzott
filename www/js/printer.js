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
                var connected = function(){
                    showMessage('nyomtató ok','',2);
                    printerDialog.showNext();
                        
                }
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
                        $('#btNext').attr('disabled','disabled');
                        $('#tableprinter').attr('disabled','disabled');
                        
						try {
							app.BTEnabled(connected);
						}
						finally {
							
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
