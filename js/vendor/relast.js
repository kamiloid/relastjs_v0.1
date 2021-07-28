var Rapp = new Class(
	{
		_conf: null,
		_main: null,
		_parent: null,
		_name: '',
		_bbox: null,
		_actions:{},
		_states:{},
		_nodes:{states:{}, ids:{}},
		_view:{},
		_net:{},
		_mods:{},
		initialize: function(conf)
		{
			this._conf = conf;
			this._name = conf.name || "unknow app";
			this._bbox = conf.bbox;
			this._main = conf.main;
			this._parent = conf.parent;

			this._view['main'] = '';
		},
		get_main: function(mod)
		{
			if(!mod) return null;
			let aux = mod;
			while(aux._parent != null)
				aux = aux._parent;
			return aux;
		},
		exec: function()
		{
			if(!this._bbox) return;

			this.render('main', this._bbox);
		},
		state: function(key, value)
		{
			if(!key || value == null || value == undefined) return;
			if(key.trim() == '') return;
			this._states[key] = value;
			if(!this._nodes.states[key]) return;
			if(!Array.isArray(this._nodes.states[key])) return;
			for(o of this._nodes.states[key])
			{
				let node = o.node;
				let type = o.type;
				if(type == 'set')
					node.value = value;
				else if(type == 'get')
				{
					if(node.tagName.toLowerCase() == 'input')
						node.value = value;
					else
						node.innerHTML = value;
				}
			}
		},
		get_state: function(key)
		{
			if(!key) return;
			if(key.trim() == '') return;
			return this._states[key];
		},
		action:function(key, action)
		{
			if(!key || !action) return;
			if(key.trim() == '') return;
			this._actions[key] = action;
		},
		call_action: function(key, args)
		{
			if(!key) return;
			if(key.trim() == '') return;
			if(!this._actions[key]) return;
			this._actions[key](args);
		},
		render: function(key, bbox)
		{
			if(!key || !bbox) return;
			if(key.trim() == '') return;
			if(!this._view[key]) return;
			if(typeof(bbox) == 'string')
				bbox = document.getElementById(bbox);
			if(!bbox) return;
			bbox.innerHTML = this._view[key];
			this.analize(bbox);
		},
		append: function(key, bbox, args=null)
		{
			if(!key || !bbox) return;
			if(key.trim() == '') return;
			if(!this._view[key]) return;
			if(typeof(bbox) == 'string')
				bbox = document.getElementById(bbox);
			if(!bbox) return;
			let cont = this._view[key].trim();
			
			if(args == null) return;
			for(a in args)
			{
				let re = new RegExp(`{%${a}%}`, 'g');
				cont = cont.replace(re, args[a]);
			}

			if(!cont.startsWith('<')) return;
			let tag = cont.match(/<([a-z])+>/gs);
			if(tag.length == 0) return;
			let def_tag = tag[0].replace('<', '').replace('>', '');
			let subcont = cont.substr((`<${def_tag}>`).length, cont.length);
			subcont = subcont.substr(0, subcont.length - (`</${def_tag}>`).length);
			let node = document.createElement(def_tag);
			node.innerHTML = subcont.trim();
			bbox.appendChild(node);
			this.analize(bbox);
			return node;
		},
		analize: function(bbox)
		{
			let events = ['click', 'change', 'keyup', 'keydown', 'mouseover', 'mouseout', 'load', 'submit'];
			for(node of bbox.childNodes)
			{
				if(bbox.childNodes.hasOwnProperty(node)) continue;
				if(node.nodeName)
					if(node.nodeName == '#text')
						continue;

				// --------------------------------------------------------------
				// CATCH EVENTS
				// --------------------------------------------------------------
				for(e of events)
				{
					let ev = node.getAttribute(`ev:${e}`);
					if(!ev) continue;
					let value = ev.replace('{%', '');
					value = value.replace('%}', '');
					let action = value;
					let args = {node: node};
					if(value.includes('|'))
					{
						let split = value.split('|');
						action = split[0];
						args = JSON.parse(split[1]);
						//args = this.str2obj(split[1]);
					}
					
					node.removeAttribute(`ev:${e}`);
					node.addEventListener(e, ()=>{this.call_action(action, args)});
				}
				// --------------------------------------------------------------
				// --------------------------------------------------------------

				// --------------------------------------------------------------
				// CATCH STATES
				// --------------------------------------------------------------
				for(attr of node.attributes)
				{
					let attr_name = attr.name;
					let attr_value = attr.value;
					if(!attr_name.includes('state')) continue;
					let state_name = attr_name.replace('state:', '');
					if(this._nodes.states[attr_value] == null || this._nodes.states[attr_value] == undefined)
						this._nodes.states[attr_value] = [];
					this._nodes.states[attr_value].push({node: node, type:state_name});
					if(state_name == 'set')
					{
						node.value = this._states[attr_value];
					}else if(state_name == 'get')
					{
						if(node.tagName.toLowerCase() == 'input')
							node.value = this._states[attr_value];
						else
							node.innerHTML = this._states[attr_value];
					}
				}
				// --------------------------------------------------------------
				// --------------------------------------------------------------
				this.analize(node);
			}
		},
		include:function(file, class_name)
		{
			let self = this;
			let script = document.createElement('script');
			script.onload = function()
			{
				let main = self.get_main(self);
				let mod = Rapp.create_app(class_name, {
					name: class_name,
					bbox: class_name,
					parent: self,
					main: main
				});
				main._mods[class_name] = mod;
			};
			script.src = file+"?"+Math.random();

			document.head.appendChild(script);
		},
		str2obj: function(txt)
		{
			let obj = {};
			if(txt.startsWith('{'))
				txt = txt.replace('{', '');
			if(txt.endsWith('}'))
				txt = txt.replace('}', '');
			let split1 = txt.split(',');
			for(o of split1)
			{
				let split2 = o.split(':');
				obj[split2[0].trim()] = split2[1];
			}
			return obj;
		}
	});

Rapp.create_app = function(app_name, conf)
{
	// app_name [string]
	// conf [object]
	// -	name [string]
	if(!app_name) return;
	if(!window[app_name])return;
	let app = new window[app_name](conf);
	if(app.run)
	{
		app.run();
		app.exec();
	}
	return app;
}