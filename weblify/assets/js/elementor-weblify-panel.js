(function( $ ){
	$(function() {		
		function setPanelDemoGenerator(){
			var selectExtrasOptions = '';

			$.each( window.weblifyDemoCategories, function( key, value ){
				selectExtrasOptions += "<option value='" + value + "'>" + value + "</option> "
			});			
			
			var panelContent = "<div id='weblify-generator-demo'>" +
				"<div class='elementor-panel-scheme-buttons'>" +
					"<div class='elementor-panel-scheme-button-wrapper elementor-panel-scheme-save'>" +
						"<button class='elementor-button elementor-button-success' > Generate </button>" +
					"</div>" +
				"</div>" +
				
				//Extras
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> Extras Selection </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> The default sections that are added to a demo are Hero - Testimonials - Services - Contact form - Footer.\nIf you want to have more sections, you can select them from in list below. If there are different templates for a same section type, the generator will randomly select one.</div>" +
					"<div class='elementor-panel-scheme-items elementor-panel-box-content'>" +
						"<div class='elementor-panel-scheme-item'>" +
							"<div style='position: relative; margin:10px; cursor: pointer'>" +
								'<i class="fa fa-plus"> Add an Extra </i> ' +
							"</div>" +
						"</div>" +	
					"</div>" +
				"</div>" +
				
				//Logo color picker
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> Logo </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> Upload a logo here.</div>" +
					"<div class='elementor-panel-scheme-items elementor-panel-box-content'>" +
						//Image
						"<div class='elementor-panel-scheme-item  elementor-control-type-media'>" +
							"<div id='weblify-demo-logo' class='elementor-control-input-wrapper elementor-aspect-ratio-169'>" +
								"<div class='elementor-control-media elementor-fit-aspect-ratio'>" +
									"<div class='elementor-control-media-upload-button elementor-fit-aspect-ratio'><i class='fa fa-plus-circle' aria-hidden='true'></i></div>" +
									"<div class='elementor-control-media-area elementor-fit-aspect-ratio'>" +
										"<div class='elementor-control-media-image elementor-fit-aspect-ratio'></div>" +
										"<div class='elementor-control-media-delete'>Delete</div>" +
									"</div>" +	
								"</div>" +	
							"</div>" +	
						"</div>" +	
						
						//Color palette
						"<div id='weblify-panel-logo-colors'>" +
							
							//Dominant color
							"<div class='weblify-panel-logo-dominant-color'>" +
								"<div class='elementor-panel-scheme-item weblify-logo-dominant-color'>" +
									"<div class='elementor-panel-scheme-color-input-wrapper'>" +
										"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
									"</div>" +
									"<div class='elementor-panel-scheme-color-title'>Dominant Color</div>" +
								"</div>" +
							"</div>" +
				
							//Other colors
							"<div class='weblify-panel-logo-palette-colors'>" +
								"<div class='elementor-panel-scheme-item weblify-logo-palette-1'>" +
									"<div class='elementor-panel-scheme-color-input-wrapper'>" +
										"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
									"</div>" +
								"</div>" +
								"<div class='elementor-panel-scheme-item weblify-logo-palette-2'>" +
									"<div class='elementor-panel-scheme-color-input-wrapper'>" +
										"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
									"</div>" +
									"<div class='elementor-panel-scheme-color-title'>Palette</div>" +
								"</div>" +
								"<div class='elementor-panel-scheme-item weblify-logo-palette-3'>" +
									"<div class='elementor-panel-scheme-color-input-wrapper'>" +
										"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
									"</div>" +
								"</div>" +
							"</div>" +
							
						"</div>" +		
					"</div>" +
				"</div>" +
				
				//Industry
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> Industry </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> Enter 1 or 2 keywords which describes the industry the best. Inserted images will be related to these keywords. You'll get random images if there are too many keywords or if they mean nothing</div>" +
					"<div class='elementor-panel-scheme-items elementor-panel-box-content'>" +
						"<div class='elementor-panel-scheme-item'>" +
							"<div class='elementor-control-input-wrapper'>" +
								"<input id='weblify-industry-input' class='elementor-input' placeholder='Keyword for Industry' />" +
							"</div>" +	
						"</div>" +	
					"</div>" +
				"</div>" +
				
			"</div>";
		
			$( '#elementor-panel-content-wrapper' )[ 0 ].innerHTML = panelContent;
						
			$( '.elementor-panel-scheme-color-value', '#weblify-panel-logo-colors' ).wpColorPicker();

			// Set all variables to be used in scope
			var frame,
				metaBox = $( '#weblify-demo-logo' ), // Your meta box id here
				delImgLink = metaBox.find( '.elementor-control-media-delete' ),
				imgContainer = metaBox.find( '.elementor-control-media-image' ),
				colorPaletteHex = [];
			
			imgContainer.on( 'click', function( event ){
				event.preventDefault();
				
				// If the media frame already exists, reopen it.
				if ( frame ) {
				  frame.open();
				  return;
				}

				// Create a new media frame
				frame = wp.media({
					title: 'Select or Upload Media Of Your Chosen Persuasion',
					button: {
						text: 'Use this media'
					},
					multiple: false  // Set to true to allow multiple files to be selected
				});
				
				// When an image is selected in the media frame...
				frame.on( 'select', function() {
					// Get media attachment details from the frame state
					var attachment = frame.state().get( 'selection' ).first().toJSON();

					// Send the attachment URL to our custom image input field.
     				imgContainer.css( 'background-image', 'url("' + attachment.url + '")' );
   					
					var image = new Image();
					image.src = attachment.url;
					
					//After image is loaded, get palette of colors
					image.onload = function(){
						var rgbToHex = function ( rgb ) { 
							var hex = Number( rgb ).toString( 16 );
							
							if (hex.length < 2) {
								hex = "0" + hex;
							}
							
							return hex;
						};
						
						var fullColorHex = function( r,g,b ) {   
							var red = rgbToHex( r) ;
							var green = rgbToHex( g );
							var blue = rgbToHex( b );
							
							return red+green+blue;
						};
						
						var colorThief = new ColorThief();
						var colorPalette = colorThief.getPalette( image, 4 ); 
						
						colorPalette.forEach(function( color ){
							colorPaletteHex.push( '#' + fullColorHex( color[ 0 ], color[ 1 ], color[ 2 ] ) );
						});
						
						//Set input colors to the colors of the palette
						$( '.elementor-panel-scheme-color-value', '.weblify-logo-dominant-color' ).wpColorPicker( 'color', colorPaletteHex[ 0 ] );
						$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-1' ).wpColorPicker( 'color', colorPaletteHex[ 1 ] );
						$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-2' ).wpColorPicker( 'color', colorPaletteHex[ 2 ] );
						$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-3' ).wpColorPicker( 'color', colorPaletteHex[ 3 ] );
					};
				});

				// Finally, open the modal on click
				frame.open();				
			});
			
			 // DELETE IMAGE LINK
			delImgLink.on( 'click', function( event ){
				event.preventDefault();

				// Clear out the preview image
     			imgContainer.css( 'background-image', '' );
				
				//Set input colors to white
				//TODO : reset the color instead of put white
				$( '.elementor-panel-scheme-color-value', '.weblify-logo-dominant-color' ).wpColorPicker( 'color', '#fff' );
				$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-1' ).wpColorPicker( 'color', '#fff' );
				$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-2' ).wpColorPicker( 'color', '#fff' );
				$( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-3' ).wpColorPicker( 'color', '#fff' );

			});
			
			$( '.elementor-button' , '#weblify-generator-demo' ).on( "click", function(){
				//Extras
				var selectedExtras = [];
				
				$('.weblify-select-demo-extra' ).each( function( extraDropDown ){
					selectedExtras.push( $( "select", this ).val() );
				});
								
				//Industry
				var industryInput = encodeURI( $( 'input#weblify-industry-input' ).val() );

				//Color Palette
				if ( $( '.elementor-panel-scheme-color-value', '.weblify-logo-dominant-color' ).val() ){
					colorPaletteHex[ 0 ] = $( '.elementor-panel-scheme-color-value', '.weblify-logo-dominant-color' ).val();
				}
				if ( $( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-1' ).val() ){
					colorPaletteHex[ 1 ] = $( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-1' ).val();
				}
				if ($( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-2' ).val() ){
					colorPaletteHex [2 ] = $( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-2' ).val();
				}
				if ( $( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-3' ).val() ){
					colorPaletteHex[ 3 ] = $( '.elementor-panel-scheme-color-value', '.weblify-logo-palette-3' ).val();
				}
				
				//Generate the demo
				//weblify_generateDemo( selectedExtras, industryInput, colorPaletteHex );		
			});
			
			$( '.fa-plus', '#weblify-generator-demo' ).click(function(){
				var extraPosition = $( '.weblify-select-demo-extra' ).length + 1;
				
				var selectDropDown = "<div style='width: 230px; position: relative; margin:10px; align-items:center; display:flex;'>" +
					"<div class='weblify-demo-extra-position' style='margin-right: 10px;'><b>" + 
						extraPosition + 
					"</b></div>" +
					"<select class='ui fluid dropdown selection search weblify-filter weblify-select-demo-extra' >" +
						selectExtrasOptions +
					"</select>" +
					'<i class="fa fa-minus" style="margin-left: 10px; cursor: pointer;"></i> ' +
				"</div>";	
				
				$( selectDropDown ).insertBefore( $( this ).parent() );
				
				$( '.weblify-select-demo-extra' ).dropdown({
					placeholder: 'Select Extras',
				});
				
				$( '.fa-minus', '#weblify-generator-demo' ).click(function(){	
					$( this ).parent().remove();	
					
					var i = 1;
					$( '.weblify-demo-extra-position', '#weblify-generator-demo' ).each( function(){
						var updatedExtraPosition = i;

						$( this ).html( "<b>" + updatedExtraPosition + "</b>" ) ;
						i++;
					});
				});
			});	
		}
		
        function setPanelURLColorPalette(){		
			var panelContent = "<div id='weblify-global-style-scheme'>" +
				"<div class='elementor-panel-scheme-buttons'>" +
					"<div class='elementor-panel-scheme-button-wrapper elementor-panel-scheme-save'>" +
						"<button class='elementor-button elementor-button-success' > Apply </button>" +
					"</div>" +
				"</div>" +
				
				//Colors
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> URL Color Palette </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> Enter a website URL here. Press \"Apply\" to set the default color picker palette to the palette of the website. </div>" +
					"<div class='elementor-control elementor-control-link elementor-control-type-url elementor-label-block'>" +
						"<div class='elementor-control-content'>" + 
							"<div class='elementor-control-field elementor-control-url-external-show'>"+
								"<label for='weblify-url-input-color-palette' class='elementor-control-title'>URL : </label>"+
								"<div class='elementor-control-input-wrapper'>" +
									"<input id='weblify-url-input-color-palette' class='elementor-control-tag-area elementor-input ui-autocomplete-input' placeholder='Paste URL or type' autocomplete='off'>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
				"</div>" +
			"</div>";
			
			$( '#elementor-panel-content-wrapper' )[ 0 ].innerHTML = panelContent;
			
			//Use WP Color Picker API for the color palette
			//Get Elementor color palette scheme
			
			$( '.elementor-button' , '#weblify-global-style-scheme' ).on( "click", function(){
				var url = $( '#weblify-url-input-color-palette' , '#weblify-global-style-scheme' ).val();
				
				$.ajax({
					data: {
						'action': 'get_url_palette',
						'url': url
					},
					type: 'post',
					url: admin_ajax_url,
					success: function( data ){
						var palette = data.split(",")
						palette.forEach(function (item, index) {
							elementor.schemes.setSchemeValue('color-picker', index+1, item);
						});
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.error('Failed to get color palette from the website : ' + errorThrown);
					}
				});
			});
			
		}
		
		function setPanelGlobalColors(){		
			var panelContent = "<div id='weblify-global-style-scheme'>" +
				"<div class='elementor-panel-scheme-buttons'>" +
					"<div class='elementor-panel-scheme-button-wrapper elementor-panel-scheme-save'>" +
						"<button class='elementor-button elementor-button-success' > Apply </button>" +
					"</div>" +
				"</div>" +
				
				//Colors
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> Gobal colors </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> The \"Old Color\" will be replaced by the \"New Color\" in the whole page </div>" +
					"<div class='elementor-panel-scheme-items elementor-panel-box-content weblify-panel-scheme-items'>" +
						"<div class='elementor-panel-scheme-item weblify-old-global-color'>" +
							"<div class='elementor-panel-scheme-color-input-wrapper'>" +
								"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
							"</div>" +
							"<div class='elementor-panel-scheme-color-title'>Old Color</div>" +
						"</div>" +
						"<div class='elementor-panel-scheme-item weblify-new-global-color'>" +
							"<div class='elementor-panel-scheme-color-input-wrapper'>" +
								"<input type='text' class='elementor-panel-scheme-color-value' data-alpha='true' />" +
							"</div>" +
							"<div class='elementor-panel-scheme-color-title'>New Color</div>" +
						"</div>" +
					"</div>" +
				"</div>" +
			"</div>";
			
			$( '#elementor-panel-content-wrapper' )[ 0 ].innerHTML = panelContent;
			
			//Use WP Color Picker API for the color palette
			//Get Elementor color palette scheme
			var palette = elementor.schemes.getScheme('color-picker');

			$( '.elementor-panel-scheme-color-value', '#weblify-global-style-scheme' ).wpColorPicker({
				 palettes: [
					 	palette.items[ '7' ].value,
						palette.items[ '8' ].value,
						palette.items[ '1' ].value,
						palette.items[ '5' ].value,
						palette.items[ '2' ].value,
						palette.items[ '3' ].value,
						palette.items[ '6' ].value,
					 	palette.items[ '4' ].value
				 ]
			});
			$( '.elementor-button' , '#weblify-global-style-scheme' ).on( "click", function(){
				var inputsAreSet = true;
				
				$.each( $( '.color-alpha', '#weblify-global-style-scheme' ), function( key, value ){
					if ( !$( value ).attr( 'style' ) ){
						inputsAreSet = false;
					}
				});
				
				if ( inputsAreSet ){
					var oldColor = $( '.elementor-panel-scheme-color-value', '.weblify-old-global-color' ).val();
					var newColor = $( '.elementor-panel-scheme-color-value', '.weblify-new-global-color' ).val();
					
					//Change the preview style
					weblify_changeColorsFrontEnd( $( 'style', elementor.$previewContents[ 0 ].head ), oldColor, newColor ); 

					//Save the modifications in the elements array of object so everything is saved
					weblify_changeColorsBackEnd( elementor.elements.models, oldColor, newColor );
				}
			});
			
		}
		
		function setPanelBCMats(){		
			var panelContent = "<div id='weblify-global-style-scheme'>" +
				"<div class='elementor-panel-scheme-buttons'>" +
					"<div class='elementor-panel-scheme-button-wrapper elementor-panel-scheme-save'>" +
						"<button class='elementor-button elementor-button-success' > Apply </button>" +
					"</div>" +
				"</div>" +
				
				//Colors
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> URL Color Palette </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> Enter a website URL here. Press \"Apply\" to set the default color picker palette to the palette of the website. </div>" +
					"<div class='elementor-control elementor-control-link elementor-control-type-url elementor-label-block'>" +
						"<div class='elementor-control-content'>" + 
							"<div class='elementor-control-field elementor-control-url-external-show'>"+
								"<label for='weblify-url-input-color-palette' class='elementor-control-title'>URL : </label>"+
								"<div class='elementor-control-input-wrapper'>" +
									"<input id='weblify-url-input-color-palette' class='elementor-control-tag-area elementor-input ui-autocomplete-input' placeholder='Paste URL or type' autocomplete='off'>"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
				"</div>" +
			"</div>";
			
			$( '#elementor-panel-content-wrapper' )[ 0 ].innerHTML = panelContent;
			
			//Use WP Color Picker API for the color palette
			//Get Elementor color palette scheme
			
			$( '.elementor-button' , '#weblify-global-style-scheme' ).on( "click", function(){
				var url = $( '#weblify-url-input-color-palette' , '#weblify-global-style-scheme' ).val();
				
				$.ajax({
					data: {
						'action': 'upload_basecamp_material',
						'url': url
					},
					type: 'post',
					url: admin_ajax_url,
					success: function( data ){
						console.log("success");
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.error('Failed to get color palette from the website : ' + errorThrown);
					}
				});
			});
			
		}
		
		function setPanelGlobalFamilies(){
			//Get all font options
			var selectFamiliesOptions = $( '#tmpl-elementor-panel-scheme-typography-item' ).text();
			selectFamiliesOptions = selectFamiliesOptions.substring( selectFamiliesOptions.indexOf( '<select' ) );
			selectFamiliesOptions = selectFamiliesOptions.substring( 0, selectFamiliesOptions.indexOf( "select>" ) +7 );

			var panelContent = "<div id='weblify-global-style-font-families'>" +
				"<div class='elementor-panel-scheme-buttons'>" +
				/*	"<div class='elementor-panel-scheme-button-wrapper elementor-panel-scheme-save'>" +
						"<button class='elementor-button elementor-button-success' > Apply </button>" +
					"</div>" +*/
				"</div>" +
				
				//One input for each widget type that has text inside : Nav Menu, Heading, Text-Editor, Button
				"<div class='elementor-panel-scheme-content elementor-panel-box'>" +
					"<div class='elementor-panel-heading'>" +
						"<div class='elementor-panel-heading-title'> Gobal Font Families </div>" +
					"</div>" +
					"<div class='elementor-panel-scheme-description elementor-descriptor'> The font family of the text inside each of the widget types below will be changed to the font family of your selection. </div>" +
					"<div class='elementor-panel-scheme-typography-items elementor-panel-box-content weblify-panel-font-families-items'>" +
						
						//Heading
						"<div class='elementor-panel-scheme-typography-item'>" +
							"<div class='elementor-panel-scheme-item-title elementor-control-title'>Heading Family</div>" +
							"<div class='elementor-panel-scheme-typography-item-value weblify-heading-family'>" +
								selectFamiliesOptions +
							"</div>" +
						"</div>" +
						
						//Text-Editor
						"<div class='elementor-panel-scheme-typography-item'>" +
							"<div class='elementor-panel-scheme-item-title elementor-control-title'>Text-Editor Family</div>" +
							"<div class='elementor-panel-scheme-typography-item-value weblify-text-editor-family'>" +
								selectFamiliesOptions +
							"</div>" +
						"</div>" +
				
						//Button
						"<div class='elementor-panel-scheme-typography-item'>" +
							"<div class='elementor-panel-scheme-item-title elementor-control-title'>Button Family</div>" +
							"<div class='elementor-panel-scheme-typography-item-value weblify-button-family'>" +
								selectFamiliesOptions +
							"</div>" +
						"</div>" +
				
					"</div>" +
				"</div>" +
			"</div>";
			
			$( '#elementor-panel-content-wrapper' )[ 0 ].innerHTML = panelContent;

			$( '.elementor-panel-scheme-typography-item-field' ).change( function(){
				var classList = $( this ).parent().attr( 'class' ).split( ' ' );
				var family = $( this ).val();
				var widgetType;

				switch( classList[ 1 ] ){
					case 'weblify-heading-family':
						widgetType = 'heading';
						break;
						
					case 'weblify-text-editor-family':
						widgetType = 'text-editor';
						break;
						
					case 'weblify-button-family':
						widgetType = 'button';
						break;
						
					default:
						
				}

				function setFontLink( familyWidgetType ){
					if ( familyWidgetType ){
						var linkExists = false;
						var links = $( 'link', elementor.$previewContents[ 0 ].head );
						var hrefToFont = "https://fonts.googleapis.com/css?family=" + familyWidgetType;

						$( links ).each(function() {
							var href = $( this ).attr( 'href' ); 
							href = href.substring( 0, href.indexOf( ":", 7 ) );

							if( hrefToFont == href ){
								linkExists = true;
							}
						});

						if( !linkExists ){
							$( elementor.$previewContents[ 0 ].head ).append( '<link href="' + hrefToFont + ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic" rel="stylesheet" type="text/css" />' );
						}
					}	
				}
				
				//Create the link to the fonts
				setFontLink( family );
				
				weblify_changeFamiliesFrontEnd( $( 'style', elementor.$previewContents[ 0 ].head ), family, widgetType );
				weblify_changeFamiliesBackEnd( elementor.elements.models, family, widgetType );	
			});
		}
		
				
		var templatePanelMenu = $( "#tmpl-elementor-panel-menu" );
		
		/*if ( templatePanelMenu.length > 0 ) {
			var templatePanelMenuText = templatePanelMenu.text();
			
			templatePanelMenuText = templatePanelMenuText.replace( '<div id="elementor-panel-page-menu-content"></div>', 
					'<div id="elementor-panel-page-menu-content">' +
						'<div class="elementor-panel-menu-group">' +
							'<div class="elementor-panel-menu-group-title">Generators</div>' +
						  	'<div class="elementor-panel-menu-items">' +
						  		'<div class="elementor-panel-menu-item elementor-panel-menu-item-generator-demo-weblify">' +
						  			'<div class="elementor-panel-menu-item-icon">' +
						  				'<i class="fa fa-cogs"></i> ' +
						  			'</div> ' +
						  			'<div class="elementor-panel-menu-item-title">Demo Generator</div>' +
						  		'</div>' +
						  	'</div>' +
						'</div>' +
					'</div>' );
			
			templatePanelMenu.text( templatePanelMenuText );
			elementor.on( "preview:loaded", function() {
				$( '#elementor-panel' ).on( "click", ".elementor-panel-menu-item-generator-demo-weblify", setPanelDemoGenerator );
			})
		}*/
		
		var templatePanelMenuGroup = $( "#tmpl-elementor-panel-menu-group" );
		
		if ( templatePanelMenuGroup.length > 0 ) {
			var templatePanelMenuGroupText = templatePanelMenuGroup.text();
			
			templatePanelMenuGroupText = templatePanelMenuGroupText.replace( 'elementor-panel-menu-items"></div>', 'elementor-panel-menu-items"> <# if( title == "Style" ){ #>' +
							'<div class="elementor-panel-menu-item elementor-panel-menu-item-global-colors-weblify">' +
								'<div class="elementor-panel-menu-item-icon">' +
									'<i class="fa fa-eyedropper"></i>' +
								'</div>' +
								'<div class="elementor-panel-menu-item-title">Colors - All in one</div>' +
							'</div>' +
							'<div class="elementor-panel-menu-item elementor-panel-menu-item-bc-mats">' +
								'<div class="elementor-panel-menu-item-icon">' +
									'<i class="fa fa-cog"></i>' +
								'</div>' +
								'<div class="elementor-panel-menu-item-title">Upload BC mats</div>' +
							'</div>' +												
						'<# } #></div>' );
			templatePanelMenuGroup.text( templatePanelMenuGroupText );
		
			elementor.on( "preview:loaded", function() {
				$( '#elementor-panel' ).on( "click", ".elementor-panel-menu-item-global-colors-weblify", setPanelGlobalColors );
			});
			
			elementor.on( "preview:loaded", function() {
				$( '#elementor-panel' ).on( "click", ".elementor-panel-menu-item-bc-mats", setPanelBCMats );
			});
			
			/*elementor.on( "preview:loaded", function() {
				$( '#elementor-panel' ).on( "click", ".elementor-panel-menu-item-global-fonts-weblify", setPanelGlobalFamilies );
			});*/
		}
	});
})( jQuery );