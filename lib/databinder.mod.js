import { Logger } from "https://assets.dax.live/dax-logger/dax-logger.mod.js";
import { mustache } from "./mustache.mod.js";

var _L = Logger.get("databinder");

var DataBinder = function() {

	this.bind = function(selector) {
		let node = document.querySelector(selector);
		if(!node) {
			_L.warn("node not found for the given selector");
			return;
		}

		let data_src = node.getAttribute("data-src");
		if(!data_src) {
			_L.warn("attribute: data-src not found on selected node");
			return;
		}

		getUrl(data_src).then( data => {
			let tpl_data = JSON.parse(data);
			let tpl = node.innerHTML;
			let substxt = mustache.render(tpl, tpl_data);
			node.innerHTML = substxt;
			node.hidden = false;
		})
		.catch( err => {
			_L.warn("unable to load data", err.cause);
			node.hidden = true;
		});
	}

	/// Helper methods

	function getUrl(url) {
		return new Promise((resolve, reject) => {
			const req = new XMLHttpRequest();
			req.open("GET", url);
			req.onload = function() {
				if(req.status === 200) {
					resolve(req.response);
				}
				else {
					let cause = {
						"status" : req.status,
						"status-text" : req.statusText
					}
					reject(Error("load failed", { "cause" : cause }));
				}
				//req.status === 200 ?  : );
			}
			req.onerror = (e) => reject(Error(`Network Error: ${e}`));
			req.send();
		});
	}
}

window.DataBinder = DataBinder;
export { DataBinder }