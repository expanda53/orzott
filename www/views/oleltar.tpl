<script>
	

	
	$('#bFolytMost').bind('click',function (event) {
        leltar.folytMost(event);
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
				<div id=labelHkod>Helykód</div>
				<input id=dataHkod>
                <button id=bUjHkod>Új helykód</button>
			</div>

			<div class='drendszam'>
				<div id=labelRendszam>Rendszám</div>
				<input id=dataRendszam>
			</div>
		</div>

        <div class='rszadatok'>
            <div class='dmeretminta'>
                <span class='dataMeret'></span>
            </div>
            <div class='dfegu'>
                <span class='labelFelniGumi'>Felni/Gumi:</span>
                <span class='dataFegu'></span>
                <span class='dataFeall'></span>
            </div>
        </div>
        <div id=gpanelcontainer></div>
		<!-- panel end -->
		<!-- melysegmeres panel -->
		<div id=divmeres>
		</div>
		<!-- melysegmeres panel end -->
		<div id=divreview>
			<div class=divReviewTables>
				<div class=divreviewRight>
					<div class=divTableReview>
						<table class=tableReview></table>
					</div>
				</div>
				<div class=dButtonsReview>
					<button id=bFolytMost>Folyt. most</button>
					<!-- <button id=bFolytKesobb>Folyt. később</button> -->
					<button id=bLezar>Lezárás</button>
				</div>			
			</div>
		</div>
</div>
</body>