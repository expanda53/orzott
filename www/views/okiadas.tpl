<script>
	

	
	
</script>
<body>
<div id=divclick></div>
<input type=hidden id=hAZON>
<input type=hidden id=hMIBIZ>
<input type=hidden id=hSORSZ>
<input type=hidden id=rendszam>
<div id=tploBeerk>
	<div id=divheader>
		Őrzött abroncsok kiadása
	</div>
	<div id=divcontent>
		<!-- panel -->
		<div id=divpanel>
			<button id=bMenu>Menü</button>
			<button id=bEllenorzes>Ellenőrzés</button>
			
			<div id=divaltalanos>
				<div id=divsofor>
					<div id=labelSofor>Sofőr</div>
					<div id=dataSofor></div>
				</div>
				<div id=divjarat>
					<div id=labelJarat>Járat</div>
					<div id=dataJarat></div>
				</div>
				<div id=divraktar>
					<div id=labelRaktar>Raktár</div>
					<div id=dataRaktar></div>
				</div>
				
			</div>
			<div class='dhkod'>
				<span id=labelHkod>Helykód</span>
				<input id=dataHkod>
				<span id=labelHkodVart></span>
				<!-- <button id=bHkodUj>Új helykód</button> -->
			</div>
			<div class='drendszam'>
				<span id=labelRendszam>Rendszám</span>
				<input id=dataRendszam>
				<span id=labelRendszamVart></span>
				<button id=bNincs>Nincs meg</button>
			</div>
			

		</div>
		<!-- panel end -->
		<!-- review panel -->
		<div id=divreview>
			<div class=divReviewTables>
			<div class=divreviewLeft>
				<div class=divreviewLeftContent>
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
				<!--<button id=bElteres>Eltérések</button>-->
				<button id=bFolytMost>Folytatás</button>
				<button id=bLezar>Lezárás</button>
			</div>			
		</div>
		<!-- review panel end -->
		
	</div>
</div>
</body>