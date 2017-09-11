
exports._getEnvURL = function(url){
	if(process.env.NODE_ENV === "development"){
		return "http://127.0.0.1:3001" + url;
	}

	return url;
}