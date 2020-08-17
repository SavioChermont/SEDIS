class Modal {
	constructor(elemento, body, containerTitulo){
		this.elemento = $(elemento);
		this.body = $(body);
		this.titulo = $(containerTitulo);
		this.open = false;
	}

	abrir(callback=undefined){
		if (this.elemento.hasClass(`fade`)) {
			this.elemento.removeClass('fade').addClass('show');
			this.open = true;
			if (callback !== undefined) callback.call(this.elemento);
		}
	}
	fechar(callback=undefined){
		if (this.elemento.hasClass(`show`)) {
			this.elemento.addClass('fade').removeClass('show');
			this.open = false;
			if (callback !== undefined) callback.call(this.elemento);
			$(document).trigger('modalFechado');
		}
	}
	isAberto(){
		// 
		return this.open;
	}

	carregar(url, titulo, fnContextual=undefined){
		let $this = this;

		this.titulo.text(titulo);
		this.body.load(url, () => {
			if (fnContextual !== undefined) fnContextual.call(this);
			$this.chamar.call(this);
		});
	}
	chamar(){
		let $this = this;
		this.abrir(() => {
			let temp = $("*[data-custom-dismiss='#"+this.elemento[0].id+"']");
				temp.click(function(){
					$this.fechar();
					temp.off('click');
				});
		});
	}
}