function displayWeblifyDemos( container ){
	var displayLimit = 0;
	
	$.each( window.weblifyDemos, function ( key, value ){
		if ( displayLimit < 50 ){ //only show 50 demos to faster the loading
			displayWeblifyDemo( container, value );
			
			displayLimit++;
		}
	});
}

function displayWeblifyDemo( container, value ){
	var industry = value[ 'fields' ][ 'Industry' ];
	var builtDate = value[ 'fields' ][ 'Date demo was built' ];
	var id = value['id'];
	let imageArray = value[ 'fields' ][ 'Image' ][ 0 ].thumbnails;
	var thumbnails = '';
	var title = value[ 'fields' ][ 'Company' ];	
	
	if ( builtDate ){
		bd = new Date( builtDate );
		var month = '0';
		var day = '0';
		if ( bd.getMonth() < 10 ){
			month = '0' + ( bd.getMonth() + 1 );
		} else {
			month = bd.getMonth() + 1;
		}
		
		if ( bd.getDate() < 10 ){
			day = '0' + ( bd.getDate() + 1 );
		} else {
			day = bd.getDate() + 1;
		}
		
		var builtDate =  " | " + bd.getFullYear() + "-" + month + "-" + day;
	} else {
		builtDate = '';
	}
	
	if ( imageArray ){
		thumbnails = imageArray.large.url;
	} 
	
	if ( !industry ){
		industry = '';
	} 
	
	$( container )[ 0 ].innerHTML += "<div class='elementor-template-library-template elementor-template-library-template-remote elementor-template-library-template-page weblify-template' data-industry='" + industry + "' >" +
		"<div class='elementor-template-library-template-body'>" +
			"<div class='elementor-template-library-template-screenshot' style='background-image:url(" + thumbnails + ")'></div>" +
			"<div class='elementor-template-library-template-preview weblifyTemplatePreview'>" +
				"<img style='display: none;' src=" + thumbnails + " />" +
				"<i class='fa fa-search-plus' aria-hidden='true'></i>" +
			"</div>" +
		"</div>" +
		"<div class='elementor-template-library-template-footer'>" +
			"<button class='elementor-template-library-template-action elementor-template-library-template-insert elementor-button' onclick='weblify_insertTemplate(\"" + id + "\", \"demo\")'>" +
				"<i class='eicon-file-download' aria-hidden='true'></i>" +
				"<span class='elementor-button-title'>Insert</span>" +
			"</button>" +
			"<div class='elementor-template-library-template-name'>" + title + builtDate + "</div>" +
		"</div>"+
	"</div>";
	
}

function setPanelDemos(){
	jQuery( function( $ ) {
		var dropDownIndustry = '';
	
		$.each( window.weblifyDemoIndustry, function( key, value ){
			dropDownIndustry += "<option value='" + value + "'>" + value + "</option> "
		});
		
		//Set the content of Unsplash tab
		$( '.weblify_content_panel' )[ weblifyPanelNames.indexOf( 'Demos' ) ].innerHTML = "<div class='row weblify_content_panel_filters'>" +
			"<div class='col-md-12'>" +
				"<ul class='filterContainer'>" +
					"<li>" +
						// Code added by Khushal Gupta
						"<div class='ui search'>" +
							"<div class='ui icon input'>" +
								"<input type='text' placeholder='Search' class='prompt demoSearchBar form-control' name='search'>" +
								"<i class='search icon'></i>" +
							"</div>" +
						"</div>" +
					"</li>" +
					"<li>" +
						// For Multiselect dropdown -- added by Khushal Gupta
						"<div style='width: 250px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='multiselectIndustry'>" +
								dropDownIndustry +
							"</select>" +
						"</div>" +
					"</li>" +
				"</ul>" +
			"</div>" +
		"</div>" +
    	"<div class='templatesDemosContainer'>" +
    	"</div>" +
	"<div>";
				
		displayWeblifyDemos( '.templatesDemosContainer' );
		
		$( '.demoSearchBar' ).on( 'keydown', function( e ){
			if ( e.keyCode === 13 ) {  //checks whether the pressed key is "Enter"
				if ( $( 'input.demoSearchBar' ).val() ){
					$( '.templatesDemosContainer' ).children().each( function(){
						$( this ).attr( "style", "display:none" );
					});

					$.each( window.weblifyDemos, function ( key, value ){
						if (value[ 'fields' ][ 'Company' ]){
							var input = new RegExp( $( 'input.demoSearchBar' ).val(), 'i' );

							if ( value[ 'fields' ][ 'Company' ].match( input ) ){
								displayWeblifyDemo( '.templatesDemosContainer', value );
							} 
						} 
					});
				} else {
					$( '.templatesDemosContainer' ).children().each( function(){
						$( this ).attr( "style", "display:block" );
					});
				}		
			}
		});
			
		$('#multiselectIndustry').dropdown({
			placeholder: 'Select Industry'
		});	
		
		$( 'ul', 'div.ms-drop' ).children().addClass( 'select_item' );
		
		$( '.weblify-filter' ).change(function(){
			//Loop into all templates
			var industryArray = [];
			$( '.templatesDemosContainer' ).children().each( function(){
				//Get template subpage categories
				var templateIndustry = $( this ).attr( 'data-industry' );

				//Get selected tags
				var selectedIndustry = $( 'select#multiselectIndustry' ).val();
				
				//Process filter on subpage categories	
				if ( selectedIndustry ){
					var matchedNumber = 0;
					$.each( selectedIndustry, function( key, value ){
						if ( value == templateIndustry ){
							matchedNumber++;
						}	
					});	
					
					if ( matchedNumber ){
						industryArray.push( this ); 
					} 
				} else {
					industryArray.push( this );
				}			
			});
			
			var templatesToDisplay = industryArray;
			
			//Display the right templates, hide the others
			$( '.templatesDemosContainer' ).children().each( function(){
				if ( $.inArray( this, templatesToDisplay ) != -1 ){
					$( this ).attr( "style", "display:block" );
				} else {	
					$( this ).attr( "style", "display:none" );
				}				
			});
		});
	});
}
