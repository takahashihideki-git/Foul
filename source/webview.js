// nodeintegration mode is available to file:// or shortcuts only.
( function () {

	if ( window.location.protocol == "file:" ) {
		return;
	}

	var fs = require( 'fs' );
	var shortcuts = JSON.parse( fs.readFileSync( __dirname + "/shortcut.json", "utf8" ) );

	if ( shortcuts[ window.location.href ] ) {
		return
	}

	window.require = null;
	window.remote = null;

} )();