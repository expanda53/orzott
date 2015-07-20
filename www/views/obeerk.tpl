<script>
	$('.tmibizlist tr').bind('click',function(){
		tr = $(this);
		id = tr.find(".tmibiz").html();
		mszam3 = tr.find(".tmszam3").html();
		beerk.selectTask(id,mszam3);
	})
	
/*
	$('#bOBeerkMenu').bind('click',function () {
		//showMenu();
		beerk.showReview();
	})
*/	
	$('#bGumi, #bGumiFelni, #bFelni').bind('click',function () {
		beerk.showPozPanel($(this));
	})
	$('#bJavitas').bind('click',function () {
		beerk.rszJavitas();
	})
	$('#bFolytMost').bind('click',function () {
		$('#divreview').hide();
		$('#divpanel').show();
	})
	$('#bFolytKesobb').bind('click',function () {
		beerk.folytKesobb();
	})	
	$('#bLezar').bind('click',function () {
		beerk.lezarStart();
	})	
	/*
	$('#bNincsMeg').bind('click',function () {
		beerk.nincsMegStart();
	})
*/	
	$('#bMenu').bind('click',function () {
		showMenu();
	})	
	$('#bteszt').bind('click',function () {
		$('#divteszt').show();
	})	
	$('#bteszthide').bind('click',function () {
		$('#divteszt').hide();
	})	
	$('#bGPanelClose').bind('click',function () {
		$('#divgpanel').hide();
		$('.drendszam, .rszadatok, .dcontrol').show();
	})	
	
	
</script>
<body>
<input type=hidden id=hAZON>
<input type=hidden id=hMIBIZ>
<input type=hidden id=hSORSZ>
<input type=hidden id=rendszam>
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
				<span id=srendszam onclick='beerk.showReview()'></span>
			</div>
			<div class='rszadatok' onclick='beerk.showGPanel()'>
				<!--
				<div class='dceg'>
					<span class='labelCeg'>Cég:</span>
					<span class='dataCeg'></span>
				</div>
				-->
				<div class='dmeretminta'>
					<span class='labelMeret'>Méret,minta:</span>
					<span class='dataMeret'></span>
				</div>
				<div class='dfegu'>
					<span class='labelFelniGumi'>Felni/Gumi:</span>
					<span class='dataFegu'></span>
				</div>
			</div>
			<div id=divgpanel>
				<select id=gpMarkaA></select>
				<select id=gpMeretA></select>
				<select id=gpMintaA></select>
				<select id=gpSIA></select>
				<br>
				<select id=gpMarkaB></select>
				<select id=gpMeretB></select>
				<select id=gpMintaB></select>
				<select id=gpSIB></select>
				<br>
				<select id=gpMarkaP></select>
				<select id=gpMeretP></select>
				<select id=gpMintaP></select>
				<select id=gpSIP></select>
				
				<button id=bGPanelClose>Bezár</button>
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
					<!--<button class='bnoprint' id=bPlus>+1</button>-->
					<button class='bnoprint' id=bJavitas>Javítás</button>
					<!-- <button class='bnoprint' id=bNincsMeg>Nincs meg</button> -->
					<!--<button class='bnoprint' id=bOBeerkMenu>Átnézés</button>-->
					<!--<button class='bnoprint' id=bMelyseg>Mérés</button>-->
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
			<div class=divReviewTables>
			<div class=divreviewLeft>
				<!--
				<div class=divreviewLeftFilter>
					<button id=letter1>1</button>
					<button id=letter2>2</button>
					<button id=letter3>3</button>
				</div>
				-->
				<div class='divreviewLeftContent'>
					<table class=tableReviewFilter>
						<tbody>
						</tbody>
					</table>
				</div>
				
			</div>
			<div class=divreviewRight>
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
			</div>
			</div>
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