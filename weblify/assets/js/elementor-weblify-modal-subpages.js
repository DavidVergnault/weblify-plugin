function setPanelSubpages( templateContainer, filters ){
	jQuery( function( $ ) {
		var HTMLOptions = getHTMLOptions( 0, 1, 1, 0, 1 );
		//Set the content of Unsplash tab
		$( '.weblify_content_panel' )[ weblifyPanelNames.indexOf( 'Subpages' ) ].innerHTML = "<div class='row weblify_content_panel_filters'>" +
			"<div class='col-md-12'>" +
				"<ul class='filterContainer'>" +
					"<li>" +
						"<div style='width: 250px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='multiselectSubpageCategory'>" +
								HTMLOptions[ 2 ] +
							"</select>" +
						"</div>" +
					"</li>" +
					"<li>" +
						"<div style='width: 250px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: 	middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='multiselectTags'>" +
								HTMLOptions[ 1 ] +
							"</select>" +
						"</div>" +
					"</li>" +
					"<li>" +
						"<div style='width: 250px; position: relative;'>" +
							"<i class='filter icon' style='vertical-align: 	middle; font-size: larger;'></i>" +
							"<select class='ui fluid dropdown selection search multiple weblify-filter' multiple='' id='multiselectPacks'>" +
								HTMLOptions[ 4 ] +
							"</select>" +
						"</div>" +
					"</li>" +
				"</ul>" +
			"</div>" +
		"</div>" +
    	"<div class='templatesSubpagesContainer'>"+
    	"</div>"+
	"<div>";
		
		displayWeblifyTemplates( '.templatesSubpagesContainer', '', [ 'Subpages' ] );
			
		$('#multiselectSubpageCategory').dropdown({
			placeholder: 'Select Subpage Categories'
		});
		
		$( '#multiselectTags' ).dropdown({
			placeholder: 'Select Tags'
		});
		
		$( '#multiselectPacks' ).dropdown({
			placeholder: 'Select Packs'
		});
		
		$( 'ul','div.ms-drop' ).children().addClass( 'select_item' );
		
		$( '.weblify-filter' ).change( function(){
			//Loop into all templates
			var subCatsArray = [];
			var tagsArray = [];
			var packsArray = [];
			$( '.templatesSubpagesContainer' ).children().each( function(){
				//Get template subpage categories
				var templateSubpageCategories = $( this ).attr( 'data-subpages-categories' ).split( ',' );
				//Get template tags
				var templateTags = $( this ).attr( 'data-tags' ).split( ',' );
				//Get template packs
				var templatePacks = $( this ).attr( 'data-subpages-pack' );
				
				//Get selected subpages categories
				var selectedSubCat = $( 'select#multiselectSubpageCategory' ).val();				
				//Get selected tags
				var selectedTags = $( 'select#multiselectTags' ).val();
				//Get selected packs
				var selectePacks = $( 'select#multiselectPacks' ).val();
				
				//Process filter on subpage categories	
				if ( selectedSubCat ){
					var matchedNumber = 0;
					
					$.each( selectedSubCat, function( key, value ){
						if ( $.inArray( value, templateSubpageCategories ) != -1 ){
							matchedNumber++;
						}	
					});	
					
					if ( matchedNumber ){
						subCatsArray.push( this ); 
					} 
				} else {
					subCatsArray.push( this );
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
				
				//Process filter on packs
				if ( selectePacks ){
					var matchedNumber = 0;
					$.each( selectePacks, function( key, value ){
						if ( value == templatePacks ){
							matchedNumber++;
						}	
					});	
					
					if ( matchedNumber ){
						packsArray.push( this ); 
					} 
				} else {
					packsArray.push( this );
				}
			});
			
			var templatesToDisplayTmp = [];
			
			if ( packsArray.length > 0 ){
				$.each( packsArray, function( keyPack, valuePack ){
					if ( $.inArray( valuePack, tagsArray ) != -1 ){
						templatesToDisplayTmp.push( valuePack );
					}
				});
			} 
			
			//Merge the matching values of the 2 arrays
			var templatesToDisplay = [];
			
			if ( subCatsArray.length > 0 ){
				$.each( subCatsArray, function( keySubCat, valueSubCat ){
					if ( $.inArray( valueSubCat, templatesToDisplayTmp ) != -1 ){
						templatesToDisplay.push( valueSubCat );
					}
				});
			} 
			
			//Display the right templates, hide the others
			$( '.templatesSubpagesContainer' ).children().each( function(){
				if ( $.inArray( this, templatesToDisplay ) != -1 ){
					$( this ).attr( "style", "display:block" );
				} else {	
					$( this ).attr( "style", "display:none" );
				}				
			});
		});
	});
}