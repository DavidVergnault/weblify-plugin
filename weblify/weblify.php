<?php
/**
 * Plugin Name: Weblify
 * Description: Weblify plugin has been created by Weblify for Weblify. It has some features to help the work of Weblify's designers using Elementor.
 * Author: Weblify
 * Version: 1.1.0
 * Author URI: https://weblify.se/
 *
 * Text Domain: //insert text domain
 */ 

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'WEBLIFY_VERSION', '1.0.0' );
define( 'WEBLIFY_PREVIOUS_STABLE_VERSION', '1.0.0' );

define( 'WEBLIFY__FILE__', __FILE__ );
define( 'WEBLIFY_PLUGIN_BASE', plugin_basename( WEBLIFY__FILE__ ) );
define( 'WEBLIFY_PATH', plugin_dir_path( WEBLIFY__FILE__ ) );
define( 'WEBLIFY_ASSETS_PATH', WEBLIFY_PATH . 'assets/' );
define( 'WEBLIFY_URL', plugins_url( '/', WEBLIFY__FILE__ ) );
define( 'WEBLIFY_ASSETS_URL', WEBLIFY_URL . 'assets/' );

define( 'MINIMUM_ELEMENTOR_VERSION', '2.0.0' );
define( 'MINIMUM_PHP_VERSION', '7.0' );

/**
 * Load gettext translate for our text domain.
 *
 * @since 1.0.0
 *
 * @return void
 */
function weblify_load_plugin() {
	//Load plugin localization files
	load_plugin_textdomain( 'weblify' );
	
	// Check for required PHP version
	if ( version_compare( PHP_VERSION, MINIMUM_PHP_VERSION, '<' ) ) {
		add_action( 'admin_notices', [ $this, 'admin_notice_minimum_php_version' ] );
		return;
	}
	
	require WEBLIFY_PATH . 'includes/weblify-menu-page.php';	   

	//Add plugin description to the plugin list in WP dashboard
	add_filter( 'plugin_row_meta', 'plugin_row_meta' , 10, 2 );
	
	if ( get_option( 'image_resizing' )){
		//Resize any uploaded image to 1920xsomething
		require WEBLIFY_PATH . 'includes/weblify-resize-image.php';
	}
	
	// Check if Elementor installed and activated
	if ( ! did_action( 'elementor/loaded' ) ) {
		add_action( 'admin_notices', [ $this, 'admin_notice_missing_main_plugin' ] );
		return;
	} 

	// Check for required Elementor version
	if ( ! version_compare( ELEMENTOR_VERSION, MINIMUM_ELEMENTOR_VERSION, '>=' ) ) {
		add_action( 'admin_notices', [ $this, 'admin_notice_minimum_elementor_version' ] );
		return;
	}
	
	//Insert hooks or code insde Elementor files
	//require WEBLIFY_PATH . 'lib/Minifier.php'; //This can create crashes
	require WEBLIFY_PATH . 'includes/weblify-hooks.php';
		
	if( is_user_logged_in() ) {
		$user = wp_get_current_user();
		$roles = ( array ) $user->roles;
		foreach ( $roles as $role) {
			if ( $role == 'RD' ) {
				add_action( 'admin_init', function(){
					remove_menu_page('users');
					remove_menu_page('weblify');
					remove_menu_page('elementor');
				});
				
				add_action('admin_menu', 'remove_menus');
				
				add_action( 'elementor/template-library/before_export_template', function(){
					die("Not allowed");
				});
			} 
		}
	}
	
	
	//Stripe API
	//require_once WEBLIFY_PATH . 'lib/stripe-php-6.37.0/init.php';	
	//require_once WEBLIFY_PATH . 'stripeAPI.php';

	//BC3 API
	//require_once WEBLIFY_PATH . 'basecamp3-Api.php';

	//GetAccept API
	//require_once WEBLIFY_PATH . 'getAcceptAPI.php';
	
	require WEBLIFY_PATH . 'plugin.php';
}


/**
 * Admin notice
 *
 * Warning when the site doesn't have Elementor installed or activated.
 *
 * @since 1.0.0
 *
 */
function admin_notice_missing_main_plugin() {

	if ( isset( $_GET[ 'activate' ] ) ) unset( $_GET[ 'activate' ] );

	$message = sprintf(
		/* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
		esc_html__( '"%1$s" requires "%2$s" to be installed and activated.', 'weblify' ),
		'<strong>' . esc_html__( 'Webify', 'weblify' ) . '</strong>',
		'<strong>' . esc_html__( 'Elementor', 'weblify' ) . '</strong>'
	);

	printf( '<div class="notice notice-warning is-dismissible"><p>Weblify</p></div>', $message );

}

/**
 * Admin notice
 *
 * Warning when the site doesn't have a minimum required Elementor version.
 *
 * @since 1.0.0
 *
 */
function admin_notice_minimum_elementor_version() {

	if ( isset( $_GET[ 'activate' ] ) ) unset( $_GET[ 'activate' ] );

	$message = sprintf(
		/* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
		esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'weblify' ),
		'<strong>' . esc_html__( 'Weblify', 'weblify' ) . '</strong>',
		'<strong>' . esc_html__( 'Elementor', 'weblify' ) . '</strong>',
		MINIMUM_ELEMENTOR_VERSION
	);

	printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

}

/**
 * Admin notice
 *
 * Warning when the site doesn't have a minimum required PHP version.
 *
 * @since 1.0.0
 *
 */
function admin_notice_minimum_php_version() {

	if ( isset( $_GET['activate'] ) ) unset( $_GET['activate'] );

	$message = sprintf(
		/* translators: 1: Plugin name 2: PHP 3: Required PHP version */
		esc_html__( '"%1$s" requires "%2$s" version %3$s or greater.', 'weblify' ),
		'<strong>' . esc_html__( 'Weblify', 'weblify' ) . '</strong>',
		'<strong>' . esc_html__( 'PHP', 'weblify' ) . '</strong>',
		MINIMUM_PHP_VERSION
	);

	printf( '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message );

}

/**
 * Plugin row meta.
 *
 * Adds row meta links to the plugin list table
 *
 * Fired by `plugin_row_meta` filter.
 *
 * @since 1.1.4	 
 * @access public
 *
 * @param array  $plugin_meta An array of the plugin's metadata, including
 *                            the version, author, author URI, and plugin URI.
 * @param string $plugin_file Path to the plugin file, relative to the plugins
 *                            directory.
 *
 * @return array An array of plugin row meta links.
 */
function plugin_row_meta( $plugin_meta, $plugin_file ) {
	if ( WEBLIFY_PLUGIN_BASE === $plugin_file ) {
		//A link to the terms and condition of the plugin
		$row_meta = [
			'docs' => '<a href="https://weblify.se/en/terms-and-conditions-for-the-plugin/" target="_blank">Terms & Conditions</a>',
		];

		$plugin_meta = array_merge( $plugin_meta, $row_meta );
	}

	return $plugin_meta;
}

function remove_menus()
{
    global $menu;
    global $current_user;
	
	$restricted = array(
		__('Appearance'),
		__('Plugins'),
		__('Users'),
	);
	end ($menu);
	while (prev($menu)){
		$value = explode(' ',$menu[key($menu)][0]);
		if(in_array($value[0] != NULL?$value[0]:"" , $restricted)){unset($menu[key($menu)]);}
	}
}

add_action( 'plugins_loaded', 'weblify_load_plugin' );
