function setPanelAI(){
	jQuery( function( $ ) {
		//Set the content of Unsplash tab		
		$( ".weblify_content_panel" )[ weblifyPanelNames.indexOf( 'AI' ) ].innerHTML = "<div class='row weblify_content_panel_filters'>" +
			"<div class='col-md-12 d-flex flex-wrap justify-content-between'>" +
				"<div class='ui search' style='top: 5px;'>" +
					"<div class='ui icon input'>" +
						"<input type='text' placeholder='Search from URL' class='prompt searchBarURL form-control' name='search'>" +
						"<i class='search icon'></i>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>" +
		"<div class='AI-container'>" +
			"<div class='AI-color-palette'>" +
				"<div class='AI-color-palette-pickers'>" +
					"<input type='text' value='#bada55' class='AI-color-palette-picker' />" +
					"<input type='text' value='#c3f9a2' class='AI-color-palette-picker' />" +
					"<input type='text' value='#ffffff' class='AI-color-palette-picker' />" +
					"<input type='text' value='#000000' class='AI-color-palette-picker' />" +
				"</div>" +
				"<div class='AI-color-palette-button'>" +
					"<button onclick=''>Apply palette to default's one</button>" +
				"</div>" +
			"</div>" +
			"<div class='AI-inputs'>" +
				"<div class='AI-hero-area'>" +
					"<input type='text' class='AI-input AI-input-hero-area' />" +
				"</div>" +
				"<div class='AI-services-area'>" +
					"<input type='text' class='AI-input AI-input-services-area' />" +
				"</div>" +
				"<div class='AI-testimonials-area'>" +
					"<input type='text' class='AI-input AI-input-testimonials-area' />" +
				"</div>" +
				"<div class='AI-extras-area'>" +
					"<input type='text' class='AI-input AI-input-extras-area' />" +
				"</div>" +
				"<div class='AI-footer-area'>" +
					"<input type='text' class='AI-input AI-input-footer-area' />" +
				"</div>" +		
			"</div>" +		
		"</div>";
		
		$('.AI-color-palette-picker').wpColorPicker();		
	});
}