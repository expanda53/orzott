/* beerkezes */
markaUpdate = false;
meretUpdate = false;
mintaUpdate = false;
siUpdate = false;
printing = false;
dialogResult = false;
function clickHelp(){
	$('#divclick').show();
	window.setTimeout(function(){$('#divclick').hide();},20);
}
function pingPrinter(){
	//nem kell, a nyomtatót be lehet konfigolni, hogy ne kapcsoljon ki.
	//! U1 setvar "power.inactivity_timeout" "0"
	/*window.setTimeout(function(){
		if (!printing) {
			alert('ping start');
			var btPrint = function() {
						var tpl = '\r\n';
						var writeOk = function(){
						}
						var writeError = function(){
							console.log('btprint ping write error');
						}
						bluetoothSerial.write(tpl,writeOk,writeError);
			}
			var printError = function(){
				//console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
			}
			if(typeof bluetoothSerial != 'undefined') {
				try {
					printing=true;
					bluetoothSerial.isConnected(btPrint, printError);
				}
				finally {
					printing=false;
				}
			}
			alert('ping finish');
			
		}
		pingPrinter();
	},30*1000);
	*/
}
var OBeerk = function(){
	this.meresKell=false;
	this.initMibizList();
	this.currentItem = ""; //bGumi,bFelni,bGumiFelni
	this.currentPosition = '';
    this.kerekPozvalasztas=true; //korabban ugy volt, hogy a kerek megy mosasra, es utana nyomtatnak. Ez ugy tunik nem igy van, de berakok egy konfigot, ha megis...
    this.tobblet=0;
    this.printAll = false;
    this.pozToPrint = '';
    //gpanel = new OGPanel();
}
/* feladat valasztas */
OBeerk.prototype.initMibizList = function(){
	fn = 'beerk.mibizList'; /* PDA_MIBIZLIST_ORZOTTLERAK2 */
	r = ajaxCall(fn,{'login':login_id},true, fn);
	/* obeerk.tpl beolvas, tr click -re mibiz átadása selectTask-nak. tr click az obeerk.tpl-ben van*/
}
OBeerk.prototype.mibizList = function(result) {
	/* feladat lista ajax eredménye */
	panelName = 'obeerk';
    if (result.length>0) {
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
        sor += '<tr id="'+res.MIBIZ+'">';
		sor += '<td  class="tmszam3">'+res.FUVAR+'</td>'; 
		sor +=  '<td class="tkezelo">'+res.KEZELOK+'</td>'; 
		sor +=  '<td class="tdrbsum">'+res.DRBSUM+'</td>'; 
		sor +=  '<td class="tstat">'+res.STATUSZ+'</td>'; 
		sor += '</tr>';
	}
	
	
	css='';
	$.get( "css/"+panelName+".css", function( data ) {
		css = '<head><style>' + data + '</style></head>';
		$.get( "views/"+panelName+".tpl", function( data ) { 
			tpl = data.replace('<{sorok}>',sor); 
			$('#divContent').html(css + tpl);
            
            
            $('#bGumi, #bGumiFelni, #bFelni').on('click', function(event){

                event.stopPropagation();
                event.preventDefault();
                if(event.handled !== true) {
                    clickHelp();
                    beerk.showPozPanel($(this));
                    event.handled = true;
                } else {
                    return false;
                }
                

            });
            
            $('#bJavitas').bind('click',function () {
                beerk.rszJavitas();
            })
            $('#bElteres').bind('click',function (event) {
                event.stopPropagation();
                event.preventDefault();
                if(event.handled !== true) {
                    clickHelp();
                    beerk.reviewFilter();
                    event.handled = true;
                } else {
                    return false;
                }
            })
            
            $('#bFolytMost').bind('click',function (event) {
                event.stopPropagation();
                event.preventDefault();
                if(event.handled !== true) {
                    clickHelp();
                    $('#divreview').hide();
                    $('#divpanel').show();
                    event.handled = true;
                } else {
                    return false;
                }
            })
            $('#bFolytKesobb').bind('click',function (event) {
                event.stopPropagation();
                event.preventDefault();
                clickHelp();
                if(event.handled !== true) {

                    beerk.folytKesobb();

                    event.handled = true;
                } else {
                    return false;
                }
                
            })	
            $('#bLezar').bind('click',function () {
                beerk.lezarStart();
            })	
            $('#bTobblet').bind('click',function () {
                beerk.tobbletStart();
            })	
            $('#bMenu').bind('click',function () {
                showMenu();
            })	
            $('#bGPanelClose').bind('click',function () {
                beerk.GPanelClose(true);
            })	
            $('#bGPanelCancel').bind('click',function () {
                beerk.GPanelClose(false);
            })	
            $('#bGPanelOptions').bind('click',function (event) {
                beerk.GPanelOptions();
            })	
            $('#srendszam, #bRendszam').bind('click',function (event) {
                clickHelp();
                beerk.showReview()	
            })	
            $('.rszadatok').bind('click',function (event) {
                event.stopPropagation();
                event.preventDefault();
                if(event.handled !== true) {
                    clickHelp();
                    beerk.showGPanel();
                    event.handled = true;
                } else {
                    return false;
                }

            })	
            
            $('.bnum').on('click', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    char = $(this).text();		
                    if (char=='+/-' ) {
                        content = $('.dataTobbletUpdate').html()
                        c = content.substring(0,1);
                        if (c=='-' || c=='+') {
                            if (c=='-') char='+';
                            else char='-';
                            content = char + content.substring(1,content.length);
                        }
                        else {
                            char='-';
                            content = char + $('.dataTobbletUpdate').html();
                        }
                    }
                    else {
                        content = $('.dataTobbletUpdate').html() + char;
                    }
                    $('.dataTobbletUpdate').html(content);
                    
                    
           });
           $('.bbacksp').on('click', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    content = $('.dataTobbletUpdate').html();
                    content = content.substring(0,content.length-1);
                    $('.dataTobbletUpdate').html(content);
          });
           $('.bment').on('click', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    content = $('.dataTobbletUpdate').html();
                    if (content!='') {
                        azon = $('#hAZON').val();
                        fn = 'beerk.updateTobblet'; /// PDA_ORZOTTLERAK_TOBBLET
                        r = ajaxCall(fn,{'azon':azon,'drb':content,'login':login_id},true, fn);
                    }
                    else {
                       showMessage('Add meg hogy mennyivel módosítod a többletet!');
                    }
          });      
           $('.bvissza').on('click', function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    $('#divTobblet').hide();
                    $('#divreview').show();
          });      
                        
			//feladat valasztas inditasa
			$('.tmibizlist tr').bind('click',function(){
				tr = $(this);
				id = tr.attr('id');
				mszam3 = tr.find(".tmszam3").html();
				beerk.selectTask(id,mszam3);
			})
			
			$('#divContent').show();
            $('#divheader').bind('click',function(){
                app.getDepthMeters();
            })
                
		});
		
	})
    }
    else {
        showMessage('Nincs élő bevét lista a rendszerben!','',1.5);
        showMenu();
        
    }

}

