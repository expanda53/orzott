<script>
	

	
	$('#bFolytMost').bind('click',function (event) {
		event.stopPropagation();
        event.preventDefault();
        if(event.handled !== true) {
			clickHelp();
			$('#divreview').hide();
			$('#divpanel').show();
            event.handled = true;
        } else {
            return false;
        }
	})
	$('#bFolytKesobb').bind('click',function (event) {
		event.stopPropagation();
        event.preventDefault();
		clickHelp();
        if(event.handled !== true) {

            beerk.folytKesobb();

            event.handled = true;
        } else {
            return false;
        }
		
	})	
	$('#bLezar').bind('click',function () {
		beerk.lezarStart();
	})	
	$('#bMenu').bind('click',function () {
		showMenu();
	})	
	$('#bGPanelClose').bind('click',function () {
		beerk.GPanelClose(true);
	})	
	$('#bGPanelCancel').bind('click',function () {
		beerk.GPanelClose(false);
	})	
	$('#bGPanelOptions').bind('click',function () {
		beerk.GPanelOptions();
	})	

	
	
</script>
<body>
<div id=divclick></div>
<input type=hidden id=hAZON>
<input type=hidden id=hMIBIZ>
<input type=hidden id=hSORSZ>
<input type=hidden id=rendszam>
<div id=tploBeerk>
	<div id=divheader>
		Beérkezett abroncsok elrakodása
	</div>
	<div id=divcontent>
		<!-- panel -->
		<div id=divpanel>
			<button id=bMenu>Menü</button>
			<div class='drendszam'>
				<span id=labelRendszam>Rendszám</span>
				<input id=dataRendszam>
			</div>
			<div class='rszadatok'>
				<!--
				<div class='dceg'>
					<span class='labelCeg'>Cég:</span>
					<span class='dataCeg'></span>
				</div>
				-->
				<div class='dmeretminta'>
					<span class='dataMeret'></span>
				</div>
				<div class='dfegu'>
					<span class='labelFelniGumi'>Felni/Gumi:</span>
					<span class='dataFegu'></span>
					<span class='dataFeall'></span>
				</div>
			</div>
			<div class='dhkod'>
				<span id=labelHkod>Helykód</span>
				<input id=dataHkod>
			</div>

			<div class='dcontrol'>
					<button class='bnoprint' id=bJavitas>Javítás</button>
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
			<div class=divTableReview>
			<table class=tableReview></table>
			</div>
			</div>
			<div id=divhiany>
				<div class=labelHiany></div>
				<div class=dataHiany></div>
			</div>
			<div class=dButtonsReview>
				<button id=bElteres>Eltérések</button>
				<button id=bFolytMost>Folyt. most</button>
				<button id=bFolytKesobb>Folyt. később</button>
				<button id=bLezar>Lezárás</button>
			</div>			
		</div>
		
	</div>
</div>
</body>