<script>
	$('#bAllapotClose').bind('click',function () {
		$('#divmeres').hide();
		$('#divpanel').show();
	})
	$('.bpozicio').bind('click',function () {
		beerk.selectPosition($(this));
	})
	$('#bAllapotMent').bind('click',function () {
		beerk.allapotMentes();
	})
	
</script>
<div class=meres>
Állapot felmérés<br>
<span id=muvelet></span>
<div id=divpozicio>
	<button class=bpozicio id=bJE>JE-1</button>
	<button class=bpozicio id=bBE>BE-2</button>
	<button class=bpozicio id=bJH>JH-3</button>
	<button class=bpozicio id=bBH>BH-4</button>
	<button class=bpozicio id=bPOT>POT-5</button>
	<button class=bpozicio id=bJHI>JHI-6</button>
	<button class=bpozicio id=bBHI>BHI-7</button>
	
	
</div>
<div id=divallapot>
	<div id=divgstat>
		<span>Állapot</span>
		<select id=gstat>
		</select>
	</div>
</div>
<button id=bAllapotMent>Mentés</button>
<button id=bAllapotClose>Bezár</button>
</div>