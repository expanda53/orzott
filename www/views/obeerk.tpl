<script>
	$('.tmibizlist tr').bind('click',function(){
		tr = $(this);
		id = tr.find(".tmibiz").html();
		selectTask(id);
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
				<button>Menü</button>
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
		</div>
		<!-- panel end -->
		
	</div>
</div>
</body>