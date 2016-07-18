///<reference path="../typings/globals/handlebars/index.d.ts" />

import * as Handlebars from "handlebars";

Handlebars.registerHelper(
	'selectOptions',
	function(options: Array<any>|{[k:string]:any}, selected:any, dflt:{v:any, k:string}){
		let r: string;
		let i: any;
		let f: (k:string, v:any, s:boolean) => string;
		f = (k,v,s) => '<option value="'+k+'"'+(s?' selected':'')+'>'+v+'</option>';
		r = dflt ? f(dflt.k,dflt.v,false) : '';
		if (options instanceof Array) {
			let l: number = options.length;
			for (i=0; i<l; i++){r += f(i,options[i],i===selected);}
		} else {
			for (i in options) {r += f(i,options[i],i===selected);}
		}
		return r;
	}
);
Handlebars.registerHelper(
	'radioOptions',
	function(name:string, options:any[]|{[k:string]:any}, selected:any){
		let r: string;
		let i: any;
		let f: (n:string, k:string, v:any, s:boolean) => string;
		f = (n,k,v,s) => '<label><input type="radio" name="'+n+'" value="'+k+'"'+(s?' checked':'')+' /> '+v+'</label>';
		r = '';
		if (options instanceof Array) {
			let l: number = options.length;
			for (i=0; i<l; i++){r += f(name,i,options[i],i===selected);}
		} else {
			for (i in options) {r += f(name,i,options[i],i===selected);}
		}
		return r;
	}
);
