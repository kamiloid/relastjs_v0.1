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
		_indexer:{},//save nodes indexed with ref:id attribute
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
			// console.log(this._nodes.states);
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
				}else if(type == 'visible' || type == 'hidden')
				{
					let style = 'visible';
					if(value && type == 'visible') style = 'none';
					else if(!value && type == 'visible') style = 'inherit';
					else if(value && type == 'hidden') style = 'inherit';
					else if(!value && type == 'hidden') style = 'none';
					node.setAttribute('style', `display:${style}`);
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

			let node = document.createElement('div');
			bbox.appendChild(node);
			node.outerHTML = cont;
			// if(!cont.startsWith('<')) return;
			// let tag = cont.match(/<([a-z|A-Z|\s])+>/gs);
			// if(tag.length == 0) return;
			// let def_tag = tag[0].replace('<', '').replace('>', '');
			// let subcont = cont.substr((`<${def_tag}>`).length, cont.length);
			// subcont = subcont.substr(0, subcont.length - (`</${def_tag}>`).length);
			// let node = document.createElement(def_tag);
			// node.innerHTML = subcont.trim();
			// bbox.appendChild(node);
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
				let states_attrs = [];
				for(a in node.attributes)
				{
					if(!node.attributes.hasOwnProperty(a)) continue;
					let attr = node.attributes[a];
					if(!attr.name.includes('ref') && 
						!attr.name.includes('state')) continue;
					states_attrs.push(attr);
				}
				for(a in node.attributes)
				{
					if(!node.attributes.hasOwnProperty(a)) continue;
					let attr = node.attributes[a];
					let attr_name = attr.name;
					let attr_value = attr.value;
					if(!attr.name.includes('ref') && 
						!attr.name.includes('state')) continue;
					if(attr.name == 'ref:id')
					{
						this._indexer[attr.value] = node;
						continue;
					}
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
					}else if(state_name == 'visible' || state_name == 'hidden')
					{
						let style = state_name == 'visible' ? 'inherit' : 'none';
						node.setAttribute('style', `display:${style}`);
					}
				}
				for(a in states_attrs)
				{
					if(!states_attrs.hasOwnProperty(a)) continue;
					let attr = states_attrs[a];
					if(!attr.name.includes('ref') && 
						!attr.name.includes('state')) continue;
					node.removeAttribute(attr.name);
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
		import:function(mod_name, conf)
		{
			// mod_name [string]
			// conf [object]
			// -	name [string]
			if(!mod_name) return;
			if(!window[mod_name])return;
			let mod = new window[mod_name](conf);
			if(mod.run)
			{
				let props = conf.props;
				if(!props)
					props = this.get_node_attrs(conf.bbox);
				if(!conf.args)
					conf['args'] = {};
				mod.run(props);
				mod.append('main', conf.bbox, conf.args);
			}
			return mod;
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
		},
		get_node_attrs:function(node)
		{
			let attrs = {};
			if(!node) return attrs;
			if(typeof(node) == 'string')
				node = document.getElementById(node);
			for(attr of node.attributes)
				attrs[attr.name] = attr.value;
			return attrs;
		},
		new_refId: function()
		{
			return Rapp.uid();
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
		let props = conf.props;
		if(!props)
			props = app.get_node_attrs(conf.bbox);
		app.run(props);
		app.exec();
	}
	return app;
}


Rapp.uid = function() {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

Rapp.new_refId = function()
{
	return Rapp.uid();
}


Rapp.MD5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
           if (lX4 & lY4) {
                   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
           }
           if (lX4 | lY4) {
                   if (lResult & 0x40000000) {
                           return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                   } else {
                           return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                   }
           } else {
                   return (lResult ^ lX8 ^ lY8);
           }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
   		}

   	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

   	return temp.toLowerCase();
}