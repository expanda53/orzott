<script>
	$('.tmibizlist tr').bind('click',function(){
		tr = $(this);
		id = tr.find(".tmibiz").html();
		orzott.selectTask(id);
	})
	
	$('#bOBeerkMenu').bind('click',function () {
		//showMenu();
		orzott.showReview();
	})
	$('#rendszam').bind('change',function () {
		orzott.rszChange();
	})	
	$('#bGumi, #bGumiFelni, #bFelni').bind('click',function () {
		orzott.updateStart($(this));
	})
	$('#bJavitas').bind('click',function () {
		orzott.rszJavitas();
	})
	$('#bFolytMost').bind('click',function () {
		$('#divreview').hide();
		$('#divpanel').show();
	})
	$('#bFolytKesobb').bind('click',function () {
		orzott.folytKesobb();
	})	
	$('#bLezar').bind('click',function () {
		orzott.lezarStart();
	})	
	$('#bNincsMeg').bind('click',function () {
		orzott.nincsMeg();
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
					<button id=bOBeerkMenu>Átnézés</button>					
				</div>
			</div>
		</div>
		<!-- panel end -->
		<div id=divreview>
			<table class=tableReview>
				<thead>
				<tr>
					<th>Rendszám</th>
					<th>Lerakodandó</th>
					<th>Lerakodott</th>
				</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<div id=divhiany>
				<span class=labelHiany></span>
				<span class=dataHiany></span>
			</div>
			<div class=dButtons>
				<button id=bFolytMost>Folyt. most</button>
				<button id=bFolytKesobb>Folyt. később</button>
				<button id=bLezar>Lezárás</button>
			</div>			
		</div>
		
	</div>
</div>
</body>