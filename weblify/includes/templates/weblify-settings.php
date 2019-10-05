<h1>Weblify Plugin Settings</h1>
<?php settings_errors(); ?>
<form method="post" action="options.php">
	<?php 
		settings_fields( 'weblify-settings-group' );
		do_settings_sections( 'weblify' );
		submit_button();
	?>
</form>