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
            szortir.folytKesobb();
            event.handled = true;
        } else {
            return false;
        }
		
	})	
	$('#bLezar').bind('click',function () {
		szortir.lezarStart();
	})	
	$('#bAtnez').bind('click',function () {
		//showMenu();
		szortir.showReview();
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
		Őrzött abroncs szortír
	</div>
	<div id=divcontent>
		<!-- panel -->
		<div id=divpanel>
			<button id=bAtnez>Átnézés</button>
			<div class='drendszam'>
				<span id=labelRendszam>Rendszám</span>
				<input id=dataRendszam>
                <span class='dataRSZ'></span>
				<span id='labelStatus'></span>
			</div>
			<div class='rszadatok'>
				<div class='drsz'>
					
				</div>
				<div class='dmszam3'>
					<span class='rszadatokLabel' id='labelMszam3'>Sofőr:</span>
                    <span class='rszadatokData' id='dataMszam3'></span>
				</div>                                
				<div class='djarat'>
					<span class='rszadatokLabel' id='labelJarat'>Járat:</span>
                    <span class='rszadatokData' id='dataJarat'></span>
				</div>                
				<div class='dosszdrb'>
					<span class='rszadatokLabel' id='labelOsszdrb'>Szortírozandó:</span>
                    <span class='rszadatokData' id='dataOsszdrb'></span>
				</div>
				<div class='dkeszdrb'>
					<span class='rszadatokLabel' id='labelKeszdrb'>Szortírozva:</span>
                    <span class='rszadatokData' id='dataKeszdrb'></span>
				</div>                

                <!--
				<div class='dmeret'>
					<span class='labelCikk'>Cikk:</span>
                    <span class='dataCikk'></span>
				</div>
				<div class='dfegu'>
					<span class='labelFelniGumi'>Felni/Gumi:</span>
					<span class='dataFegu'></span>
					<span class='dataFeall'></span>
				</div>
                <div class='dpoz'>
                    <span class='labelPoz'>Pozíció:</span>
					<span class='dataPoz'></span>
                </div>
				<div class='dgstat'>
					<span class='dataGSTAT'></span>
				</div>
				<div class='dcegnev'>
					<span class='labelCegnev'>Tulaj:</span>
                    <span class='dataCegnev'></span>
				</div>
				<div class='draktarban'>
					<span class='labelRaktarban'>Szezon:</span>
                    <span class='dataRaktarban'></span>
				</div>
                -->                
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