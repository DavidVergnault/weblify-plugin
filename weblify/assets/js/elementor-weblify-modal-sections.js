//Sections
function setPanelSections(){
	jQuery( function( $ ) {
		var HTMLOptions = getHTMLOptions( 1, 1, 0, 1, 0 );
				
		//Set the content of Unsplash tab
		$( '.weblify_content_panel' )[ weblifyPanelNames.indexOf( 'Sections' ) ].innerHTML = "<div class='row weblify_content_panel_filters'>" +
			"<div class='col-md-12'>" +
				"<ul class='filterContainer'>" +
					"<li>" +
						// For Multiselect dropdown -- added by Khushal Gupta
						"<div style='width: 200px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='sectionMultiselectCategory'>" +
								HTMLOptions[ 0 ] +
							"</select>" +
						"</div>" +
					"</li>" +
					"<li>" +
						"<div style='width: 200px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='sectionMultiselectTags'>" +
								HTMLOptions[ 1 ] +
							"</select>" +
						"</div>" +
					"</li>" +
					"<li>" +
						"<div style='width: 200px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='sectionMultiselectAuthor'>" +
								HTMLOptions[ 3 ] +
							"</select>" +
						"</div>" +
					"</li>" +
					"<li>" +
						"<label><input class='weblify-filter' id='sectionFromMG' type='checkbox' />From Mega Demo</label>" +
					"</li>" +
					"<li>" +
						"<label><input class='weblify-filter' id='sectionNotFromMG' type='checkbox' />Not from Mega Demo</label>" +
					"</li>" +
					"<li>" +
						"<label><input class='weblify-filter' id='sectionSwedish' type='checkbox' />In Swedish</label>" +
					"</li>" +
					"<li>" +
						"<label><input class='weblify-filter' id='sectionNotSwedish' type='checkbox' />Not in Swedish</label>" +
					"</li>" +
				"</ul>" +
			"</div>" +
		"</div>" +
    	"<div class='templatesSectionContainer'>"+
    	"</div>"+
	"<div>";
		
		displayWeblifyTemplates( '.templatesSectionContainer', [ 'Subpages' ], '' );
	
		// For Multiselect dropdown -- added by Khushal Gupta
		$( '#sectionMultiselectCategory' ).dropdown({
			placeholder: 'Select Categories'
		});
		
		$( '#sectionMultiselectTags' ).dropdown({
			placeholder: 'Select Tags',
		});
		
		$( '#sectionMultiselectAuthor' ).dropdown({
			placeholder: 'Select Authors'
		});
		
		$( 'ul', 'div.ms-drop' ).children().addClass( 'select_item' );
		
		$( '.weblify-filter', '.filterContainer' ).change( function(){
			//Loop into all templates
			var catsArray = [];
			var tagsArray = [];
			var authorArray = [];
			
			$( '.templatesSectionContainer' ).children().each( function(){
				//Get template categories
				var templateCategories = $( this ).attr( 'data-categories' ).split( ',' );
				//Get template tags
				var templateTags = $( this ).attr( 'data-tags' ).split( ',' );
				//Get template tags
				var templateAuthor = $( this ).attr( 'data-author' );
 
				//Get selected categories
				var selectedCat = $( 'select#sectionMultiselectCategory' ).val();				
				//Get selected tags
				var selectedTags = $( 'select#sectionMultiselectTags' ).val();
				//Get selected tags
				var selectedAuthor = $( 'select#sectionMultiselectAuthor' ).val();
				
				//Process filter on categories	
				if ( selectedCat ){
					var matchedNumber = 0;
					$.each( selectedCat, function( key, value){
						if ( $.inArray( value, templateCategories ) != -1 ){
							matchedNumber++;
						}	
					});	
					
					if ( matchedNumber ){
						catsArray.push( this ); 
					} 
				} else {
					catsArray.push( this );
				}
				
				//Process filter on tags
				if ( selectedTags ){
					var matchedNumber = 0;
					$.each( selectedTags, function( key, value ){
						if ( $.inArray( value, templateTags ) != -1 ){
							matchedNumber++;
						}	
					});	
					
					if ( matchedNumber == selectedTags.length ){
						tagsArray.push( this ); 
					} 
				} else {
					tagsArray.push( this );
				}
				
				//Process filter on authors
				if ( selectedAuthor ){
					var matchedNumber = 0;
					$.each( selectedAuthor, function( key, value ){
						if ( value == templateAuthor ){
							matchedNumber++;
						}	
					});	
					if ( matchedNumber ){
						authorArray.push( this ); 
					} 
				} else {
					authorArray.push( this );
				}
			});
			
			//Merge the matching values of the 2 first arrays
			var templatesToDisplayTmp = [];
			if ( catsArray.length > 0 ){
				$.each( catsArray, function( keyCat, valueCat ){
					if ( $.inArray( valueCat, tagsArray ) != -1 ){
						templatesToDisplayTmp.push( valueCat );
					}
				});
			} 
			
			//Merge the matching values of the 2 arrays
			var templatesToDisplay = [];
			if ( authorArray.length > 0 ){
				$.each( authorArray, function( keyAuth, valueAuth ){
					if ( $.inArray( valueAuth, templatesToDisplayTmp ) != -1 ){
						templatesToDisplay.push( valueAuth );
					}
				});
			} 
			
			//Display the right templates, hide the others
			$( '.templatesSectionContainer' ).children().each( function(){
				if ( $.inArray( this, templatesToDisplay ) != -1 ){
					$( this ).attr( "style", "display:block" );
				} else {	
					$( this ).attr( "style", "display:none" );
				}				
			});	
			
			if ( $( 'input#sectionFromMG' ).attr( 'checked' ) ){
				$( '.templatesSectionContainer' ).children().each( function(){
					if ( $( this ).attr( "data-fromMG" ) && $( this ).attr( "style" ) != "display:none" ){
						$( this ).attr( "style", "display:block" );
					} else {	
						$( this ).attr( "style", "display:none" );
					}				
				});			
			}

			if ( $( 'input#sectionNotFromMG' ).attr( 'checked' ) ){
				$( '.templatesSectionContainer' ).children().each( function(){
					if ( !$( this ).attr( "data-fromMG" ) && $( this ).attr( "style" ) != "display:none" ){
						$( this ).attr( "style", "display:block" );
					} else {	
						$( this ).attr( "style", "display:none" );
					}				
				});			
			}
			
			if ( $( 'input#sectionSwedish' ).attr( 'checked' ) ){
				$( '.templatesSectionContainer' ).children().each( function(){
					if ( $( this ).attr( "data-isSwedish" ) && $( this ).attr( "style" ) != "display:none" ){
						$( this ).attr( "style", "display:block" );
					} else {	
						$( this ).attr( "style", "display:none" );
					}				
				});			
			}
			
			if ( $( 'input#sectionNotSwedish' ).attr( 'checked' ) ){
				$( '.templatesSectionContainer' ).children().each( function(){
					if ( !$( this ).attr( "data-isSwedish" ) && $( this ).attr( "style" ) != "display:none" ){
						$( this ).attr( "style", "display:block" );
					} else {	
						$( this ).attr( "style", "display:none" );
					}				
				});			
			}
		});	
	});
}

