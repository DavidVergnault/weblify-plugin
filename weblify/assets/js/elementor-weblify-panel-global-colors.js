function weblify_changeColorsBackEnd( elements, oldColor, newColor ){
	//This function is recursive
	
	$.each( elements, function ( key, value ) {
		//Restrein the loop for fast response
		if ( key == 'models' || key == 'attributes' || key == 'elements' || typeof key == 'number' ){
			
			//Check if $element has settings
			if ( value.settings && value.settings.attributes ){
				
				//Check background_color truthness 
				$.each( value.settings.attributes, function( keySettings, valueSettings ){
				
					//If matches, remplace by new color
					if ( valueSettings == oldColor ){
						value.settings.attributes[ keySettings ] = newColor;
					}
				});
			}
			
			weblify_changeColorsBackEnd( value, oldColor, newColor );
		}
	});
}

function weblify_changeColorsFrontEnd( elements, oldColor, newColor ){
	elements.each( function () {
		var oldColorRegex = new RegExp( oldColor, 'g' );	
		var style = $( this ).text();	
		var newStyle = style.replace( oldColorRegex, newColor );
		
		$( this ).text( newStyle );	
	});
		
	//Trigger the "Update" button to save the changes
	elementor.channels.editor.reply( 'status', true ).trigger( 'status:change', true );
}