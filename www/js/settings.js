var settings = {
	items : null,
	setItems: function(jsonItems) {
		this.items = jsonItems;
	},
	getItem: function(tetel){
		result=null;
		for (x in this.items){
			akt = this.items[x];
			
			if (akt!=null) {
				if (akt.TETEL.toUpperCase() === tetel.toUpperCase()) {
					result = akt.ERTEK;
					break;
				}
			}
			else result="";
		}
		return result;
	}
	
}
