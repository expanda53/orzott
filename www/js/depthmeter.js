var depthMeterDialog = {
	show: function(){
		panelName = 'printer';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divSettings').html(css + tpl);
				$('#divSettings').show();
                $('#divheaderS').html('M�lys�gm�r� csatlakoztat�s');
                $('#divContent').hide();
				depthMeterDialog.createTable();				
				
				$('#btNext').bind('click', function() {
					app.getPrinters();
				})
				
			});
			
		})
	},
	createTable:function(){
				sorok = "";
                var connected = function(){
                    showMessage('M�lys�gm�r� OK.','',2)
                    app.getPrinters();
                }
                
				app.depthMeters.forEach(function(meter){
					sorok+="<tr>";
					sorok+="<td class=printerid>"+meter.id+"</td>";
					if (printer.name=='undefined')	meter.name="";
					sorok+="<td class=printername>"+meter.name+"</td>";
					sorok+="</tr>";
					
				})
				if (sorok=="") {
					//showMenu();
					//$('#tplDM').hide();
					app.getPrinters();
				}
				else {
					$("#tableprinter tbody").html(sorok);
					$('#tableprinter tr').bind('click',function(){
						tr = $(this);
						if (app.depthMeterConnected) app.manageConnection2(false,null);
						app.depthMeterId = tr.find(".printerid").html();
						app.depthMeterName = tr.find(".printername").html();
                        $('#btNext').attr('disabled','disabled');
                        $('#tableprinter').attr('disabled','disabled');
						try {
							app.BT2Enabled(connected);						
						}
						finally {
							//app.getPrinters();
						}
					})
				}
				
				

	}
}
/*
  show->createTable->(index.js)app.BT2Enabled->connected->getPrinters
*/