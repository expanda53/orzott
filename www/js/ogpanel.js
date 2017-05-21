
var OGPanel = function(){
    this.markaUpdate = false;
    this.meretUpdate = false;
    this.mintaUpdate = false;
    this.siUpdate = false;
    this.rszAdatokTEMP=null;
}
        
OGPanel.prototype.rszAdatokSet = function (result){
	//alert(JSON.stringify(result));
}

OGPanel.prototype.GPanelOptions = function (saveData){
  /* tengelyek adatainak masolasa, torlese  */
  $('#divGPOptions').show();
  $('#boptclose').bind('click',function(){
		$('#divGPOptions').hide();
  })
  $('#bcopyAB').bind('click',function(){
		gpanel.GPanelFunctions('copy','A','B');
  })
  $('#bcopyAP').bind('click',function(){
		gpanel.GPanelFunctions('copy','A','P');
  })
  $('#bcopyBA').bind('click',function(){
		gpanel.GPanelFunctions('copy','B','A');
  })
  $('#bcopyBP').bind('click',function(){
		gpanel.GPanelFunctions('copy','B','P');
  })
  $('#bdelA').bind('click',function(){
		gpanel.GPanelFunctions('del','A','');
  })
  $('#bdelB').bind('click',function(){
		gpanel.GPanelFunctions('del','B','');
  })
  $('#bdelP').bind('click',function(){
		gpanel.GPanelFunctions('del','P','');
  })
  $('#bxcAB').bind('click',function(){
		gpanel.GPanelFunctions('xc','A','B');
  })  
  
}
OGPanel.prototype.GPanelFunctions = function(func,src,trg){
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
        //A->B
        gpanel.GPanelFunctions('copy',src,trg);
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
	$('#divGPOptions').hide();
		
}

