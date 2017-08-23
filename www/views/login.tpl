<script>
	$('.bnum').on('click', function(event){
		event.stopPropagation();
        event.preventDefault();
		char = $(this).text();		
		content = $('.divinput').text() + char;
		
		$('.divinput').html(content);
	});
	$('.bbacksp').on('click', function(event){
		event.stopPropagation();
        event.preventDefault();
		content = $('.divinput').text();
		content = content.substring(0,content.length-1);
		
		$('.divinput').text(content);
	});
	$('.blogin').on('click', function(event){
		event.stopPropagation();
        event.preventDefault();
		orzottLogin();

	});
</script>
<body>
<div id=tplLogin>
	<div id=divheader>
		Bejelentkezés <span id=divversion>11</span>
	</div>
	<div id=divcontent>
		<div class=divinput>
		</div>
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
		</div>
		<div class=divfnbuttons>
			<button class=bbacksp>Javítás</button>
			<button class=blogin>Bejelentkezés</button>
		</div>
	</div>
</div>
</body>