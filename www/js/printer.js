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
                $('#divheaderS').html('Nyomtat� csatlakoztat�s');
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
                    //showMessage('nyomtat� ok','',2);
                    if (app.printerTplPrefix=="_portrait") {showMessage("Nyomtat� csatlakoztatva. Nyomtat�s �ll�tva (RW220)","",2);printerDialog.showNext();}
                    else
                    if (app.printerTplPrefix=="") {showMessage("Nyomtat� csatlakoztatva. Nyomtat�s fektetve (RW420)","",2);printerDialog.showNext();}
                    else printerDialog.setOrientation();
                
                    
                        
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
    setOrientation:function(){
        app.printerTplPrefix="_portrait";
        if(confirm("Fektetve(OK) vagy �ll�tva nyomtat(M�gse)?")) {
            app.printerTplPrefix="";
        }
        printerDialog.showNext();
        
    },
        
    showNext:function(){
        if (app.currentModule=='') showMenu();
        else {
            $('#divSettings').hide();
            $('#divContent').show();
        }
    }
        
}

/*
  show->createTable->(index.js)app.BTEnabled->connected->setOrientation->showNext->(orzott.js)showMenu/panel elrejt�s*/
