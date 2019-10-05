<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

//This function take a lot of time to execute
function resize_uploaded_image( $sizes, $metadata, $attachement_id ) {
	$file = ABSPATH . 'wp-content/uploads/' . $metadata[ 'file' ];

	if( $metadata[ 'width' ] > 1920 || $metadata[ 'height' ] > 1920 ){
		//Resize image
		if( $metadata[ 'width' ] > 1920 ){
			$percentage = 1920 / $metadata[ 'width' ];
		} else {
			$percentage = 1920 / $metadata[ 'height' ];		
		}

		$metadata[ 'width' ] = $percentage * $metadata[ 'width' ];
		$metadata[ 'height' ] = $percentage * $metadata[ 'height' ];

		$editor = wp_get_image_editor( $file );
		if ( ! is_wp_error( $editor ) ) {
			$editor->resize($metadata[ 'width' ], $metadata[ 'height' ], true );

			//Delete the original file
			unlink( $file );

			//Replace it by the resized file
			$editor->save( $file );
		}
	}
	
	return $sizes;
}

add_filter( 'intermediate_image_sizes_advanced', 'resize_uploaded_image', 3, 99 );