OBeerk.prototype.updateTobblet = function (result) {
	/* tobblet javitas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
            beerk.tobblet=res.TOBBLET;
            $('.dataTobbletSum').html(beerk.tobblet);
            $('#divTobblet').hide();
            $('#divreview').show();		
        }
		else alert('Hiba');
	}
}
OBeerk.prototype.showDialog = function(caption,text, fnTrue, fnFalse){
    $('#dialog').html(text);    
            $( "#dialog" ).dialog({
                autoOpen: true,
                width: 400,
                modal: true, 
                title:caption,
                buttons: [
                    {
                        text: "Igen",
                        click: function() {
                            this.dialogResult=true;
                            fnTrue(true);
                            $( this ).dialog( "close" );
                        }
                    },
                    {
                        text: "Nem",
                        click: function() {
                            this.dialogResult=false;
                            fnFalse(false);
                            $( this ).dialog( "close" );
                        }
                    }
                ]
            });

    
//    $( "#dialog" ).dialog( "open" );    
}

OBeerk.prototype.selectTask = function(mibiz,mszam3) {
	/* feladat valaszto ajax inditas */
	beerk.tempMibiz=mibiz;
	beerk.tempMszam3=mszam3;
    this.showDialog('Üzemmód','Állapot felméréssel?', beerk.selectTaskCont,beerk.selectTaskCont);
}

OBeerk.prototype.selectTaskCont = function(result) {
	mibiz = beerk.tempMibiz;
	mszam3 = beerk.tempMszam3;
	beerk.meresKell=result;
	if (beerk.meresKell) {
		$('#divheader').html('Őrzött beérkezés - <b>állapot felméréssel</b> - Sofőr:'+mszam3);
	}
	else {
		$('#divheader').html('Őrzött beérkezés - <b>állapot felmérés nélkül</b> - Sofőr:'+mszam3);
	}
	ajaxCall('beerk.taskReg',{'mibiz':mibiz, 'login':login_id},true, '');
	$('#divmibizlist').hide();
	fn = 'beerk.panelInit'; /* query */
	r = ajaxCall(fn,{'mibiz':mibiz, 'login':login_id},true, fn);

}
OBeerk.prototype.panelInit = function (result) {
	/* feladat indítás ajax eredménye*/
	sor = '';
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#hAZON").val(res.AZON);
		$("#hMIBIZ").val(res.MIBIZ);
	}
	beerk.showReview();
	$('#bFolytMost').hide();
	
}

/* feladat valasztas eddig */

/* fopanel */

OBeerk.prototype.rszJav = function (result) {
	/* mennyiseg javitas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT!=-1)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FEGU);
		}
		else alert('Hiba');
	}
	if ( $('#divmeres').is(":visible") ){
		$('#divmeres').hide();
		$('#divpanel').show();	
	}
}

OBeerk.prototype.rszJavitas = function () {
	/* mennyiseg javitas ajax inditas */
	this.showDialog('Javítás','A rendszámhoz tartozó előző nyomtatás törlése,mehet?', beerk.rszJavitasResponse,beerk.rszJavitasResponse);
}
OBeerk.prototype.rszJavitasResponse=function(result){
	if (result) {
		azon = $('#hAZON').val();
		sorsz = $('#hSORSZ').val();	
		rsz = $('#rendszam').val();
		drb2 = $('.dataDrbKesz').html();
		if (drb2>0) {
		  fn = 'beerk.rszJav'; /// PDA_ORZOTTLERAK_JAVITAS
		  r = ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'rsz':rsz,'login':login_id},true, fn);
		}
    }
    
}


OBeerk.prototype.showPozPanel = function(obj) {
	this.showAllapotPanel(obj);
}

/* fopanel eddig */



/* allapot panel */
OBeerk.prototype.showAllapotPanel = function(obj){
    beerk.printAll = false;
    this.currentItem = obj.attr('id'); 
    if (beerk.fedb>0 && beerk.currentItem=="bGumi") this.showDialog('Rögzítés','Keréknek várjuk, biztos hogy guminak rögzíted?', beerk.showAllapotPanelResponse,beerk.showAllapotPanelResponse);
    else
    if (beerk.fedb==0 && beerk.currentItem=="bGumiFelni") this.showDialog('Rögzítés','Guminak várjuk, biztos hogy keréknek rögzíted?', beerk.showAllapotPanelResponse,beerk.showAllapotPanelResponse);
    else beerk.showAllapotPanelResponse(true);

}
			
OBeerk.prototype.showAllapotPanelResponse = function(result){
    if (result) {
        $('#bAllapotClose').show();
        if (beerk.meresKell || beerk.currentItem=="bGumi" || (beerk.kerekPozvalasztas && beerk.currentItem=="bGumiFelni")) {
            /* ha meressel kerte, vagy meres nelkul de gumit (vagy kereket) valasztott */
            panelName='meres';
            $.get( "css/"+panelName+".css", function( data ) {
                css = '<head><style>' + data + '</style></head>';
                $.get( "views/"+panelName+".tpl", function( data ) { 
                    rsz = $('#rendszam').val();
                    mibiz = $('#hMIBIZ').val();
                    $('#divmeres').html(css + data);
                    $('#divpanel').hide();
                    $('#divmeres').show();
                    $('#divpozicio').show();				
                    if (beerk.meresKell) { 
                        $('#bMIND').hide();
                    }
                    else {
                        $('#bMIND').show(); 
                    }
                    
                    var muvelet = 'Rendszám: '+rsz+' ';
                    
                    if (beerk.currentItem=="bGumi") muvelet += "beérkezés: gumi";
                    if (beerk.currentItem=="bFelni") muvelet += "beérkezés: felni";
                    if (beerk.currentItem=="bGumiFelni") muvelet += "beérkezés: kerék";
                    muvelet += beerk.szlevAllapot;
                    beerk.currentPosition = '';
                    $('#muvelet').html(muvelet);
                    
                    app.btRefresh();
                    
                    fn='beerk.getPositions'; /* PDA_ORZOTTLERAK_GETPOZ */
                    ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'login':login_id},true, fn);
                    
                });
                
            })
        }
        else {
            /* ha meres nelkul kerte (kiveve gumi eseten, ott ilyenkor is van allapot panel) */
            /* felni eseten automatikus nyomtatas erkezesi sorrendben, nincs jelentosege, hogy melyik felni melyik pozicio*/
            /* kerek eseten csak mennyiseg noveles van, mivel nem merunk es nyomtatni sem kell, mert mossak oket */
            beerk.selectPosition(null);
        }
    }
}


