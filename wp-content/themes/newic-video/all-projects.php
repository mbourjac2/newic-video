<?php
/*
 * Template Name: Réalisations
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context         = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;
$context['projects'] = Timber::get_posts(array(
  'post_type'      => 'project',
  'post_status'    => 'publish',
  'posts_per_page' => -1,
  'order'          => 'DESC',
  'orderby'        => 'date',
));

Timber::render( 'pages/all-projects/all-projects.twig' , $context );
