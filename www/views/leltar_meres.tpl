<script>
    var defgstat=null;
	function uncheckAll(){
		$('#cbcs').prop('checked',false);
		$('#cbfcs').prop('checked',false);
		$('#cbfs').prop('checked',false);
		$('#cbd').prop('checked',false);	
	}
	uncheckAll();
	if (leltar.currentItem=='A') {
        $('#cbfcs').attr('disabled',true);
        $('#cbfs').attr('disabled',true);
    }
	$('#cbd').attr('disabled',true);	
    if (leltar.currentItem=='F') {
        $('#cbcs').attr('disabled',true);	
    }
    
    
	$('#bAllapotClose').bind('click',function () {
		$('#divmeres').hide();
		$('#divpanel').show();
        $('.rszadatok').hide();
        $('.dcontrol').hide();
        
        leltar.currentPosition="";
        leltar.currentItem="";
        leltar.currentRsz = "";                    
        $("#dataRendszam").prop('disabled', false);
        $('#dataRendszam').val('');
        $('#dataRendszam').focus();
	})
	$('#bAllapotMent').bind('click',function () {
		leltar.allapotMentes();
	})
	$('#bAllapotJavitas').bind('click',function () {
		leltar.rszJavitas();	
	})

	$('#gstat').bind('change',function(){
		uncheckAll();
		defgstat = $('#gstat').val();
		if (defgstat==null || defgstat=='-' || defgstat=='') {
            //ha uresre allitotta, akkor csak a cseret valaszthatja
            if (leltar.currentItem=='A') {
                //gumi eseten a felniseket nem valaszthatja
                $('#cbfcs').attr('disabled',true);
                $('#cbfs').attr('disabled',true);
            }
            //defekt mindig lekapcsolva, csak meres utan lehet valasztani
			$('#cbd').attr('disabled',true);	
		}
		else {
            //ha nem ures
			if (leltar.currentItem!='A') {
                //ha felni vagy kerek, akkor valaszthatja a felnis allapotokat 
				$('#cbfcs').removeAttr('disabled');
				$('#cbfs').removeAttr('disabled');
			}
			//ha nem felni, akkor a defekt is valaszthato. 
            if (leltar.currentItem!='F') $('#cbd').removeAttr('disabled');	
            else {
                //felni eseten cs nem valaszthato, csak a fcs, fs
                $('#cbcs').attr('disabled',true);
            }

		}
		$('.divgcsok').hide();
		$('#gcsok').val("");

		
	})
        
	$('.divcb input[type=checkbox]').change(function(){
		if ($(this).attr('id')=='cbcs') {
			//ha a cseret valasztotta, akkor a defektet kikapcsoljuk. Ha cseret kikapcsolta, akkor a defektet bekapcsoljuk
			defekt_disabled = $(this).prop('checked');
            //ha felni van kivalasztva, a defektet nem lehet bekapcsolni
            if (leltar.currentItem == 'F') defekt_disabled = true;
            $('#cbd').attr('disabled',defekt_disabled);
            //ha nincs merve, akkor csak a cs, csfcs, fs valaszthato. Gumi eseten csak a cs. Defekt soha
            if (defgstat==null || defgstat=='-' || defgstat=='') {
                $('#cbd').attr('disabled',true);	
            }
			if ($(this).prop('checked')) $('.divgcsok').show();
			else {
				$('.divgcsok').hide();
				$('#gcsok').val("");
			}
		}
		if ($(this).attr('id')=='cbd') $('#cbcs').attr('disabled',$(this).prop('checked'));
		if ($(this).attr('id')=='cbfcs') $('#cbfs').attr('disabled',$(this).prop('checked'));		
		if ($(this).attr('id')=='cbfs') $('#cbfcs').attr('disabled',$(this).prop('checked'));		

		newgstat = defgstat;
		if (newgstat==null) newgstat='';
		if ($('#cbcs').prop('checked')) {
			//ha a cseret valasztotta, akkor a mert erteket ki kell ra cserelni
			newgstat='CS';
		}
		
		
		$('.divcb input:checkbox').each(function(){
			
			if ($(this).prop('checked') && $(this).attr('id')!='cbcs'){
				val = $(this).attr('val').toUpperCase();
				newgstat += val;
				
			}
		})
		$('#gstat').val(newgstat);
        if ($('#gstat').val()==null && newgstat!='') {
            showMessage('Nincs ilyen választható állapot!');
            $('#gstat').val(defgstat);
        }
	})
	
		
</script>
<div class=meres>
<!-- <span id=muvelet></span> -->
<div id=divallapot>
	<div id=divgstat>
		<span id=labelGstat>Állapot</span>
		<select id=gstat></select>
	</div>
<div id=divcsok>
		<div id='labelcsok'>Sérülés,csere</div>
		<div class='divcb'><input type=checkbox val='D' id=cbd />D</div>
		<div class='divcb'><input type=checkbox val='FS' id=cbfs />FS</div>
		<div class='divcb'><input type=checkbox val='FCS' id=cbfcs />FCS</div>
		<div class='divcb'><input type=checkbox val='CS' id=cbcs />CS</div>
		<div class='divgcsok'>
			<select id=gcsok>
				<option value="" selected>Válasszon</option>
				<option value="Futófelület sérült">Futófelület sérült</option>
				<option value="Legyalogolva">Legyalogolva</option>
				<option value="Légzáró réteg elválás">Légzáró réteg elválás</option>
				<option value="Nem javítható defekt">Nem javítható defekt</option>
				<option value="Nem szakszerű javítás">Nem szakszerű javítás</option>
				<option value="Oldalfal sérült">Oldalfal sérült</option>
				<option value="Rendellenes kopás (közepe kikopva)">Rendellenes kopás (közepe kikopva)</option>
				<option value="Rendellenes kopás (szélei kopottak)">Rendellenes kopás (szélei kopottak)</option>
				<option value="Rendellenes kopás (féloldalas kopás)">Rendellenes kopás (féloldalas kopás)</option>
				<option value="Súlyosan elöregedve">Súlyosan elöregedve</option>
				<option value="Szálszakadt">Szálszakadt</option>
				<option value="Vállban sérült">Vállban sérült</option>
			</select>
		</div>
		
	</div>	
</div>
<button id=bAllapotMent>Mentés</button>
<button id=bAllapotClose>Bezár</button>
</div>