OBeerk.prototype.getPositions=function(result){
	/* mar kivalasztott poziciok disabledre: JE:A:13  (pozicio:tipus:melyseg)*/
	if (result[0].RESULT!='') {
		res = result[0].RESULT.split(',');
		for (var i = 0;i < res.length;i++){
			p = res[i].split('#');
			id='b' + p[0];
			$('#'+id).attr('disabled','disabled');
		}
	}
}

OBeerk.prototype.checkMarka = function (poz){
  /* gumipanel adatok ellenorzese*/
  indexMarka=-1;
  indexMeret=-1;
  indexMinta=-1;
  tengely='';
  result=true;
  if  (this.currentItem!='bFelni') {
      if (poz=='bJE' || poz=='bBE')  {indexMarka=9;indexMeret=10;indexMinta=11;tengely='A';}
      if (poz=='bJH' || poz=='bBH')  {indexMarka=12;indexMeret=13;indexMinta=14;tengely='B';}
      if (poz=='bPOT' )  {indexMarka=15;indexMeret=16;indexMinta=17;tengely='P'}
      if (indexMarka!=-1 || indexMinta!=-1 || indexMeret!=-1) {
            uzenet='';
            if (beerk.rszAdatok[indexMarka].trim()=='' || beerk.rszAdatok[indexMarka].trim().toUpperCase()=='NINCS') uzenet+="márka\n";
            if (beerk.rszAdatok[indexMeret].trim()=='' || beerk.rszAdatok[indexMeret].trim().toUpperCase()=='NINCS') uzenet+="méret\n";
            if (beerk.rszAdatok[indexMinta].trim()=='' || beerk.rszAdatok[indexMinta].trim().toUpperCase()=='NINCS') uzenet+="minta\n";
            if (uzenet!='') {
                uzenet="Hiányos "+tengely+" tengely adatok! Hiányzik:\n" + uzenet;
                result = false;
            }
      }
  }
  return result;

}

OBeerk.prototype.selectAll = function () {
    //maradek cimkek egyben lenyomtatasa
    /* a nynomtatas kesleltetve van inditva, hogy ne elozze be egyik a masikat. emiatt lehet hogy a beerk.printAll trueban marad, de a showAllapotPanel false-ra allitja a kov. megnyitaskor */
    drb = $('.dataDrbVart').html();
    drb2 = $('.dataDrbKesz').html();
    pdrb= drb - drb2;
    sec=1;
    aktdrb=0;
    beerk.printAll = false;
    
    if (pdrb>0) {
        stop=false;
        beerk.printAll = true;
        beerk.pozToPrint='';        
        aktpoz='#bJE';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bJE';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);            
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }

        aktpoz='#bBE';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {
                pdrb--;
                beerk.pozToPrint+=aktpoz+';';
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bBE';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);                            
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }

        aktpoz='#bJH';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {            
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bJH';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);                            
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }
        
        aktpoz='#bBH';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {            
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bBH';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);            
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }
        
        aktpoz='#bPOT';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {            
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bPOT';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);            
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }
        
        aktpoz='#bJHI';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {            
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    aktpoz='#bJHI';
                    beerk.printAll = true;
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }

        aktpoz='#bBHI';
        aktpozDisabled = $(aktpoz).attr('disabled');
        if (!aktpozDisabled && pdrb>0 && !stop) {
            poz=$(aktpoz).attr('id');
            if (this.checkMarka(poz)) {            
                beerk.pozToPrint+=aktpoz+';';
                pdrb--;
                aktdrb++;
                setTimeout(function(){ 
                    beerk.printAll = true;
                    aktpoz='#bBHI';
                    //showMessage('Nyomtatás:' + aktpoz,'',sec);
                    beerk.selectPosition($(aktpoz)) ;
                }, aktdrb * sec * 1000);
            }
            else stop=true;
        }
        if (!stop) beerk.mentesMind();
        else {
          beerk.printAll = false;
          this.showGPanel();
          $('#bAllapotClose').trigger( "click" );
        }
        
        //alert(drb+ ' ' + drb2 + ' ' + aktpoz + ' ' + aktpozDisabled);
        
    }
}

