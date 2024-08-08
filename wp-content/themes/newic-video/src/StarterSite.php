<?php

use Timber\Site;

/**
 * Class StarterSite
 */
class StarterSite extends Site {
    public function __construct() {
        add_action('after_setup_theme', [$this, 'theme_supports']);
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_taxonomies']);
        add_action('wp_enqueue_scripts', [$this, 'load_assets']);

        add_filter('timber/context', [$this, 'add_to_context']);
        add_filter('timber/twig', [$this, 'add_to_twig']);
        add_filter('timber/twig/environment/options', [
            $this,
            'update_twig_environment_options',
        ]);
        add_filter('script_loader_tag', [$this, 'add_type_attribute'], 10, 3);

        add_action('wp_ajax_nopriv_handle_estimate_form', [
            $this,
            'handle_estimate_form',
        ]);
        add_action('wp_ajax_handle_estimate_form', [
            $this,
            'handle_estimate_form',
        ]);

        add_action('wp_ajax_nopriv_handle_contact_form', [
            $this,
            'handle_contact_form',
        ]);
        add_action('wp_ajax_handle_contact_form', [
            $this,
            'handle_contact_form',
        ]);

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
    public function add_to_context($context) {
        $context['menu'] = Timber::get_menu();
        $context['site'] = $this;

        return $context;
    }

    public function theme_supports() {
        // Add default posts and comments RSS feed links to head.
        add_theme_support('automatic-feed-links');

        /*
         * Let WordPress manage the document title.
         * By adding theme support, we declare that this theme does not use a
         * hard-coded <title> tag in the document head, and expect WordPress to
         * provide it for us.
         */
        add_theme_support('title-tag');

        /*
         * Enable support for Post Thumbnails on posts and pages.
         *
         * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
         */
        add_theme_support('post-thumbnails');

        /*
         * Switch default core markup for search form, comment form, and comments
         * to output valid HTML5.
         */
        add_theme_support('html5', [
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ]);

        /*
         * Enable support for Post Formats.
         *
         * See: https://codex.wordpress.org/Post_Formats
         */
        add_theme_support('post-formats', [
            'aside',
            'image',
            'video',
            'quote',
            'link',
            'gallery',
            'audio',
        ]);

        add_theme_support('menus');
    }

    public function handle_estimate_form() {
        // Check the nonce for security
        if (!check_ajax_referer('estimate_form_nonce', 'security', false)) {
            wp_send_json_error([
                'errors' => ['nonce' => 'Invalid nonce.'],
            ]);
            wp_die();
        }

        $decoded_data = [];
        $errors = [];

        foreach ($_POST as $key => $value) {
            // Skip the security field
            if ($key === 'security') {
                continue;
            }

            // Attempt to decode JSON, if applicable
            $decoded_value = json_decode(stripslashes($value), true);

            // If json_decode returns an array, use it, otherwise use the original value
            if (
                json_last_error() === JSON_ERROR_NONE &&
                is_array($decoded_value)
            ) {
                $decoded_data[$key] = $decoded_value;
            } else {
                $decoded_data[$key] = $value;
            }

            // Check if the field is an 'answer' field and validate it
            if (isset($decoded_data[$key]['answer'])) {
                $answer = $decoded_data[$key]['answer'];

                // Ensure the answer is not empty
                if (
                    empty($answer) ||
                    (is_array($answer) && !array_filter($answer))
                ) {
                    $errors[$key] = 'This field cannot be empty.';
                } else {
                    // Sanitize the answer field
                    if (is_array($answer)) {
                        $decoded_data[$key]['answer'] = array_map(
                            'sanitize_text_field',
                            $answer
                        );
                    } else {
                        $decoded_data[$key]['answer'] = sanitize_text_field(
                            $answer
                        );
                    }
                }

                // Special handling for email and phone fields
                if ($key === 'email') {
                    if (empty($answer)) {
                        $errors[$key] = 'Email field cannot be empty.';
                    } elseif (!is_email($answer)) {
                        $errors[$key] = 'Invalid email address.';
                    } else {
                        // Sanitize the email field
                        $decoded_data[$key]['answer'] = sanitize_email($answer);
                    }
                }

                if ($key === 'phone') {
                    if (empty($answer)) {
                        $errors[$key] = 'Phone field cannot be empty.';
                    } elseif (
                        !preg_match(
                            '/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/',
                            $answer
                        )
                    ) {
                        $errors[$key] = 'Invalid phone number.';
                    } else {
                        // Sanitize the phone field
                        $decoded_data[$key]['answer'] = sanitize_text_field(
                            $answer
                        );
                    }
                }
            }
        }

        // If there are errors, return them
        if (!empty($errors)) {
            wp_send_json_error([
                'errors' => $errors,
            ]);
            wp_die();
        }

        // Prepare email content
        $admin_email = get_option('admin_email');
        $subject = 'Nouveau devis';
        $headers = 'Content-Type: text/html; charset="UTF-8"';
        $message = '<h1>Nouveau devis</h1>';
        $message .= '<ul>';

        foreach ($decoded_data as $key => $data) {
            if (isset($data['label']) && isset($data['answer'])) {
                $label = is_array($data['label'])
                    ? implode(', ', $data['label'])
                    : $data['label'];
                $answer = is_array($data['answer'])
                    ? implode(', ', $data['answer'])
                    : $data['answer'];

                $message .=
                    '<li><strong>' .
                    esc_html($label) .
                    ':</strong> ' .
                    esc_html($answer) .
                    '</li>';
            }
        }

        $message .= '</ul>';

        // Send email
        $email_sent = wp_mail($admin_email, $subject, $message, $headers);

        if ($email_sent) {
            wp_send_json_success([
                'message' => 'Merci pour votre message. Il a bien été envoyé.',
                'data' => $decoded_data,
            ]);
        } else {
            wp_send_json_error([
                'message' =>
                    'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
            ]);
        }
    }

    public function handle_contact_form() {
        $data = [
            'name' => sanitize_text_field($_POST['name']),
            'email' => sanitize_email($_POST['email']),
            'phone' => sanitize_text_field($_POST['phone']),
            'subject' => sanitize_text_field($_POST['subject']),
            'message' => sanitize_textarea_field($_POST['message']),
        ];

        $errors = $this->validate_contact_form($data);

        if (!empty($errors)) {
            wp_send_json_error([
                'message' =>
                    'Certains champs sont invalides. Veuillez les corriger.',
                'errors' => $errors,
            ]);
        }

        $email_sent = $this->send_contact_email($data);

        if ($email_sent) {
            wp_send_json_success([
                'message' => 'Merci pour votre message. Il a bien été envoyé.',
            ]);
        } else {
            wp_send_json_error([
                'message' =>
                    'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer plus tard.',
            ]);
        }
    }

    public function validate_contact_form($data) {
        $errors = [];

        if (empty($data['name'])) {
            $errors['name'] = 'Ce champ est requis.';
        }

        if (empty($data['email'])) {
            $errors['email'] = 'Ce champ est requis.';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Veuillez saisir une adresse e-mail valide.';
        }

        if (empty($data['phone'])) {
            $errors['phone'] = 'Ce champ est requis.';
        } elseif (!$this->is_valid_phone($data['phone'])) {
            $errors['phone'] = 'Veuillez saisir un numéro de téléphone valide.';
        }

        if (empty($data['message'])) {
            $errors['message'] = 'Ce champ est requis.';
        }

        return $errors;
    }

    public function is_valid_phone($phone) {
        $phoneRegex = '/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/i';
        return preg_match($phoneRegex, $phone);
    }

    public function send_contact_email($data) {
        $headers = 'Content-Type: text/html; charset="UTF-8"';
        $to = get_option('admin_email');
        $subject = 'Newic Vidéo - Nouvelle demande de contact';

        $message = "Nom : {$data['name']}" . '<br>';
        $message .= "Email : {$data['email']}" . '<br>';
        $message .= "Numéro de téléphone : {$data['phone']}" . '<br>';
        $message .= "Sujet : {$data['subject']}" . '<br>';
        $message .= "Message : {$data['message']}";

        return wp_mail($to, $subject, $message, $headers);
    }

    /**
     * Grab the specified data like Thumbnail URL of a publicly embeddable video hosted on Vimeo.
     *
     * @param  string $video_link The URL of a Vimeo video.
     * @param  string $data       Video data to be fetched
     * @return string             The specified data
     */
    function get_vimeo_data_from_link($video_link, $data) {
        // Parse the URL to get the path
        $parsed_url = wp_parse_url($video_link);

        // Extract the video ID from the path
        $path_parts = explode('/', trim($parsed_url['path'], '/'));
        $video_id = end($path_parts);

        // Make the API request
        $request = wp_remote_get(
            'https://vimeo.com/api/oembed.json?url=https://vimeo.com/' .
                $video_id
        );

        // Retrieve the response body
        $response = wp_remote_retrieve_body($request);

        // Decode the JSON response
        $video_array = json_decode($response, true);

        // Return the requested data
        return isset($video_array[$data]) ? $video_array[$data] : null;
    }

    /**
     * This is where you can add your own functions to twig.
     *
     * @param Twig\Environment $twig get extension.
     */
    public function add_to_twig($twig) {
        /**
         * Required when you want to use Twig’s template_from_string.
         * @link https://twig.symfony.com/doc/3.x/functions/template_from_string.html
         */
        // $twig->addExtension( new Twig\Extension\StringLoaderExtension() );

        $twig->addFilter(new Twig\TwigFilter('myfoo', [$this, 'myfoo']));
        $twig->addFunction(
            new Twig\TwigFunction('get_vimeo_data_from_link', [
                $this,
                'get_vimeo_data_from_link',
            ])
        );

        // Adding the custom no_p_tags filter
        $twig->addFilter(
            new Twig\TwigFilter('no_p_tags', function ($content) {
                return wp_strip_all_tags($content);
            })
        );

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
    function update_twig_environment_options($options) {
        // $options['autoescape'] = true;

        return $options;
    }

    /**
     * Load custom styles and scripts.
     */
    public function load_assets() {
        // Core GSAP library
        wp_enqueue_script(
            'gsap-js',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js',
            [],
            false,
            true
        );
        // ScrollTrigger - with gsap.js passed as a dependency
        wp_enqueue_script(
            'gsap-st',
            'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/ScrollTrigger.min.js',
            ['gsap-js'],
            false,
            true
        );

        wp_register_style(
            'style',
            get_template_directory_uri() . '/static/style.min.css'
        );
        wp_enqueue_style('style');

        wp_register_script(
            'script',
            get_template_directory_uri() . '/static/bundle.min.js'
        );
        wp_enqueue_script('script');

        // Localize script with nonce for security
        wp_localize_script('script', 'ajax_object', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'estimate_form_nonce' => wp_create_nonce('estimate_form_nonce'),
            'contact_form_nonce' => wp_create_nonce('contact_form_nonce'),
        ]);
    }

    /**
     * Add module type to index.js.
     */
    public function add_type_attribute($tag, $handle, $src) {
        if ($handle === 'index') {
            $tag =
                '<script type="module" src="' . esc_url($src) . '"></script>';
        }

        return $tag;
    }
}
