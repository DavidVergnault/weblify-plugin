<?php

namespace Weblify;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Main class plugin
 * 
 * The main class that initiates and runs the plugin.
 */
final class Plugin {

    /**
	 * @var Plugin
	 */
	private static $_instance;
   
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}
	
    public static function elementor() {
		return \Elementor\Plugin::$instance;
	}
	
	/**
	 * Plugin constructor.
	 */
	private function __construct() {
		ini_set( 'max_execution_time' , 180 ); //May be usefull to help importing big templates
		$this->setup_hooks();
	}
	
	private function setup_hooks() {			
		if ( class_exists( '\Elementor\Plugin' ) ){
			//Set the Layout of the page
			if ( 1 == get_option( 'page_layout' ) ){
				add_action( 'elementor/widgets/widgets_registered', [ $this, 'set_page_layout' ], 99 );
			}
			
			if ( 1 == get_option( 'widgets_ordering' ) ){
				$this->categorize_widgets();
			}
			
			//Set the Weblify Media Section
			add_action( 'elementor/editor/before_enqueue_scripts', [ $this, 'enqueue_editor_scripts' ] );
			add_action( 'elementor/editor/before_enqueue_styles', [ $this, 'enqueue_editor_styles' ] );
			add_action( 'elementor/preview/enqueue_styles', [ $this, 'enqueue_preview_styles' ] ); 
					
			add_action('elementor/element/after_section_end', [ $this, 'remove_elementor_demo_controls' ], 999, 3);
			
			//Upload an image downloaded from WMS
			add_action( 'wp_ajax_upload_images' , [ $this, 'upload_unsplash_image'], 99, 1 );
			
			//Get palette from URL
			add_action( 'wp_ajax_get_url_palette' , [ $this, 'get_url_palette'], 99, 1 );
			
			//Upload an image downloaded from WMS
			add_action( 'wp_ajax_get_unsplash_from_url' , [ $this, 'get_images_from_url'], 99, 1 );
			
			//Get a placeholder image ID and URL
			add_action( 'wp_ajax_upload_placeholder' , [ $this, 'upload_placeholder_image'], 99, 1 );	
			
			add_action( 'wp_ajax_upload_basecamp_material' , [ $this, 'upload_basecamp_material'], 99, 1 );	
		}
	}
	
	function set_page_layout(){
		/*if ( 'elementor_canvas' == get_option( 'page_layout_radio' ) ){
			update_metadata( 'post', $_GET[ 'post' ], '_wp_page_template', 'elementor_canvas' );
		} else {
			if ( 'elementor_header_footer' == get_option( 'page_layout_radio' ) ){
				update_metadata( 'post', $_GET[ 'post' ], '_wp_page_template', 'elementor_header_footer' );
			}
		}*/
	}
	
	public function enqueue_preview_styles(){
		wp_enqueue_style( 'elementor_weblify_modal_button-css', WEBLIFY_ASSETS_URL . 'css/elementor-weblify-modal-button.css' );
	}
	
	public function enqueue_editor_styles(){
		//Libs
		wp_enqueue_style( 'flexbox_gallery-css', WEBLIFY_URL . 'lib/flexbox-gallery.css' );
		wp_enqueue_style( 'boostrap-css', "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css" );
		// For Multiselect dropdown -- added by Khushal Gupta
		wp_enqueue_style( 'multiple_select-semantic-css', 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css' );

		wp_enqueue_style( 'elementor_weblify_modal-css', WEBLIFY_ASSETS_URL . 'css/elementor-weblify-modal.css' );
		wp_enqueue_style( 'elementor_weblify_panel-css', WEBLIFY_ASSETS_URL . 'css/elementor-weblify-panel.css' );
	}
	
	public function enqueue_editor_scripts(){
		//Libs
		wp_enqueue_script( 'flexbox_gallery-js', WEBLIFY_URL . 'lib/flexbox-gallery.js' ); //This file has received some modification, that's why I don't import it from cloudflare even though it's possible
		wp_enqueue_script( 'color_thief-js', "https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.0.1/color-thief.min.js" );
		wp_enqueue_script( 'boostrap-js', "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js" );			
		wp_enqueue_script( 'sweet_alert-js', 'https://cdnjs.cloudflare.com/ajax/libs/sweetalert/2.1.2/sweetalert.min.js' );
		// For Multiselect dropdown -- added by Khushal Gupta
		wp_enqueue_script( 'multiple_select-semantic-js', 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.js' );
		
		wp_enqueue_script( 'airtable_api-js', WEBLIFY_ASSETS_URL . 'js/airtable_api_bundle.js' );

		//Weblify Media Sections
		wp_enqueue_script( 'elementor_weblify_modal-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal.js', [ 'jquery' ] );
		wp_localize_script( 'elementor_weblify_modal-js', 'phpInfos', array( 'isDemoMode' => get_option( 'demo_mode' ) ) );
		wp_localize_script( 'elementor_weblify_modal-js', 'admin_ajax_url', admin_url('admin-ajax.php'));
		wp_enqueue_script( 'elementor_weblify_modal_insert_template-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-insert-template.js', [ 'jquery' ] );
		wp_localize_script( 'elementor_weblify_modal_insert_template-js', 'putPlaceholderImage', array( get_option( 'placeholder_image' ) ) );
		wp_enqueue_script( 'elementor_weblify_modal_unsplash-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-unsplash.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_modal_AI-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-AI.js', [ 'jquery' ] );

		wp_enqueue_script( 'elementor_weblify_modal_subpages-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-subpages.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_modal_demos-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-demos.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_modal_sections-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-sections.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_modal_filters-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-modal-filters.js', [ 'jquery' ] );

		//Features in the editor panel on the left in Elementor
		wp_enqueue_script( 'elementor_weblify_panel_demo_generator-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-panel-demo-generator.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_panel_global_colors-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-panel-global-colors.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_panel_global_families-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-panel-global-families.js', [ 'jquery' ] );
		wp_enqueue_script( 'elementor_weblify_panel-js', WEBLIFY_ASSETS_URL . 'js/elementor-weblify-panel.js', [ 'jquery' ] );

	}
	
	function add_elementor_widget_categories( $elements_manager ) {
		$elements_manager->add_category(
			'layout',
			[
				'title' => __( 'Layout', 'weblify' ),
				'icon' => 'fa fa-plug',
			]
		);
		$elements_manager->add_category(
			'content',
			[
				'title' => __( 'Content', 'weblify' ),
				'icon' => 'fa fa-plug',
			]
		);
		$elements_manager->add_category(
			'media',
			[
				'title' => __( 'Media', 'weblify' ),
				'icon' => 'fa fa-plug',
			]
		);
		$elements_manager->add_category(
			'others',
			[
				'title' => __( 'Others', 'weblify' ),
				'icon' => 'fa fa-plug',
			]
		);
	}

	function categorize_widgets() {		
		//Add widget categories so they are categorized later on
		add_action( 'elementor/elements/categories_registered', [ $this, 'add_elementor_widget_categories' ], 1 );
		
		$widgets_list_layout = [ 'spacer', 'menu-anchor', 'form', 'jet-nav-menu', 'jet-auth-links', 'jet-hamburger-panel' ];
		
		$widgets_list_content = [ 'heading', 'text-editor', 'toggle', 'icon-list', 'price-table', 'posts', 'blockquote', 'counter', 'shortcode', 'accordion', 'jet-login', 'jet-register', 'jet-pricing-table', 'wp-widget-rss', 'google_maps', 'social-icons' ];
		
		$widgets_list_media = [ 'image', 'image-gallery', 'icon', 'theme-site-logo', 'jet-inline-svg', 'jet-carousel', 'media-carousel' ];
		
		$widgets_list_others = [ 'video', 'divider', 'portfolio', 'slides', 'login', 'animated-headline', 'price-list', 'flip-box', 'testimonial-carousel', 'countdown', 'share-buttons', 'facebook-embed', 'facebook-page', 'image-carousel', 'progress', 'tabs', 'html', 'nav-menu', 'sitemap', 'theme-post-title', 'theme-post-excerpt', 'theme-post-featured-image', 'post-comments', 'post-info', 'post-excerpt', 'author-box', 'post-navigation', 'jet-search', 'jet-post-navigation', 'jet-posts-pagination', 'jet-video-playlist', 'jet-advanced-map', 'jet-animated-box', 'jet-audio', 'jet-circle-progress', 'jet-countdown-timer', 'jet-horizontal-timeline', 'jet-image-comparison', 'jet-images-layout', 'jet-pie-chart', 'jet-portfolio', 'jet-posts', 'jet-price-list', 'jet-progress-bar', 'jet-slider', 'jet-table', 'jet-timeline', 'jet-video', 'jet-accordion', 'jet-image-accordion', 'jet-switcher', 'jet-tabs', 'jet-hotspots' , 'jet-unfold', 'jet-view-more', 'jet-logo', 'button', 'jet-testimonials', 'jet-map', 'jet-custom-menu', 'jet-mega-menu', 'contact-form-7', 'icon-box', 			'testimonial', 'star-rating' ];
		
		foreach( $widgets_list_layout as $widget ){
			add_filter( 'elementor/widget/' .$widget. '/get_inital_config', [ $this, 'filter_widget_config_layout' ], 15 );
		}
		foreach( $widgets_list_content as $widget ){
			add_filter( 'elementor/widget/' .$widget. '/get_inital_config', [ $this, 'filter_widget_config_content' ], 15 ); 
		}
		foreach( $widgets_list_media as $widget ){
			add_filter( 'elementor/widget/' .$widget. '/get_inital_config', [ $this, 'filter_widget_config_media' ], 15 ); 
		}
		
		foreach( $widgets_list_others as $widget ){
			add_filter( 'elementor/widget/' .$widget. '/get_inital_config', [ $this, 'filter_widget_config_others' ], 15 );
		}	
		
		//Unregister the unused widgets
		add_action( 'elementor/widgets/widgets_registered', [ $this, 'unregister_widgets' ], 15 );
	}
	
	function unregister_widgets( $widgets_manager ){
		$black_list = [
			'call-to-action',
			'reviews',
			'facebook-comments', 
			'facebook-button', 
			'template',
			'image-box',	
			'alert',
			'audio',
			'sidebar',
			'read-more',
			'breadcrumbs', 
			'theme-page-title', 
			'theme-site-title', 
			'search-form',
			'jet-breadcrumbs',
			'jet-site-logo',
			'jet-smart-posts-list',
			'jet-smart-posts-titles',
			'jet-text-ticker',
			'jet-animated-text',
			'jet-banner',
			'jet-brands',
			'jet-button',
			'jet-download-button',
			'jet-dropbar',
			'jet-headline',
			'jet-instagram-gallery',
			'jet-scroll-navigation',
			'jet-services',
			'jet-subscribe-form',
			'jet-team-member',
			'jet-weather',
			'jet-ajax-search',
		];
		
		foreach( $black_list as $widget ){
			$widgets_manager->unregister_widget_type( $widget );
		}
	}
	
	function filter_widget_config_layout( $config ){
		$config[ 'categories' ] = [ 'layout' ];
		return $config;
	}
	
	function filter_widget_config_content ( $config ){
		$config[ 'categories' ] = [ 'content' ];
		return $config;
	}
	
	function filter_widget_config_media ( $config ){
		$config[ 'categories' ] = [ 'media' ];
		return $config;
	}
	
	function filter_widget_config_others ( $config ){
		$config[ 'categories' ] = [ 'others' ];
		return $config;
	}
	
	function upload_unsplash_image(){
		if ( isset( $_POST[ 'image' ] ) ){
			$imageurl = $_POST[ 'image' ];
			
			if( is_array( $imageurl ) ){
				$list = array();
				
				foreach ( $imageurl as $key => $value ) {
					$image_data  = url_get_contents( $value ); // Get image data
					$filename    = basename( $value ); // Get image file name

					$is_unsplash_image = strpos( $filename, "?" );
					
					if ( $is_unsplash_image != FALSE ){
						$filename = substr( $filename, 0, strpos( $filename, "?" ) ).".png"; //Rename it to be a png file
					}
					
					$upload_dir = wp_upload_dir(); // Array of key => value pairs
					$upload_dir = $upload_dir[ 'url' ];
					
					$image_url = $upload_dir."/".$filename;
					$image_id = attachment_url_to_postid( $image_url );

					if ( $image_id ){
						//Return the existing image
						array_push( $list, array( "id" => $image_id, "url" => wp_get_attachment_image_src( $image_id, 'full' )[ 0 ] ) );
					} else {
						//Upload the image in the upload folder of WP
						$upload_file = wp_upload_bits( $filename, null, $image_data );

						if ( !$upload_file[ 'error' ] ) {
							$wp_filetype = wp_check_filetype( $filename, null );

							// Set attachment data
							$attachment = array(
								'post_mime_type' => $wp_filetype[ 'type' ],
								'post_title'     => sanitize_file_name( $filename ),
								'post_content'   => '',
								'post_status'    => 'inherit'
							);

							$attachment_id = wp_insert_attachment( $attachment, $upload_file[ 'file' ] );

							//Create the thumbnail
							if ( !is_wp_error( $attachment_id ) ) {
								require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
								
								$attach_data = wp_generate_attachment_metadata( $attachment_id, $upload_file[ 'file' ] );
								
								wp_update_attachment_metadata( $attachment_id, $attach_data );
								
								array_push( $list, array( "id" => $attachment_id, "url" => wp_get_attachment_image_src( $attachment_id, 'full' )[ 0 ] ) ); 
							}
						}
					}
				}
				
				echo json_encode( $list );
				wp_die(); 
			} else {
				//For Unsplash images
				
				//Use cURL instead of file_get_contents becasue in case the php.ini hasn't the right configuration
				$image_data  = url_get_contents( $imageurl ); // Get image data
				$filename    = basename( $imageurl ); // Get image file name

				$filename = substr( $filename, 0, strpos( $filename, "?" ) ).".png"; //Rename it to be a png file

				//Upload the image in the upload folder of WP
				$upload_file = wp_upload_bits( $filename, null, $image_data );

				if ( !$upload_file[ 'error' ] ) {
					$wp_filetype = wp_check_filetype( $filename, null );

					// Set attachment data
					$attachment = array(
						'post_mime_type' => $wp_filetype[ 'type' ],
						'post_title'     => sanitize_file_name( $filename ),
						'post_content'   => '',
						'post_status'    => 'inherit'
					);

					$attachment_id = wp_insert_attachment( $attachment, $upload_file[ 'file' ] );

					//Create the thumbnail
					if ( !is_wp_error( $attachment_id ) ) {
						require_once( ABSPATH . "wp-admin" . '/includes/image.php' );
						
						$attach_data = wp_generate_attachment_metadata( $attachment_id, $upload_file['file'] );
						
						wp_update_attachment_metadata( $attachment_id, $attach_data );
						
						echo json_encode( array( "id" => $attachment_id, "url" => wp_get_attachment_image_src( $attachment_id, 'full' )[ 0 ] ) );
						wp_die(); 
					}
				}
			}
		}
	}
	
	function upload_placeholder_image(){
		$upload_dir = wp_upload_dir(); // Array of key => value pairs
		$upload_dir = $upload_dir[ 'url' ];
		
		$filename = 'placeholder.png';
		
		$placeholder_url = $upload_dir."/".$filename;
		$placeholder_id = attachment_url_to_postid( $placeholder_url );
	
		if ( $placeholder_id ){
			echo json_encode( array( "id" => $placeholder_id, "url" => $placeholder_url ) );
			wp_die(); //Do this otherwise it echoes a 0
		} else {
			//Upload the placeholder image in the upload folder of WP
			$upload_file = wp_upload_bits( $filename, null, url_get_contents( 'https://mother-site.production-weblify.com/wp-content/uploads/2019/06/placeholder.png' ) );

			if ( !$upload_file[ 'error' ] ) {
				$wp_filetype = wp_check_filetype( $filename, null );

				// Set attachment data
				$attachment = array(
					'post_mime_type' => $wp_filetype[ 'type' ],
					'post_title'     => sanitize_file_name( $filename ),
					'post_content'   => '',
					'post_status'    => 'inherit'
				);

				$attachment_id = wp_insert_attachment( $attachment, $upload_file[ 'file' ] );

				//Create the thumbnail
				if ( !is_wp_error( $attachment_id ) ) {
					require_once(ABSPATH . "wp-admin" . '/includes/image.php');
					
					$attach_data = wp_generate_attachment_metadata( $attachment_id, $upload_file[ 'file' ] );
					
					wp_update_attachment_metadata( $attachment_id, $attach_data );
					
					echo json_encode( array( "id" => $attachment_id, "url" => wp_get_attachment_image_src( $attachment_id, 'full' )[ 0 ] ) );
					wp_die(); 
				}
			}
		}
	}
	
	function upload_basecamp_material(){
		include 'weblify_api_config.php';

		//Get Airtable record data ----------------
		$info = array(
			"action" => "GET",
			"api_url" => $airtable_config[ 'api_url' ],
			"access_token" => $airtable_config[ 'access_token' ],
			"base" => $airtable_config[ 'apis' ][ 'base' ],
			"table" => "tbln5OOqdZGrRAtcV",
			"view" => "",
			"record_id" => "rec8UopyU21u3xQt3",
			"data" => "",
			"params" => array(),
		);	

		$response = json_decode( airtable_api_request_single_page( $info ), true );
		//-----------

		//Get all basecamp files uploaded from the specified bucket/vault----------
		$access_token = $response['fields']['Access Token'];
		$request_url = $_POST['basecamp_url'] . "/uploads.json";  

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $request_url );
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);		
		curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
		$headers = array();
		$headers[] = 'Authorization: Bearer ' . $access_token;
		$headers[] = 'User-Agent: Weblify (david.vergnault@weblify.se)';
		curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
		$response = curl_exec($ch);
		$response = json_decode( $response, true );
		curl_close($ch);
		//-----------

		foreach( $response as $key => $value ){
			//Get the file content. Assumed that it's an image
			$download_url = $value[ 'download_url' ];  
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $download_url );
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);		
			curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
			$headers = array();
			$headers[] = 'Authorization: Bearer ' . $access_token;
			$headers[] = 'User-Agent: Weblify (david.vergnault@weblify.se)';
			curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
			$response = curl_exec($ch);
			curl_close($ch);

			$filename =pathinfo($download_url, PATHINFO_BASENAME); 
				
			$upload_dir = wp_upload_dir(); // Array of key => value pairs
			$upload_dir = $upload_dir[ 'url' ];

			$image_url = $upload_dir."/".$filename;
			$image_id = attachment_url_to_postid( $image_url );
			if ( empty($image_id) ){
				$upload_file = wp_upload_bits( $filename, null, $response );
				error_log(print_r($upload_file, true));
				if ( !$upload_file[ 'error' ] ) {
					$wp_filetype = wp_check_filetype( $filename, null );

					// Set attachment data
					$attachment = array(
						'post_mime_type' => $wp_filetype[ 'type' ],
						'post_title'     => sanitize_file_name( $filename ),
						'post_content'   => '',
						'post_status'    => 'inherit'
					);

					$attachment_id = wp_insert_attachment( $attachment, $upload_file[ 'file' ] );

					//Create the thumbnail
					if ( !is_wp_error( $attachment_id ) ) {
						require_once(ABSPATH . "wp-admin" . '/includes/image.php');

						$attach_data = wp_generate_attachment_metadata( $attachment_id, $upload_file[ 'file' ] );

						wp_update_attachment_metadata( $attachment_id, $attach_data );
					}
				}
			}
		}
	}
	
	function remove_elementor_demo_controls( $element, $section_id, $args ){
		if( is_user_logged_in() ) {
			$user = wp_get_current_user();
			$roles = ( array ) $user->roles;
			foreach ( $roles as $role) {
				if ( $role == 'RD') {
					//Empty Advanced TAB
					if ( $args['tab'] == \Elementor\Controls_Manager::TAB_ADVANCED ){
						foreach ( $element->get_section_controls( $section_id ) as $control ) {
							$element->remove_control($control);
						}
					}

					//Remove all options but text color alignement, and typography.
					/*if ( $args['tab'] == \Elementor\Controls_Manager::TAB_STYLE ){
						foreach ( $element->get_section_controls( $section_id ) as $control ) {
							$black_list_controls = [ 'text_color', 
													'typography_font_size', 
													'typography_font_weight', 
													'typography_text_transform',
												    'typography_font_style',
												    'typography_text_decoration',
													'typography_line_height',
													'typography_letter_spacing',
													'column_gap',
													'text_columns',
													'text_shadow_text_shadow_type',
													'blend_mode'
												   ];
							if ( in_array( $control[ 'name' ], $black_list_controls ) ) {
								$element->remove_control($control[ 'name' ]);
							} else {
								continue;
							}
						}
					}*/
				}
			}
		}
	}
	
	function get_url_palette (){
		$url = $_POST[ 'url' ];

		$exec_command = '~/python/bin/python3 ' . getcwd() . '/../wp-content/plugins/weblify/includes/python/David_colorPalette.py ' . $url;

		$result = exec($exec_command);
		echo $result;
		wp_die(); 
	}
	
	function get_images_from_url(){
		$url = $_POST[ 'url' ];
		error_log($url);

		$exec_command = '~/python/bin/python3 ' . getcwd() . '/../wp-content/plugins/weblify/includes/python/David_picGenerator.py ' . $url;
		$result = shell_exec($exec_command);
		error_log($result);
		echo $result;
		wp_die(); 
	}
}

function url_get_contents( $Url ) {
		if ( !function_exists( 'curl_init' ) ){ 
			die( 'CURL is not installed!' );
		}
		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_URL, $Url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$output = curl_exec( $ch );
		curl_close( $ch );
		return $output;
	}

Plugin::instance();