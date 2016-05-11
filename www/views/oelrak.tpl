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
			<button id=bEllenorzes>Ellenőrzés</button>
            <div class='divmunkaban'>
                <div id=labelRszWork>Rendszám munkában</div>
                <div id=dataRszWork></div>
                <div id=labelHkodWork>Hkód munkában</div>
                <div id=dataHkodWork></div>
            </div>

			<div class='drendszam'>
				<span id=labelRendszam>Rendszám</span>
				<input id=dataRendszam>
                <button id=bHkodTorol>Helykódok törlése</button>
			</div>
			<div class='dhkod'>
				<span id=labelHkod>Helykód</span>
				<input id=dataHkod>
                
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
			</div>			
		</div>
		
	</div>
</div>
</body>