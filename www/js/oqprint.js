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
    this.fegu="";
	this.panelInit();
}
OQPrint.prototype.panelInit = function () {
	/* kezdő panel megjelenítése*/
	panelName='oqprint';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
            tpl = data; 
			$('#divContent').html(css + tpl);		
			$('#divContent').show();

			$('#bPrint').bind('click',function () {	
                printtext = $('#dataRendszam').val();
				//qprint.print(printtext);
                qprint.showCimkePanel();
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
            });
            $('#btabaj').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').hide();
                $('.divajbuttons').show();
                $('.divkzbuttons').hide();
            });
            $('#btabkz').on('click', function(event){
                event.stopPropagation();
                event.preventDefault();
                $('.divnumbuttons').hide();
                $('.divajbuttons').hide();
                $('.divkzbuttons').show();
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
			$('#bCimkeClose').bind('click',function () {
				$('#divcimke').hide();
				$('#divpanel').show();
                //$('#dataRendszam').focus();
			})
            
            $('.divajbuttons').show();        
			
		})
	})

}

/* ez mar nem kell, de egyelore benthagyom. 2018.02.06*/
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
                printerNum='';
                if (app.tcpPrinterNr>1) printerNum='P'+app.tcpPrinterNr;
                dataString="ORZOTTCIMKEGYORS"+printerNum + " " + rsz+" "+tipstr+" "+pozstr+" "+rszprint;
                tcpClient.send(app.tcpServerIP,app.tcpServerPort,dataString,cbPrint);
            }
            finally {
                printing=false;
            }                
        }
        else  showMessage('printer not found');
    }
}

/* cimke nyomtatas */
OQPrint.prototype.showCimkePanel = function(){
	fn = 'qprint.setLabelData'; /* PDA_ORZOTTKI_CIMKEADATOK */
    qprint.fegu="";
    printtext = $('#dataRendszam').val();
	ajaxCall(fn,{'login':login_id,'rsz':printtext},true, fn);

}
OQPrint.prototype.setLabelData = function(result){
	/* cimke nyomtatashoz gombok */
	html = "";
    if (result[0].RESULT>0) {
        $('#divpanel').hide();
        $('#divcimke').show();
        for (var i = 0;i < result.length;i++){
            res = result[i];
            qprint.fegu=res.FE+"/"+res.GU;
            tip='A';
            if (res.GU==0) tip='F';
            if (res.GU>0 && res.FE>0) tip='M';
            for (var j=0;j<res.GU;j++) {
                if (j==0) poz='JE';
                else
                if (j==1) poz='BE';
                else
                if (j==2) poz='JH';
                else
                if (j==3) poz='BH';
                else
                if (j==4) poz='POT';
                else
                if (j==5) poz='JHI';
                else
                if (j==6) poz='BHI';
                rszpoz=res.RSZ + '_' + (j+1) + tip;
                html+="<div><button class='bcimkeprint' val='"+rszpoz+"'>"+rszpoz+"</button></div>";
            }
        }
        $('#dcimkebuttons').html(html);
        $('.bcimkeprint').bind('click',function(){
            qprint.printLabel( $(this) );
        });
    }
    else showMessage('Nincs ilyen rendszám!');
}
OQPrint.prototype.printLabel = function(aktbutton){
	rszprint = aktbutton.attr('val');
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
	var btPrint = function() {
		$.get( "views/prn_rendszam_lerak"+app.printerTplPrefix+".tpl", function( data ) {

                tpl = data;
                tpl = tpl.replace(/\[RENDSZ\]/g,rsz); 
                tpl = tpl.replace(/\[TIPUS\]/g,tipstr); 
                tpl = tpl.replace(/\[POZSTR\]/g,pozstr); 
                tpl = tpl.replace(/\[RENDSZPOZ\]/g,rszprint); 
				tpl += '\r\n';
				var writeOk = function(){
				}
				var writeError = function(){
					console.log('btprint write error:kiadas, label print:'+rszprint);
				}
				if (!teszt) bluetoothSerial.write(tpl,writeOk,writeError);
				if (teszt) writeOk();
		})
	}
	
	var printError = function(){
		console.log('btprint write error:kiadas, label print:'+rszprint);
		app.printerConnected=false;
		if (app.printerId!="") BTEnabled(null);
		if (app.printerConnected==false) alert('Nyomtatási hiba');
	}
	/* print */
    if (app.printerType=='bt') {
        if(typeof bluetoothSerial != 'undefined') {
                try {
                    printing=true;
                    bluetoothSerial.isConnected(btPrint, printError);
                }
                finally {
                    printing=false;
                }
        }
        else {
                showMessage('printer not found');
                if (teszt) btPrint();
        }
    }
    else { 
        if (typeof Socket != 'undefined') {
            try {
                printing=true;
                cbPrint = function(){};
                printerNum='';
                if (app.tcpPrinterNr>1) printerNum='P'+app.tcpPrinterNr;
               
                dataString="ORZOTTCIMKE" +printerNum+ " " + rsz+" "+tipstr+" "+pozstr+" "+rszprint+" "+qprint.fegu;
                tcpClient.send(app.tcpServerIP,app.tcpServerPort,dataString,cbPrint);
            }
            finally {
                printing=false;
            }                
        }
        else  showMessage('printer not found');
    }                
	

}
/* cimke nyomtatas eddig */



/* fopanel */