OBeerk.prototype.selectPosition = function (obj) {
	/* nyomtatas inditas + mentes ajax*/
	tip = this.currentItem; /* gumi,felni, ... */
	var poz = "";
	if (obj == null) {
		/* felni vagy kerek meres nelkul, automatikus pozicio meghatarozassal, a mar belott drbszam alapjan. 0 -> JE, 1->BE, 2->JH,3->BH,4->POT,5->JHI, 6->BHI */
        //kereknel ha van nyomtatas, akkor kell poziciot valasztani
		poz='auto';
	}
	else poz=obj.attr('id');
	this.currentPosition = poz;

    if (beerk.currentPosition=='bJE') ppoz = 1;
    if (beerk.currentPosition=='bBE') ppoz = 2;
    if (beerk.currentPosition=='bJH') ppoz = 3;
    if (beerk.currentPosition=='bBH') ppoz = 4;
    if (beerk.currentPosition=='bPOT') ppoz = 5;
    if (beerk.currentPosition=='bJHI') ppoz = 6;
    if (beerk.currentPosition=='bBHI') ppoz = 7;
    pozstr=beerk.currentPosition.substring(1);
    if (beerk.currentItem=="bGumi") {ptip = "A";tipstr='Gumi';}
    if (beerk.currentItem=="bFelni") {ptip = "F";tipstr='Felni';}
    if (beerk.currentItem=="bGumiFelni") {ptip = "M";tipstr='Kerék';}	
    mindenre = settings.getItem('ORZOTT_LERAKODAS_MINDENRE_NYOMTAT').toUpperCase();
    mindenre_nyomtat = (mindenre =='IGEN');

    
    var btPrintInit = function() {
        showMessage('Nyomtató OK.');
        btPrint();
    }
	var btPrint = function() {
        app.btRefresh();
        if (app.printerConnected || teszt){
            rsz = $('#rendszam').val();
            $.get( "views/prn_rendszam_lerak"+app.printerTplPrefix+".tpl", function( data ) {

                    tpl = data;
                    tpl = tpl.replace(/\[RENDSZ\]/g,rsz); 
                    tpl = tpl.replace(/\[TIPUS\]/g,tipstr); 
                    tpl = tpl.replace(/\[POZSTR\]/g,pozstr); 
                    tpl = tpl.replace(/\[RENDSZPOZ\]/g,rsz+"_"+ppoz+ptip); 
                    tpl += '\r\n';
                    var writeOk = function(){
                        beerk.mentes(azon,sorsz,drb2,tip,poz);
                    }
                    var writeError = function(){
                        console.log('btprint write error:'+beerk.currentItem+':'+beerk.currentPosition);
                    }
                    if (!teszt && (beerk.currentItem!='bGumiFelni' || mindenre_nyomtat)) bluetoothSerial.write(tpl,writeOk,writeError);
                    if (teszt || (beerk.currentItem=='bGumiFelni' && !mindenre_nyomtat)) writeOk();
            })
        }
        else {
            $("#btimg").attr("src","img/bluetooth-red.png");
        }
		printing=false;
		
	}
	var printError = function(){
		console.log('btprint error:'+beerk.currentItem+':'+beerk.currentPosition);
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
	azon = $('#hAZON').val();
	sorsz = $('#hSORSZ').val();	
	drb = $('.dataDrbVart').html();
	drb2 = $('.dataDrbKesz').html();
	if (beerk.currentPosition=='auto') {
					if (drb2==0) beerk.currentPosition='bJE';
					if (drb2==1) beerk.currentPosition='bBE';
					if (drb2==2) beerk.currentPosition='bJH';
					if (drb2==3) beerk.currentPosition='bBH';
					if (drb2==4) beerk.currentPosition='bPOT';
					if (drb2==5) beerk.currentPosition='bJHI';
					if (drb2==6) beerk.currentPosition='bBHI';
					poz=beerk.currentPosition;

	}
    //egyedi nyomtatasnal itt kell ellenorizni, hogy ki van-e toltve a gumipanel. Csoportos nyomtatasnal a selectAll rutinban tortenik az ellenorzes, mert itt mar keso
	if (beerk.printAll || this.checkMarka(poz)) {
        if (drb2>=drb && !beerk.printAll) {
            showMessage('A beérkezett mennyiség '+drb+' db!');
        }
        /* ha a sajcegben a mindenre nyomtat=IGEN, akkor minden gombra nyomtatas van */
        //mindenre_nyomtat = (settings.getItem('ORZOTT_LERAKODAS_MINDENRE_NYOMTAT').toUpperCase() == 'IGEN');
        
        if (mindenre_nyomtat || tip!='bGumiFelni' || teszt) {
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
                            beerk.mentes(azon,sorsz,drb2,tip,poz);
                        }
                        fegu = beerk.fedb+"/"+beerk.gudb;
                        printerNum='';
                        if (app.tcpPrinterNr>1) printerNum='P'+app.tcpPrinterNr;
                        dataString="ORZOTTCIMKE" +printerNum+ " " + rsz+" "+tipstr+" "+pozstr+" "+rsz+"_"+ppoz+ptip+" "+fegu;
                        if (beerk.currentItem!='bGumiFelni' || mindenre_nyomtat) tcpClient.send(app.tcpServerIP,app.tcpServerPort,dataString,cbPrint);
                        if (beerk.currentItem=='bGumiFelni' && !mindenre_nyomtat) cbPrint();
                    }
                    finally {
                        printing=false;                        
                    }                
                }
                else  showMessage('printer not found');
                //if (teszt) beerk.mentes(azon,sorsz,drb2,tip,poz);
            }            
        }
        else {
            /* kerek valasztasnal nincs nyomtatas (mivel mossak oket, es kesobb nyomtatjak)*/
            beerk.mentes(azon,sorsz,drb2,tip,poz);
        }
    }
    else {
      this.showGPanel();
      $('#bAllapotClose').trigger( "click" );
    }


}

OBeerk.prototype.mentes = function(azon,sorsz,drb2,tip,poz) {
    if (!beerk.printAll) {
            rsz = $('#rendszam').val();
            fn = 'beerk.rszMent';
            ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':tip,'poz':poz,'login':login_id,'rsz':rsz},true, fn);
    }
}
OBeerk.prototype.mentesMind = function() {
    if (beerk.pozToPrint!='') {
            tip = beerk.currentItem; /* gumi,felni, ... */
            drb2 = $('.dataDrbVart').html();
            azon = $('#hAZON').val();
            sorsz = $('#hSORSZ').val();
            rsz = $('#rendszam').val();
            fn = 'beerk.rszMentMind';
            ajaxCall(fn,{'azon':azon,'sorsz':sorsz,'drb2':drb2,'tip':tip,'poz':beerk.pozToPrint,'login':login_id,'rsz':rsz},true, fn);
    }
}
OBeerk.prototype.rszMentMind = function(result) {
	/* mentes ajax eredmenye */
    app.btRefresh();
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT>0 && res.RESULT<=10)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FE+'/'+res.GU);
        }
    }
    $('#bAllapotClose').trigger( "click" );
}
OBeerk.prototype.rszMent = function(result) {
	/* mentes ajax eredmenye */
    app.btRefresh();
	for (var i = 0;i < result.length;i++){
		res = result[i];
		if (res.RESULT>0 && res.RESULT<=10)	{
			$('.dataDrbKesz').html(res.RESULT);
			$('.dataDrbFEGU').html(res.FE+'/'+res.GU);
			
			id=beerk.currentPosition;
			if (beerk.meresKell) {
				//meres panel betoltese
				$('#muvelet').append(' ('+beerk.currentPosition.substring(1)+')');
				$('#divpozicio').hide();
				$('#divallapot').show();
                var dmOk = function(){
                    showMessage('Mélységmérő OK.');
                }

                var dmreconnect = function(){
                    console.log('depthmeter connection error:'+beerk.currentItem+':'+beerk.currentPosition);
                    depthMeterConnected=false;
                    if (app.depthMeterId!="") {
                        app.BT2Enabled(dmOk);
                    }
                    if (app.depthMeterConnected==false) {
                        showMessage('Mélységmérő hiba');
                        $("#btimg").attr("src","img/bluetooth-red.png");
                    }
                    
                }
                var dmconnected = function(){
                    app.btRefresh();
                }
                
                
                if(typeof bluetoothSerial2 != 'undefined'){ 
                    bluetoothSerial2.isConnected(dmconnected, dmreconnect);
                }
                $('#bAllapotMent').show();
				$('#bAllapotClose').hide();
				if (beerk.currentItem=='bGumi' || beerk.currentItem=='bGumiFelni'  || beerk.currentItem=='bFelni') {
					fn = 'beerk.getMelyseg'; /* query */
					ajaxCall(fn,{'poz':beerk.currentPosition, 'login':login_id,'tip':beerk.currentItem},true, fn);
				}
			}
            else $('#bAllapotClose').trigger( "click" );
			
			
		}
		else showMessage('Hiba');
	}
}




