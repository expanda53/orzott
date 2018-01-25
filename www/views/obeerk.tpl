<!DOCTYPE html>
<body>
<div id=divclick></div>
<input type=hidden id=hAZON>
<input type=hidden id=hMIBIZ>
<input type=hidden id=hSORSZ>
<input type=hidden id=rendszam>
<div id=tploBeerk>
	<div id=divheader>
		Örzött beérkezés
	</div>
	<div id=divcontent>
<div id="dialog" title="Dialog Title">
<p>Dialog</p>
</div>
    
		<!-- tasklist -->
		<div id=divmibizlist>
			<button id=bMenu>Menü</button>
			<div class=dtable>
				<table class=tmibizlist>
					
					<{sorok}>
				</table>
			</div>
		</div>
		<!-- tasklist end -->
		<!-- panel -->
		<div id=divpanel>
			<div class='drendszam'>
				<div id=srendszam></div>
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
			<div id=divgpanel>
				<div id='divGPOptions'>
					
						<button id=bcopyAB>A->B</button>
						<button id=bcopyAP>A->P</button>
						<button id=bcopyBA>B->A</button>
						<button id=bcopyBP>B->P</button><br>
						<button id=bdelA>A törlése</button>
						<button id=bdelB>B törlése</button>
						<button id=bdelP>P törlése</button><br>
                        <button id=bxcAB>A<->B</button>
						<button id=boptclose>Bezár</button>
					
				</div>
				<div class='labelGP'>A</div>
				<select id=gpMarkaA></select>
				<select id=gpMeretA></select>
				<select id=gpMintaA></select>
				<select id=gpSIA></select>
				<br>
				<div class='labelGP'>B</div>
				<select id=gpMarkaB></select>
				<select id=gpMeretB></select>
				<select id=gpMintaB></select>
				<select id=gpSIB></select>
				<br>
				<div class='labelGP'>P</div>
				<select id=gpMarkaP></select>
				<select id=gpMeretP></select>
				<select id=gpMintaP></select>
				<select id=gpSIP></select>
				<br>
				
				<div class='labelGP'>felni</div>
				<select id=gpFelnitip>
						<option value='-'>nincs</option>
						<option value='A'>Alu</option>
						<option value='L'>Lemez</option>
				</select>
				<!--
                <div class='labelGPdb'>db</div>
				<select id=gpFelnidb>
						<option value='0'>0</option>
						<option value='1'>1</option>
						<option value='2'>2</option>
						<option value='3'>3</option>
						<option value='4'>4</option>
						<option value='5'>5</option>
						<option value='6'>6</option>						
						<option value='7'>7</option>
				</select>
                -->
                <div class='labelGPEvszak'>Évszak</div>
				<select id=gpEvszak>
						<option value='nyári'>Nyári</option>
						<option value='téli'>Téli</option>
                </select>
				<br>
				
				<button id=bGPanelClose>Mentés</button>
				<button id=bGPanelCancel>Mégsem</button>
				<button id=bGPanelOptions>Műveletek</button>
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
					<div class=ddrbfegu>
						<span class='labelDrbFEGU'>fe/gu</span>
						<span class='dataDrbFEGU'>0/0</span>
					</div>
				</div>
				<div class=dButtons>
					<button class='bprint' id=bGumi>Gumi</button>
					<button class='bprint' id=bGumiFelni>Gumi+Felni</button>
					<button class='bprint' id=bFelni>Felni</button>
					<button class='bnoprint' id=bJavitas>Javítás</button>
                    <button class='bnoprint' id=bRendszam>Rendszámok</button>
				</div>
			</div>
		</div>
		<!-- panel end -->
		<!-- melysegmeres panel -->
		<div id=divmeres>
		</div>
		<!-- melysegmeres panel end -->
        <!-- atnezes panel -->
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
                <div id=divtobbletsum>
                    <div class=labelTobbletSum></div>
                    <div class=dataTobbletSum></div>
                </div>                
                <div id=divhiany>
                    <div class=labelHiany></div>
                    <div class=dataHiany></div>
                </div>
            </div>
            <div class=dButtonsReview>
                    <button id=bElteres>Eltérések</button>
                    <button id=bTobblet>Többlet</button>
                    <button id=bFolytMost>Folyt. most</button>
                    <button id=bFolytKesobb>Folyt. később</button>
                    <button id=bLezar>Lezárás</button>
            </div>
        </div>
        <!-- atnezes panel end -->        
        <div id=divTobblet>
          <div class=divTobbletLabel>Eddigi többlet</div>
          <div class=dataTobbletRegi></div>
          <div class=divTobbletModLabel>Módosítás</div>
          <div class=dataTobbletUpdate></div>
          <div class=dbuttonscontent>
                <div class=divnumbuttons>
                    <button class=bnum>0</button>
                    <button class=bnum>1</button>
                    <button class=bnum>2</button>
                    <button class=bnum>3</button>
                    <button class=bnum>4</button>
                    <button class=bnum>5</button>
                    <button class=bnum>6</button>
                    <button class=bnum>7</button>
                    <button class=bnum>8</button>
                    <button class=bnum>9</button>
                    <button class=bnum>+/-</button>                    
                    <button class=bbacksp>Javítás</button>
                    <button class=bment>Mentés</button>
                    <button class=bvissza>Vissza</button>
                </div>
          </div>
        </div>
        
</div>

</body>