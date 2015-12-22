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
            leltar.folytKesobb();
            event.handled = true;
        } else {
            return false;
        }
		
	})	
	$('#bLezar').bind('click',function () {
		leltar.lezarStart();
	})	
	$('#bAtnez').bind('click',function () {
		//showMenu();
		leltar.showReview();
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
		Őrzött abroncs leltár
	</div>
	<div id=divcontent>
		<!-- panel -->
		<div id=divpanel>
			<button id=bAtnez>Átnézés</button>
			<div class='dhkod'>
				<span id=labelHkod>Helykód</span>
				<input id=dataHkod>
			</div>

			<div class='drendszam'>
				<span id=labelRendszam>Rendszám</span>
				<input id=dataRendszam>
				<span id='labelStatus'></span>
			</div>
			<div class='rszadatok'>
				<!--
				<div class='dceg'>
					<span class='labelCeg'>Cég:</span>
					<span class='dataCeg'></span>
				</div>
				-->
				<div class='drsz'>
					<span class='dataRSZ'></span>
				</div>
				<div class='dmeretminta'>
					<span class='dataMeret'></span>
				</div>
				<div class='dfegu'>
					<span class='labelFelniGumi'>Felni/Gumi:</span>
					<span class='dataFegu'></span>
					<span class='dataFeall'></span>
				</div>
			</div>
		</div>
		<!-- panel end -->

		<div id=divreview>
			<div class=divReviewTables>
				<div class=divreviewRight>
					<div class=divTableReview>
						<table class=tableReview></table>
					</div>
				</div>
				<div class=dButtonsReview>
					<button id=bFolytMost>Folyt. most</button>
					<button id=bFolytKesobb>Folyt. később</button>
					<button id=bLezar>Lezárás</button>
				</div>			
			</div>
		</div>
</div>
</body>