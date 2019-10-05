function getHTMLOptions( doGetCat, doGetTags, doGetSubCat, doGetAuth, doGetPacks){
	var dropDownTags = getHTMLOption( window.weblifyTags, doGetTags );
	var dropDownSubCat = getHTMLOption( window.weblifySubpagesCategories, doGetSubCat );
	var dropDownCat = getHTMLOption( window.weblifyCategories, doGetCat );
	var dropDownAuth = getHTMLOption( window.weblifyAuthors, doGetAuth );
	var dropDownPacks = getHTMLOption( window.weblifyPacks, doGetPacks );

	return [ dropDownCat, dropDownTags, dropDownSubCat, dropDownAuth, dropDownPacks ];
}

function getHTMLOption( array , doGetFilter ){
	var dropDownValue = '';
	
	if ( doGetFilter ){
		$.each( array, function( key, value ){
			dropDownValue += "<option value='" + value + "'>" + value + "</option>";
		});
	}
	
	return dropDownValue;
}