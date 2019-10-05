function weblify_generateDemo( extraCategories, industryInput, colorPalette ){
	var sections = window.weblifyTemplates;
	//General structure of a Demo : Hero - USP - Services - Testimonials - Other sections
	var sectionsHero = [];
	var sectionsServices = [];
	var sectionsTestimonials = [];
	var sectionsContact = [];
	var sectionsFooter = [];
	var sectionsOthers = [];

	$.each( sections, function( key, value ){

		//Only keep sections from the mega demo
		if ( value.fields[ 'FROM MEGA DEMO' ] ){
			switch( value.fields[ 'Category' ] ){
				case 'Hero':
					sectionsHero.push( value );
					break;
					
				case 'Services':
					sectionsServices.push( value );
					break;
					
				case 'Testimonials':
					sectionsTestimonials.push( value );
					break;
					
				case 'Contact information':
					sectionsContact.push( value );
					break;
					
				case 'Footer':
					sectionsFooter.push( value );
					break;
					
				default: 
					sectionsOthers.push( value );
					break;
			}
		}
	});
	
	var sectionsToInsert = [];	

	//Random select sections from a category. This has to be changed soon
	sectionsToInsert.push( sectionsHero[ Math.floor( Math.random() * sectionsHero.length ) ][ 'fields' ][ 'JSON file' ] );
	sectionsToInsert.push( sectionsServices[ Math.floor( Math.random() * sectionsServices.length ) ][ 'fields' ][ 'JSON file' ] );
	sectionsToInsert.push( sectionsTestimonials[ Math.floor( Math.random() * sectionsTestimonials.length ) ][ 'fields' ][ 'JSON file' ] );

	if ( extraCategories ){
		extraCategories.forEach( function( extraCategory ){
			//Use a for loop to use break statement that is not usable in a forEach loop
			for ( var i = 0; i < sectionsOthers.length; i++ ) {
				var section = sectionsOthers[ i ];
				var sectionCategory = section.fields[ 'Category' ];
				
				if ( extraCategory == sectionCategory ){
					sectionsToInsert.push( section.fields[ 'JSON file' ] );
					break;
				}					 
			}		
		});
	}

	//Add the contact form at the end
	sectionsToInsert.push( sectionsContact[ Math.floor( Math.random() * sectionsContact.length ) ][ 'fields' ][ 'JSON file' ] );	
	sectionsToInsert.push( sectionsFooter[ Math.floor( Math.random() * sectionsFooter.length ) ][ 'fields' ][ 'JSON file' ] );
	
	
	
	var dataHook;
	
	/*if( industryInput ){
	    var unsplashRequest = 'https://api.unsplash.com/search/photos/?query=' + industryInput + '&per_page=30&client_id=' + APIKey;
		dataHook = {
			'action': 'upload_images',
			'image': imagesToUpload
		};
		
		$.getJSON( unsplashRequest, function( response ) {
			//Random query if too few results for the initial query
			if( response.results.length > 2 ){
			   	weblify_insertWeblifySections( sectionsToInsert, response.results, colorPalette );
			} else {
				var unsplashRequest = 'https://api.unsplash.com/photos/?per_page=30&client_id=' + APIKey;
				
				$.getJSON( unsplashRequest, function( backupResponse ) {
					weblify_insertWeblifySections( sectionsToInsert, backupResponse, colorPalette );
				});
			}
		});
	} else {
		var unsplashRequest = 'https://api.unsplash.com/photos/?per_page=30&client_id=' + APIKey;
		dataHook = {
			'action': 'upload_placeholder',
		}
		
		$.getJSON( unsplashRequest, function( response ) {
			weblify_insertWeblifySections( sectionsToInsert, response, colorPalette );
		});
	}*/
	
	
	if( industryInput ){
		var APIKey = '42371ddb04c95d39e2623174978251758a1a724901657d2810649271b6ae37f4'; //Unsplash API Key
	    var unsplashRequest = 'https://api.unsplash.com/search/photos/?query=' + industryInput + '&per_page=30&client_id=' + APIKey;	
		
		$.getJSON( unsplashRequest, function( response ) {
			if( response.results.length > 10 ){
				dataHook = {
					'action': 'upload_images',
					'image': response.results
				};
				
				$.ajax({
					data: dataHook,
					type: 'post',
					url: admin_ajax_url,
					success: function( data, textStatus, jQxhr ){	
						sectionsToInsert.forEach( function( sectionToInsert ){
							sectionToInsert = replaceRemoteImagesWithLocal( sectionToInsert , JSON.parse( data ) );
							
							//Insert the template after all images are downloaded
							for ( var i = 0; i < sectionToInsert.length; i++ ) {
								elementor.getPreviewView().addChildElement( sectionToInsert[ i ], {clone: true} );
							}
						});
						
						window.weblifyModal.hide();
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.error('Failed to upload images in the library');
						window.weblifyModal.hide();
					}
				});		
			} else {
				dataHook = {
					'action': 'upload_placeholder',
				}
				
				$.ajax({
					data: dataHook,
					type: 'post',
					url: admin_ajax_url,
					success: function( data, textStatus, jQxhr ){	
						sectionsToInsert.forEach( function( sectionToInsert ){
							sectionsToInsert = replaceRemoteImagesWithPlaceholder( sectionsToInsert , JSON.parse( data ) );
							
							//Insert the template after all images are downloaded
							for ( var i = 0; i < sectionToInsert.length; i++ ) {
								elementor.getPreviewView().addChildElement( sectionToInsert[ i ], {clone: true} );
							}
						});
						
						window.weblifyModal.hide();
					},
					error: function( jqXhr, textStatus, errorThrown ){
						console.error('Failed to upload images in the library');
						window.weblifyModal.hide();
					}
				});		
			}
		});
	} else {
		dataHook = {
			'action': 'upload_placeholder',
		}

		$.ajax({
			data: dataHook,
			type: 'post',
			url: admin_ajax_url,
			success: function( data, textStatus, jQxhr ){	
				sectionsToInsert.forEach( function( sectionToInsert ){
					sectionsToInsert = replaceRemoteImagesWithPlaceholder( sectionsToInsert , JSON.parse( data ) );

					//Insert the template after all images are downloaded
					for ( var i = 0; i < sectionToInsert.length; i++ ) {
						elementor.getPreviewView().addChildElement( sectionToInsert[ i ], {clone: true} );
					}
				});
			},
			error: function( jqXhr, textStatus, errorThrown ){
				console.error('Failed to upload images in the library');
			}
		});	
	}
}

