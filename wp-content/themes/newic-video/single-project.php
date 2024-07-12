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
      'posts_per_page' => 3,
      'orderby' => 'rand',
      'post__not_in' => array($context['project']->ID) // Exclude the current project
    );

    $random_projects = Timber::get_posts($args);
    $context['random_projects'] = $random_projects;

    // Initialize an array to hold related projects for each term
    $context['related_projects'] = array();

    // Get terms for fields and project categories
    $fields = $context['project']->terms('field');
    $categories = $context['project']->terms('project-category');

    // Fetch related projects for each field term
    foreach ($fields as $field) {
        $args = array(
            'post_type' => 'project',
            'posts_per_page' => 3,
            'orderby' => 'rand',
            'post__not_in' => array($context['project']->ID), // Exclude the current project
            'tax_query' => array(
                array(
                    'taxonomy' => 'field',
                    'field' => 'slug',
                    'terms' => $field->slug,
                ),
            ),
        );
        $related_projects = Timber::get_posts($args);
        $context['related_projects']['fields'][$field->slug] = $related_projects;
    }

    // Fetch related projects for each category term
    foreach ($categories as $category) {
        $args = array(
            'post_type' => 'project',
            'posts_per_page' => 3,
            'orderby' => 'rand',
            'post__not_in' => array($context['project']->ID), // Exclude the current project
            'tax_query' => array(
                array(
                    'taxonomy' => 'project-category',
                    'field' => 'slug',
                    'terms' => $category->slug,
                ),
            ),
        );
        $related_projects = Timber::get_posts($args);
        $context['related_projects']['categories'][$category->slug] = $related_projects;
    }

    Timber::render('pages/single-project/single-project.twig', $context);
} else {
    // Optionally handle cases where the post type is not 'project'
    Timber::render('pages/404/404.twig', $context);
}
