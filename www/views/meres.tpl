<script>
	$('#bMeresClose').bind('click',function () {
		$('#divmeres').hide();
		$('#divpanel').show();
	})
	$('.bpozicio').bind('click',function () {
		orzott.updateStart($(this));
	})
	
</script>
Állapot felmérés<br>
<div id=divpozicio>
	<button class=bpozicio id=bJE>JE</button>
	<button class=bpozicio id=bJH>JH</button>
	<button class=bpozicio id=bBE>BE</button>
	<button class=bpozicio id=bBH>BH</button>
	<button class=bpozicio id=bJHI>JHI</button>
	<button class=bpozicio id=bBHI>BHI</button>
	<button class=bpozicio id=bPOT>POT</button>
	
</div>
<div id=dfelnitipus>
	<span>felni típus</span>
	<select id=felnitip>
		<{felnik}>
	</select>
</div>
<button id=bMeresClose>Bezár</button>