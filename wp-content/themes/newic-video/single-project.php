<?php
/*
 * Template Name: Réalisation
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();

$context['project'] = Timber::get_post();

if (is_single() && $context['project']->post_type === 'project') {
    // Query for four random projects
    $args = array(
        'post_type' => 'project',
        'posts_per_page' => 4,
        'orderby' => 'rand',
        'post__not_in' => array($context['project']->ID) // Exclude the current project
    );

    $random_projects = Timber::get_posts($args);
    $context['random_projects'] = $random_projects;

    Timber::render('pages/single-project/single-project.twig', $context);
} else {
    // Optionally handle cases where the post type is not 'project'
    Timber::render('pages/404/404.twig', $context);
}
