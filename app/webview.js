// nodeintegration mode is available to file:// or shortcuts only.
( function () {

	if ( window.location.protocol == "file:" ) {
		return;
	}

	var fs = require( 'fs' );
	var shortcutFilePath = fs.readFileSync( __dirname + "/path.txt", "utf8" );
	var shortcuts = JSON.parse( fs.readFileSync( shortcutFilePath, "utf8" ) );

	if ( shortcuts[ window.location.href ] ) {
		return
	}

	window.require = null;
	window.remote = null;

} )();