OBeerk.prototype.getMelyseg=function(result){
	$("#gstat").html('');
	$("#gstat").append('<option value="-" selected disabled>Mérjen!</option>');
	for (var i = 0;i < result.length;i++){
		res = result[i];
		$("#gstat").append('<option value='+res.KOD+'>'+res.KOD+'</option>');
	}
	manualChoice = settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS')!=null && settings.getItem('ORZOTT_MELYSEGMERES_KEZZEL_IS').toUpperCase()=='IGEN';
	if (!manualChoice) $('#gstat').attr('disabled',true);
	$('#divgstat').show();

	
}

OBeerk.prototype.allapotMentes=function(){
	poz = this.currentPosition;
	melyseg = $('#gstat').val();
	csereok = $('#gcsok').val();
    tip=beerk.currentItem;
	if (this.meresKell && (melyseg=='-' || melyseg=='' || melyseg==null) && tip!='bFelni' ) showMessage('Mentés előtt mérd meg a mélységet!');
	else 
	if (melyseg=='CS' && csereok=="") {
		showMessage('Csere esetén töltd ki a csere okát!');
	}
	else {
		rsz = $('#rendszam').val();
		mibiz = $('#hMIBIZ').val();
		fn='beerk.allapotMent'; /* PDA_ORZOTTLERAK_ALLAPOTMENT */
		ajaxCall(fn,{'rsz':rsz,'mibiz':mibiz,'poz':poz,'melyseg':melyseg,'login':login_id,'tip':tip,'csereok':csereok},true, fn);
	}
}
OBeerk.prototype.allapotMent=function(result){
	$('#bAllapotClose').trigger( "click" );
}
/* allapot panel eddig */

/* atnezo panel */
OBeerk.prototype.showReview = function() {
	/* atnezo panel ajax inditas */
	//$('bFolytMost').show();
	azon = $('#hAZON').val();
	$('#divpanel').hide();
	fn = 'beerk.reviewRszFilter'; /* query */
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
	$('#divreview').show();
	
}
OBeerk.prototype.reviewRszFilter = function(result) {
	/* atnezo panel filter ajax eredenye (rsz szures)*/
	sorok = '';
	$('.tableReviewFilter tbody').empty();
	sorok='<tbody>'
	var hianydb = 0;
	sorok += '<tr >';
	sorok += '<td id="rszall">*</td>';
	sorok += '</tr>';

	for (var i = 0;i < result.length;i++){
		res = result[i];
		sorok += '<tr >';
		sorok += '<td id="'+res.RENDSZAM+'">'+res.RENDSZAM+'</td>';
		sorok += '</tr>';
		
	}
	sorok+='</tbody>'
	$('.tableReviewFilter tbody').append(sorok);
	$('.tableReviewFilter tbody td').bind('click',function(){
		curTD = $(this);
		filter = curTD.html();
		azon = $('#hAZON').val();
		fn = 'beerk.reviewRszGet'; /* query */
		r = ajaxCall(fn,{'filter':filter,'azon':azon,'login':login_id},true, fn);
	})

	$('#rszall').trigger('click');
	
}

OBeerk.prototype.reviewRszGet = function(result) {
	/* atnezo panel filter ajax eredenye (rendszamok)*/
	sorok = '';
	fej="<thead>"
				+"<tr>"
					+"<th class='tdrsz'>Rendszám</th>"
					+"<th>Kártya</th>"
					+"<th>Lerakodandó</th>"
					+"<th>Lerakodott</th>"
				+"</tr>"
		+"</thead>";
	
	$('.tableReview').empty();
	var hianydb = 0;
	beerk.reviewSet = result;
    beerk.tobblet=0;
	for (var i = 0;i < result.length;i++){
		res = result[i];
        if (res.RENDSZAM!='TOBBLET') {
            tdclass='';
            if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
            sorok += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
            sorok += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
            sorok += '<td>'+res.KARTYA+'</td>';
            sorok += '<td>'+res.DRB+'</td>'; 
            sorok += '<td class="tmibiz">'+res.DRB2+'</td>'; 
            sorok += '</tr>';
            if (res.DRB2<res.DRB) {
                hianydb = parseInt(hianydb) + parseInt(res.DRB) - parseInt(res.DRB2);
            }
        }
        else {
           //tobblet
            beerk.tobblet = beerk.tobblet + parseInt(res.DRB2);
        }
		
	}
	$('.tableReview').html(fej+sorok);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})

	//if (hianydb!=0){
		$('.labelHiany').html('Hiány:');
		$('.dataHiany').html(hianydb);
        
		$('.labelTobbletSum').html('Többlet:');
		$('.dataTobbletSum').html(beerk.tobblet);
        
	//}
	beerk.reviewFilter();

}



OBeerk.prototype.reviewFilter = function() {
	/* eltérés/összes sor mutatása*/
	val = $('#bElteres').html();
	showAll = (val!='Eltérések');
	if (val=='Eltérések') val='Összes sor';
	else val='Eltérések';
	$('#bElteres').html(val);
	
	sor = '';
	$('.tableReview tbody tr').remove();
	var hianydb = 0;
	result = beerk.reviewSet;
	for (var i = 0;i < result.length;i++){
		res = result[i];
        if (res.RENDSZAM!='TOBBLET') {
            tdclass='';
            if (showAll || res.DRB!=res.DRB2) {
                if (res.DRB==res.DRB2) tdclass=' rowhighlighted';
                sor += '<tr class="'+tdclass+'" id="'+res.RENDSZAM+'">';
                sor += '<td class="tdrsz">'+res.RENDSZAM+'</td>';
                sor += '<td>'+res.KARTYA+'</td>';
                sor += '<td>'+res.DRB+'</td>'; 
                sor +=  '<td class="tmibiz">'+res.DRB2+'</td>'; 
                sor += '</tr>';
            }
        }
		
	}
	$('.tableReview tbody').append(sor);
	$('.tableReview tbody tr').bind('click',function(){
		tr = $(this);
		rsz = tr.find(".tdrsz").html();
		$('#rendszam').val(rsz);
		$('#srendszam').html(rsz);
		beerk.rszChange();
		$('#bFolytMost').trigger('click');

	})
}

OBeerk.prototype.rszChange = function (){
	/* rendszam valasztas ajax indito */
	rsz = $('#rendszam').val();
	if (rsz!='-') {
		azon = $('#hAZON').val();
		fn = 'beerk.rszAdatokGet'; /* query */
		ajaxCall(fn,{'rsz':rsz,'azon':azon},true, fn);
	}
	else {
		$('.rszadatok').hide();
		$('.dcontrol').hide();
	}
	
}

