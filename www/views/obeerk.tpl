<script>
	$('.tmibizlist tr').bind('click',function(){
		tr = $(this);
		id = tr.find(".tmibiz").html();
		selectTask(id);
	})
	
	$('#bOBeerkMenu').bind('click',function () {
		showMenu();
	})
	$('#rendszam').bind('change',function () {
		alert('change');
	})	
	
</script>
<body>
<div id=tploBeerk>
	<div id=divheader>
		Örzött beérkezés
	</div>
	<div id=divcontent>
		<!-- tasklist -->
		<div id=divmibizlist>
			<table class=tmibizlist>
				<tr>
					<th>Bizonylatszám</th>
					<th>Sofőr</th>
				</tr>
				
				<{sorok}>
			</table>
		</div>
		<!-- tasklist end -->
		<!-- panel -->
		<div id=divpanel>
			<div class=buttons>
				<button id=bOBeerkMenu>Menü</button>
			</div>
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
			<div class='dceg'>
				<span class='labelCeg'>Cég</span>
				<span class='dataCeg'></span>
			</div>
			<div class='dmeretminta'>
				<span class='labelMeret'>Méret,minta</span>
				<span class='dataMeret'></span>
			</div>
			<div class='dfegu'>
				<span class='labelFelniGumi'>Felni/Gumi</span>
				<span class='dataFegu'></span>
			</div>		
		</div>
		<!-- panel end -->
		
	</div>
</div>
</body>