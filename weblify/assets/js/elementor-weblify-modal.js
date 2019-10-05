var weblifyPanelNames = [ 'Sections', 'Images', 'Subpages', 'Demos' ];
var weblifyPanelShown = [];

function showPanel( panelName ){
	jQuery( function( $ ) {
		if ( $.inArray( panelName, weblifyPanelShown ) == -1 ){	
			switch( panelName ){
				case 'Sections':
					setPanelSections();
					break;

				case 'Demos':
					setPanelDemos();
					break;

				case 'Subpages':
					setPanelSubpages();
					break;

				case 'Images':
					setPanelUnsplash();
					break;
				
				case 'AI':
					setPanelAI();
					break;
					
				default:

			}
			weblifyPanelShown.push( panelName );
		}
		
		//Make visual feedback
		var tabButtons = $( ".weblify_header_tabs_button" );
		var tabPanels = $( ".weblify_content_panel" );

		$.each( tabButtons, function( key, value ){
			value.style.backgroundColor = "";
			value.style.color = "black";
		});		
		
		tabButtons[ weblifyPanelNames.indexOf( panelName ) ].style.backgroundColor = "#ea155f";
		tabButtons[ weblifyPanelNames.indexOf( panelName ) ].style.color = "white";

		$.each( tabPanels, function( key, value ){
			value.style.display = "none";
		});
		
		tabPanels[ weblifyPanelNames.indexOf( panelName ) ].style.display = "block";	
	});
}

(function($){
    $(function() {		
        function setModalContent() {
            if ( elementorCommon ) {
				if ( !window.weblifyModal ) {
					window.weblifyModal = elementorCommon.dialogsManager.createWidget( 'lightbox', { //Create the popup, also called "modal"
						id: "weblify-elements-modal",
						headerMessage: false,
						message: "",
						hide: {
							auto: false,
							onClick: false,
							onOutsideClick: false,
							onOutsideContextMenu: false,
							onBackgroundClick: true
						},
						position: {
							my: "center",
							at: "center"
						},
						onShow: function() {
							var loadingView = $( '#tmpl-elementor-template-library-loading' ).text();
							var modalContent = window.weblifyModal.getElements( "content" );
							
							var displayedTabs;
							if ( 1 == phpInfos[ 'isDemoMode' ] ){
								displayedTabs = "<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[0] +"\")'>"+ weblifyPanelNames[0] +"</button>"+
									"<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[1] +"\")'>"+ weblifyPanelNames[1] +"</button>";
							} else {
								displayedTabs = "<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[0] +"\")'>"+ weblifyPanelNames[0] +"</button>"+
 									"<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[1] +"\")'>"+ weblifyPanelNames[1] +"</button>"+
 									"<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[2] +"\")'>"+ weblifyPanelNames[2] +"</button>"+
 									"<button class='weblify_header_tabs_button ui button' onclick='showPanel(\""+ weblifyPanelNames[3] +"\")'>"+ weblifyPanelNames[3] +"</button>";
							}
							
							modalContent.get( 0 ).innerHTML = "<div class='weblify_header'>" +
								"<div class='weblify_header_tabs'>"+
									displayedTabs + 
									"<button class='weblify_header_tabs_button closeBtn ui button' onclick='window.weblifyModal.hide()' style='background: none'>" +
										"<i class='close icon' style='margin: 0px; font-size: 1.5em'></i>" +
									"</button>" +
								"</div>"+
							"</div>"+
							"<div class='weblify_content'>" +
								"<div class='weblify-library-loading'>" +
									loadingView +
								"</div>" +
								"<div class='weblify_content_panel'></div>" +
								"<div class='weblify_content_panel'></div>" +
								"<div class='weblify_content_panel'></div>" +
								"<div class='weblify_content_panel'></div>" +
							"</div>";
							
							$( '.weblify-library-loading' ).css( 'display', 'none' );

							//Default Panel
							showPanel( weblifyPanelNames[ 1 ] );
							if ( 1 != phpInfos[ 'isDemoMode' ] ){
								showPanel( weblifyPanelNames[ 2 ] );
								showPanel( weblifyPanelNames[ 3 ] );
							}
							showPanel( weblifyPanelNames[ 0 ] );

						},
						onHide: function() {	
							weblifyPanelShown = [];
						}
					});
					window.weblifyModal.getElements( "header" ).remove();
					window.weblifyModal.getElements( "message" ).append( window.weblifyModal.addElement( "content" ) );
				}
				window.weblifyModal.show();
			}
		}
        
		window.weblifyModal = null;
        
		var templateAddSection = $( "#tmpl-elementor-add-section" );
        
		if ( templateAddSection.length > 0 ) {
            var templateAddSectionText = templateAddSection.text();
            
			templateAddSectionText = templateAddSectionText.replace( '<div class="elementor-add-section-drag-title', '<div class="elementor-add-section-area-button elementor-add-weblify-button" title="Weblify"> <i class="fa fa-folder"></i> </div><div class="elementor-add-section-drag-title' );
			templateAddSection.text( templateAddSectionText );
			
			elementor.on( "preview:loaded", function() {
                $( elementor.$previewContents[ 0 ].body ).on( "click", ".elementor-add-weblify-button", setModalContent )
            });
        }
    })
})(jQuery);