OBeerk.prototype.rszAdatokGet = function (result){
	/* rendszam valasztas ajax eredmenye */
	for (var i = 0;i < result.length;i++){
		res = result[i];
		//$(".dataCeg").html(res.CEGNEV);
		$(".dataMeret").html(res.MERETMINTA);
		$(".dataFegu").html(res.FEGU);
		$(".dataDrbVart").html(res.DRB);
		$(".dataDrbKesz").html(res.CDRB);
		$(".dataDrbFEGU").html(res.FEGUKESZ);
		$("#hSORSZ").val(res.SORSZ);
		beerk.fedb = res.FEDB;
		beerk.gudb = res.GUDB;
        beerk.evszak = res.EVSZAK;
		beerk.rszAdatok = res.RSZADATOK.split("\n");
		beerk.rszAdatokTEMP = beerk.rszAdatok;
		feall='';
		if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
		if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
		$(".dataFeall").html(feall);
        
        beerk.szlevAllapot = '  (Szállítólevélen JE:'+beerk.rszAdatok[0]+' BE:'+beerk.rszAdatok[1]+' JH:'+beerk.rszAdatok[2]+' BH:'+beerk.rszAdatok[3]+' POT:'+beerk.rszAdatok[4]+' JHI:'+beerk.rszAdatok[5]+' BHI:'+beerk.rszAdatok[6]+')';
        
	}
	$('.rszadatok').show();
	$('.dcontrol').show();
}


OBeerk.prototype.folytKesobb=function(){
	/* atnezon folyt kesobb ajax inditas */
	fn = 'beerk.folytUpdate'; /* update */
	azon = $('#hAZON').val();
	r = ajaxCall(fn,{'azon':azon,'login':login_id},true, fn);
}
OBeerk.prototype.folytUpdate=function(result){
	/* atnezon folyt kesobb ajax eredmenye */
	$('#divreview').hide();
	beerk.initMibizList();
}

