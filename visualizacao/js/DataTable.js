class DataTable {
	constructor(elemento, config){
		this.referencia = $(elemento).DataTable(config);
	}
	
	update(){
		$(document).trigger('beforeTableUpdate');
		this.referencia.ajax.reload();
	}
}