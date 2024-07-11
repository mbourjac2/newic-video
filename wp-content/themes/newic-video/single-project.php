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
    Timber::render('pages/single-project/single-project.twig', $context);
} else {
    // Optionally handle cases where the post type is not 'project'
    Timber::render('pages/404/404.twig', $context);
}