OBeerk.prototype.lezarStart = function(){
	/* atnezon lezaras ajax inditas */
	hianydb = $('.dataHiany').html();
    if (hianydb=='') hianydb=0;
	stat='Z';
	mehet=true;
	if (hianydb!=0 || beerk.tobblet!=0) {
        mehet=false;
        msg='';
        if (hianydb!=0) msg+="Hiány: <b>"+hianydb+" db</b><br>";
        if (beerk.tobblet!=0) msg+="Többlet: <b>"+beerk.tobblet+" db</b><br>";
        msg+="<br>Ennek ellenére lezárod?";
        
		this.showDialog('Lezárás',msg, beerk.lezarStartResponse, beerk.lezarStartResponse);
	}
	if (mehet) {
		showMessage('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'beerk.lezarUpdate'; /* PDA_LERAKODAS_LEZAR */
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}
OBeerk.prototype.lezarStartResponse = function(result){
	/* atnezon lezaras ajax inditas, hiannyal lezaras */
    console.debug('beerk.lezarStartResponse start');
	if (result==true) {
        hianydb = $('.dataHiany').html();
        stat='X';
		showMessage('hiany:'+hianydb+' stat:'+stat);
		mibiz=$("#hMIBIZ").val();
		fn = 'beerk.lezarUpdate'; /* PDA_LERAKODAS_LEZAR */
		ajaxCall(fn,{'mibiz':mibiz,'stat':stat,'login':login_id},true, fn);
	}
}


OBeerk.prototype.lezarUpdate =function(result){
	/* atnezon lezaras ajax eredmenye */
	res = result[0];  
    if (res.RESULT!=0) showMessage('A lerakodás lezárása során hiba történt! Lezárás leállítva.');
    else {
        showMessage('A lezárás kész.');
    	beerk.folytUpdate(result);
    }
}
OBeerk.prototype.tobbletStart = function(){
    /*  tobblet gomb megnyomasa, felir egy tobblet sort ha meg nincs. Ha mar van, akkor csak modositja a darabszamot*/ 
        $('#divreview').hide();
        $('.dataTobbletRegi').html(beerk.tobblet);
        $('.dataTobbletUpdate').html('');
        $('#divTobblet').show();
}

/* atnezo panel eddig */


/* gumipanel */
OBeerk.prototype.rszAdatokSet = function (result){
	//alert(JSON.stringify(result));
}

OBeerk.prototype.GPanelOptions = function (saveData){
  /* tengelyek adatainak masolasa, torlese  */
  $('#divGPOptions').show();
  $('#boptclose').bind('click',function(){
		$('#divGPOptions').hide();
  })
  $('#bcopyAB').bind('click',function(){
		beerk.GPanelFunctions('copy','A','B');
        $('#divGPOptions').hide();
  })
  $('#bcopyAP').bind('click',function(){
		beerk.GPanelFunctions('copy','A','P');
        $('#divGPOptions').hide();
  })
  $('#bcopyBA').bind('click',function(){
		beerk.GPanelFunctions('copy','B','A');
        $('#divGPOptions').hide();
  })
  $('#bcopyBP').bind('click',function(){
		beerk.GPanelFunctions('copy','B','P');
        $('#divGPOptions').hide();
  })
  $('#bdelA').bind('click',function(){
		beerk.GPanelFunctions('del','A','');
        $('#divGPOptions').hide();
  })
  $('#bdelB').bind('click',function(){
		beerk.GPanelFunctions('del','B','');
        $('#divGPOptions').hide();
  })
  $('#bdelP').bind('click',function(){
		beerk.GPanelFunctions('del','P','');
        $('#divGPOptions').hide();
  })
  $('#bxcAB').bind('click',function(event){
    if (!event.handled) {
		beerk.GPanelFunctions('xc','A','B');
        event.handled=true;
        $('#divGPOptions').hide();
    }
  })  
  
}
OBeerk.prototype.GPanelFunctions = function(func,src,trg){
	if (func=='copy') {
		fn='getMarka'; /* query */
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMarka'+src).val();
		$('#gpMarka'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMinta';/* query */
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMinta'+src).val();
		$('#gpMinta'+trg+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMeret';/* query */
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpMeret'+src).val();
		$('#gpMeret'+trg+' option[value='+def+']').prop('selected', 'selected');

	
		fn='getSI';/* query */
		ajaxCall(fn,{'marka':$('#gpMarka'+src).val(),'meret':$('#gpMeret'+src).val(),'minta':'mind','si':$('#gpSI'+src).val()},false, fn+trg);
		def = $('#gpSI'+src).val();
		$('#gpSI'+trg+' option[value='+def+']').prop('selected', 'selected');
		
	}
	else
	if (func=='del') {
		$('#gpMarka'+src).empty();
        $('#gpMarka'+src).val('');
		$('#gpMeret'+src).empty();
        $('#gpMeret'+src).val('');
		$('#gpMinta'+src).empty();
        $('#gpMinta'+src).val('');
		$('#gpSI'+src).empty();
        $('#gpSI'+src).val('');
	}
	else
	if (func=='xc') {
        //B tengely felremasol
        tmarka=$('#gpMarka'+trg).val();
        tminta=$('#gpMinta'+trg).val();
        tmeret=$('#gpMeret'+trg).val();
        tsi=$('#gpSI'+trg).val();
        //B urit
        beerk.GPanelFunctions('del',trg,'');
        //A->B
        beerk.GPanelFunctions('copy',src,trg);
        //A urit
        beerk.GPanelFunctions('del',src,'');
        //A tengelyre B beallitasa (felremasolt adatokbol)
		fn='getMarka'; /* query */
		ajaxCall(fn,{'marka':tmarka,'meret':tmeret,'minta':'mind','si':tsi},false, fn+src);
		def = tmarka;
		$('#gpMarka'+src+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMinta';/* query */
		ajaxCall(fn,{'marka':tmarka,'meret':tmeret,'minta':'mind','si':tsi},false, fn+src);
		def = tminta;
		$('#gpMinta'+src+' option[value='+def+']').prop('selected', 'selected');
		
		fn='getMeret';/* query */
		ajaxCall(fn,{'marka':tmarka,'meret':tmeret,'minta':'mind','si':tsi},false, fn+src);
		def = tmeret;
		$('#gpMeret'+src+' option[value='+def+']').prop('selected', 'selected');

	
		fn='getSI';/* query */
		ajaxCall(fn,{'marka':tmarka,'meret':tmeret,'minta':'mind','si':tsi},false, fn+src);
		def = tsi;
		$('#gpSI'+src+' option[value='+def+']').prop('selected', 'selected');
            
    }
	//$('#divGPOptions').hide();
		
}

OBeerk.prototype.GPanelClose = function (saveData){
	if (saveData) {
			beerk.evszak = $('#gpEvszak option:selected').val();
            //beerk.fedb = $('#gpFelnidb option:selected').val();
			beerk.rszAdatok[7]=$('#gpFelnitip option:selected').val();
			beerk.rszAdatok[9]=$('#gpMarkaA option:selected').text();
			beerk.rszAdatok[10]=$('#gpMeretA option:selected').text();
			beerk.rszAdatok[11]=$('#gpMintaA option:selected').text()
			beerk.rszAdatok[18]=$('#gpSIA option:selected').text();
			
			beerk.rszAdatok[12]=$('#gpMarkaB option:selected').text();
			beerk.rszAdatok[13]=$('#gpMeretB option:selected').text();
			beerk.rszAdatok[14]=$('#gpMintaB option:selected').text();
			beerk.rszAdatok[19]=$('#gpSIB option:selected').text();
			
			beerk.rszAdatok[15]=$('#gpMarkaP option:selected').text();
			beerk.rszAdatok[16]=$('#gpMeretP option:selected').text();
			beerk.rszAdatok[17]=$('#gpMintaP option:selected').text();
			beerk.rszAdatok[20]=$('#gpSIP option:selected').text();
			newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18];
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]!=beerk.rszAdatok[9]) {
				newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];
			}
			else
			if (beerk.rszAdatok[12]!='' && beerk.rszAdatok[12]==beerk.rszAdatok[9]) {
				if (beerk.rszAdatok[13]!='' && beerk.rszAdatok[13]==beerk.rszAdatok[10]) {
					if (beerk.rszAdatok[14]!='' && beerk.rszAdatok[14]==beerk.rszAdatok[11]) {
						if (beerk.rszAdatok[19]!='' && beerk.rszAdatok[19]==beerk.rszAdatok[18]) {
							newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]; //egyezik minden
						}
						else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18]+'+'+beerk.rszAdatok[19]; //csak SI eltérés
						
					}
					else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[14]+' '+beerk.rszAdatok[19];//minta,si eltérés
				}
				else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //meret,minta,si eltérés
			}
			else newContent=beerk.rszAdatok[9]+' '+beerk.rszAdatok[10]+' '+beerk.rszAdatok[11]+' '+beerk.rszAdatok[18] + ' + ' + beerk.rszAdatok[12]+' '+beerk.rszAdatok[13]+' '+beerk.rszAdatok[14]+' '+beerk.rszAdatok[19]; //marka,meret,minta,si eltérés
			newContent = newContent.trim();
			if (newContent.indexOf('+')==0) {
				newContent = newContent.replace('+','').trim();
			}
			fn='beerk.rszAdatokSet'; /* PDA_ORZOTTLERAK_RSZUPDATE */
			rsz = $('#rendszam').val();
			azon = $('#hAZON').val();				
			ajaxCall(fn,{'rsz':rsz,'azon':azon,'fedb':beerk.fedb,'data':JSON.stringify(beerk.rszAdatok),'evszak':beerk.evszak,'login':login_id},true, fn);
			$('.dataMeret').html(newContent);
			$(".dataFegu").html(beerk.fedb+'/'+beerk.gudb);
			feall='';
			if (checkParam(beerk.rszAdatok[7])=='L' && beerk.fedb>0) feall='Lemez';
			if (checkParam(beerk.rszAdatok[7])=='A' && beerk.fedb>0) feall='Alu';
			$(".dataFeall").html(feall);
			
	}
	
	$('#gpMarkaA, #gpMarkaB, #gpMarkaP, #gpMeretA, #gpMeretB, #gpMeretP, #gpMintaA, #gpMintaB, #gpMintaP, #gpSIA, #gpSIB, #gpSIP').html('');	
	$('#divgpanel').hide();
	$('.drendszam, .rszadatok, .dcontrol').show();
	
}
OBeerk.prototype.showGPanel =function(){
    //gumipanel
	$('.drendszam, .rszadatok, .dcontrol').hide();
        /* evszak */
        $('#gpEvszak').val(beerk.evszak);
        $('#gpEvszak').bind('change',function(event){
            /* evszak valtasnal torlom az adatokat */
            beerk.GPanelFunctions('del','A','');
            beerk.GPanelFunctions('del','B','');
            beerk.GPanelFunctions('del','P','');
        });
		/* marka */
		fn='getMarka'; /* query */
		obj='gpMarka';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka'; /* query */
			tengely='A';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18]},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* meret */
		fn='getMeret'; /* query */
		obj='gpMeret';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret'; /* query */
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* minta */
		fn='getMinta'; /* query */
		obj='gpMinta';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta'; /* query */
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}

		/* si */
		fn='getSI'; /* query */
		obj='gpSI';
		tengely='A';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI'; /* query */
			tengely='A';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[9])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[9],'meret':beerk.rszAdatokTEMP[10],'minta':beerk.rszAdatokTEMP[11],'si':beerk.rszAdatokTEMP[18],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[12])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[12],'meret':beerk.rszAdatokTEMP[13],'minta':beerk.rszAdatokTEMP[14],'si':beerk.rszAdatokTEMP[19],'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(beerk.rszAdatokTEMP[15])!='') {
			ajaxCall(fn,{'marka':beerk.rszAdatokTEMP[15],'meret':beerk.rszAdatokTEMP[16],'minta':beerk.rszAdatokTEMP[17],'si':beerk.rszAdatokTEMP[20],'evszak':'mind'},true, fn+tengely);
		}
		
		//felni:
		felnidef = checkParam(beerk.rszAdatokTEMP[7]);
		if (felnidef=='') felnidef='-';
		$('#gpFelnitip option[value='+felnidef+']').prop('selected', 'selected');
		$('#gpFelnidb option[value='+beerk.fedb+']').prop('selected', 'selected');
		$('#divgpanel').show();
}

