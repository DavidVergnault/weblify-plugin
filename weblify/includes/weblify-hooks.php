<?php 

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

function create_weblify_hooks(){
	//Weblify_widget_base_hook
	change_file_content( array (
		'file' => ABSPATH . "wp-content/plugins/elementor/includes/base/widget-base.php", 
		'regex_old_content' => "/return array_merge\( parent::_get_initial_config\(\), \\\$config \);/" , 
		'new_content' => "\$widget_type = \$this->get_name();
		\$config = apply_filters(\"elementor/widget/{\$widget_type}/get_inital_config\", \$config);
		
		return array_merge( parent::_get_initial_config(), \$config );", 
		'tag' => "Weblify_widget_base_hook",
		)
	);
	
	
	if( is_user_logged_in() ) {
		$user = wp_get_current_user();
		$roles = ( array ) $user->roles;
		foreach ( $roles as $role) {
			if ( $role == 'RD') {
				change_file_content( array (
					'file' => ABSPATH . "wp-content/plugins/elementor/includes/fonts.php", 
					'regex_old_content' => "/private static function get_native_fonts\(\) {/" , 
					'new_content' => "private static function get_native_fonts() {
							return [ 
								'Roboto' => self::GOOGLE,
								'Open Sans' => self::GOOGLE,
							];
						", 
					'tag' => "Weblify_fonts_hook",
					)
				);
					
				change_file_content( array (
					'file' => ABSPATH . "wp-content/plugins/elementor/includes/template-library/sources/local.php", 
					'regex_old_content' => "/public function export_template\( \\\$template_id \) {/" , 
					'new_content' => "public function export_template( \$template_id ) {	
					do_action('elementor/template-library/before_export_template');
					",
					'tag' => "Weblify_local_hook",
					)
				);
				
			} else {
				change_file_content_back( array (
					'file' => ABSPATH . "wp-content/plugins/elementor/includes/fonts.php", 
					'regex_old_content' => "/private static function get_native_fonts\(\) {/" , 
					'tag' => "Weblify_fonts_hook",
					)
				);
			}
		}
	}
}

function weblify_deactivate(){
	change_file_content_back( array (
		'file' => ABSPATH . "wp-content/plugins/elementor/includes/base/widget-base.php", 
		'regex_old_content' => "/return array_merge\( parent::_get_initial_config\(\), \\\$config \);/" , 
		'tag' => "Weblify_widget_base_hook",
		)
	);
}

function change_file_content( $args ){
	$regex_tag = "/" . $args[ 'tag' ] . "/i";
	$file_content = file_get_contents ($args[ 'file' ]);

	//Check if tag already exists
	if ( !preg_match( $regex_tag, $file_content )){
		//Put the content between two general tags to it's easier to remove later
		$new_content_with_tag = "/** Weblify addon
		 * " . $args[ 'tag' ] . "
		 */
		 
		" . $args[ 'new_content' ] . "
		
		/** Weblify addon **/";
		
		$replacement = preg_replace( $args[ 'regex_old_content' ], $new_content_with_tag, $file_content );

		file_put_contents ($args[ 'file' ], $replacement);
	} 
}

function change_file_content_back( $args ){
	$regex_tag = "/" . $args[ 'tag' ] . "/i";
	$file_content = file_get_contents ($args[ 'file' ]);

	//Check if tag already exists
	if ( preg_match( $regex_tag, $file_content )){
		
		preg_match($args[ 'regex_old_content' ], $file_content, $matches);
		$replacement = preg_replace( "/\/\*\*( ?)Weblify( ?)addon(.*?)" . $args[ 'tag' ] . "(.*?)Weblify( ?)addon( ?)\*\*\//s", $matches[0], $file_content );
		file_put_contents ($args[ 'file' ], $replacement);
	} 
}

create_weblify_hooks();