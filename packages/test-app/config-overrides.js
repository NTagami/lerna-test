const { tap, useBabelRc, override, overrideDevServer } = require('customize-cra');

/*headers: {
	    "Access-Control-Allow-Methods": "*",
	    'Access-Control-Allow-Headers': '*',
	    "Access-Control-Allow-Origin": "*"
	},
*/

function myConfig(config){
    return {
	proxy: {
	    '/pcd': {
		target:"https://github.com",
		pathRewrite:{'^/pcd':''}
	    }
	},
	...config
    };
}

module.exports = {
    webpack: override(useBabelRc()),
    devServer: overrideDevServer()
};