function displayWeblifyTemplates( container, blackListCategories = '', whiteListCategories = '' ){
	$.each(window.weblifyTemplates, function ( key, value ){
		var category = value[ 'fields' ][ 'Category' ];
		
		if ( blackListCategories ){
		   if ( $.inArray( category, blackListCategories ) == -1 ){
			   displayWeblifyTemplate( container, value );
		   }
		} else {
			if ( whiteListCategories ){
				if ( $.inArray( category, whiteListCategories ) != -1 ){
			   		displayWeblifyTemplate( container, value );
				}
			}
		}
	});
}

function displayWeblifyTemplate( container, value ){
	let imageArray = value[ 'fields' ][ 'Image' ];
	var thumbnails = '';

	var title = value[ 'fields' ][ 'DL NAME' ];	
	var tags = value[ 'fields' ][ 'DL TAGS' ];
	var categories = value[ 'fields' ][ 'DL CATEGORY' ];
	var subpagesCategories = value[ 'fields' ][ 'DL SUBPAGE CATEGORY' ];
	var subpagesPack = value[ 'fields' ][ 'Packs' ];
	var author = value[ 'fields' ][ 'CREATE - Who?' ];
	var builtDate = value[ 'fields' ][ 'Built Date' ];
	var fromMG = value[ 'fields' ][ 'FROM MEGA DEMO' ];
	var isSwedish = value[ 'fields' ][ 'In Swedish' ];
	var id = value[ 'id' ];

	if ( !title ){
		title = value[ 'fields' ][ 'Name' ];
	}

	if ( tags ){
		tags.join();
	} else {
		tags = [];
	}

	if ( subpagesCategories ){
		subpagesCategories.join();
	} else {
		subpagesCategories = [];
	}
	
	if( !subpagesPack ){
	   subpagesPack = '';
	}
	
	if ( categories ){
		categories.join();
	} else {
		categories = [];
	}

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
			day = '0' + ( bd.getDate() );
		} else {
			day = bd.getDate();
		}
		
		builtDate = " | " + bd.getFullYear() + "-" + month + "-" + day;
	} else {
		builtDate = '';
	}

	if ( !fromMG ){
		fromMG = '';
	}
	
	if ( !isSwedish ){
		isSwedish = '';
	}
	
	if ( imageArray ){
		thumbnails = imageArray[ 0 ].thumbnails.large.url;
	} 

	$( container )[ 0 ].innerHTML += "<div class='elementor-template-library-template elementor-template-library-template-remote elementor-template-library-template-page weblify-template' data-categories='" + categories + "' data-tags='" + tags + "' data-author='" + author + "' data-subpages-categories='" + subpagesCategories + "' data-subpages-pack='" + subpagesPack + "' data-fromMG='" + fromMG + "' data-isSwedish='" + isSwedish + "'>" +
		"<div class='elementor-template-library-template-body'>" +
			"<div class='elementor-template-library-template-screenshot' style='background-image:url(" + thumbnails + ")'></div>" +
			"<div class='elementor-template-library-template-preview weblifyTemplatePreview'>" +
				"<img style='display: none;' src=" + thumbnails + " />" +
				"<i class='fa fa-search-plus' aria-hidden='true'></i>" +
			"</div>" +
		"</div>" +
		"<div class='elementor-template-library-template-footer'>" +
			"<button class='elementor-template-library-template-action elementor-template-library-template-insert elementor-button' onclick='weblify_insertTemplate(\"" + id + "\", \"section\")'>" +
				"<i class='eicon-file-download' aria-hidden='true'></i>" +
				"<span class='elementor-button-title'>Insert</span>" +
			"</button>" +
		"<div class='elementor-template-library-template-name'>" + title + builtDate + "</div>" +
		"</div>"+
	"</div>";
}
