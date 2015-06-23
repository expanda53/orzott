<script>
	$('.tmibizlist tr').bind('click',function(){
		tr = $(this);
		id = tr.find(".tmibiz").html();
		orzott.selectTask(id);
	})
	
	$('#bOBeerkMenu').bind('click',function () {
		showMenu();
	})
	$('#rendszam').bind('change',function () {
		orzott.rszChange();
	})	
	$('#bGumi, #bGumiFelni, #bFelni').bind('click',function () {
		orzott.printClick($(this));
	})
	
</script>
<body>
<input type=hidden id=hAZON>
<input type=hidden id=hMIBIZ>
<input type=hidden id=hSORSZ>
<div id=tploBeerk>
	<div id=divheader>
		Örzött beérkezés
	</div>
	<div id=divcontent>
		<!-- tasklist -->
		<div id=divmibizlist>
			<table class=tmibizlist>
				<tr>
				<th>Sofőr</th>
				<th>Bizonylatszám</th>
				</tr>
				
				<{sorok}>
			</table>
		</div>
		<!-- tasklist end -->
		<!-- panel -->
		<div id=divpanel>
			<div class=buttons>
				<button id=bOBeerkMenu>Menü</button>
			</div>
			<div class='dsofor'>
				<span class='labelSofor'>Sofőr</span>
				<span class='dataSofor'></span>
			</div>
			<div class='drendszam'>
				<span class='labelRendszam'>Rendszám</span>
				<select id=rendszam>
				<{rendszamok}>
				</select>
			</div>
			<div class='rszadatok'>
				<div class='dceg'>
					<span class='labelCeg'>Cég:</span>
					<span class='dataCeg'></span>
				</div>
				<div class='dmeretminta'>
					<span class='labelMeret'>Méret,minta:</span>
					<span class='dataMeret'></span>
				</div>
				<div class='dfegu'>
					<span class='labelFelniGumi'>Felni/Gumi:</span>
					<span class='dataFegu'></span>
				</div>
				<div class=ddrbvart>
					<span class='labelDrbVart'>várt</span>
					<span class='dataDrbVart'>0</span>
				</div>
				<div class=ddrbkesz>
					<span class='labelDrbKesz'>lepakolva</span>
					<span class='dataDrbKesz'>0</span>
				</div>
				<div class=dButtons>
					<button id=bGumi>Gumi</button>
					<button id=bGumiFelni>Gumi+Felni</button>
					<button id=bFelni>Felni</button>
					<button id=bJavitas>Javítás</button>
					<button id=bNincsMeg>Nincs meg</button>
				</div>
			</div>
		</div>
		<!-- panel end -->
		
	</div>
</div>
</body>