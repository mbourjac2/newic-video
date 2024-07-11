<?php

use Timber\Site;

/**
 * Class StarterSite
 */
class StarterSite extends Site {
	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'theme_supports' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'load_assets' ) );

		add_filter( 'timber/context', array( $this, 'add_to_context' ) );
		add_filter( 'timber/twig', array( $this, 'add_to_twig' ) );
		add_filter( 'timber/twig/environment/options', [ $this, 'update_twig_environment_options' ] );
		add_filter( 'script_loader_tag', array( $this, 'add_type_attribute' ), 10, 3 );

		parent::__construct();
	}

	/**
	 * This is where you can register custom post types.
	 */
	public function register_post_types() {

	}

	/**
	 * This is where you can register custom taxonomies.
	 */
	public function register_taxonomies() {

	}

	/**
	 * This is where you add some context
	 *
	 * @param string $context context['this'] Being the Twig's {{ this }}.
	 */
	public function add_to_context( $context ) {
		$context['menu']  = Timber::get_menu();
		$context['site']  = $this;

		return $context;
	}

	public function theme_supports() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/*
		 * Enable support for Post Formats.
		 *
		 * See: https://codex.wordpress.org/Post_Formats
		 */
		add_theme_support(
			'post-formats',
			array(
				'aside',
				'image',
				'video',
				'quote',
				'link',
				'gallery',
				'audio',
			)
		);

		add_theme_support( 'menus' );
	}

  /**
   * Grab the specified data like Thumbnail URL of a publicly embeddable video hosted on Vimeo.
   *
   * @param  str $video_link The URL of a Vimeo video.
   * @param  str $data       Video data to be fetched
   * @return str             The specified data
   */
  function get_vimeo_data_from_link( $video_link, $data ) {
    // Parse the URL to get the path
    $parsed_url = wp_parse_url( $video_link );

    // Extract the video ID from the path
    $path_parts = explode( '/', trim( $parsed_url['path'], '/' ) );
    $video_id = end( $path_parts );

    // Make the API request
    $request = wp_remote_get( 'https://vimeo.com/api/oembed.json?url=https://vimeo.com/' . $video_id );

    // Retrieve the response body
    $response = wp_remote_retrieve_body( $request );

    // Decode the JSON response
    $video_array = json_decode( $response, true );

    // Return the requested data
    return isset( $video_array[$data] ) ? $video_array[$data] : null;
  }

	/**
	 * This is where you can add your own functions to twig.
	 *
	 * @param Twig\Environment $twig get extension.
	 */
	public function add_to_twig( $twig ) {
		/**
		 * Required when you want to use Twig’s template_from_string.
		 * @link https://twig.symfony.com/doc/3.x/functions/template_from_string.html
		 */
		// $twig->addExtension( new Twig\Extension\StringLoaderExtension() );

		$twig->addFilter( new Twig\TwigFilter( 'myfoo', [ $this, 'myfoo' ] ) );
    $twig->addFunction( new Twig\TwigFunction( 'get_vimeo_data_from_link', [ $this, 'get_vimeo_data_from_link' ] ) );

		return $twig;
	}

	/**
	 * Updates Twig environment options.
	 *
	 * @link https://twig.symfony.com/doc/2.x/api.html#environment-options
	 *
	 * \@param array $options An array of environment options.
	 *
	 * @return array
	 */
	function update_twig_environment_options( $options ) {
	    // $options['autoescape'] = true;

	    return $options;
	}

	/**
	 * Load custom styles and scripts.
	 */
	public function load_assets() {
		wp_register_style('style', get_template_directory_uri() . '/static/style.min.css');
		wp_enqueue_style('style');

		wp_register_script('script', get_template_directory_uri() . '/static/bundle.min.js');
		wp_enqueue_script('script');
	}

	/**
	 * Add module type to index.js.
	 */
	public function add_type_attribute($tag, $handle, $src) {
		if ($handle === 'index') {
			$tag = '<script type="module" src="' . esc_url($src) . '"></script>';
		}

		return $tag;
	}
}
