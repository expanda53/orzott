/* gyors nyomtatas */
/*
  a beirt szoveget nyomtatja

  */

printing = false;
tcpsocket = false;
function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}
var OQPrint = function(){
	this.panelInit();
}
OQPrint.prototype.panelInit = function () {
	/* kezdõ panel megjelenítése*/
	panelName='oqprint';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
            tpl = data; 
			$('#divContent').html(css + tpl);		
			$('#divContent').show();

			$('#bPrint').bind('click',function () {	
                printtext = $('#dataRendszam').val();
				qprint.print(printtext);
			})
            $('#dataRendszam').focus();

			$('#bMenu').bind('click',function () {
				showMenu();
			})	
            
            $('#btabnum').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').show();
                $('.divajbuttons').hide();
                $('.divkzbuttons').hide();
                $('.divspecbuttons').hide();
            });
            $('#btabaj').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').hide();
                $('.divajbuttons').show();
                $('.divkzbuttons').hide();
                $('.divspecbuttons').hide();
            });
            $('#btabkz').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').hide();
                $('.divajbuttons').hide();
                $('.divkzbuttons').show();
                $('.divspecbuttons').hide();
            });
            $('#btabspec').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').hide();
                $('.divajbuttons').hide();
                $('.divkzbuttons').hide();
                $('.divspecbuttons').show();
            });
        

            $('.bnum').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                char = $(this).text();		
                content = $('#dataRendszam').val() + char;
                $('#dataRendszam').val(content);
                
                
            });
            $('.bbacksp').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                content = $('#dataRendszam').val();
                content = content.substring(0,content.length-1);
                $('#dataRendszam').val(content);
            });
            $('.divajbuttons').show();        
			
		})
	})

}

OQPrint.prototype.print = function (printtext) {
	/* nyomtatas inditas + mentes ajax*/
    rszprint = printtext.toUpperCase();

    rsztomb = rszprint.split("_");
    poz="";
    tip="";
    rsz="";
    pozstr="";
    tipstr="";
    
    if (rsztomb.length>1) {
        rsz = rsztomb[0];
        poz = rsztomb[1].substring(0,1);
        tip = rsztomb[1].substring(1);
        if (poz=="1") pozstr = "JE";
        if (poz=="2") pozstr = "BE";
        if (poz=="3") pozstr = "JH";
        if (poz=="4") pozstr = "BH";
        if (poz=="5") pozstr = "POT";
        if (poz=="6") pozstr = "JHI";
        if (poz=="7") pozstr = "BHI";
        if (tip=="A") tipstr="Gumi";
        if (tip=="F") tipstr="Felni";
        if (tip=="M") tipstr="Kerék";
    }
    else rsz=rszprint;

	var btPrintInit = function() {
        showMessage('Nyomtató OK.');
        btPrint();
    }
	var btPrint = function() {
        app.btRefresh();
        if (app.printerConnected || teszt){
            
            $.get( "views/prn_gyors"+app.printerTplPrefix+".tpl", function( data ) {

                    //alert(rsztomb.length+ " pozstr:" + pozstr +" tipstr:" +tipstr+" rsz:" + rsz + " poz:" + poz +" tip:" +tip);
                    tpl = data;
                    tpl = tpl.replace(/\[RENDSZ\]/g,rsz); 
                    tpl = tpl.replace(/\[TIPUS\]/g,tipstr); 
                    tpl = tpl.replace(/\[POZSTR\]/g,pozstr); 
                    tpl = tpl.replace(/\[RENDSZPOZ\]/g,rszprint); 
                    tpl += '\r\n';
                
                    var writeOk = function(){
                        $('#dataRendszam').val('');
                        $('#dataRendszam').focus();
                    }
                    var writeError = function(){
                        //console.log('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
                        showMessage('Nyomtatási hiba');
                    }
                    bluetoothSerial.write(tpl,writeOk,writeError);
            })
        }
        else {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
		printing=false;
		
	}
	var printError = function(){
		console.log('btprint error: ' + rszprint);
		app.printerConnected=false;
        if (app.printerId!="") {
            app.BTEnabled(btPrintInit);
        }
		if (app.printerConnected==false) {
            $("#btimg").attr("src","img/bluetooth-red.png");
            showMessage('Nyomtatási hiba');
        }
        printing=false;
	}

    /* print */
    if (app.printerType=='bt') {
        if(typeof bluetoothSerial != 'undefined') {
            try {
                printing=true;
                bluetoothSerial.isConnected(btPrint, printError);
            }
            finally {
            }
        }
        else {
            showMessage('printer not found');
            $("#btimg").attr("src","img/bluetooth-red.png");
            if (teszt) btPrint();
        }
    }
    else { 
        if (typeof Socket != 'undefined') {
            try {
                printing=true;
                cbPrint = function(){
                }
                dataString="ORZOTTCIMKEGYORS" + " " + rsz+" "+tipstr+" "+pozstr+" "+rszprint;
                tcpClient.send(app.tcpServerIP,app.tcpServerPort,dataString,cbPrint);
            }
            finally {
                printing=false;
            }                
        }
        else  showMessage('printer not found');
    }
}

/* fopanel */






/* atnezo panel eddig */


/* elrakodas eddig */
/*
panelInit->getRszInProgress->(#datarendszam.change)->rszChange()->rszAdatokGet->(meres volt, hkod van)hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres volt, hkod nincs)showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              ->(meres nem volt)->getMelyseg->allapotMentes->allapotMent->(ha van hkod mar)->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                                                                                        ->(ha meg nincs hkod)->showHkod->hkodSaveInit->hkodSaveCheck->hkodSave->getRszInProgress
                                                                              
                                                                              
átnézõ: showReview->reviewRszFilter->reviewRszGet->reviewFilter
*/

