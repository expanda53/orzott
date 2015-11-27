<script>
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

	
</script>
<div class=meres>
Állapot felmérés<br>
<!-- <span id=muvelet></span> -->
<div id=divallapot>
	<div id=divgstat>
		<span>Állapot</span>
		<select id=gstat>
		</select>
	</div>
</div>
<button id=bAllapotMent>Mentés</button>
<button id=bAllapotClose>Bezár</button>
<button id=bAllapotJavitas>Javítás</button>
</div>