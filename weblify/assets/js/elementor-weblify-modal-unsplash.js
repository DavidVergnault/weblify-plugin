function setPanelUnsplash(){
	jQuery( function( $ ) {
		//Set the content of Unsplash tab		
		$( ".weblify_content_panel" )[ weblifyPanelNames.indexOf( 'Images' ) ].innerHTML = "<div class='row weblify_content_panel_filters'>" +
			"<div class='col-md-12 d-flex flex-wrap justify-content-between galleryFilters'>" +
			// Code added by Khushal Gupta
				"<div class='ui search' style='margin-left: 400px; top: 5px;'>" +
					"<div class='ui icon input'>" +
						"<input type='text' placeholder='Search' class='prompt searchBar form-control' name='search'>" +
						"<i class='search icon'></i>" +
					"</div>" +
				"</div>" +
				"<div class='large ui buttons'>" +
					"<button class='ui button filterListItem active' data-filter='all'>All</button>" +
					"<button class='ui button filterListItem' data-filter='portrait'>Portrait</button>" +
					"<button class='ui button filterListItem' data-filter='landscape'>Landscape</button>" +
				"</div>" +
			
			"</div>" +
		"</div>" +
		"<div class='filtr-container galleryContainer'>" +
		"</div>";
		
		$( ".galleryContainer" ).css( 'display', 'flex' );
		$( ".searchBar" ).on( "keydown", function ( key ) {
			if ( key.keyCode === 13 ) {  //checks whether the pressed key is "Enter"
				getUnsplashImages( $( "input.searchBar" ).val() );
			}
		});
		
		getUnsplashImages( null );
		setUnsplashFilters();
	});
	
	
}

//Unsplash
function setUnsplashFilters(){
	$( ".filterListItem" ).on( 'click', function(){
		var orientationFilter = $( this ).attr( 'data-filter' );

		$( ".filterListItem" ).removeClass( "active" );
		$( this ).addClass( "active" );

		$.each( $( ".filtr-item" ), function( key, value ){
			var orientation = value.attributes[ 1 ].value;

			if ( orientationFilter == 'all' ){
				value.style.display = 'block';
			} else {
				if ( orientation != orientationFilter ){
					value.style.display = 'none';
				} else {
					value.style.display = 'block';
				}
			}	
		});
	});
}

//Unsplash
function getUnsplashImages( query ) {
	var APIKey = '42371ddb04c95d39e2623174978251758a1a724901657d2810649271b6ae37f4';
	var request = "";

	$( '.filtr-item' ).remove(); //Clean the tab content before to fill it again

	if ( !query ){
		request = 'https://api.unsplash.com/photos/?per_page=30&client_id=' + APIKey;		

		//Show loading screen
		$( '.weblify-library-loading' ).css( 'display', 'block' );
		$( '.galleryContainer' ).css( 'display', 'none' );
		
		$.getJSON( request, function( data ) {
			fillPanelWithImages( data, APIKey ); //Display the result images	
			
			request = 'https://api.unsplash.com/photos/?per_page=30&page=2&client_id=' + APIKey;		

			$.getJSON( request, function( data ) {
				fillPanelWithImages( data, APIKey ); //Display the result images
				
				request = 'https://api.unsplash.com/photos/?per_page=30&page3&client_id=' + APIKey;		

				$.getJSON( request, function( data ) {
					fillPanelWithImages( data, APIKey ); //Display the result images

					if ( $( '.filtr-item' ).length > 0 ){ //Check if gallery not empty
						$( ".galleryContainer" ).flexgal(); //Show the gallery with flex CSS
						
						//Hide loading screen
						$( '.weblify-library-loading' ).css( 'display', 'none' );
						$( '.galleryContainer' ).css( 'display', 'flex' );
					}	
				});	
			});	
		});		
	} else {
		request = 'https://api.unsplash.com/search/photos/?query=' + query + '&per_page=30&client_id=' + APIKey;
		
		//Show loading screen
		$( '.weblify-library-loading' ).css( 'display', 'block' );
		$( '.galleryContainer' ).css( 'display', 'none' );
		
		$.getJSON( request, function( data ) {
			fillPanelWithImages( data.results, APIKey ); //Display the result images
			
			request = 'https://api.unsplash.com/search/photos/?query=' + query + '&per_page=30&page=2&client_id=' + APIKey;

			$.getJSON( request, function( data ) {
				fillPanelWithImages( data.results, APIKey ); //Display the result images	
				
				request = 'https://api.unsplash.com/search/photos/?query=' + query + '&per_page=30&page=3&client_id=' + APIKey;

				$.getJSON( request, function( data ) {
					fillPanelWithImages( data.results, APIKey ); //Display the result images

					if ( $( '.filtr-item' ).length > 0 ){ //Check if gallery not empty
						$( ".galleryContainer" ).flexgal(); //Show the gallery with flex CSS
						
						//Hide loading screen
						$( '.weblify-library-loading' ).css( 'display', 'none' );
						$( '.galleryContainer' ).css( 'display', 'flex' );
					}
				});	
			});	
		});	
	}	
}

