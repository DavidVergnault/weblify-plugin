<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function weblify_add_admin_page(){
    
	//Generate Weblify Admin page
	add_menu_page( 'Weblify Plugin Options', 'Weblify', 'manage_options', 'weblify', 'weblify_create_page', '', 110 );
	
	//Generate Weblify Admin Sub page
	add_submenu_page( 'weblify', 'Weblify Plugin Options', 'General', 'manage_options', 'weblify' , 'weblify_general_page' );
	add_submenu_page( 'weblify', 'Weblify Settings', 'Settings', 'manage_options', 'weblify-settings' , 'weblify_settings_page' );
	
	add_action( 'admin_init', 'weblify_settings' );
}
add_action( 'admin_menu', 'weblify_add_admin_page' );

function weblify_settings(){
	register_setting( 'weblify-settings-group', 'image_resizing' );
	register_setting( 'weblify-settings-group', 'widgets_ordering' );
	register_setting( 'weblify-settings-group', 'page_layout' );
	register_setting( 'weblify-settings-group', 'page_layout_radio' );
	register_setting( 'weblify-settings-group', 'demo_mode' );

	add_settings_section( 'weblify-settings-section', '', 'weblify_settings_section', 'weblify' );
	add_settings_field( 'image-resizing', 'Enable image resizing', 'weblify_enable_image_resizing', 'weblify', 'weblify-settings-section' );
	add_settings_field( 'widgets_ordering', 'Enable widgets re-ordering and stripping', 'weblify_enable_widgets_ordering', 'weblify', 'weblify-settings-section');
	add_settings_field( 'demo_mode', 'Demo mode', 'weblify_demo_mode', 'weblify', 'weblify-settings-section' );
	add_settings_field( 'page_layout', 'Enable page layout pre-set', 'weblify_enable_page_layout', 'weblify', 'weblify-settings-section' );
}


function weblify_enable_page_layout(){
?>
	<p><input type='checkbox' name='page_layout' value='1' <?php checked(1, get_option( 'page_layout' ), true ); ?> /></p>

	<p><input type='radio' name='page_layout_radio' value='elementor_canvas' <?php checked( 'elementor_canvas', get_option( 'page_layout_radio' ), true ); ?> />Canvas
	<input type='radio' name='page_layout_radio' value='elementor_header_footer' <?php checked( 'elementor_header_footer', get_option( 'page_layout_radio' ), true ); ?> />Full Width</p>

<?php
}


function weblify_demo_mode(){
?>
	<input type="checkbox" name='demo_mode' value='1' <?php checked(1, get_option( 'demo_mode' ), true ); ?> />
<?php
}

function weblify_enable_widgets_ordering(){
?>
	<input type="checkbox" name='widgets_ordering' value='1' <?php checked(1, get_option( 'widgets_ordering' ), true ); ?> />
<?php
}

function weblify_enable_image_resizing(){
?>
	<input type="checkbox" name='image_resizing' value='1' <?php checked( 1, get_option( 'image_resizing' ), true ); ?> />
<?php
}

function weblify_settings_section(){
}

function weblify_general_page(){
    echo "<br><b>Weblify Plugin</b> is a plugin for WordPress.<br>
It has some features that have been created to help the work of Designers using Elementor.<br>
<br>
<br>
<h1><b>Terms and Conditions</b></h1><br>
The Weblify plug-in for Wordpress, owned by Weblify AB, created by David Vergnault in 2019 will be referred to as \"this plug-in\" in the following terms.<br>
<br>
Please read these terms of use carefully before using this plug-in. Using this plug-in means you agree to be bound by these terms without modification.<br>
If you don't accept these terms you will not be allowed to use this plug-in or its content in any way and you will have to desactivate it as soon as possible.<br>
<br>
<b>### What you can do</b><br>
<br>
\t- You can only use this plug-in and the content it gives access to to execute work requested by Weblify AB in the context of your professional relationship with Weblify AB.<br>
<br>
<b>### What you can't do</b><br>
<br>
\t- You cannot use this plug-in and/or the content it gives access to for commercial use outside of Weblify AB.<br>
\t- You cannot re-sell or re-distribute the rights to use this plug-in and the content it gives access to.<br>
\t- You cannot re-sell or re-distribute a product made with this plug-in and/or the content it gives access to.<br>
\t- You cannot share this plug-in and/or the content it gives access to with anyone unless otherwise specified in a written way through email by a member of Weblify AB.<br>
\t- You cannot share information about this plug-in and/or the content it gives access to with anyone unless otherwise specified in a written way through email by a member of Weblify AB.<br>
\t- If you have been hired as a subcontractor or freelancer by Weblify AB and you own the product before you deliver it to Weblify AB and the product has been made with this plug-in and/or the content it gives access to, you can only sell the product to Weblify AB.<br>
\t- You cannot share information about a product made with this plug-in and/or the content it gives access to with anyone outside of you professional and contractual obligations towards Weblify AB.";
}

function weblify_settings_page(){
    require_once( WEBLIFY_PATH . 'includes/templates/weblify-settings.php' );
}