var CMS = new Class(
	{
		Extends: Rapp,
		initialize: function(conf)
		{
			this.parent(conf);
		},
		run: function()
		{
			// --------------------------------------------------------------------------------
			// INCLUDES
			// --------------------------------------------------------------------------------
			// this.include('file_path[.js]', [class_name]);
			this.include('js/mods/pages_admin.js', 'Pages_Admin');
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------

			// --------------------------------------------------------------------------------
			// STATES
			// --------------------------------------------------------------------------------
			// this.state('state_key', [value]);
			// this.get_state('state_key');
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------

			// --------------------------------------------------------------------------------
			// ACTIONS
			// --------------------------------------------------------------------------------
			// this.action('action_key', (args)=>{...});
			// this.call_action('action_key', args[object]);
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------


			// --------------------------------------------------------------------------------
			// HTML VIEWs
			// --------------------------------------------------------------------------------
			this._view.main = `<div>
				<div id='Pages_Admin'></div>
			</div>`;
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------
		}
	});