function getUnsplashImagesFromURL( url ){
	$( '.weblify-library-loading' ).css( 'display', 'block' );
	$( '.galleryContainer' ).css( 'display', 'none' );
	$( '.filtr-item' ).remove();
	
	$.ajax({
		data: {
			'action': 'get_unsplash_from_url',
			'url': url
		},
		type: 'post',
		url: admin_ajax_url,
		success: function( data ){
			console.log(data)
			if ( !data ){
				swal({
					title: "This website isn't processable",
					text: "No images found, can't access the website, images too complex, ...",
					icon: "warning",
				});
				
				$( '.weblify-library-loading' ).css( 'display', 'none' );
				$( '.galleryContainer' ).css( 'display', 'flex' );
			} else {
				var data = data.split(/(?:\|)(?=\{)/);
			
				data.forEach(function (item, index) {
					console.log(item);
					fillPanelWithImages( JSON.parse(item).results, null ); //Display the result images
				});

				if ( $( '.filtr-item' ).length > 0 ){ //Check if gallery not empty
					$( ".galleryContainer" ).flexgal();

					$( '.weblify-library-loading' ).css( 'display', 'none' );
					$( '.galleryContainer' ).css( 'display', 'flex' );
				}
			}	
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.error('Failed to get images from the website : ' + errorThrown);
			swal({
				title: "This website isn't processable",
				text: "No images found, can't access the website, images too complex, ...",
				icon: "warning",
			});
			$( '.weblify-library-loading' ).css( 'display', 'none' );
			$( '.galleryContainer' ).css( 'display', 'flex' );
		}
	});
}

//Unsplash
function fillPanelWithImages( results, APIKey ){
	$.each( results, function( key, value ){
		var photographerName = value.user[ 'first_name' ] + ' ' + value.user[ 'last_name' ] ;
		var photographerLink = value.user.links.html;
		var photographerImage = value.user[ 'profile_image' ].small;
		var height = value.height;
		var width = value.width;
		var orientation = '';
		if ( height > width ){
			//Portrait
			orientation = 'portrait';
		} else {
			//Landscape or Square
			orientation = 'landscape';
		}

		$( '.galleryContainer' )[ 0 ].innerHTML += "<div class='filtr-item' data-category='" + orientation + "' data-photographer-name='" + photographerName + "' data-photographer-link='" + photographerLink + "' data-photographer-image='" + photographerImage + "' data-image='" + value.urls.raw + "' data-download-trigger='" + value.links.download_location + "' >" +
													"<img src="+ value.urls.regular +" alt='Image'/>" +												
												"</div>" ;
	});				
}

function uploadUnsplashImage( imageUrlRaw, imageDownloadLink, APIKey ){
	//Show loading screen
	$( '.weblify-library-loading' ).css( 'display', 'block' );
	$( '.galleryContainer' ).css( 'display', 'none' );

	$.ajax({
		data: {
			'action': 'upload_images',
			'image': imageUrlRaw
		},
		type: 'post',
		url: admin_ajax_url,
		success: function( data ){
			$.getJSON( imageDownloadLink + "?client_id=" + APIKey );
			
			//Hide loading screen
			$( '.weblify-library-loading' ).css( 'display', 'none' );
			$( '.galleryContainer' ).css( 'display', 'flex' );
		},
		error: function( jqXhr, textStatus, errorThrown ){
			console.error('Failed to upload image to WordPress Media Library : ' + errorThrown);
		}
	});
}