OGPanel.prototype.GPanelClose = function (saveData){
	if (saveData) {
			gpanel.rszAdatokTEMP.RAKTARBAN = $('#gpEvszak option:selected').val();
            //gpanel.fedb = $('#gpFelnidb option:selected').val();
			gpanel.rszAdatokTEMP.FEALL=$('#gpFelnitip option:selected').val();
			gpanel.rszAdatokTEMP.AMARKA=$('#gpMarkaA option:selected').text();//9
			gpanel.rszAdatokTEMP.AMERET=$('#gpMeretA option:selected').text();//10
			gpanel.rszAdatokTEMP.AMINTA=$('#gpMintaA option:selected').text()//11
			gpanel.rszAdatokTEMP.ASI=$('#gpSIA option:selected').text();//18
			
			gpanel.rszAdatokTEMP.BMARKA=$('#gpMarkaB option:selected').text();//12
			gpanel.rszAdatokTEMP.BMERET=$('#gpMeretB option:selected').text();//13
			gpanel.rszAdatokTEMP.BMINTA=$('#gpMintaB option:selected').text();//14
			gpanel.rszAdatokTEMP.BSI=$('#gpSIB option:selected').text();//19
			
			gpanel.rszAdatokTEMP.PMARKA=$('#gpMarkaP option:selected').text();//15
			gpanel.rszAdatokTEMP.PMERET=$('#gpMeretP option:selected').text();//16
			gpanel.rszAdatokTEMP.PMINTA=$('#gpMintaP option:selected').text();//17
			gpanel.rszAdatokTEMP.PSI=$('#gpSIP option:selected').text();//20
			newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI;
            gpanel.rszAdatokTEMP.MARKA = gpanel.rszAdatokTEMP.AMARKA;
            gpanel.rszAdatokTEMP.MINTA = gpanel.rszAdatokTEMP.AMINTA + ' ' + gpanel.rszAdatokTEMP.ASI;
            gpanel.rszAdatokTEMP.MERET = gpanel.rszAdatokTEMP.AMERET;
            if (gpanel.rszAdatokTEMP.BMINTA!='' && gpanel.rszAdatokTEMP.BMINTA!=gpanel.rszAdatokTEMP.AMINTA) {
                gpanel.rszAdatokTEMP.MINTA += '+'+gpanel.rszAdatokTEMP.BMINTA + ' ' + gpanel.rszAdatokTEMP.BSI;
            }
            if (gpanel.rszAdatokTEMP.BMERET!='' && gpanel.rszAdatokTEMP.BMERET!=gpanel.rszAdatokTEMP.AMERET) {
                gpanel.rszAdatokTEMP.MERET+= '+'+gpanel.rszAdatokTEMP.BMERET;
            }
            
			if (gpanel.rszAdatokTEMP.BMARKA!='' && gpanel.rszAdatokTEMP.BMARKA!=gpanel.rszAdatokTEMP.AMARKA) {
				newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI + ' + ' + gpanel.rszAdatokTEMP.BMARKA+' '+gpanel.rszAdatokTEMP.BMERET+' '+gpanel.rszAdatokTEMP.BMINTA+' '+gpanel.rszAdatokTEMP.BSI;
                gpanel.rszAdatokTEMP.MARKA += '+'+gpanel.rszAdatokTEMP.BMARKA;
			}
			else
			if (gpanel.rszAdatokTEMP.BMARKA!='' && gpanel.rszAdatokTEMP.BMARKA==gpanel.rszAdatokTEMP.AMARKA) {
				if (gpanel.rszAdatokTEMP.BMERET!='' && gpanel.rszAdatokTEMP.BMERET==gpanel.rszAdatokTEMP.AMERET) {
					if (gpanel.rszAdatokTEMP.BMINTA!='' && gpanel.rszAdatokTEMP.BMINTA==gpanel.rszAdatokTEMP.AMINTA) {
						if (gpanel.rszAdatokTEMP.BSI!='' && gpanel.rszAdatokTEMP.BSI==gpanel.rszAdatokTEMP.ASI) {
							newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI; //egyezik minden
						}
						else newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI+'+'+gpanel.rszAdatokTEMP.BSI; //csak SI eltérés
						
					}
					else newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI + ' + ' + gpanel.rszAdatokTEMP.BMINTA+' '+gpanel.rszAdatokTEMP.BSI;//minta,si eltérés
				}
				else newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI + ' + ' + gpanel.rszAdatokTEMP.BMERET+' '+gpanel.rszAdatokTEMP.BMINTA+' '+gpanel.rszAdatokTEMP.BSI; //meret,minta,si eltérés
			}
			else newContent=gpanel.rszAdatokTEMP.AMARKA+' '+gpanel.rszAdatokTEMP.AMERET+' '+gpanel.rszAdatokTEMP.AMINTA+' '+gpanel.rszAdatokTEMP.ASI + ' + ' + gpanel.rszAdatokTEMP.BMARKA+' '+gpanel.rszAdatokTEMP.BMERET+' '+gpanel.rszAdatokTEMP.BMINTA+' '+gpanel.rszAdatokTEMP.BSI; //marka,meret,minta,si eltérés
			newContent = newContent.trim();
			if (newContent.indexOf('+')==0) {
				newContent = newContent.replace('+','').trim();
			}
			//fn='gpanel.rszAdatokSet'; /* PDA_ORZOTTLERAK_RSZUPDATE */
            
            f=gpanel.callback.split(".");
            if (f.length>1) {
                var myFunc = window[f[0]][f[1]];
            }
            else {
                var myFunc = window[fn];
            }
            if(typeof myFunc === 'function') {
                myFunc(gpanel.rszAdatokTEMP);
            }
			
            

			$('.dataMeret').html(newContent);
			//$(".dataFegu").html(gpanel.fedb+'/'+gpanel.gudb);
			feall='';
			if (checkParam(gpanel.rszAdatokTEMP.FEALL)=='L' && gpanel.rszAdatokTEMP.FE>0) feall='Lemez';
			if (checkParam(gpanel.rszAdatokTEMP.FEALL)=='A' && gpanel.rszAdatokTEMP.FE>0) feall='Alu';
			$(".dataFeall").html(feall);
			
	}
	
	$('#gpMarkaA, #gpMarkaB, #gpMarkaP, #gpMeretA, #gpMeretB, #gpMeretP, #gpMintaA, #gpMintaB, #gpMintaP, #gpSIA, #gpSIB, #gpSIP').html('');	
	$('#divgpanel').hide();
	$('.drendszam, .rszadatok, .dhkod, .dcontrol, #bRszMentes').show();
	
}
OGPanel.prototype.showGPanel =function(rszAdatok,fn){
    //gumipanel
    gpanel.rszAdatokTEMP = rszAdatok;
    gpanel.callback = fn;
    $('#bGPanelClose').bind('click',function () {
        gpanel.GPanelClose(true);
    })	
    $('#bGPanelCancel').bind('click',function () {
        gpanel.GPanelClose(false);
    })	
    $('#bGPanelOptions').bind('click',function () {
        gpanel.GPanelOptions();
    })	
   
	$('.drendszam, .rszadatok, .dhkod, .dcontrol, #bRszMentes').hide();
        /* evszak */
        $('#gpEvszak').val(gpanel.rszAdatokTEMP.RAKTARBAN);
        $('#gpEvszak').bind('change',function(event){
            /* evszak valtasnal torlom az adatokat */
            gpanel.GPanelFunctions('del','A','');
            gpanel.GPanelFunctions('del','B','');
            gpanel.GPanelFunctions('del','P','');
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
		if (checkParam(gpanel.rszAdatokTEMP.AMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.AMARKA,'meret':gpanel.rszAdatokTEMP.AMERET,'minta':gpanel.rszAdatokTEMP.AMINTA,'si':gpanel.rszAdatokTEMP.ASI},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.BMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.BMARKA,'meret':gpanel.rszAdatokTEMP.BMERET,'minta':gpanel.rszAdatokTEMP.BMINTA,'si':gpanel.rszAdatokTEMP.BSI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMarka'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':'mind','meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.PMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.PMARKA,'meret':gpanel.rszAdatokTEMP.PMERET,'minta':gpanel.rszAdatokTEMP.PMINTA,'si':gpanel.rszAdatokTEMP.PSI,'evszak':'mind'},true, fn+tengely);
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
		if (checkParam(gpanel.rszAdatokTEMP.AMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.AMARKA,'meret':gpanel.rszAdatokTEMP.AMERET,'minta':gpanel.rszAdatokTEMP.AMINTA,'si':gpanel.rszAdatokTEMP.ASI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.BMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.BMARKA,'meret':gpanel.rszAdatokTEMP.BMERET,'minta':gpanel.rszAdatokTEMP.BMINTA,'si':gpanel.rszAdatokTEMP.BSI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}

		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMeret'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':'mind','minta':$('#gpMinta'+tengely).val(),'si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.PMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.PMARKA,'meret':gpanel.rszAdatokTEMP.PMERET,'minta':gpanel.rszAdatokTEMP.PMINTA,'si':gpanel.rszAdatokTEMP.PSI,'evszak':'mind'},true, fn+tengely);
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
		if (checkParam(gpanel.rszAdatokTEMP.AMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.AMARKA,'meret':gpanel.rszAdatokTEMP.AMERET,'minta':gpanel.rszAdatokTEMP.AMINTA,'si':gpanel.rszAdatokTEMP.ASI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.BMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.BMARKA,'meret':gpanel.rszAdatokTEMP.BMERET,'minta':gpanel.rszAdatokTEMP.BMINTA,'si':gpanel.rszAdatokTEMP.BSI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getMinta'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':'mind','si':$('#gpSI'+tengely).val(),'evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.PMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.PMARKA,'meret':gpanel.rszAdatokTEMP.PMERET,'minta':gpanel.rszAdatokTEMP.PMINTA,'si':gpanel.rszAdatokTEMP.PSI,'evszak':'mind'},true, fn+tengely);
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
		if (checkParam(gpanel.rszAdatokTEMP.AMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.AMARKA,'meret':gpanel.rszAdatokTEMP.AMERET,'minta':gpanel.rszAdatokTEMP.AMINTA,'si':gpanel.rszAdatokTEMP.ASI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='B';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI'; /* query */
			tengely='B';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':$('#gpEvszak').val()},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.BMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.BMARKA,'meret':gpanel.rszAdatokTEMP.BMERET,'minta':gpanel.rszAdatokTEMP.BMINTA,'si':gpanel.rszAdatokTEMP.BSI,'evszak':$('#gpEvszak').val()},true, fn+tengely);
		}
		
		tengely='P';
		$('#'+obj+tengely).focus(function(){ 
			fn='getSI'; /* query */
			tengely='P';
			ajaxCall(fn,{'marka':$('#gpMarka'+tengely).val(),'meret':$('#gpMeret'+tengely).val(),'minta':$('#gpMinta'+tengely).val(),'si':'mind','evszak':'mind'},false, fn+tengely);
		});
		if (checkParam(gpanel.rszAdatokTEMP.PMARKA)!='') {
			ajaxCall(fn,{'marka':gpanel.rszAdatokTEMP.PMARKA,'meret':gpanel.rszAdatokTEMP.PMERET,'minta':gpanel.rszAdatokTEMP.PMINTA,'si':gpanel.rszAdatokTEMP.PSI,'evszak':'mind'},true, fn+tengely);
		}
		
		//felni:
		felnidef = checkParam(gpanel.rszAdatokTEMP.FEALL);
		if (felnidef=='') felnidef='-';
		$('#gpFelnitip option[value='+felnidef+']').prop('selected', 'selected');
		$('#gpFelnidb option[value='+gpanel.rszAdatokTEMP.FE+']').prop('selected', 'selected');
		$('#divgpanel').show();
}

function getMarka(result,tengely){
	if (markaUpdate==false) {
	markaUpdate=true;
	def = $("#gpMarka"+tengely+' option:selected').val();
	if (def=='mind') def='';
	if (def=='' || def==null) {
		if (tengely=='A') def = gpanel.rszAdatokTEMP.AMARKA.trim();
		if (tengely=='B') def = gpanel.rszAdatokTEMP.BMARKA.trim();
		if (tengely=='P') def = gpanel.rszAdatokTEMP.PMARKA.trim();
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
		if (tengely=='A') def=gpanel.rszAdatokTEMP.AMERET.trim();
		if (tengely=='B') def=gpanel.rszAdatokTEMP.BMERET.trim();
		if (tengely=='P') def=gpanel.rszAdatokTEMP.PMERET.trim();
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
		if (tengely=='A') def=gpanel.rszAdatokTEMP.AMINTA.trim();
		if (tengely=='B') def=gpanel.rszAdatokTEMP.BMINTA.trim();
		if (tengely=='P') def=gpanel.rszAdatokTEMP.PMINTA.trim();
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
		if (tengely=='A') def = gpanel.rszAdatokTEMP.ASI.trim();
		if (tengely=='B') def = gpanel.rszAdatokTEMP.BSI.trim();
		if (tengely=='P') def = gpanel.rszAdatokTEMP.PSI.trim();
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