function weblify_insertWeblifySections( sectionsToInsert, placeholderImages, colorPalette ){
	//This function is recursive
	
	if ( sectionsToInsert ){
		//Get the Json content of the first element of the sections to insert. 
		//Then remove this element from the array and recursively call this function
		$.getJSON( sectionsToInsert[ 0 ], function( data ) {
			var templateToInsert = weblify_putPaletteColors( data.content, colorPalette );
			templateToInsert = weblify_putPlaceholderImages( data.content, placeholderImages );
			
			//Insert the template
			for ( var i = 0; i < templateToInsert.length; i++ ) {
				elementor.getPreviewView().addChildElement( templateToInsert[ i ], {clone: true} );
			}
		}).done( function(){
			//Remove first element
			sectionsToInsert.shift();
			
			weblify_insertWeblifySections( sectionsToInsert, placeholderImages, colorPalette );
		});		
	}
}

function weblify_putPlaceholderImages( templateToInsert, placeholderImages ){
	//This function is recursive
	
	$.each( templateToInsert, function ( templateKey, templateValue ) {
		if ( templateKey == 'url' && templateValue ){
			templateToInsert[ templateKey ] = placeholderImages[ Math.floor( Math.random() * placeholderImages.length ) ].urls.regular;
		} else{
			if( typeof templateValue == 'object'){
				weblify_putPlaceholderImages( templateValue, placeholderImages );
			}
		}
	});
	
	return templateToInsert;
}

function weblify_putPaletteColors( templateToInsert, colorPalette ){
	//This function is recursive
	
	if ( colorPalette ){
		$.each(templateToInsert, function ( templateKey, templateValue ) {
			if ( templateValue && templateValue == "#6ec1e4" && colorPalette[ 1 ]){
				templateToInsert[ templateKey ] = colorPalette[ 1 ];
			} else{
				var colorExceptions = ["#ffffff", "#000000", "#fafafa", "#b5b5b5", "#bfbfbf", "#f7f7f7", "#252728", "#dddddd", "#444444", "#bababa"];
				
				if ( colorPalette[ 0 ] && 
					templateValue && /^#[0-9A-F]{6}$/i.test(templateValue) && 
					templateKey != 'background_overlay_color' &&
					templateKey != 'background_overlay_color_b' && 
					$.inArray( templateValue, colorExceptions ) ){
					templateToInsert[ templateKey ] = colorPalette[ 0 ];
				} else{
					if( typeof templateValue == 'object'){
						weblify_putPaletteColors( templateValue, colorPalette );
					} 
				}
			}
		});
	}
	
	return templateToInsert;
}