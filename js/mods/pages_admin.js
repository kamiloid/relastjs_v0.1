var Page_item = new Class(
	{
		Extends: Rapp,
		initialize: function(conf)
		{
			this.parent(conf);
		},
		run: function(props)
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
			this.state('id', props.id);
			this.state('page_name', props.name);
			this.state('edit', false);
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------

			// --------------------------------------------------------------------------------
			// ACTIONS
			// --------------------------------------------------------------------------------
			// this.action('action_key', (args)=>{...});
			// this.call_action('action_key', args[object]);
			this.action('change_name', (args)=>
			{
				this.state('page_name', args.node.value);
			});
			this.action('edit_page', (args)=>
			{
				this.state('edit', true);
			});
			this.action('edit_page_form', (args)=>
			{
				this.state('edit', false);
			});
			this.action('delete_page', (args)=>
			{
				this._parent.call_action('delete_page', {token: this.get_state('id'), node: this._indexer[this.get_state('id')]});
			});
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------


			// --------------------------------------------------------------------------------
			// HTML VIEWs
			// Events attributes: ev:[html event without on]='[action_name]'
			// State attribute for inputs: state:set='[state_name]'
			// State attribute to print: state:get='[state_name]'
			// --------------------------------------------------------------------------------
			this._view.main = `<div ref:id='{%id%}'>
				<div>
					<span state:get='page_name' state:visible='edit'></span>
					<form action='javascript:;' ev:submit='edit_page_form' state:hidden='edit'>
						<input state:set='page_name' type='text' ev:keyup='change_name' />
						<input type='submit' value='Save' />
					</form>
				</div>
				<div>
					<button ev:click='edit_page' state:visible='edit'>Edit</button>
					<button ev:click='delete_page'>Remove</button>
				</div>
			</div>`;
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------
		}
	});


var Pages_Admin = new Class(
	{
		Extends: Rapp,
		_items:{},
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
				let uid = this.new_refId();
				let item = this.import('Page_item', {
					name:'Page_item', 
					bbox:'list_pages',
					parent: this,
					props:{
						id: uid,
						name: this.get_state('page_label')
					},
					args:{
						id: uid
					}
				});
				this._items[uid] = item;
				this.state('page_label', '');
			});
			this.action('change_page_label', (args)=>
			{
				this.state('page_label', args.node.value);
			});
			this.action('delete_page', (args)=>
			{
				let uid_item = args.token;
				let node = args.node;
				delete this._items[uid_item];
				document.getElementById('list_pages').removeChild(node);
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
			// --------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------
		}
	});