function getMarka(result,tengely){
	if (markaUpdate==false) {
        markaUpdate=true;
        def = $("#gpMarka"+tengely+' option:selected').val();
        if (def=='mind') def='';
        if (def=='' || def==null) {
            if (tengely=='A') ix=9;
            if (tengely=='B') ix=12;
            if (tengely=='P') ix=15;
            def = beerk.rszAdatokTEMP[ix].trim();
        }
        $("#gpMarka"+tengely).html('');
        $("#gpMarka"+tengely).append('<option value=mind></option>');
        for (var i = 0;i < result.length;i++){
            res = result[i];
            $("#gpMarka"+tengely).append('<option value="'+res.MARKA+'">'+res.MARKA+'</option>');
        }
        if (def!='') $('#gpMarka'+tengely+' option[value='+def+']').prop('selected', 'selected');
	
	}
	markaUpdate=false;
}
function getMarkaA(result){	getMarka(result,'A');}
function getMarkaB(result){	getMarka(result,'B');}
function getMarkaP(result){	getMarka(result,'P');}

function getMeret(result,tengely){
	if (meretUpdate==false) {
        meretUpdate=true;
        def = $("#gpMeret"+tengely+' option:selected').val();
        if (def=='mind') def='';
        optid = '';
        if (def=='' || def==null) {
            if (tengely=='A') ix=10;
            if (tengely=='B') ix=13;
            if (tengely=='P') ix=16;
            def = beerk.rszAdatokTEMP[ix].trim();
        }
        
        $("#gpMeret"+tengely).html('');
        $("#gpMeret"+tengely).append('<option value=mind></option>');
        for (var i = 0;i < result.length;i++){
            res = result[i];
            optid = checkParam(res.MERET);
            $("#gpMeret"+tengely).append('<option value="'+optid+'">'+res.MERET+'</option>');
        }
        if (def!=null)optid = checkParam(def);
        if (optid!='') $('#gpMeret'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	meretUpdate=false;
}
function getMeretA(result) {getMeret(result,'A')}
function getMeretB(result) {getMeret(result,'B')}
function getMeretP(result) {getMeret(result,'P')}

function getMinta(result,tengely){
	if (mintaUpdate==false) {
        mintaUpdate=true;
        def = $("#gpMinta"+tengely+' option:selected').val();
        if (def=='mind') def='';
        optid='';
        if (def=='' || def==null) {
            if (tengely=='A') ix = 11;
            if (tengely=='B') ix = 14;	
            if (tengely=='P') ix = 17;	
            def = beerk.rszAdatokTEMP[ix].trim();
        }
        
        $("#gpMinta"+tengely).html('');
        $("#gpMinta"+tengely).append('<option value=mind></option>');
        for (var i = 0;i < result.length;i++){
            res = result[i];
            optid = checkParam(res.MINTA);
            $("#gpMinta"+tengely).append('<option value="'+optid+'">'+res.MINTA+'</option>');
        }
        if (def!=null)optid = checkParam(def);
        if (optid!='') $('#gpMinta'+tengely+' option[value='+optid+']').prop('selected', 'selected');
	}
	mintaUpdate=false;
}
function getMintaA(result) {getMinta(result,'A')}
function getMintaB(result) {getMinta(result,'B')}
function getMintaP(result) {getMinta(result,'P')}

function getSI(result,tengely){
	if (siUpdate==false) {
        siUpdate=true;
        def = $("#gpSI"+tengely+' option:selected').val();
        if (def=='mind') def='';
        if (def=='' || def==null) {
            if (tengely=='A') ix = 18;
            if (tengely=='B') ix = 19;	
            if (tengely=='P') ix = 20;	

            def = beerk.rszAdatokTEMP[ix].trim();
        }

        $("#gpSI"+tengely).html('');
        $("#gpSI"+tengely).append('<option value=mind></option>');
        for (var i = 0;i < result.length;i++){
            res = result[i];
            $("#gpSI"+tengely).append('<option value="'+res.SI+'">'+res.SI+'</option>');
        }
        if (def!='') $('#gpSI'+tengely+' option[value='+def+']').prop('selected', 'selected');
	}
	siUpdate=false;
}
function getSIA(result) {getSI(result,'A')}
function getSIB(result) {getSI(result,'B')}
function getSIP(result) {getSI(result,'P')}


/* gumipanel eddig */
/* beerkezes eddig */


/*
initMibizList->mibizList->selectTask->panelInit->showReview->rszChange->rszAdatokGet->#bgumi.click->showPozPanel->showAllapotPanel->getPositions
(meres.tpl)bpozicio.click->selectPosition->checkMarka->btPrint->writeOk->rszMent (pozíció mentés)->getMelyseg->(meres.tpl)allapotMentes.click->allapotMentes->allapotMent(allapot,csere ok mentes)->(meres.tpl)bAllapotClose.click

zárás:
showReview->lezarStart->lezarUpdate->folytUpdate->folytKesobb->initMibizList

allapotpanel:
ha merni kell, vagy gumit valasztott, akkor feljon az allapot panel. 
ha meres nelkul kerte (kiveve gumi eseten, ott ilyenkor is van allapot panel)
    felni eseten automatikus nyomtatas erkezesi sorrendben, nincs jelentosege, hogy melyik felni melyik pozicio
    kerek eseten csak mennyiseg noveles van, mivel nem merunk es nyomtatni sem kell, mert mossak oket

sajceg:
[ANDROID]
ORZOTT_LERAKODAS_MINDENRE_NYOMTAT=IGEN //ilyenkor mindig nyomtat matricat. Ha "NEM", akkor kerek eseten nem nyomtat (mivel azt mossak - elvileg)
ORZOTT_MELYSEGMERES_KEZZEL_IS=NEM //csak merni lehet. "IGEN": kivalaszthato kezzel is

ha az adott tengelyen nincs meret minta stb beallitva, akkor nyomtatas helyett feldobja a gumipanelt. (showGPanel)
*/