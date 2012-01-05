(function (oo) {
	
	var v = oo.createPanel({
		id: 'super-id',
		init: function init() {
			this.setTemplate('<div class="monpanel">&nbsp;</div>');
		},
		onEnabled: function onEnabled() {
			var b = new oo.view.Button('.monpanel');

			this.register(b);
		}
	});

	oo.getViewport().register(v);

})(oo);