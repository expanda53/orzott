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
	$('#bGumi, #bGumiFelni, #bFelni, #bPlus').bind('click',function () {
		//orzott.updateStart($(this));
		orzott.showPozPanel($(this));
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
	$('#bMenu').bind('click',function () {
		showMenu();
	})	
	$('#bMelyseg').bind('click',function () {
		orzott.melysegMeres();
	})	
	$('#bteszt').bind('click',function () {
		$('#divteszt').show();
	})	
	$('#bteszthide').bind('click',function () {
		$('#divteszt').hide();
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
			<button id=bMenu>Menü</button>
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
			<div class='drendszam'>
				<select id=rendszam>
				<{rendszamok}>
				</select>
			</div>
			<div class='dsofor'>
				<span class='labelSofor'>Sofőr</span>
				<span class='dataSofor'></span>
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
			</div>
			<div class='dcontrol'>
				<div class=divlabels>
					<div class=ddrbvart>
						<span class='labelDrbVart'>várt</span>
						<span class='dataDrbVart'>0</span>
					</div>
					<div class=ddrbkesz>
						<span class='labelDrbKesz'>lepakolva</span>
						<span class='dataDrbKesz'>0</span>
					</div>
				</div>
				<div class=dButtons>
					<div class='labelPrint'>Címke nyomtatás</div>
					<button class='bprint' id=bGumi>Gumi</button>
					<button class='bprint' id=bGumiFelni>Gumi+Felni</button>
					<button class='bprint' id=bFelni>Felni</button>
					<div class='labelPrint'>Nyomtatás nélkül</div>
					<button class='bnoprint' id=bPlus>+1</button>
					<button class='bnoprint' id=bJavitas>Javítás</button>
					<button class='bnoprint' id=bNincsMeg>Nincs meg</button>
					<button class='bnoprint' id=bOBeerkMenu>Átnézés</button>
					<button class='bnoprint' id=bMelyseg>Mérés</button>
					<!-- <button class='bteszt' id=bteszt>Teszt</button>					-->
				</div>
				<div id=divteszt>
					<textarea id=tplprint rows="10" cols="50">
					</textarea>
					<button id=bteszthide>bezár</button>					
				</div>
			</div>
		</div>
		<!-- panel end -->
		<!-- melysegmeres panel -->
		<div id=divmeres>
		</div>
		<!-- melysegmeres panel end -->
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