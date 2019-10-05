function weblify_insertTemplate( template_id, templateType ){
	switch( templateType ){
		case 'demo':
			weblify_insertTemplate_( template_id, window.weblifyDemos, 'demo', true );
			break;

		case 'section':
			swal({
				title: "Re-upload the images ?",
				text: "Re-uploading the images can take a few seconds but you will be able to manipulate a copy of the orginal section.\nPutting placeholder images will load the section way faster.",
				icon: "warning",
				buttons: {
					placeholder: {
						text: "Put placeholder images",
						value: "placeholder",
					},
					reUpload: {
						text: "Re-upload images",
						value: "reUpload",
					},
					cancel: "Do a barrel roll !"
				 }
			})
				.then( value => {
				switch( value ){
					case 'placeholder':
						weblify_insertTemplate_( template_id, window.weblifyTemplates, 'section', false );
						break;
						
					case 'reUpload':
						weblify_insertTemplate_( template_id, window.weblifyTemplates, 'section', true );
						break;
						
					default:
						
				}
			});			
			break;

		default:

	}		
}

function weblify_insertTemplate_( template_id, templates, templateType, doUploadImages ){
	jQuery( function( $ ) {		
		$.getJSON( templates[ template_id ][ 'fields' ][ 'JSON file' ], function( data ) {			
			var templateToInsert = data.content;

			$( '.weblify-library-loading' ).css( 'display', 'block' );
			$( '.weblify_content_panel' ).css( 'display', 'none' );

			var imagesToUpload = [];
			
			getImagesUrls( templateToInsert, imagesToUpload );

			//Upload all the images in WP media library. This takes a lot of time
			var dataHook = {
					'action': 'upload_images',
					'image': imagesToUpload
				};
			
			//Change the action hook if it is a section
			if( !doUploadImages ){
			   dataHook = {
				    'action': 'upload_placeholder',
			   }
			}

			$.ajax({
				data: dataHook,
				type: 'post',
				url: admin_ajax_url,
				success: function( data, textStatus, jQxhr ){	
					switch( templateType ){
						case 'demo':			
							templateToInsert = replaceRemoteImagesWithLocal( templateToInsert , JSON.parse( data ) );
							break;
							
						case 'section':
							if ( !doUploadImages ){
								templateToInsert = replaceRemoteImagesWithPlaceholder( templateToInsert , JSON.parse( data ) );
							} else {
								templateToInsert = replaceRemoteImagesWithLocal( templateToInsert , JSON.parse( data ) );
							}
							break;
							
						default:
					}

					//Insert the template after all images are downloaded
					for ( var i = 0; i < templateToInsert.length; i++ ) {
						elementor.getPreviewView().addChildElement( templateToInsert[ i ], {clone: true} );
					}

					window.weblifyModal.hide();
				},
				error: function( jqXhr, textStatus, errorThrown ){
					console.error('Failed to upload images in the library');
					window.weblifyModal.hide();
				}
			});		
		});
	});
}

function getImagesUrls( templateToInsert, imagesToUpload ){
	$.each( templateToInsert, function ( templateKey, templateValue ) {
		switch( templateKey ) {
			case 'image':	
				if ( templateValue.url ){
					imagesToUpload.push( templateValue.url );
				}			
				break;

			case 'background_image':
				if ( templateValue.url ){
					imagesToUpload.push( templateValue.url );
				}
				break;

			case 'wp_gallery':
				$.each( templateValue, function( key, value ){
					if ( value.url ){
						imagesToUpload.push( value.url );
					}
				});
				break;

			case 'svg_url':
				if ( templateValue.url ){
					imagesToUpload.push( templateValue.url );
				}
				break;

			case 'background_video_fallback':
				if ( templateValue.url ){
					imagesToUpload.push( templateValue.url );
				}
				break;

			default:
				if( typeof templateValue == 'object'){
					getImagesUrls( templateValue, imagesToUpload );
				}
		}	
	});
}

function replaceRemoteImagesWithLocal( templateToInsert, localImages ){
	if ( localImages ){		
		$.each( templateToInsert, function ( templateKey, templateValue ) {
			switch ( templateKey ){
				case 'image':	
					if ( templateValue.url ){
						templateToInsert[ templateKey ] = localImages.shift();
					}		
					break;

				case 'background_image':
					if( templateToInsert[ 'background_image_mobile' ] ){
						templateToInsert[ 'background_image_mobile' ] = localImages[ 0 ];
					}

					if( templateToInsert[ 'background_image_tablet' ] ){
						templateToInsert[ 'background_image_tablet' ] = localImages[ 0 ];
					}
					if ( templateValue.url ){
						templateToInsert[ templateKey ] = localImages.shift();
					}						
					break;

				case 'wp_gallery':
					$.each( templateValue, function( key, value ){
						if ( value.url ){
							templateToInsert[ templateKey ][ key ] = localImages.shift();
						}	
					});					
					break;

				case 'svg_url':
					if ( templateValue.url ){
						templateToInsert[ templateKey ] = localImages.shift();
					}	
					break;

				case 'background_video_fallback':
					if ( templateValue.url ){
						templateToInsert[ templateKey ] = localImages.shift();
					}	
					break;

				default:	
					if( typeof templateValue == 'object' ){
						replaceRemoteImagesWithLocal( templateValue, localImages );
					}				
			}	
		});
	}
	
	return templateToInsert;
}

function replaceRemoteImagesWithPlaceholder( templateToInsert, placeholderImage ){
	if ( placeholderImage ){		
		$.each( templateToInsert, function ( templateKey, templateValue ) {
			switch ( templateKey ){
				case 'image':	
					templateToInsert[ templateKey ] = placeholderImage;
					break;

				case 'background_image':
					if( templateToInsert[ 'background_image_mobile' ] ){
						templateToInsert[ 'background_image_mobile' ] = placeholderImage;
					}

					if( templateToInsert[ 'background_image_tablet' ] ){
						templateToInsert[ 'background_image_tablet' ] = placeholderImage;
					}
					templateToInsert[ templateKey ] = placeholderImage;
					break;

				case 'wp_gallery':
					$.each( templateValue, function( key, value ){
						templateToInsert[ templateKey ][ key ] = placeholderImage;
					});					
					break;

				case 'svg_url':
					templateToInsert[ templateKey ] = placeholderImage;
					break;

				case 'background_video_fallback':
					if( templateToInsert[ 'background_background' ] == 'video' ){
						templateToInsert[ templateKey ] = placeholderImage;
					}
					break;

				default:	
					if( typeof templateValue == 'object'){
						replaceRemoteImagesWithPlaceholder( templateValue, placeholderImage );
					}				
			}	
		});
	}
	
	return templateToInsert;
}