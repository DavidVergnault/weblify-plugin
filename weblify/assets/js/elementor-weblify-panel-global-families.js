function weblify_changeFamiliesBackEnd( elements, family, widgetType ){
	//This function is recursive
	
	$.each( elements, function ( key, value ) {
		if ( key == 'models' || key == 'attributes' || key == 'elements' || typeof key == 'number' ){
			if ( value.attributes && value.attributes.widgetType ){
				var widgetType_ = value.attributes.widgetType;
				
				if ( widgetType_ == widgetType ){
					if (family){
						value.attributes.settings.attributes.typography_font_family = family;
					} else {
						value.attributes.settings.attributes.typography_font_family = "";
					}
				}
			}
			
			weblify_changeFamiliesBackEnd( value, family, widgetType );
		}
	});
}

function weblify_changeFamiliesFrontEnd( elements, family, widgetType ){
	var widgetTypeClass,
		schemeClass,
		defaultFamily;

	switch( widgetType ){
		case 'heading':
			widgetTypeClass = 'elementor-widget-heading';
			schemeClass = 'elementor-widget-heading';
			defaultFamily = "\"Ubuntu\", Sans-serif"; 
			break;
			
		case 'text-editor':
			widgetTypeClass = 'elementor-text-editor';
			schemeClass = 'elementor-widget-text-editor';
			defaultFamily = "\"Bai Jamjuree\", Sans-serif"; 
			break;
			
		case 'button':
			widgetTypeClass = 'elementor-button';
			schemeClass = 'elementor-widget-button';
			defaultFamily = "\"Roboto Slab\", Sans-serif"; 
			break;
			
		default:
	}

	elements.each( function () {
		var id = $( this ).attr( 'id' );
		
		var widgetTypeRegex = new RegExp( widgetTypeClass, 'g' );
		var schemeClassRegex = new RegExp( schemeClass, 'g' );
		var familyRegex = new RegExp( 'font-family', 'g' );

		var style = $( this ).text();

		var matchedWidgetType = style.match( widgetTypeRegex );
		var matchedSchemeClass = style.match( schemeClassRegex );
		var matchedFamily = style.match( familyRegex );

		if( id == 'elementor-style-scheme' ){ //Default Scheme
			if( matchedSchemeClass ){
				function replaceAt ( string, index, stringToReplace, replacement ) {
					return string.substr( 0, index ) + replacement + string.substr( index + stringToReplace.length );
				}

				var startFrom = style.indexOf( schemeClass );
				var oldFamilyIndex = style.indexOf( 'font-family', startFrom );
				var oldFamily = style.substring( oldFamilyIndex );
				oldFamily = oldFamily.substring( 0, oldFamily.indexOf( ";" ) );

				var replacement = 'font-family:"' + family + '", Sans-serif';

				if ( !family ){
					var replacement = 'font-family:"' + defaultFamily + '", Sans-serif';
				}

				style = replaceAt( style, oldFamilyIndex, oldFamily, replacement );

				$( this ).text( style );
			}
		} else {			
			if( matchedWidgetType ){
				if( matchedFamily ){
					var oldFamily = style.substring( style.indexOf( 'font-family' ) );
					oldFamily = oldFamily.substring( 0, oldFamily.indexOf( ";" ) );

					var replacement = 'font-family:"' + family + '", Sans-serif';

					if ( !family ){
						var replacement = 'font-family:"' + defaultFamily + '", Sans-serif';
					}

					style = style.replace( oldFamily, replacement );

					$( this ).text( style );		
				} 
			}
		}
	});
	
	//Trigger the "Update" button to save the changes
	elementor.channels.editor.reply( 'status', true ).trigger( 'status:change', true );
}