var Pages_Admin = new Class(
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
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------

			// --------------------------------------------------------------------------------
			// STATES
			// --------------------------------------------------------------------------------
			// this.state('state_key', [value]);
			// this.get_state('state_key');
			this.state('page_label', '');
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------

			// --------------------------------------------------------------------------------
			// ACTIONS
			// --------------------------------------------------------------------------------
			// this.action('action_key', (args)=>{...});
			// this.call_action('action_key', args[object]);
			this.action('add_page', (args)=>
			{
				this.append('item_page', 'list_pages', {
					label: this.get_state('page_label')
				});
				this.state('page_label', '');
			});
			this.action('change_page_label', (args)=>
			{
				this.state('page_label', args.node.value);
			});
			this.action('edit_page', (args)=>
			{
				console.log(args.node.getAttribute('key'));
			});
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------


			// --------------------------------------------------------------------------------
			// HTML VIEWs
			// Events attributes: ev:[html event without on]='[action_name]'
			// State attribute for inputs: state:set='[state_name]'
			// State attribute to print: state:get='[state_name]'
			// --------------------------------------------------------------------------------
			this._view.main = `<div>
				<form action='javascript:;' method='POST' ev:submit='add_page'>
					<input type='text' state:set='page_label' ev:keyup='change_page_label' />
					<input type='submit' value='Save' />
				</form>
				<div id='list_pages'></div>
			</div>`;
			this._view.item_page = `<div>
				<div>{%label%}</div>
				<div><button ev:click='edit_page' key='{%label%}'>Edit</button><div>
				<div><button>Remove</button><div>
			</div>`;
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------
		}
	});