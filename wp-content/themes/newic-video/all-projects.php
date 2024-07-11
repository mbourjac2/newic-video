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

$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

$args = array(
  'post_type'      => 'project',
  'post_status'    => 'publish',
  'posts_per_page' => 8, // Adjust the number of posts per page
  'paged'          => $paged,
  'order'          => 'DESC',
  'orderby'        => 'date',
);

$query = new WP_Query($args);
$context['projects'] = Timber::get_posts($query->posts);
$context['total_pages'] = $query->max_num_pages; // Add total number of pages

Timber::render( 'pages/all-projects/all-projects.twig' , $context );
