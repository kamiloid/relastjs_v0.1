var Template_sample = new Class(
	{
		Extends: mochi_addon,
		initialize: function(pconfig)
		{
			this.parent(pconfig, Template_sample, this);
		},
		run: function()
		{
			this.run_me();
			return this;
		}
	});




Template_sample.controller =
{
	main_addon: function()
	{
		this.addon.render({
			bbox: this.addon._config.bbox,
			v: ["styles_addon", "main_addon"],
			c2: []
		});
	}
};




Template_sample.model =
{

};



Template_sample.view =
{
	main_addon: function()
	{
		var inner = 
		``;
		return inner;
	},
	styles_addon: function()
	{
		var inner =
		`<style>
		</style>`;
		return inner;
	}
}


		