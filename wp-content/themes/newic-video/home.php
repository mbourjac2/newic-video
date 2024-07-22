<?php
/*
 * Template Name: Accueil
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();
$timber_post = Timber::get_post();
$context['post'] = $timber_post;

Timber::render('pages/home/home.twig', $context);
