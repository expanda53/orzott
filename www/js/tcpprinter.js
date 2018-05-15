var tcpprinterDialog = {
	show: function(){
		panelName = 'printer';
		$.get( "css/"+panelName+".css", function( data ) {
			css = '<head><style>' + data + '</style></head>';
			$.get( "views/"+panelName+".tpl", function( data ) { 
				tpl = data; 
				$('#divSettings').html(css + tpl);
                $('#divContent').hide();
				$('#divSettings').show();
                $('#divheaderS').html('Címkenyomtató választás');
				tcpprinterDialog.createTable();				
				$('#btNext').bind('click', function() {
					tcpprinterDialog.showNext();
				})
				
			});
			
		})
	},
	createTable:function(){
				sorok = "";
                var connected = function(){
                    //showMessage('nyomtató ok','',2);
                    if (app.printerTplPrefix=="_portrait") {showMessage("BT nyomtató csatlakoztatva. Nyomtatás állítva (RW220)","",2);tcpprinterDialog.showNext();}
                    else
                    if (app.printerTplPrefix=="") {showMessage("BT nyomtató csatlakoztatva. Nyomtatás fektetve (RW420)","",2);tcpprinterDialog.showNext();}
                    else tcpprinterDialog.setOrientation();
                
                    
                        
                }
				for (i=0;i<app.tcpPrinterMax;i++){
                    id=i+1;
					sorok+="<tr>";
					sorok+="<td class=printerid>"+id+"</td>";
					sorok+="<td class=printername>"+id+". nyomtató </td>";
					sorok+="</tr>";
				}	
				

                $("#tableprinter tbody").html(sorok);
                $('#tableprinter tr').bind('click',function(){
                    tr = $(this);
                    app.tcpPrinterNr = tr.find(".printerid").html();
                    tcpprinterDialog.showNext();
                })

				

	},
        
    showNext:function(){
        if (app.currentModule=='') {
            showMenu();
        }
        else {
            $('#divSettings').hide();
            $('#divContent').show();
        }
    }
        
}

/*
  show->createTable->(index.js)app.BTEnabled->connected->setOrientation->showNext->(orzott.js)showMenu/panel elrejtés*/
