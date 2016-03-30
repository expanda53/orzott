<script>
    var defgstat=null;
	function uncheckAll(){
		$('#cbcs').prop('checked',false);
		$('#cbfcs').prop('checked',false);
		$('#cbfs').prop('checked',false);
		$('#cbd').prop('checked',false);	
	}
	uncheckAll();
	$('#cbfcs').attr('disabled',true);
	$('#cbfs').attr('disabled',true);
	$('#cbd').attr('disabled',true);	
	
	$('#bAllapotClose').bind('click',function () {
		$('#divmeres').hide();
		$('#divpanel').show();
	})
	$('#bAllapotMent').bind('click',function () {
		elrak.allapotMentes();
	})
	$('#bAllapotJavitas').bind('click',function () {
		elrak.rszJavitas();	
	})

	$('#gstat').bind('change',function(){
		uncheckAll();
		defgstat = $('#gstat').val();
		if (defgstat==null || defgstat=='-' || defgstat=='') {
			$('#cbfcs').attr('disabled',true);
			$('#cbfs').attr('disabled',true);
			$('#cbd').attr('disabled',true);	
		}
		else {
			if (elrak.currentItem!='A') {
				$('#cbfcs').removeAttr('disabled');
				$('#cbfs').removeAttr('disabled');
			}
			$('#cbd').removeAttr('disabled');	
		}
		$('.divgcsok').hide();
		$('#gcsok').val("");

		
	})
	$('.divcb input[type=checkbox]').change(function(){
		if ($(this).attr('id')=='cbcs') {
			$('#cbd').attr('disabled',$(this).prop('checked'));
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
				<option value="Rendellenes kopás">Rendellenes kopás</option>
				<option value="Súlyosan elöregedve">Súlyosan elöregedve</option>
				<option value="Szálszakadt">Szálszakadt</option>
				<option value="Vállban sérült">Vállban sérült</option>
			</select>
		</div>
		
	</div>	
</div>
<button id=bAllapotMent>Mentés</button>
<button id=bAllapotClose>Bezár</button>
<!--<button id=bAllapotJavitas>Javítás</button>-->
</div>