(function($) {
  	$.fn.flexgal = function(){	
		//Unsplash API key
		var APIKey = '42371ddb04c95d39e2623174978251758a1a724901657d2810649271b6ae37f4';
		
		//Preload the div to hold the full screen image
		$( 'div.weblify_content' ).prepend( '<div id="fullimage" style="display: none"></div>' );

		//Display the images the right way
		$( this ).addClass( 'flex-gallery' );
		$( 'img', this ).parent().addClass( 'image-rate' );
		
		$( '.image-rate' ).click( function() {
			var parent = $( 'img', this ).parent();
			var photographerName = $( parent ).attr( 'data-photographer-name' );
			var photographerLink = $( parent ).attr( 'data-photographer-link' );
			var photographerImage = $( parent ).attr( 'data-photographer-image' );
			var imageUrl = $(parent).attr( 'data-image' );
			var downloadTrigger = $( parent ).attr( 'data-download-trigger' );

			//Add the links to follow Unsplash API charter and hsow the download button
			var fullImageContent = "<div class='unsplashLinks'>" +
				"<div class='unsplashWebsiteLink'>" +
					"<a target='_blank' href='https://unsplash.com'> Unsplash.com</a>" +
				"</div>" +
				
				"<div class='weblify_download_image'>" +
                 	"<a href='#' onClick='uploadUnsplashImage(\"" + imageUrl + "\", \"" + downloadTrigger + "\", \"" + APIKey + "\")'> <i class='eicon-file-download' aria-hidden='true' style='font-size: 40px; margin-top: 100px;'></i> </a>" +
                "</div>" +
				
				"<div class='photographerLink'>" +
					"<a target='_blank' href='" + photographerLink + "'> <img src='" + photographerImage + "' class='photographerImage' />" + photographerName + "</a> "+
				"</div>" +
			"</div>";
			
			var imageSrc = $( 'img', this ).attr( 'src' );
			
			//Set the bottom background a little bit more black to see the links in white, whatever the color of the image
			$( "#fullimage" ).css('background', "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)),url('" + imageSrc + "') 50%/contain no-repeat");
			$( "#fullimage" ).append( fullImageContent );

			$( "#fullimage" ).fadeIn( "slow" );
		});

		$( '.weblifyTemplatePreview' ).click( function() {
			$( 'img', this ).clone().prependTo( '#fullimage' );
			$( '#fullimage' ).children().css( 'display', 'block' );
			$( "#fullimage" ).fadeIn( "slow" );
		});
		
		$( '#fullimage' ).click( function() {
			$( this ).fadeOut( "slow", function() {
				$( this ).empty();
				$( this ).css( 'background', "rgba(0, 0, 0, 0.8)" );
			});
		});
  }
}(jQuery));

